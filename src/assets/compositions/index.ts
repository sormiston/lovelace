import type { Score } from "@/types";

const oneVoice: Score = {
  name: "oneVoice",
  tempo: {
    bpm: 120,
    baseDuration: "4",
  },
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
  tempo: { bpm: 120, baseDuration: "4" },
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
  tempo: { bpm: 120, baseDuration: "4" },
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
  tempo: { bpm: 120, baseDuration: "4" },
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
const threeFourBarRest: Score = {
  name: "threeFourBarRest",
  tempo: { bpm: 120, baseDuration: "4" },
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
                  {
                    type: "REST",
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

const twoTwoBarRest: Score = {
  name: "twoTwoBarRest",
  tempo: { bpm: 60, baseDuration: "2" },
  keySignature: "C",
  timeSignature: [2, 2],
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
                    type: "REST",
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

const sixEightA: Score = {
  name: "sixEightA",
  tempo: { bpm: 60, baseDuration: "4", compound: true },
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
  tempo: { bpm: 120, baseDuration: "4" },
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
  tempo: { bpm: 85, baseDuration: "4" },
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

// a simple 3/8 score example
const simpleThreeEight: Score = {
  name: "simpleThreeEight",
  tempo: { bpm: 140, baseDuration: "8" },
  keySignature: "C",
  timeSignature: [3, 8],
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
                    notes: [{ step: "E", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "D", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
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

// a 9/8 bar with rests and subdivisions
const nineEightA: Score = {
  name: "nineEightA",
  tempo: { bpm: 60, baseDuration: "4", compound: true },
  keySignature: "C",
  timeSignature: [9, 8],
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
                    notes: [{ step: "E", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "REST",
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "D", octave: 5 }],
                    duration: "16",
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
                    type: "REST",
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "E", octave: 5 }],
                    duration: "8",
                  },
                ],
              },
              {
                // 2 eighths in the time of 3 (duplet over one dotted-quarter beat)
                type: "TUPLET",
                numNotes: 2,
                inTimeOf: 3,
                unitDuration: "8",
                members: [
                  {
                    type: "SONORITY",
                    notes: [{ step: "E", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "D", octave: 5 }],
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

const sixEightB: Score = {
  name: "sixEightB",
  tempo: { bpm: 104, baseDuration: "4", compound: true },
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
                    notes: [{ step: "D", octave: 6 }],
                    duration: "8",
                    dots: 1,
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 6 }],
                    duration: "16",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "B", octave: 5 }],
                    duration: "8",
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "A", octave: 5 }],
                    duration: "8",
                    dots: 1,
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "G", octave: 5 }],
                    duration: "16",
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

const twelveEightWRests: Score = {
  name: "twelveEightWRests",
  tempo: { bpm: 60, baseDuration: "4", compound: true },
  keySignature: "C",
  timeSignature: [12, 8],
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
                    type: "REST",
                    duration: "2",
                    dots: 1,
                  },
                  {
                    type: "REST",
                    duration: "4",
                    dots: 1,
                  },
                  {
                    type: "SONORITY",
                    notes: [{ step: "C", octave: 5 }],
                    duration: "4",
                  },
                  {
                    type: "REST",
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

export default {
  simple: [oneVoice, multiVoice, simpleThreeEight],
  dotted: [singleDotted, doubleDotted],
  tuplets: [triplets1, bigTriplets],
  barRests: [twoTwoBarRest, threeFourBarRest],
  compoundMeter: [sixEightA, nineEightA, sixEightB, twelveEightWRests],
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
