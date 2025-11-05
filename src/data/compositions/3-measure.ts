import { Score } from "@/types";

const fourFourBarRest: Score = {
  name: "fourFourBarRest",
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

const scores = {
  basics: [fourFourBarRest],
};

export default scores;
