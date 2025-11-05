import { describe, expect, it } from "vitest";
import * as toneJsUtils from "./toneJsUtils";
import { scores } from "@/data/compositions";
import type { PartEventRich, Score } from "@/types";
import { expectedPlaybackEvents } from "./__fixtures__/playbackEvents";
import { expectedMetronomePlaybackEvents } from "./__fixtures__/metronomePlaybackEvents";

type TestCase = [string, string, PartEventRich[]];

describe("noteDurationToSeconds", () => {
  it("returns 1 second for a quarter note at 60 bpm", () => {
    const seconds = toneJsUtils.noteDurationToSeconds(
      { numerator: 1, denominator: 4 },
      { bpm: 60, baseDuration: "4" }
    );

    expect(seconds).toBe(1);
  });
});

describe("measuresToPlayback", () => {
  describe("singleMeasureScores", () => {
    const compositions = scores.singleMeasureScores;
    const expectedCases = expectedPlaybackEvents.singleMeasureScores;

    function resolveScore(category: string, name: string) {
      const score = compositions[category]?.find((s: Score) => s.name === name);
      if (!score)
        throw new Error(`Score not found for ${String(category)}:${name}`);
      const targetMeasures = score.tracks[0].measures;
      const tempoResolved = targetMeasures[0].tempo || score.tempo;
      return { targetMeasures, tempoResolved };
    }

    const singleMeasureCases: TestCase[] = Object.entries(expectedCases)
      .map(([cat, v]) => [
        ...Object.entries(v).map(
          ([caseName, caseData]) =>
            [cat, caseName, caseData as PartEventRich[]] satisfies TestCase
        ),
      ])
      .flat();

    it.each(singleMeasureCases)(
      "correctly processes %s:%s",
      (category, name, expectation) => {
        const { targetMeasures, tempoResolved } = resolveScore(category, name);

        const events = toneJsUtils.measuresToPlayback(
          targetMeasures,
          tempoResolved
        );

        expect(events).toMatchObject(expectation);
      }
    );
  });
});

describe("generateClickTrack", () => {
  describe("single measure tests", () => {
    it("generates correct number of click events for 4/4 measure at 60 bpm", () => {
      const { playbackData } = toneJsUtils.generateClickTrack(
        { bpm: 60, baseDuration: "4" },
        [4, 4],
        0
      );
      expect(playbackData.length).toBe(4); // 4 quarter note clicks in a 4/4 measure
      expect(playbackData[0][0]).toBe(0); // First click at time 0
      expect(playbackData[1][0]).toBe(1);
      expect(playbackData[2][0]).toBe(2);
      expect(playbackData[3][0]).toBe(3);
    });

    it("generates correct click events for quarternote = 120 in 4/4 time", () => {
      const fixture = expectedMetronomePlaybackEvents.find((e) => {
        const measure = e.measures[0];
        return (
          measure.timeSignature[0] === 4 &&
          measure.timeSignature[1] === 4 &&
          measure.tempo.bpm === 120 &&
          measure.tempo.baseDuration === "4"
        );
      });

      if (!fixture)
        throw new Error(
          "No fixture found for metronome case: single measure quarternote = 120 in 4/4 time"
        );

      const { playbackData } = toneJsUtils.generateClickTrack(
        fixture.measures[0].tempo,
        fixture.measures[0].timeSignature
      );

      expect(playbackData).toEqual(fixture.data);
    });

    it("generates correct click events for eighthnote = 140 in 3/8 time", () => {
      const fixture = expectedMetronomePlaybackEvents.find((e) => {
        const measure = e.measures[0];
        return (
          measure.timeSignature[0] === 3 &&
          measure.timeSignature[1] === 8 &&
          measure.tempo.bpm === 140 &&
          measure.tempo.baseDuration === "8"
        );
      });

      if (!fixture)
        throw new Error(
          "No fixture found for metronome case: single measure eighthnote = 140 in 3/8 time"
        );

      const { playbackData } = toneJsUtils.generateClickTrack(
        fixture.measures[0].tempo,
        fixture.measures[0].timeSignature
      );

      expect(playbackData).toEqual(fixture.data);
    });

    it("generates correct click events for halfnote = 60 in 2/2 time", () => {
      const fixture = expectedMetronomePlaybackEvents.find((e) => {
        const measure = e.measures[0];
        return (
          measure.timeSignature[0] === 2 &&
          measure.timeSignature[1] === 2 &&
          measure.tempo.bpm === 60 &&
          measure.tempo.baseDuration === "2"
        );
      });

      if (!fixture)
        throw new Error(
          "No fixture found for metronome case: single measure eighthnote = 140 in 3/8 time"
        );

      const { playbackData } = toneJsUtils.generateClickTrack(
        fixture.measures[0].tempo,
        fixture.measures[0].timeSignature
      );

      expect(playbackData).toEqual(fixture.data);
    });

    it("generates correct click events for dotted-quarter = 60 in 6/8 time", () => {
      const fixture = expectedMetronomePlaybackEvents.find((e) => {
        const measure = e.measures[0];
        return (
          measure.timeSignature[0] === 6 &&
          measure.timeSignature[1] === 8 &&
          measure.tempo.bpm === 60 &&
          measure.tempo.baseDuration === "4" &&
          measure.tempo.compound
        );
      });

      if (!fixture)
        throw new Error(
          "No fixture found for metronome case: single measure eighthnote = 140 in 3/8 time"
        );

      const { playbackData } = toneJsUtils.generateClickTrack(
        fixture.measures[0].tempo,
        fixture.measures[0].timeSignature
      );

      expect(playbackData).toEqual(fixture.data);
    });
  });
});
