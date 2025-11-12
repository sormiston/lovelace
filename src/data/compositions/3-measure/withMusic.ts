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

const scores = [repeatBar1];

export default scores;
