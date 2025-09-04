import type { Score } from "@/types";

const oneVoice: Score = {
  name: "oneVoice",
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
                type: "SONORITY",
                notes: [{ step: "C", octave: 4 }],
                duration: "4",
              },
              {
                // quarter note rest
                type: "REST",
                duration: "4",
              },
              {
                // half note chord
                type: "SONORITY",
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

const multiVoice: Score = {
  name: "multiVoice",
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
                type: "SONORITY",
                notes: [{ step: "C", octave: 5 }],
                duration: "4",
              },
              {
                type: "SONORITY",
                notes: [{ step: "D", octave: 4 }],

                duration: "4",
              },
              {
                type: "REST",
                duration: "4",
              },
              {
                type: "SONORITY",
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
                type: "SONORITY",
                notes: [{ step: "C", octave: 4 }],
                duration: "1",
              },
            ],
          ],
        },
      ],
    },
  ],
};

const dottedBasic: Score = {
  name: "dottedBasic",
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
                type: "SONORITY",
                notes: [{ step: "D", octave: 5 }],
                duration: "8",
                dots: 1,
              },
              {
                type: "SONORITY",
                notes: [{ step: "E", octave: 5 }],
                duration: "16",
              },
              {
                type: "SONORITY",
                notes: [
                  { step: "E", octave: 4 },
                  { step: "D", octave: 5 },
                ],
                duration: "2",
                dots: 1,
              },
            ],
          ],
        },
      ],
    },
  ],
};

export default [oneVoice, multiVoice, dottedBasic];

// 8th note E5, 16th note E5, chord of (E4 D5), chord of (E5 G5 B5)
// {
//   type: "SONORITY",
//   notes: [{ step: "E", octave: 5 }],
//   duration: "8",
//   dots: 1,
// },
// {
//   type: "SONORITY",
//   notes: [{ step: "E", octave: 5 }],
//   duration: "16",
// },
// {
//   type: "SONORITY",
//   notes: [
//     { step: "E", octave: 4 },
//     { step: "D", octave: 5 },
//   ],
//   duration: "2",
// },
// {
//   type: "SONORITY",
//   notes: [
//     { step: "E", octave: 5 },
//     { step: "G", octave: 5 },
//     { step: "B", octave: 5 },
//   ],
//   duration: "4",
// },
