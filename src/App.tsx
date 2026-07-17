import { useState, useMemo } from 'react';
import LessonCircle from './components/LessonCircle';
import CircleChromatic from './components/CircleChromatic';
import { LESSONS } from './data/lessonsContent';
import {
  CHORD_SHAPES,
  SCALE_SHAPES,
  NOTE_NAMES_SPANISH,
  FIFTHS_ORDER,
  mod,
  buildPitches,
  buildPitchesWithInterval,
  keySignature,
  intervalNameAbbr,
  playPitches,
  playPitchesArpeggiated,
  type Pitch,
} from './lib/theory';

export default function App() {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [sandbox, setSandbox] = useState(false);
  const currentChapter = LESSONS[activeChapterIdx];

  // Sandbox state
  const [sbKind, setSbKind] = useState<'chord' | 'scale'>('chord');
  const [sbShapeIdx, setSbShapeIdx] = useState(0);
  const [sbRoot, setSbRoot] = useState<Pitch>(0);
  const [sbMode, setSbMode] = useState<'chromatic' | 'fifths'>('chromatic');
  const [sbShowMirror, setSbShowMirror] = useState(false);
  const [sbArpeggiate, setSbArpeggiate] = useState(false);
  const [sbHighlighted, setSbHighlighted] = useState<Pitch[]>([]);

  const sbShapes = sbKind === 'chord' ? CHORD_SHAPES : SCALE_SHAPES;
  const sbShape = sbShapes[sbShapeIdx >= sbShapes.length ? 0 : sbShapeIdx];
  const sbPitches = useMemo(() => buildPitches(sbRoot, sbShape.intervals), [sbRoot, sbShape.intervals]);
  const sbPitchesWI = useMemo(() => buildPitchesWithInterval(sbRoot, sbShape.intervals), [sbRoot, sbShape.intervals]);
  const sbMirror = useMemo(() =>
    sbShowMirror && sbKind === 'chord' ? buildPitches(sbRoot, [0, 3, 7]) : undefined,
  [sbShowMirror, sbKind, sbRoot]);
  const sbKs = useMemo(() =>
    sbMode === 'fifths' && sbKind === 'scale' ? keySignature(sbRoot) : null,
  [sbMode, sbKind, sbRoot]);
  const sbSlice = useMemo(() => {
    if (sbMode !== 'fifths' || sbKind !== 'scale' || !['major', 'minor'].includes(sbShape.id)) return undefined;
    return [...sbPitches].sort((a, b) => FIFTHS_ORDER.indexOf(mod(a)) - FIFTHS_ORDER.indexOf(mod(b)));
  }, [sbMode, sbKind, sbPitches, sbShape.id]);

  const renderBlock = (block: any, idx: number) => {
    switch (block.type) {
      case 'heading':
        if (block.level === 2) return <h2 key={idx} className="text-2xl font-extrabold tracking-tight text-white mt-6">{block.text}</h2>;
        return <h3 key={idx} className="text-sm font-bold text-white tracking-wide border-l-2 border-emerald-500 pl-3 mt-4">{block.text}</h3>;
      case 'paragraph':
        return <p key={idx} className="whitespace-pre-line text-gray-400 text-[13px] leading-relaxed">{block.text}</p>;
      case 'list':
        return <ul key={idx} className="space-y-1 text-gray-400 text-[13px]">{block.items.map((item: string, i: number) => <li key={i} className="flex gap-2"><span className="text-emerald-400">•</span><span>{item}</span></li>)}</ul>;
      case 'circle':
        return <LessonCircle key={idx} config={block.config} caption={block.caption} />;
      case 'callout':
        return <div key={idx} className={`p-3 rounded-xl border text-[11px] flex items-start gap-2 ${block.variant === 'info' ? 'bg-indigo-500/5 border-indigo-500/10 text-indigo-300/80' : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300/80'}`}><span>{block.variant === 'info' ? '💡' : '✨'}</span><p>{block.text}</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-[#07070a] text-gray-100">
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-md px-4 py-2.5 flex flex-row justify-between items-center gap-2 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-emerald-500/10">G</div>
          <div><h1 className="text-sm font-bold tracking-wide bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Geometría Musical</h1></div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSandbox(s => !s)}
            className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${sandbox ? 'bg-emerald-500 text-black' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black'}`}
          >
            {sandbox ? '✕ Cerrar' : '🎛️ Sandbox'}
          </button>
          {!sandbox && (
            <nav className="flex flex-wrap gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
              {LESSONS.map((ch, idx) => (
                <button key={ch.id} onClick={() => setActiveChapterIdx(idx)} className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${activeChapterIdx === idx ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{idx + 1}</button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {sandbox ? (
        <main className="flex-1 flex flex-col items-center gap-6 px-4 py-8 overflow-y-auto">
          <CircleChromatic
            activePitches={sbPitches}
            highlightedPitches={sbHighlighted}
            color={sbShape.color}
            mode={sbMode}
            size={260}
            mirrorPitches={sbMirror}
            mirrorColor="#60a5fa"
            showAxis={sbShowMirror && sbKind === 'chord'}
            fifthsSliceNotes={sbSlice}
            showSliceBackground={sbMode === 'fifths' && sbKind === 'scale' && ['major', 'minor'].includes(sbShape.id)}
            rootPitch={sbRoot}
          />

          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: sbShape.color }}>{NOTE_NAMES_SPANISH[sbRoot]} {sbShape.label}</div>
            <div className="text-gray-400 text-xs mt-1 font-mono">{sbPitchesWI.map(({ pitch, interval }) => `${NOTE_NAMES_SPANISH[pitch]} (${intervalNameAbbr(interval)})`).join(' · ')}</div>
          </div>

          {sbKs && (
            <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs w-full max-w-sm space-y-1">
              <div className="flex justify-between"><span className="text-gray-500">Armadura:</span><span className="font-bold text-white">{sbKs.count >= 0 ? `${sbKs.count} ♯` : `${Math.abs(sbKs.count)} ♭`}</span></div>
              {sbKs.accidentals.length > 0 && <div className="flex justify-between"><span className="text-gray-500">Alteraciones:</span><span className="text-emerald-400">{sbKs.accidentals.join(' · ')}</span></div>}
            </div>
          )}

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 w-full max-w-sm space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Tipo</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button onClick={() => { setSbKind('chord'); setSbShapeIdx(0); setSbShowMirror(false); setSbArpeggiate(false); }} className={`px-3 py-2 rounded-xl text-xs font-bold ${sbKind === 'chord' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>Acorde</button>
                <button onClick={() => { setSbKind('scale'); setSbShapeIdx(0); setSbShowMirror(false); setSbArpeggiate(true); }} className={`px-3 py-2 rounded-xl text-xs font-bold ${sbKind === 'scale' ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>Escala</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Forma</label>
              <select value={sbShapeIdx} onChange={e => setSbShapeIdx(Number(e.target.value))} className="w-full mt-1.5 bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white">
                {sbShapes.map((s, i) => <option key={s.id} value={i}>{s.label}</option>)}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-500 uppercase tracking-wider">Tónica</label>
                <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded">{NOTE_NAMES_SPANISH[sbRoot]}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setSbRoot(r => mod(r - 1))} className="bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold h-8 w-8 rounded-lg text-xs">−</button>
                <input type="range" min={0} max={11} value={sbRoot} onChange={e => setSbRoot(mod(Number(e.target.value)))} aria-label="Tónica" className="flex-1 accent-emerald-500 bg-white/10 h-1 rounded-lg cursor-pointer" />
                <button onClick={() => setSbRoot(r => mod(r + 1))} className="bg-white/5 border border-white/5 hover:bg-white/10 text-white font-bold h-8 w-8 rounded-lg text-xs">+</button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Espacio</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button onClick={() => setSbMode('chromatic')} className={`px-3 py-2 rounded-xl text-xs font-bold ${sbMode === 'chromatic' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-400'}`}>Cromático</button>
                <button onClick={() => setSbMode('fifths')} className={`px-3 py-2 rounded-xl text-xs font-bold ${sbMode === 'fifths' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-gray-400'}`}>Quintas</button>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5">
              {sbKind === 'chord' && (
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={sbShowMirror} onChange={e => setSbShowMirror(e.target.checked)} className="accent-emerald-500 h-4 w-4 rounded" />
                  <span>Reflejo quiral (menor)</span>
                </label>
              )}
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" checked={sbArpeggiate} onChange={e => setSbArpeggiate(e.target.checked)} className="accent-emerald-500 h-4 w-4 rounded" />
                <span>Arpegiar</span>
              </label>
            </div>

            <button onClick={() => {
                if (sbArpeggiate) {
                  const step = 550;
                  sbPitches.forEach((p, i) => {
                    setTimeout(() => setSbHighlighted([p]), i * step);
                  });
                  setTimeout(() => setSbHighlighted([]), sbPitches.length * step);
                  playPitchesArpeggiated(sbPitches).catch(console.warn);
                  if (sbMirror && sbMirror.length > 0) {
                    const offset = sbPitches.length * step + 600;
                    sbMirror.forEach((p, i) => {
                      setTimeout(() => setSbHighlighted([p]), offset + i * step);
                    });
                    setTimeout(() => setSbHighlighted([]), offset + sbMirror.length * step);
                    playPitchesArpeggiated(sbMirror, 4, 0.35, 0.2, offset / 1000).catch(console.warn);
                  }
                } else {
                  setSbHighlighted(sbPitches);
                  playPitches(sbPitches).catch(console.warn);
                  if (sbMirror && sbMirror.length > 0) {
                    setTimeout(() => { playPitches(sbMirror).catch(console.warn); setSbHighlighted(sbMirror); }, 1400);
                    setTimeout(() => setSbHighlighted([]), 2800);
                  } else {
                    setTimeout(() => setSbHighlighted([]), 1200);
                  }
                }
              }} className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl py-3 text-xs tracking-wider uppercase transition-all cursor-pointer">▶ Escuchar</button>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex justify-center px-4 py-8">
          <div className="w-full max-w-2xl space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{currentChapter.subtitle}</span>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">{currentChapter.title}</h2>
            </div>
            <div className="space-y-4 text-gray-300 leading-relaxed text-sm">
              <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-xl space-y-4 hover:border-white/10 transition-colors">
                {currentChapter.blocks.map((block, idx) => renderBlock(block, idx))}
              </div>
            </div>
            <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[11px] text-indigo-300/80 flex items-start gap-2">
              <span>💡</span>
              <p><strong>Cómo aprender:</strong> Lee cada sección y pulsa "Escuchar" en cada círculo. Usa <strong>🎛️ Sandbox</strong> arriba para experimentar libremente.</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
