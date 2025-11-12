import { Score } from "@/types";
import { BarlineType } from "vexflow4";

const fourFourBar: Score = {
  name: "fourFourBar",
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
                clef: "treble",
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
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar1: Score = {
  name: "repeatBar1",
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
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar2: Score = {
  name: "repeatBar2",
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
                clef: "treble",
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
        {
          number: 2,
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar3: Score = {
  name: "repeatBar3",
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
                clef: "treble",
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
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar1To2: Score = {
  name: "repeatBar1To2",
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
          leftBarline: BarlineType.REPEAT_BEGIN,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 2,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar1To3: Score = {
  name: "repeatBar1To3",
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
          leftBarline: BarlineType.REPEAT_BEGIN,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar2To3: Score = {
  name: "repeatBar2To3",
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
                clef: "treble",
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
        {
          number: 2,
          leftBarline: BarlineType.REPEAT_BEGIN,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const repeatBar1To2RepeatBar3: Score = {
  name: "repeatBar1To2RepeatBar3",
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
          leftBarline: BarlineType.REPEAT_BEGIN,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 2,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const changeTimeSignature: Score = {
  name: "changeTimeSignature",
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
                clef: "treble",
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
                    type: "REST",
                    duration: "1",
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

const changeKeySignature: Score = {
  name: "changeKeySignature",
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
                clef: "treble",
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
        {
          number: 2,
          keySignature: "Gb",
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const changeClef: Score = {
  name: "changeClef",
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
                clef: "treble",
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
        {
          number: 2,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "bass",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const changeTempo: Score = {
  name: "changeTempo",
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
                clef: "treble",
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
        {
          number: 2,
          tempo: { bpm: 72, baseDuration: "2" },
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const changeMany: Score = {
  // in this score change time signature, key signature, clef, and tempo all at once
  name: "changeMany",
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
                clef: "treble",
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
        {
          number: 2,
          timeSignature: [3, 4],
          keySignature: "Eb",
          tempo: { bpm: 90, baseDuration: "8" },
          leftBarline: BarlineType.REPEAT_BEGIN,
          rightBarline: BarlineType.REPEAT_END,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "bass",
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
        {
          number: 3,
          voices: [
            [
              {
                type: "SIMPLE",
                clef: "treble",
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

const scores = [
  fourFourBar,
  repeatBar1,
  repeatBar2,
  repeatBar3,
  repeatBar1To2,
  repeatBar1To3,
  repeatBar2To3,
  repeatBar1To2RepeatBar3,
  changeTimeSignature,
  changeKeySignature,
  changeClef,
  changeTempo,
  changeMany,
];

export default scores;
