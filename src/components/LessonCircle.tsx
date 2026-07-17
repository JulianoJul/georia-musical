import { useState, useMemo, useRef, useEffect } from 'react';
import CircleChromatic from './CircleChromatic';
import {
    CHORD_SHAPES,
    SCALE_SHAPES,
    NOTE_NAMES_SPANISH,
    FIFTHS_ORDER,
    mod,
    buildPitches,
    buildPitchesWithInterval,
    playPitches,
    playPitchesArpeggiated,
    keySignature,
    intervalNameAbbr,
    type Pitch,
} from '../lib/theory';
import { type CircleConfig, DIATONIC_SCALE_IDS } from '../data/lessonsContent';

interface Props {
    config: CircleConfig;
    caption?: string;
}

const ARP_NOTE_MS = 350;
const ARP_GAP_MS = 200;
const ARP_STEP_MS = ARP_NOTE_MS + ARP_GAP_MS;

export default function LessonCircle({ config, caption }: Props) {
    const [highlightedPitches, setHighlightedPitches] = useState<Pitch[]>([]);
    const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
    const isMounted = useRef(true);

    const shapes = config.kind === 'chord' ? CHORD_SHAPES : SCALE_SHAPES;
    const shape = shapes.find((s) => s.id === config.shapeId) || shapes[0];

    const pitches = useMemo(
        () => buildPitches(config.root, shape.intervals),
                            [config.root, shape.intervals]
    );

    const pitchesWithInterval = useMemo(
        () => buildPitchesWithInterval(config.root, shape.intervals),
                                        [config.root, shape.intervals]
    );

    const mirrorPitches = useMemo(() => {
        if (!config.showMirror || config.kind !== 'chord') return undefined;
        const minShape = CHORD_SHAPES.find((c) => c.id === 'min');
        return buildPitches(config.root, minShape ? minShape.intervals : [0, 3, 7]);
    }, [config.showMirror, config.kind, config.root]);

    const ks = useMemo(() => {
        if (config.mode !== 'fifths' || config.kind !== 'scale') return null;
        return keySignature(config.root);
    }, [config.mode, config.kind, config.root]);

    const sliceArcNotes = useMemo(() => {
        if (
            config.mode !== 'fifths' ||
            config.kind !== 'scale' ||
            !DIATONIC_SCALE_IDS.has(shape.id)
        ) {
            return undefined;
        }
    return [...pitches].sort(
            (a, b) => FIFTHS_ORDER.indexOf(mod(a)) - FIFTHS_ORDER.indexOf(mod(b))
    );
    }, [config.mode, config.kind, pitches, shape.id]);

    const clearTimeouts = () => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
    };

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            clearTimeouts();
        };
    }, []);

    const schedule = (fn: () => void, delay: number) => {
        const id = setTimeout(() => {
            if (isMounted.current) fn();
        }, delay);
            timeoutIds.current.push(id);
    };

    const handlePlay = async (arpeggiate: boolean) => {
        clearTimeouts();

        if (arpeggiate) {
            pitches.forEach((p, i) => {
                schedule(() => setHighlightedPitches([p]), i * ARP_STEP_MS);
            });
            schedule(() => setHighlightedPitches([]), pitches.length * ARP_STEP_MS);

            try {
                await playPitchesArpeggiated(pitches, 4, ARP_NOTE_MS / 1000, ARP_GAP_MS / 1000);
            } catch (err) {
                console.error('Error playing arpeggio:', err);
            }

            if (mirrorPitches && mirrorPitches.length > 0) {
                const offset = pitches.length * ARP_STEP_MS + 600;
                mirrorPitches.forEach((p, i) => {
                    schedule(() => setHighlightedPitches([p]), offset + i * ARP_STEP_MS);
                });
                schedule(() => setHighlightedPitches([]), offset + mirrorPitches.length * ARP_STEP_MS);

                try {
                    await playPitchesArpeggiated(mirrorPitches, 4, ARP_NOTE_MS / 1000, ARP_GAP_MS / 1000, offset / 1000);
                } catch (err) {
                    console.error('Error playing mirror arpeggio:', err);
                }
            }
        } else {
            setHighlightedPitches(pitches);

            try {
                await playPitches(pitches);
            } catch (err) {
                console.error('Error playing chord:', err);
            }

            if (mirrorPitches && mirrorPitches.length > 0) {
                schedule(() => {
                    setHighlightedPitches(mirrorPitches);
                    playPitches(mirrorPitches, 4, 1.2).catch(err =>
                    console.error('Error playing mirror:', err)
                    );
                }, 1400);
                schedule(() => setHighlightedPitches([]), 2800);
            } else {
                schedule(() => setHighlightedPitches([]), 1200);
            }
        }
    };

    return (
        <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col items-center gap-3 w-full max-w-[380px] mx-auto shadow-2xl relative my-6 lesson-circle">
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-gray-400 uppercase tracking-widest font-mono">
        {config.mode === 'chromatic' ? 'Cromático' : 'Quintas'}
        </div>

        <CircleChromatic
        activePitches={pitches}
        highlightedPitches={highlightedPitches}
        color={shape.color}
        mode={config.mode}
        size={240}
        mirrorPitches={mirrorPitches}
        mirrorColor="#60a5fa"
        showAxis={config.showMirror && config.kind === 'chord'}
        fifthsSliceNotes={sliceArcNotes}
        showSliceBackground={config.mode === 'fifths' && config.kind === 'scale' && DIATONIC_SCALE_IDS.has(shape.id)}
        rootPitch={config.root}
        />

        <div className="text-center w-full">
        <div className="text-base font-bold tracking-wide" style={{ color: shape.color }}>
        {NOTE_NAMES_SPANISH[config.root]} {shape.label}
        </div>
        <div className="text-gray-400 text-[11px] mt-1 font-mono tracking-wider">
        {pitchesWithInterval
            .map(({ pitch, interval }) => `${NOTE_NAMES_SPANISH[pitch]} (${intervalNameAbbr(interval)})`)
            .join(' · ')}
            </div>
            {'description' in shape && (
                <div className="text-gray-500 text-[11px] mt-1.5 italic max-w-xs mx-auto">
                {shape.description}
                </div>
            )}
            {'pattern' in shape && (
                <div className="text-gray-500 text-[11px] mt-1.5">
                Patrón modular:{' '}
                <code className="text-gray-300 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 font-mono">
                {shape.pattern}
                </code>
                </div>
            )}
            </div>

            {ks && (
                <div className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2.5 text-[11px] w-full space-y-1">
                <div className="flex items-center justify-between">
                <span className="text-gray-500">Armadura:</span>
                <span className="font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                {ks.count >= 0 ? `${ks.count} ♯` : `${Math.abs(ks.count)} ♭`}
                </span>
                </div>
                {ks.accidentals.length > 0 && (
                    <div className="flex items-center justify-between">
                    <span className="text-gray-500">Alteraciones:</span>
                    <span className="text-emerald-400 font-medium">{ks.accidentals.join(' · ')}</span>
                    </div>
                )}
                </div>
            )}

            <div className="flex gap-2 w-full">
            <button
            onClick={() => handlePlay(false)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg py-2 text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
            ▶ Escuchar
            </button>
            <button
            onClick={() => handlePlay(true)}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg py-2 text-xs transition-all border border-white/10 cursor-pointer"
            >
            🎵 Arpegiar
            </button>
            </div>

            {caption && (
                <p className="text-[10px] text-gray-500 text-center italic mt-2">{caption}</p>
            )}
            </div>
    );
}
