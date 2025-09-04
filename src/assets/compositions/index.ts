import type { Score } from "@/types";

const vexflowTutAddNotesOneVoice: Score = {
  name: "2a",
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
          voices: [
            [
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
          ],
        },
      ],
    },
  ],
};

const vexflowTutAddNotesMultiVoice: Score = {
  name: "2b",
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
          voices: [
            // in this voice: quarter note C5 + quarter note D4 + quarter note rest + quarter note chord of (C4 E4 G4)
            [
              {
                type: "NOTE",
                pitch: { step: "C", octave: 5 },
                duration: "4",
              },
              {
                type: "NOTE",
                pitch: { step: "D", octave: 4 },
                duration: "4",
              },
              {
                type: "REST",
                duration: "4",
              },
              {
                type: "CHORD",
                notes: [
                  { step: "C", octave: 4 },
                  { step: "E", octave: 4 },
                  { step: "G", octave: 4 },
                ],
                duration: "4",
              },
            ],
            // in this voice: whole note on c4
            [
              {
                type: "NOTE",
                pitch: { step: "C", octave: 4 },
                duration: "1",
              },
            ],
          ],
        },
      ],
    },
  ],
};

export default [vexflowTutAddNotesOneVoice, vexflowTutAddNotesMultiVoice];
