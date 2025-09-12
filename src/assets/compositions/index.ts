import type { Score } from "@/types";

const oneVoice: Score = {
  name: "oneVoice",
  bpm: 120,
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
                  // {
                  //   // single quarter note
                  //   type: "SONORITY",
                  //   notes: [{ step: "C", octave: 4 }],
                  //   duration: "4",
                  // },
                  // {
                  //   // quarter note rest
                  //   type: "REST",
                  //   duration: "4",
                  // },
                  // {
                  //   // half note chord
                  //   type: "SONORITY",
                  //   notes: [
                  //     { step: "E", octave: 4 },
                  //     { step: "G", octave: 4 },
                  //   ],
                  //   duration: "2",
                  // },
                  {
                    // single quarter note
                    type: "SONORITY",
                    notes: [{ step: "F", octave: 5 }],
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
                      { step: "A", octave: 5 },
                      { step: "C", octave: 6 },
                    ],
                    duration: "2",
                  },
                ],
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
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            // in this voice: quarter note C5 + quarter note D4 + quarter note rest + quarter note chord of (C4 E4 G4)
            [
              {
                type: "SIMPLE",
                members: [
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
                      { step: "A", octave: 4 },
                      { step: "C", octave: 5 },
                      { step: "E", octave: 5 },
                    ],
                    duration: "4",
                  },
                ],
              },
            ],
            // in this voice: whole note on c4
            [
              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 4 }],
                    duration: "1",
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

const singleDotted: Score = {
  name: "singleDotted",
  bpm: 120,
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
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
              },
            ],
          ],
        },
      ],
    },
  ],
};

const doubleDotted: Score = {
  name: "doubleDotted",
  bpm: 120,
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [
                      { step: "C", octave: 5 },
                      { step: "E", octave: 5 },
                    ],
                    duration: "4",
                    dots: 2,
                  },
                  {
                    type: "SONORITY",
                    notes: [
                      { step: "G", octave: 4 },
                      { step: "D", octave: 5 },
                    ],
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [
                      { step: "E", octave: 4 },
                      { step: "C", octave: 5 },
                    ],
                    duration: "4",
                    dots: 2,
                  },
                  {
                    type: "SONORITY",
                    notes: [
                      { step: "E", octave: 4 },
                      { step: "B", octave: 4 },
                    ],
                    duration: "16",
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

// simple score in 3/4 time, one quarter note + half note rest
const simpleThreeFour: Score = {
  name: "simpleThreeFour",
  bpm: 120,
  keySignature: "C",
  timeSignature: [3, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
                  // {
                  //   type: "SONORITY",
                  //   notes: [{ step: "C", octave: 4 }],
                  //   duration: "4",
                  // },
                  {
                    type: "REST",
                    duration: "2",
                    dots: 1,
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

const simpleSixEight: Score = {
  name: "simpleSixEight",
  bpm: 120,
  keySignature: "C",
  timeSignature: [6, 8],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "A", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "B", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "D", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "F", octave: 5 }],
                    duration: "8",
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

export const triplets1: Score = {
  name: "triplets1",
  bpm: 120,
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "4",
                  },
                ],
              },
              {
                type: "TUPLET",
                numNotes: 3,
                inTimeOf: 2,
                unitDuration: "8",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "A", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "B", octave: 4 }],
                    duration: "8",
                  },
                ],
              },

              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "8",
                  },
                ],
              },
              {
                type: "TUPLET",
                numNotes: 3,
                inTimeOf: 2,
                unitDuration: "8",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "B", octave: 4 }],
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "16",
                  },
                ],
              },
              {
                type: "TUPLET",
                numNotes: 3,
                inTimeOf: 2,
                unitDuration: "8",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "8",
                  },
                  {
                    type: "REST",
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "16",
                  },

                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "8",
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

// in this example give a triplet, 3 half notes on a bar
export const bigTriplets: Score = {
  name: "bigTriplets",
  bpm: 85,
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            // Voice 1
            [
              {
                type: "TUPLET",
                numNotes: 3,
                inTimeOf: 2,
                unitDuration: "2",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "2",
                  },

                  {
                    type: "SONORITY",
                    notes: [{ step: "E", octave: 5 }],
                    duration: "2",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 5 }],
                    duration: "2",
                  },
                ],
              },
            ],
            // Voice 2
            [
              {
                type: "SIMPLE",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 4 }],
                    duration: "4",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 4 }],
                    duration: "4",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "E", octave: 4 }],
                    duration: "4",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 4 }],
                    duration: "4",
                  },
                ],
              },
            ],
          ],
        },
      ],
    },
  ],
};

// export default [
//   oneVoice,
//   multiVoice,
//   singleDotted,
//   doubleDotted,
//   simpleThreeFour,
//   simpleSixEight,
//   triplets1,
//   bigTriplets,
// ];

export default {
  voices: [oneVoice, multiVoice],
  dotted: [singleDotted, doubleDotted],
  tuplets: [triplets1, bigTriplets],
  barRests: [simpleThreeFour],
  compoundMeter: [simpleSixEight],
};
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
