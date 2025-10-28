import { describe, expect, it } from "vitest";
import * as toneJsUtils from "./toneJsUtils";
import compositions from "@/data/compositions";
import type { Score } from "@/types";
import { expectedPlaybackEvents } from "./__fixtures__/playbackEvents";

describe("noteDurationToSeconds", () => {
  it("returns 1 second for a quarter note at 60 bpm", () => {
    const seconds = toneJsUtils.noteDurationToSeconds(
      { numerator: 1, denominator: 4 },
      { bpm: 60, baseDuration: "4" }
    );

    expect(seconds).toBe(1);
  });
});

function resolveScore(category: keyof typeof compositions, name: string) {
  const score = compositions[category]?.find((s: Score) => s.name === name);
  if (!score)
    throw new Error(`Score not found for ${String(category)}:${name}`);
  const targetMeasures = score.tracks[0].measures;
  const tempoResolved = targetMeasures[0].tempo || score.tempo;
  return { targetMeasures, tempoResolved };
}

describe("measuresToPlayback", () => {
  it("correctly processes simple:oneVoice", () => {
    const score = compositions.simple.find((s) => s.name === "oneVoice");
    if (!score) throw new Error("Score not found");
    const targetMeasures = score.tracks[0].measures;
    const tempoResolved = targetMeasures[0].tempo || score.tempo;
    const events = toneJsUtils.measuresToPlayback(
      targetMeasures,
      tempoResolved
    );
    const expected = expectedPlaybackEvents.simple.oneVoice;

    expect(events).toMatchObject(expected);
  });

  it("correctly processes simple:multiVoice", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "simple",
      "multiVoice"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.simple.multiVoice;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes simple:simpleThreeEight", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "simple",
      "simpleThreeEight"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.simple.simpleThreeEight;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes dotted:singleDotted", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "dotted",
      "singleDotted"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.dotted.singleDotted;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes dotted:doubleDotted", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "dotted",
      "doubleDotted"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.dotted.doubleDotted;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tuplets:triplets1", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tuplets",
      "triplets1"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tuplets.triplets1;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tuplets:bigTriplets", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tuplets",
      "bigTriplets"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tuplets.bigTriplets;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tuplets:quintSex", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tuplets",
      "quintSext"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tuplets.quintSext;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes compoundMeter:sixEightA", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "compoundMeter",
      "sixEightA"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.compoundMeter.sixEightA;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes compoundMeter:nineEightA", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "compoundMeter",
      "nineEightA"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.compoundMeter.nineEightA;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes compoundMeter:sixEightB", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "compoundMeter",
      "sixEightB"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.compoundMeter.sixEightB;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes compoundMeter:twelveEightWRests", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "compoundMeter",
      "twelveEightWRests"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.compoundMeter.twelveEightWRests;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:eMajorScale", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "eMajorScale"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.eMajorScale;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:cSMelMinScale", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "cSMelMinScale"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.cSMelMinScale;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:appliedCMaj", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "appliedCMaj"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.appliedCMaj;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:fSHarMScale", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "fSHarMScale"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.fSHarMScale;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:bassClef", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "bassClef"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.bassClef;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes tonality:clefChange", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "tonality",
      "clefChange"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.tonality.clefChange;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes ties:monophonicWTuplet", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "ties",
      "monophonicWTuplet"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.ties.monophonicWTuplet;
    expect(events).toMatchObject(expected);
  });

  it("correctly processes ties:homophonicTies", () => {
    const { targetMeasures, tempoResolved } = resolveScore(
      "ties",
      "homophonicTies"
    );
    const events = toneJsUtils.measuresToPlayback(targetMeasures, tempoResolved);
    const expected = expectedPlaybackEvents.ties.homophonicTies;
    expect(events).toMatchObject(expected);
  });
});
