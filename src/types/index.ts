export type Pitch = {
  step: "C" | "D" | "E" | "F" | "G" | "A" | "B";
  octave: number;
  accidental?: "#" | "b" | "##" | "bb";
};

export type BaseDuration = "1" | "2" | "4" | "8" | "16" | "32" | "64" | "128";

export type Note = {
  type: "NOTE";
  pitch: Pitch;
  duration: BaseDuration;
  tie?: boolean;
  articulation?: string[]; // e.g., ["staccato", "accent"]
  dynamic?: string; // e.g., "p", "mf", "f"
};

export type Rest = {
  type: "REST";
  duration: BaseDuration;
};

export type Chord = {
  type: "CHORD";
  notes: Pitch[];
  duration: BaseDuration;
};

export type Measure = {
  number: number;
  timeSignature: [number, number];
  elements: (Note | Rest | Chord)[];
};

export type Track = {
  name: string;
  instrument?: string;
  measures: Measure[];
};

export type Score = {
  bpm: number;
  keySignature: string; // e.g., "C", "Gm"
  tracks: Track[];
};
