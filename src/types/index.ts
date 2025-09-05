// Basic musical elements
export type BaseDuration = "1" | "2" | "4" | "8" | "16" | "32" | "64" | "128";

export type Pitch = {
  step: "C" | "D" | "E" | "F" | "G" | "A" | "B";
  octave: number;
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

// Voice and measure structure
export type Durational = Rest | Sonority;
export type VoiceLine = Durational[];

export type Measure = {
  number: number;
  timeSignature: [number, number];
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
  bpm: number;
  keySignature: string; // e.g., "C", "Gm"
  tracks: Track[];
};
