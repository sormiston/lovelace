import { Score } from "@/types";
import { BarlineType } from "vexflow4";

const fourFourBarRest: Score = {
  name: "fourFourBarRest",
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

const repeatBar1Rests: Score = {
  name: "repeatBar1Rests",
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

const repeatBar2Rests: Score = {
  name: "repeatBar2Rests",
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

const repeatBar3Rests: Score = {
  name: "repeatBar3Rests",
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

const repeatBar1To2Rests: Score = {
  name: "repeatBar1To2Rests",
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

const repeatBar1To3Rests: Score = {
  name: "repeatBar1To3Rests",
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

const repeatBar2To3Rests: Score = {
  name: "repeatBar2To3Rests",
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

const repeatBar1To2RepeatBar3Rests: Score = {
  name: "repeatBar1To2RepeatBar3Rests",
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

const scores = {
  wholeBarRests: [
    fourFourBarRest,
    repeatBar1Rests,
    repeatBar2Rests,
    repeatBar3Rests,
    repeatBar1To2Rests,
    repeatBar1To3Rests,
    repeatBar2To3Rests,
    repeatBar1To2RepeatBar3Rests,
  ],
  withMusic: [repeatBar1],
};

export default scores;
