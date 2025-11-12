import { Score } from "@/types";
import { BarlineType } from "vexflow4";

const repeatBar1: Score = {
  name: "repeatBar1",
  tempo: { bpm: 120, baseDuration: "4" },
  keySignature: "C",
  timeSignature: [2, 4],
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "G",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "E",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 4,
                      },
                    ],
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

const changeTimeSignature: Score = {
  name: "changeTimeSignature",
  tempo: { bpm: 100, baseDuration: "4" },
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
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "2",
                    notes: [
                      {
                        step: "E",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 2,
          timeSignature: [3, 4],
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "F",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "G",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "2",
                    notes: [
                      {
                        step: "B",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 5,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 5,
                      },
                    ],
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

const changeKeySignature: Score = {
  name: "changeKeySignature",
  tempo: { bpm: 138, baseDuration: "4" },
  keySignature: "F",
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
                clef: "bass",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "F",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 3,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 3,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 2,
          keySignature: "Fm",
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "bass",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "E",
                        accidental: "b",
                        octave: 3,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 3,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "E",
                        accidental: "b",
                        octave: 2,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "bass",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "F",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "G",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 2,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "B",
                        accidental: "b",
                        octave: 2,
                      },
                    ],
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

const changeTempo: Score = {
  name: "changeTempo",
  tempo: { bpm: 60, baseDuration: "4" },
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
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "E",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "E",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 2,
          tempo: { bpm: 90, baseDuration: "4" },
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "F",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "G",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "G",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "A",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 3,
          tempo: { bpm: 120, baseDuration: "4" },
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "B",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "B",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 5,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "D",
                        octave: 5,
                      },
                    ],
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

const changeClef: Score = {
  name: "changeClef",
  tempo: { bpm: 120, baseDuration: "4" },
  keySignature: "C",
  timeSignature: [4, 4],
  tracks: [
    {
      name: "Piano",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "bass",
                members: [
                  {
                    type: "SONORITY",
                    duration: "4",
                    notes: [
                      {
                        step: "C",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "2",
                    dots: 1,
                    notes: [
                      {
                        step: "D",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "tenor",
                members: [
                  {
                    type: "SONORITY",
                    duration: "1",
                    notes: [
                      {
                        step: "E",
                        octave: 4,
                      },
                    ],
                  },
                ],
              },
            ],
          ],
        },
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
                members: [
                  {
                    type: "SONORITY",
                    duration: "2",
                    notes: [
                      {
                        step: "F",
                        octave: 4,
                      },
                    ],
                  },
                  {
                    type: "SONORITY",
                    duration: "2",
                    notes: [
                      {
                        step: "G",
                        octave: 4,
                      },
                    ],
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

const scores = [
  repeatBar1,
  changeTimeSignature,
  changeKeySignature,
  changeTempo,
  changeClef,
];

export default scores;
