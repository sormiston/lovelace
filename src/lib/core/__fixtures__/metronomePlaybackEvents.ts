import type { TimeSignature, Tempo, PartEventRich } from "@/types";

type Expectation = {
  measures: { tempo: Tempo; timeSignature: TimeSignature }[];
  data: PartEventRich[];
};

export const expectedMetronomePlaybackEvents: Expectation[] = [
  {
    measures: [
      {
        timeSignature: [4, 4],
        tempo: {
          bpm: 120,
          baseDuration: "4",
        },
      },
    ],
    data: [
      [
        0,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.5,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
  {
    measures: [
      {
        timeSignature: [3, 8],
        tempo: { bpm: 140, baseDuration: "8" },
      },
    ],
    data: [
      [
        0,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.42857142857142855,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.8571428571428571,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
  {
    measures: [
      {
        tempo: { bpm: 60, baseDuration: "2" },
        timeSignature: [2, 2],
      },
    ],
    data: [
      [
        0,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
  {
    measures: [
      {
        tempo: { bpm: 60, baseDuration: "4", compound: true },
        timeSignature: [6, 8],
      },
    ],

    data: [
      [
        0,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.2,
          velocity: 0.8,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
];
