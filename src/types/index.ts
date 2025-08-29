export type Pitch = {
  step: "C" | "D" | "E" | "F" | "G" | "A" | "B";
  octave: number;
  accidental?: "#" | "b" | "##" | "bb" | "natural";
};

export type VexDuration = "q" | "h"; // TODO: add for completion

export type ToneNotationDuration = "4n" | "2n";

export type Note = {
  type: "NOTE";
  pitch: Pitch;
  duration: VexDuration;
  startTime: string;
  velocity?: number; // 0-1, optional if only notation
  tie?: boolean;
  articulation?: string[]; // e.g., ["staccato", "accent"]
  dynamic?: string; // e.g., "p", "mf", "f"
};

export type Rest = {
  type: "REST";
  duration: VexDuration;
  startTime: string;
};

export type Chord = {
  type: "CHORD";
  notes: Pitch[];
  duration: VexDuration;
  startTime: string;
  velocity: number;
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
