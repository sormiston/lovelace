export const expectedPlaybackEvents = {
  simple: {
    oneVoice: [
      [
        0,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "F",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 1,
          velocity: 0.7,
          step: "A",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 1,
          velocity: 0.7,
          step: "C",
          octave: 6,
        },
      ],
    ],
    multiVoice: [
      [
        0,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0,
        {
          duration: 2,
          velocity: 0.7,
          step: "C",
          octave: 4,
        },
      ],
    ],
    simpleThreeEight: [
      [
        0,
        {
          duration: 0.42857142857142855,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0.42857142857142855,
        {
          duration: 0.42857142857142855,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        0.8571428571428571,
        {
          duration: 0.42857142857142855,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
  dotted: {
    singleDotted: [
      [
        0,
        {
          duration: 0.375,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        0.375,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 1.5,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        0.5,
        {
          duration: 1.5,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
    ],
    doubleDotted: [
      [
        0,
        {
          duration: 0.875,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        0,
        {
          duration: 0.875,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        0.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.875,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        1,
        {
          duration: 0.875,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        1.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
    ],
  },
  tuplets: {
    triplets1: [
      [
        0,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        0.6666666666666666,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        0.8333333333333333,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        0.9999999999999999,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.25,
        {
          duration: 0.08333333333333333,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.3333333333333333,
        {
          duration: 0.08333333333333333,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        1.4166666666666665,
        {
          duration: 0.08333333333333333,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.4999999999999998,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        1.7499999999999998,
        {
          duration: 0.08333333333333333,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        1.833333333333333,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
    ],
    bigTriplets: [
      [
        0,
        {
          duration: 0.9411764705882353,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.9411764705882353,
        {
          duration: 0.9411764705882353,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        1.8823529411764706,
        {
          duration: 0.9411764705882353,
          velocity: 0.7,
          step: "G",
          octave: 5,
        },
      ],
      [
        0,
        {
          duration: 0.7058823529411765,
          velocity: 0.7,
          step: "C",
          octave: 4,
        },
      ],
      [
        0.7058823529411765,
        {
          duration: 0.7058823529411765,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        1.411764705882353,
        {
          duration: 0.7058823529411765,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        2.1176470588235294,
        {
          duration: 0.7058823529411765,
          velocity: 0.7,
          step: "C",
          octave: 4,
        },
      ],
    ],
    quintSext: [
      [
        0,
        {
          duration: 0.16666666666666669,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        0.16666666666666669,
        {
          duration: 0.16666666666666669,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        0.33333333333333337,
        {
          duration: 0.16666666666666669,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 0.16666666666666669,
          velocity: 0.7,
          step: "F",
          octave: 5,
        },
      ],
      [
        0.6666666666666667,
        {
          duration: 0.16666666666666669,
          velocity: 0.7,
          step: "G",
          octave: 5,
        },
      ],
      [
        0.8333333333333335,
        {
          duration: 0.33333333333333337,
          velocity: 0.7,
          step: "A",
          octave: 5,
        },
      ],
      [
        1.166666666666667,
        {
          duration: 0.33333333333333337,
          velocity: 0.7,
          step: "B",
          octave: 5,
        },
      ],
      [
        1.5000000000000004,
        {
          duration: 0.33333333333333337,
          velocity: 0.7,
          step: "C",
          octave: 6,
        },
      ],
      [
        1.833333333333334,
        {
          duration: 0.33333333333333337,
          velocity: 0.7,
          step: "D",
          octave: 6,
        },
      ],
      [
        2.1666666666666674,
        {
          duration: 0.33333333333333337,
          velocity: 0.7,
          step: "E",
          octave: 6,
        },
      ],
      [
        2.500000000000001,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "G",
          octave: 5,
        },
      ],
      [
        2.6388888888888897,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "F",
          octave: 5,
        },
      ],
      [
        2.7777777777777786,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        2.9166666666666674,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        3.0555555555555562,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        3.194444444444445,
        {
          duration: 0.1388888888888889,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
    ],
  },
  compoundMeter: {
    sixEightA: [
      [
        0,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        0,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        0.3333333333333333,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        0.6666666666666666,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        1,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "G",
          octave: 5,
        },
      ],
      [
        1.3333333333333333,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        1.6666666666666665,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "F",
          octave: 5,
        },
      ],
    ],
    nineEightA: [
      [
        0,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        0.5,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        0.6666666666666666,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
      [
        1.6666666666666665,
        {
          duration: 0.3333333333333333,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        1.9999999999999998,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
      [
        2.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "D",
          octave: 5,
        },
      ],
    ],
    sixEightB: [
      [
        0,
        {
          duration: 0.28846153846153844,
          velocity: 0.7,
          step: "D",
          octave: 6,
        },
      ],
      [
        0.28846153846153844,
        {
          duration: 0.09615384615384615,
          velocity: 0.7,
          step: "C",
          octave: 6,
        },
      ],
      [
        0.3846153846153846,
        {
          duration: 0.1923076923076923,
          velocity: 0.7,
          step: "B",
          octave: 5,
        },
      ],
      [
        0.5769230769230769,
        {
          duration: 0.28846153846153844,
          velocity: 0.7,
          step: "A",
          octave: 5,
        },
      ],
      [
        0.8653846153846153,
        {
          duration: 0.09615384615384615,
          velocity: 0.7,
          step: "G",
          octave: 5,
        },
      ],
      [
        0.9615384615384615,
        {
          duration: 0.1923076923076923,
          velocity: 0.7,
          step: "F",
          octave: 5,
        },
      ],
    ],
    twelveEightWRests: [
      [
        3,
        {
          duration: 0.6666666666666666,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
    ],
  },
  tonality: {
    eMajorScale: [
      [
        0,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        0.25,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "F",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.5,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "G",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.75,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        1,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        1.25,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "C",
          octave: 5,
          accidental: "#",
        },
      ],
      [
        1.5,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "D",
          octave: 5,
          accidental: "#",
        },
      ],
      [
        1.75,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "E",
          octave: 5,
        },
      ],
    ],
    cSMelMinScale: [
      [
        0,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "C",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.125,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "D",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.25,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        0.375,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "F",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.5,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "G",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.625,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "A",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.75,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "B",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "C",
          octave: 5,
          accidental: "#",
        },
      ],
      [
        1,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        1.125,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        1.25,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "G",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1.375,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "F",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1.5,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        1.625,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "D",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1.75,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "C",
          octave: 4,
          accidental: "#",
        },
      ],
    ],
    appliedCMaj: [
      [
        0,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "E",
          octave: 4,
          accidental: "b",
        },
      ],
      [
        0,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "A",
          octave: 4,
          accidental: "b",
        },
      ],
      [
        0,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        1.2,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        1.2,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "F",
          octave: 4,
        },
      ],
      [
        1.2,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        1.2,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "C",
          octave: 5,
        },
      ],
      [
        2.4,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        2.4,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "F",
          octave: 4,
        },
      ],
      [
        2.4,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        2.4,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
      [
        3.5999999999999996,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "C",
          octave: 4,
        },
      ],
      [
        3.5999999999999996,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        3.5999999999999996,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        3.5999999999999996,
        {
          duration: 1.2,
          velocity: 0.7,
          step: "B",
          octave: 4,
        },
      ],
    ],
    fSHarMScale: [
      [
        0,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "F",
          octave: 3,
          accidental: "#",
        },
      ],
      [
        0.125,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "G",
          octave: 3,
          accidental: "#",
        },
      ],
      [
        0.25,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "A",
          octave: 3,
        },
      ],
      [
        0.375,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "B",
          octave: 3,
        },
      ],
      [
        0.5,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "C",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.625,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        0.75,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        0.875,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "F",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "E",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1.125,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        1.25,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "C",
          octave: 4,
          accidental: "#",
        },
      ],
      [
        1.375,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "B",
          octave: 3,
        },
      ],
      [
        1.5,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "A",
          octave: 3,
        },
      ],
      [
        1.625,
        {
          duration: 0.125,
          velocity: 0.7,
          step: "G",
          octave: 3,
          accidental: "#",
        },
      ],
      [
        1.75,
        {
          duration: 0.25,
          velocity: 0.7,
          step: "F",
          octave: 3,
          accidental: "#",
        },
      ],
    ],
    bassClef: [
      [
        0,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "B",
          octave: 3,
          accidental: "b",
        },
      ],
      [
        1,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "E",
          octave: 4,
          accidental: "b",
        },
      ],
    ],
    clefChange: [
      [
        0,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "C",
          octave: 3,
        },
      ],
      [
        0.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "G",
          octave: 3,
        },
      ],
      [
        1,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "B",
          octave: 3,
          accidental: "b",
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        2,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "E",
          octave: 4,
          accidental: "b",
        },
      ],
      [
        2.1666666666666665,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "G",
          octave: 4,
        },
      ],
      [
        2.333333333333333,
        {
          duration: 0.16666666666666666,
          velocity: 0.7,
          step: "F",
          octave: 4,
          accidental: "#",
        },
      ],
    ],
  },

  ties: {
    monophonicTies: [
      [
        0,
        {
          duration: 0.375,
          velocity: 0.7,
          step: "C",
          octave: 3,
        },
      ],
      [
        0.375,
        {
          duration: 0.375,
          velocity: 0.7,
          step: "G",
          octave: 3,
        },
      ],
      [
        0.75,
        {
          duration: 0.375,
          velocity: 0.7,
          step: "C",
          octave: 3,
        },
      ],
      [
        1.125,
        {
          duration: 0.375,
          velocity: 0.7,
          step: "G",
          octave: 3,
        },
      ],
      [
        1.5,
        {
          duration: 0.5,
          velocity: 0.7,
          step: "C",
          octave: 3,
        },
      ],
    ],
    monophonicWTuplet: [
      [
        0,
        {
          duration: 0.8695652173913043,
          velocity: 0.7,
          step: "C",
          octave: 4,
        },
      ],
      [
        0.8695652173913043,
        {
          duration: 1.576086956521739,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        2.4456521739130435,
        {
          duration: 0.16304347826086957,
          velocity: 0.7,
          step: "E",
          octave: 4,
        },
      ],
    ],
    homophonicTies: [
      [
        1.3333333333333333,
        {
          duration: 3.6666666666666665,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        1.3333333333333333,
        {
          duration: 3.6666666666666665,
          velocity: 0.7,
          step: "F",
          octave: 4,
        },
      ],
      [
        1.3333333333333333,
        {
          duration: 3.6666666666666665,
          velocity: 0.7,
          step: "A",
          octave: 4,
        },
      ],
      [
        5,
        {
          duration: 1,
          velocity: 0.7,
          step: "B",
          octave: 3,
        },
      ],
      [
        5,
        {
          duration: 1,
          velocity: 0.7,
          step: "D",
          octave: 4,
        },
      ],
      [
        5,
        {
          duration: 1,
          velocity: 0.7,
          step: "F",
          octave: 4,
        },
      ],
    ],
  },
};
