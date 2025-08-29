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
              // single note
              type: "NOTE",
              pitch: { step: "C", octave: 4 },
              duration: "q",
              startTime: "0:1",
              velocity: 0.8,
            },
            {
              // rest
              type: "REST",
              duration: "q",
              startTime: "0:2",
            },
            {
              // chord
              type: "CHORD",
              notes: [
                { step: "E", octave: 4 },
                { step: "G", octave: 4 },
              ],
              duration: "h",
              startTime: "0:3",
              velocity: 0.8,
            },
          ],
        },
      ],
    },
  ],
};
