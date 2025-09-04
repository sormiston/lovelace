import type { Score } from "@/types";

export const vexFlowTutAddNotes: Score = {
  bpm: 120,
  keySignature: "C",
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          timeSignature: [4, 4],
          elements: [
            {
              // single quarter note
              type: "NOTE",
              pitch: { step: "C", octave: 4 },
              duration: "4",
            },
            {
              // quarter note rest
              type: "REST",
              duration: "4",
            },
            {
              // half note chord
              type: "CHORD",
              notes: [
                { step: "E", octave: 4 },
                { step: "G", octave: 4 },
              ],
              duration: "2",
            },
          ],
        },
      ],
    },
  ],
};
