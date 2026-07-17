export type Pitch = number; // 0..11 en Z_12
export const PITCHES_12: Pitch[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const NOTE_NAMES_SHARP = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const NOTE_NAMES_SPANISH = [
  "Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si",
] as const;

// Nombres de accidentales con sostenidos (E#="Mi#", B#="Si#")
export const SHARP_ACCIDENTAL_NAMES: Record<number, string> = {
  6: "Fa#",
  1: "Do#",
  8: "Sol#",
  3: "Re#",
  10: "La#",
  5: "Mi#",
  0: "Si#",
};

// Nombres de accidentales con bemoles
export const FLAT_ACCIDENTAL_NAMES: Record<number, string> = {
  10: "Sib",
  3: "Mib",
  8: "Lab",
  1: "Reb",
  6: "Solb",
  11: "Dob",
  5: "Fab",
};

export const mod = (n: number, m = 12): Pitch => ((n % m) + m) % m;

export const noteName = (p: Pitch, names: readonly string[] = NOTE_NAMES_SPANISH): string =>
  names[mod(p)];

export interface ChordShape {
  id: string;
  label: string;
  intervals: number[]; // semitonos desde la tónica, en Z_12
  color: string;
  description: string;
}

export const CHORD_SHAPES: ChordShape[] = [
  {
    id: "maj",
    label: "Tríada Mayor",
    intervals: [0, 4, 7],
    color: "#fbbf24",
    description: "Triángulo escaleno. 4 + 3 semitonos. Brillo, alegría.",
  },
  {
    id: "min",
    label: "Tríada Menor",
    intervals: [0, 3, 7],
    color: "#60a5fa",
    description: "Reflejo especular del mayor (quiral). Melancolía.",
  },
  {
    id: "aug",
    label: "Tríada Aumentada",
    intervals: [0, 4, 8],
    color: "#f472b6",
    description: "Triángulo equilátero. Sin tónica clara, flotante.",
  },
  {
    id: "dim",
    label: "Tríada Disminuida",
    intervals: [0, 3, 6],
    color: "#a78bfa",
    description: "Polígono simétrico, tenso, inestable.",
  },
  {
    id: "dim7",
    label: "Séptima Disminuida",
    intervals: [0, 3, 6, 9],
    color: "#c084fc",
    description: "Cuadrado perfecto. 3+3+3+3. Tensión cinemática.",
  },
  {
    id: "maj7",
    label: "Séptima Mayor",
    intervals: [0, 4, 7, 11],
    color: "#34d399",
    description: "Mayor + séptima mayor. Color jazzístico.",
  },
];

export interface ScaleShape {
  id: string;
  label: string;
  intervals: number[];
  color: string;
  pattern: string;
}

export const SCALE_SHAPES: ScaleShape[] = [
  {
    id: "major",
    label: "Escala Mayor",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    color: "#fbbf24",
    pattern: "2-2-1-2-2-2-1",
  },
  {
    id: "minor",
    label: "Escala Menor Natural",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    color: "#60a5fa",
    pattern: "2-1-2-2-1-2-2",
  },
  {
    id: "penta",
    label: "Pentatónica Mayor",
    intervals: [0, 2, 4, 7, 9],
    color: "#34d399",
    pattern: "2-2-3-2-3",
  },
  {
    id: "whole",
    label: "Escala de Tonos Enteros",
    intervals: [0, 2, 4, 6, 8, 10],
    color: "#f472b6",
    pattern: "2-2-2-2-2-2",
  },
];

export const INTERVAL_NAMES: Record<number, string> = {
  0: "Tónica",
  1: "2ª menor",
  2: "2ª Mayor",
  3: "3ª menor",
  4: "3ª Mayor",
  5: "4ª Justa",
  6: "Tritono",
  7: "5ª Justa",
  8: "5ª aum.",
  9: "6ª Mayor",
  10: "7ª menor",
  11: "7ª Mayor",
};

export const intervalName = (interval: number): string =>
  INTERVAL_NAMES[mod(interval)] ?? `${interval}`;

export const INTERVAL_ABBR: Record<number, string> = {
  0: "T",
  1: "♭2",
  2: "2",
  3: "♭3",
  4: "3",
  5: "4",
  6: "♯4/♭5",
  7: "5",
  8: "♯5/♭6",
  9: "6",
  10: "♭7",
  11: "7",
};

export const intervalNameAbbr = (interval: number): string =>
  INTERVAL_ABBR[mod(interval)] ?? `${interval}`;

export const buildPitches = (root: Pitch, intervals: number[]): Pitch[] =>
  intervals.map((i) => mod(root + i));

export const buildPitchesWithInterval = (
  root: Pitch,
  intervals: number[],
): { pitch: Pitch; interval: number }[] =>
  intervals.map((i) => ({ pitch: mod(root + i), interval: mod(i) }));

// Círculo de quintas: 7 es generador porque mcd(7,12)=1
export const FIFTHS_ORDER: Pitch[] = [
  0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5,
];

export const FIFTHS_ORDER_NAMES = FIFTHS_ORDER.map(
  (p) => NOTE_NAMES_SPANISH[p],
);

// Posición de cada nota en el círculo de quintas (precalculado, O(1))
const FIFTH_INDEX_LOOKUP: number[] = new Array(12);
FIFTHS_ORDER.forEach((p, i) => { FIFTH_INDEX_LOOKUP[p] = i; });
export const fifthIndex = (p: Pitch): number => FIFTH_INDEX_LOOKUP[mod(p)];

export interface KeySignature {
  tonic: Pitch;
  name: string;
  count: number; // positivo = sostenidos, negativo = bemoles
  accidentals: string[]; // lista de notas alteradas
}

// Nombres de tonos en bemoles para armaduras planas
const FLAT_KEY_NAMES: Record<number, string> = {
  1: "Reb",
  3: "Mib",
  5: "Fa",
  8: "Lab",
  10: "Sib",
};

export function keySignature(root: Pitch): KeySignature {
  const pos = fifthIndex(root);
  let count: number;
  let accidentals: Pitch[];
  let name: string;

  if (pos <= 6) {
    // Sostenidos: F#, C#, G#, D#, A#, E#, B#
    count = pos;
    const sharpNotes = [6, 1, 8, 3, 10, 5, 0];
    accidentals = sharpNotes.slice(0, count);
    name = `${NOTE_NAMES_SPANISH[root]} Mayor`;
  } else {
    // Bemoles: Bb, Eb, Ab, Db, Gb, Cb, Fb
    count = pos - 12;
    const flatNotes = [10, 3, 8, 1, 6, 11, 5];
    accidentals = flatNotes.slice(0, Math.abs(count));
    // Usar nombre enarmónico bemol (ej: Do# → Reb)
    name = `${FLAT_KEY_NAMES[root] || NOTE_NAMES_SPANISH[root]} Mayor`;
  }

  return {
    tonic: root,
    name,
    count,
    accidentals: accidentals.map((p) =>
      pos <= 6
        ? SHARP_ACCIDENTAL_NAMES[p] ?? NOTE_NAMES_SPANISH[p]
        : FLAT_ACCIDENTAL_NAMES[p] ?? NOTE_NAMES_SPANISH[p],
    ),
  };
}

// Reproductor con Tone.js — singleton thread-safe con promesa
let synth: import("tone").PolySynth | null = null;
let synthPromise: Promise<import("tone").PolySynth> | null = null;

// Inicializa el AudioContext en el primer click global (requisito del navegador)
if (typeof window !== "undefined") {
  const initAudio = async () => {
    try {
      const { start } = await import("tone");
      await start();
    } catch { /* el primer fallo es esperado, se reintenta en getSynth */ }
  };
  window.addEventListener("click", initAudio, { once: true });
  window.addEventListener("keydown", initAudio, { once: true });
}

async function getSynth() {
  if (synth) return synth;
  if (synthPromise) return synthPromise;

  synthPromise = (async () => {
    try {
      const { PolySynth, Synth, start } = await import('tone');
      const s = new PolySynth(Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.02, decay: 0.2, sustain: 0.3, release: 0.6 },
      }).toDestination();
      await start();
      synth = s;
      return s;
    } catch (error) {
      synthPromise = null; // Limpiar para permitir reintentos
      throw error;
    }
  })();

  return synthPromise;
}

export function disposeSynth() {
  if (synth) {
    synth.dispose();
    synth = null;
  }
  synthPromise = null;
}

export async function playPitches(
  pitches: Pitch[],
  rootOctave = 4,
  duration = 1.2,
) {
  const { Frequency } = await import("tone");
  const activeSynth = await getSynth();
  activeSynth.releaseAll();
  const freqs = pitches.map((p) => {
    const midi = (rootOctave + 1) * 12 + p;
    return Frequency(midi, "midi").toFrequency();
  });
  activeSynth.triggerAttackRelease(freqs, duration);
}

export async function playPitchesArpeggiated(
  pitches: Pitch[],
  rootOctave = 4,
  noteDuration = 0.35,
  gap = 0.2,
  offsetSeconds = 0,
) {
  const { Frequency, now } = await import("tone");
  const activeSynth = await getSynth();
  activeSynth.releaseAll();
  const t0 = now() + 0.02 + offsetSeconds;
  pitches.forEach((p, i) => {
    const midi = (rootOctave + 1) * 12 + p;
    const freq = Frequency(midi, "midi").toFrequency();
    const startTime = t0 + i * (noteDuration + gap);
    activeSynth.triggerAttackRelease(freq, noteDuration, startTime);
  });
}
