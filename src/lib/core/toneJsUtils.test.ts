import { describe, expect, it } from "vitest";
import * as toneJsUtils from "./toneJsUtils";
import { scores } from "@/data/compositions";
import type { PartEventRich, Score } from "@/types";
import { expectedPlaybackEvents } from "./__fixtures__/playbackEvents";

type ScorePool = keyof typeof scores;
type TestCase = [string, string, PartEventRich[], ScorePool];

describe("noteDurationToSeconds", () => {
  it("returns 1 second for a quarter note at 60 bpm", () => {
    const seconds = toneJsUtils.noteDurationToSeconds(
      { numerator: 1, denominator: 4 },
      { bpm: 60, baseDuration: "4" }
    );

    expect(seconds).toBe(1);
  });
});

function getScore(pool: string, category: string, name: string) {
  const categoryMap = (scores as Record<string, Record<string, Score[]>>)[pool]; // TODO: loosen the typing of the exported scores object!
  const score = categoryMap[category]?.find((s: Score) => s.name === name);

  if (!score)
    throw new Error(`Score not found for ${String(category)}:${name}`);

  return score;
}

describe("measuresToPlayback", () => {
  describe("singleMeasureScores", () => {
    const expectedCases = expectedPlaybackEvents.singleMeasureScores;

    const singleMeasureCases: TestCase[] = Object.entries(expectedCases)
      .map(([cat, v]) => [
        ...Object.entries(v).map(
          ([caseName, caseData]) =>
            [
              cat,
              caseName,
              caseData as PartEventRich[],
              "singleMeasureScores",
            ] satisfies TestCase
        ),
      ])
      .flat();

    it.each(singleMeasureCases)(
      "correctly processes %s:%s",
      (category, name, expectation, poolName) => {
        const score = getScore(poolName, category, name);

        const targetMeasures = score.tracks[0].measures;
        const tempoResolved = targetMeasures[0].tempo || score.tempo;

        const events = toneJsUtils.measuresToPlayback(
          targetMeasures,
          tempoResolved
        );

        expect(events).toMatchObject(expectation);
      }
    );
  });
});

describe("scoreToClickTrack", () => {
  describe("single measure tests", () => {
    it("generates correct number of click events for 4/4 measure at 60 bpm", () => {
      const events = toneJsUtils.scoreToClickTrack({
        tempo: { bpm: 60, baseDuration: "4" },
        timeSignature: [4, 4],
        tracks: [
          {
            measures: [{}],
          },
        ],
      } as unknown as Score);

      expect(events.length).toBe(4); // 4 quarter note clicks in a 4/4 measure
    });

    it("generates correct click events for quarternote = 120 in 4/4 time", () => {
      const events = toneJsUtils.scoreToClickTrack({
        tempo: { bpm: 120, baseDuration: "4" },
        timeSignature: [4, 4],
        tracks: [
          {
            measures: [{}],
          },
        ],
      } as unknown as Score);

      expect(events).toHaveLength(4);
      const expectedTimings = [0, 0.5, 1, 1.5];
      events.forEach((event, idx) => {
        expect(event[0]).toBe(expectedTimings[idx]);
      });
    });

    it("generates correct click events for eighthnote = 140 in 3/8 time", () => {
      const events = toneJsUtils.scoreToClickTrack({
        tempo: { bpm: 140, baseDuration: "8" },
        timeSignature: [3, 8],
        tracks: [
          {
            measures: [{}],
          },
        ],
      } as unknown as Score);

      expect(events).toHaveLength(3);
      const expectedTimings = [0, 0.42857142857142855, 0.8571428571428571];
      events.forEach((event, idx) => {
        expect(event[0]).toBe(expectedTimings[idx]);
      });
    });

    it("generates correct click events for halfnote = 60 in 2/2 time", () => {
      const events = toneJsUtils.scoreToClickTrack({
        tempo: { bpm: 60, baseDuration: "2" },
        timeSignature: [2, 2],
        tracks: [
          {
            measures: [{}],
          },
        ],
      } as unknown as Score);

      expect(events).toHaveLength(2);
      const expectedTimings = [0, 1];
      events.forEach((event, idx) => {
        expect(event[0]).toBe(expectedTimings[idx]);
      });
    });

    it("generates correct click events for dotted-quarter = 60 in 6/8 time", () => {
      const events = toneJsUtils.scoreToClickTrack({
        tempo: { bpm: 60, baseDuration: "4", compound: true },
        timeSignature: [6, 8],
        tracks: [
          {
            measures: [{}],
          },
        ],
      } as unknown as Score);

      expect(events).toHaveLength(2);
      const expectedTimings = [0, 1];
      events.forEach((event, idx) => {
        expect(event[0]).toBe(expectedTimings[idx]);
      });
    });
  });

  describe("3-measure tests", () => {
    it("generates correct click events across multiple uniform bars", () => {
      const score = getScore(
        "threeMeasureScores",
        "wholeBarRests",
        "fourFourBarRest"
      );

      const events = toneJsUtils.scoreToClickTrack(score);
      expect(events).toHaveLength(3 * 4);
    });

    it("generates correct click events for multiple uniform bars with repeats", () => {
      const score = getScore(
        "threeMeasureScores",
        "wholeBarRests",
        "repeatBar1To2RepeatBar3Rests"
      );

      const events = toneJsUtils.scoreToClickTrack(score);
      expect(events).toHaveLength(6 * 4);
    });
  });
});

describe("convertRepeats", () => {
  it("3measure: no repeats: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "fourFourBarRest"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // expect convertedMeasures to equal original measures
    expect(convertedMeasures).toEqual(score.tracks[0].measures);
  });

  it("3measure: bar 1 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar1Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 4 measures: measure 1, measure 1 (repeat), measure 2, measure 3
    expect(convertedMeasures.length).toBe(4);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(1);
    expect(convertedMeasures[2].number).toBe(2);
    expect(convertedMeasures[3].number).toBe(3);
  });

  it("3measure: bar 2 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar2Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 4 measures: measure 1, measure 2, measure 2 (repeat), measure 3
    expect(convertedMeasures.length).toBe(4);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(2);
    expect(convertedMeasures[3].number).toBe(3);
  });

  it("3measure: bar 3 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar3Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 4 measures: measure 1, measure 2, measure 3, measure 3 (repeat)
    expect(convertedMeasures.length).toBe(4);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(3);
    expect(convertedMeasures[3].number).toBe(3);
  });

  it("3measure: bars 1-2 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar1To2Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 5 measures: measure 1, measure 2, measure 1 (repeat), measure 2 (repeat), measure 3
    expect(convertedMeasures.length).toBe(5);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(1);
    expect(convertedMeasures[3].number).toBe(2);
    expect(convertedMeasures[4].number).toBe(3);
  });

  it("3measure: bars 1-3 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar1To3Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 6 measures: measure 1, measure 2, measure 3, measure 1 (repeat), measure 2 (repeat), measure 3 (repeat)
    expect(convertedMeasures.length).toBe(6);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(3);
    expect(convertedMeasures[3].number).toBe(1);
    expect(convertedMeasures[4].number).toBe(2);
    expect(convertedMeasures[5].number).toBe(3);
  });

  it("3measure: bars 2-3 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar2To3Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 5 measures: measure 1, measure 2, measure 3, measure 2 (repeat), measure 3 (repeat)
    expect(convertedMeasures.length).toBe(5);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(3);
    expect(convertedMeasures[3].number).toBe(2);
    expect(convertedMeasures[4].number).toBe(3);
  });

  it("3measure: bars 1-2 repeat, bar 3 repeat: works as expected", () => {
    const score = getScore(
      "threeMeasureScores",
      "wholeBarRests",
      "repeatBar1To2RepeatBar3Rests"
    );
    const convertedMeasures = toneJsUtils.convertRepeats(score.tracks[0]);
    // We expect 6 measures: measure 1, measure 2, measure 1 (repeat), measure 2 (repeat), measure 3, measure 3 (repeat)
    expect(convertedMeasures.length).toBe(6);
    expect(convertedMeasures[0].number).toBe(1);
    expect(convertedMeasures[1].number).toBe(2);
    expect(convertedMeasures[2].number).toBe(1);
    expect(convertedMeasures[3].number).toBe(2);
    expect(convertedMeasures[4].number).toBe(3);
    expect(convertedMeasures[5].number).toBe(3);
  });
});
