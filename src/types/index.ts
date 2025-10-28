import type { ClefNote, StaveNote, Tuplet } from "vexflow4";

// Basic musical elements
export type BaseDuration = "1" | "2" | "4" | "8" | "16" | "32" | "64" | "128";
export type Step = "C" | "D" | "E" | "F" | "G" | "A" | "B";
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type ClefNames = "treble" | "bass" | "alto" | "tenor" | "percussion"; // add "tab" later
export type Fraction = { numerator: number; denominator: number };

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
  tieStart?: boolean;
  tieEnd?: boolean;
};

export type ClefChange = {
  type: "CLEF_CHANGE";
  newClef: ClefNames;
};

export type NoteContextMember = Durational | ClefChange;

// HEH.  Below is an experiment in "how do i feel about OOP style inheritance"
export interface NoteContext {
  type: "TUPLET" | "SIMPLE";
  clef: ClefNames;
  members: NoteContextMember[];
}

export interface TupletGrouping extends NoteContext {
  type: "TUPLET";
  numNotes: number;
  inTimeOf: number;
  unitDuration: BaseDuration;
}

export interface SimpleGrouping extends NoteContext {
  type: "SIMPLE";
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
  // clef: ClefNames;
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

export type TieLigation = {
  start: StaveNote;
  end: StaveNote;
  firstIndices: number[];
  lastIndices: number[];
};

export type TieAnchor = {
  note: StaveNote;
  keyIndexMap: Map<string, number[]>;
};

export type ProcessNoteGroupResult = {
  notes: (StaveNote | ClefNote)[];
  tuplets: Tuplet[];
};

export type PlaybackRest = { type: "REST"; duration: Fraction };
export type PlaybackSonority = {
  type: "SONORITY";
  duration: Fraction;
  notes: Sonority["notes"];
};

export type PlaybackDurational = PlaybackRest | PlaybackSonority;

export type PlaybackSimpleGrouping = {
  type: "SIMPLE";
  members: PlaybackDurational[];
};

export type PlaybackTupletGrouping = {
  type: "TUPLET";
  members: PlaybackDurational[];
  numNotes: number;
  inTimeOf: number;
  unitDuration: BaseDuration;
};

export type PlaybackNoteGrouping =
  | PlaybackSimpleGrouping
  | PlaybackTupletGrouping;
