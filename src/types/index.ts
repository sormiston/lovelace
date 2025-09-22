// Basic musical elements
export type BaseDuration = "1" | "2" | "4" | "8" | "16" | "32" | "64" | "128";
export type Step = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Pitch = {
  step: Step;
  octave: Octave;
  accidental?: "#" | "b" | "##" | "bb";
};

export type Rest = {
  type: "REST";
  duration: BaseDuration;
  dots?: number;
};

export type Sonority = {
  type: "SONORITY";
  notes: Pitch[]; // Single pitch for a note, multiple for a chord
  duration: BaseDuration;
  dots?: number;
};

export interface NoteContext {
  type: "TUPLET" | "SIMPLE";
  members: Durational[];
}

export interface TupletGrouping extends NoteContext {
  type: "TUPLET";
  numNotes: number;
  inTimeOf: number;
  unitDuration: BaseDuration;
  members: Durational[];
}

export interface SimpleGrouping extends NoteContext {
  type: "SIMPLE";
  members: Durational[];
}

export type NoteGrouping = SimpleGrouping | TupletGrouping;

// Voice and measure structure
export type Durational = Rest | Sonority;
export type VoiceLine = NoteGrouping[];
export type TimeSignature = [number, number];
export type Tempo = {
  bpm: number;
  baseDuration: BaseDuration;
  compound?: boolean;
};

export type Measure = {
  number: number;
  timeSignature?: TimeSignature;
  keySignature?: string; // e.g., "C", "Gm"
  tempo?: Tempo;
  voices: VoiceLine[];
};

// High-level score structure
export type Track = {
  name: string;
  instrument?: string;
  measures: Measure[];
};

export type Score = {
  name: string;
  keySignature: string; // e.g., "C", "Gm"
  timeSignature: TimeSignature;
  tempo: Tempo;
  tracks: Track[];
};

// TONE.JS PLAYBACK TYPES
export type PartEventRich = [
  number,
  {
    duration: number;
    velocity: number;
  } & Pitch
];
