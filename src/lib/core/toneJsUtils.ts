import type {
  Measure,
  NoteGrouping,
  PartEventRich,
  PlaybackDurational,
  PlaybackNoteGrouping,
  PlaybackSonority,
  Tempo,
  TimeSignature,
  Fraction,
  Score,
} from "@/types";
import { ensureExhaustive } from "@/lib/_utils";
import { BarlineType } from "vexflow4";

export function scoreToClickTrack(score: Score) {
  const measures = convertRepeats(score.tracks[0].measures);
  let offset = 0;
  const events: PartEventRich[] = [];

  for (const m of measures) {
    const resolvedTempo = m.tempo || score.tempo;
    const resolvedTimeSig = m.timeSignature || score.timeSignature;

    const { playbackData, offset: newOffset } = measureToClickTrack(
      resolvedTempo,
      resolvedTimeSig,
      offset
    );

    offset = newOffset;
    events.push(...playbackData);
  }

  return events;
}

export function measureToClickTrack(
  tempo: Tempo,
  timeSig: TimeSignature,
  offset: number = 0
): { playbackData: PartEventRich[]; offset: number } {
  const playbackData: PartEventRich[] = [];
  let currentTime = offset;

  const measureFraction: Fraction = {
    numerator: timeSig[0],
    denominator: timeSig[1],
  };
  const beatFraction = tempo.compound
    ? durationWithDotsToFraction(tempo.baseDuration, 1)
    : coerceDurationToFraction(tempo.baseDuration);
  const beatsPerMeasure = fractionToFloat(
    divideFractions(measureFraction, beatFraction)
  );
  const roundedBeats = Math.round(beatsPerMeasure);

  if (Math.abs(roundedBeats - beatsPerMeasure) > 1e-9) {
    throw new Error(
      `Tempo beat unit ${tempo.baseDuration} does not evenly divide ${timeSig[0]}/${timeSig[1]}`
    );
  }
  const beatDurationSeconds = noteDurationToSeconds(beatFraction, tempo);

  for (let i = 0; i < roundedBeats; i++) {
    playbackData.push([
      currentTime,
      {
        duration: 0.2,
        velocity: 0.8,
        step: "C",
        octave: 5,
      },
    ]);

    currentTime += beatDurationSeconds;
  }

  return { playbackData, offset: currentTime };
}

export function noteDurationToSeconds(
  duration: Fraction,
  tempo: Tempo
): number {
  const beatFraction = coerceDurationToFraction(tempo.baseDuration);
  const noteValue = fractionToFloat(duration);
  let beatValue = fractionToFloat(beatFraction);

  if (tempo.compound) {
    beatValue *= 1.5;
  }

  const beatUnitDuration = 60 / tempo.bpm;
  return (noteValue / beatValue) * beatUnitDuration;
}

function coerceDurationToFraction(value: string | number): Fraction {
  if (typeof value === "number") {
    if (value <= 0) {
      throw new Error(`Duration must be positive. Received: ${value}`);
    }
    return { numerator: 1, denominator: value };
  }

  const trimmed = value.trim();
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [, numerator, denominator] = fractionMatch;
    const num = Number(numerator);
    const den = Number(denominator);
    if (den === 0) {
      throw new Error(
        `Duration denominator cannot be zero. Received: ${value}`
      );
    }
    return { numerator: num, denominator: den };
  }

  if (/^\d+$/.test(trimmed)) {
    const denominator = Number(trimmed);
    if (denominator === 0) {
      throw new Error(
        `Duration denominator cannot be zero. Received: ${value}`
      );
    }
    return { numerator: 1, denominator };
  }

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return { numerator: numeric, denominator: 1 };
  }

  throw new Error(`Unsupported duration value: ${value}`);
}

function fractionToFloat({ numerator, denominator }: Fraction): number {
  return numerator / denominator;
}

function greatestCommonDivisor(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x || 1;
}

function simplifyFraction({ numerator, denominator }: Fraction): Fraction {
  const gcd = greatestCommonDivisor(numerator, denominator);
  return {
    numerator: numerator / gcd,
    denominator: denominator / gcd,
  };
}

function addFractions(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction({
    numerator: a.numerator * b.denominator + b.numerator * a.denominator,
    denominator: a.denominator * b.denominator,
  });
}

function multiplyFraction(fraction: Fraction, multiplier: Fraction): Fraction {
  return simplifyFraction({
    numerator: fraction.numerator * multiplier.numerator,
    denominator: fraction.denominator * multiplier.denominator,
  });
}

function divideFractions(dividend: Fraction, divisor: Fraction): Fraction {
  if (divisor.numerator === 0) {
    throw new Error("Cannot divide by zero-valued fraction");
  }

  return simplifyFraction({
    numerator: dividend.numerator * divisor.denominator,
    denominator: dividend.denominator * divisor.numerator,
  });
}

function durationWithDotsToFraction(
  duration: string | number,
  dots?: number
): Fraction {
  const base = coerceDurationToFraction(duration);
  if (!dots) return base;

  const multiplierDenominator = Math.pow(2, dots);
  const multiplierNumerator = Math.pow(2, dots + 1) - 1;

  return simplifyFraction({
    numerator: base.numerator * multiplierNumerator,
    denominator: base.denominator * multiplierDenominator,
  });
}

function transformGroupingForPlayback(
  grouping: NoteGrouping,
  incomingTie: PlaybackSonority | null
): {
  transformedGrouping: PlaybackNoteGrouping | null;
  nextTie: PlaybackSonority | null;
} {
  const members: PlaybackDurational[] = [];
  let tieChain = incomingTie ? { ...incomingTie } : null;
  const tupletMultiplier: Fraction =
    grouping.type === "TUPLET"
      ? simplifyFraction({
          numerator: grouping.inTimeOf,
          denominator: grouping.numNotes,
        })
      : { numerator: 1, denominator: 1 };

  for (const member of grouping.members) {
    if (member.type === "REST") {
      if (tieChain) {
        throw new Error("Illegal: ties over rests not supported");
      }
      members.push({
        type: "REST",
        duration: multiplyFraction(
          durationWithDotsToFraction(member.duration, member.dots),
          tupletMultiplier
        ),
      });
      continue;
    }

    const starts = member.tieStart === true;
    const ends = member.tieEnd === true;
    const fraction = multiplyFraction(
      durationWithDotsToFraction(member.duration, member.dots),
      tupletMultiplier
    );
    const base: PlaybackSonority = {
      type: "SONORITY",
      notes: member.notes,
      duration: fraction,
    };

    if (tieChain) {
      tieChain.duration = addFractions(tieChain.duration, fraction);
    } else if (starts) {
      tieChain = { ...base };
    } else {
      members.push(base);
    }

    if (tieChain && ends && !starts) {
      members.push(tieChain);
      tieChain = null;
    }
  }

  if (members.length === 0) {
    return { transformedGrouping: null, nextTie: tieChain };
  }

  if (grouping.type === "TUPLET") {
    return {
      transformedGrouping: {
        type: "TUPLET",
        members,
        numNotes: grouping.numNotes,
        inTimeOf: grouping.inTimeOf,
        unitDuration: grouping.unitDuration,
      },
      nextTie: tieChain,
    };
  }

  return {
    transformedGrouping: {
      type: "SIMPLE",
      members,
    },
    nextTie: tieChain,
  };
}

function transformVoiceForPlayback(
  voice: NoteGrouping[]
): PlaybackNoteGrouping[] {
  const transformed: PlaybackNoteGrouping[] = [];
  let pendingTie: PlaybackSonority | null = null;

  for (const grouping of voice) {
    const { transformedGrouping, nextTie } = transformGroupingForPlayback(
      grouping,
      pendingTie
    );
    if (transformedGrouping) {
      transformed.push(transformedGrouping);
    }

    pendingTie = nextTie;
  }

  // SLOP: AI gen case for over the barline ties
  if (pendingTie) {
    if (transformed.length > 0) {
      transformed[transformed.length - 1].members.push(pendingTie);
    } else {
      transformed.push({
        type: "SIMPLE",
        members: [pendingTie],
      });
    }
  }

  return transformed;
}

/**
 * ENTRY POINT FUNCTION
 * Transforms an array of Measures into TONE.JS compatible playback data
 */

export function scoreToPlayback(score: Score): PartEventRich[] | null {
  if (score.tracks?.every(({ measures }) => measures.length === 0)) return null;
  const playbackData: PartEventRich[] = [];

  let measureOffset = 0;

  // TODO: only supporting 1 track for now
  const normalizedMeasures = convertRepeats(score.tracks[0].measures).map(
    (measure) => ({
      ...measure,
      voices: measure.voices.map(transformVoiceForPlayback),
    })
  );

  for (const normalizedMeasure of normalizedMeasures) {
    const voiceOffsets: number[] = new Array(
      normalizedMeasure.voices.length
    ).fill(measureOffset);

    const tempoResolved = normalizedMeasure.tempo || score.tempo;

    normalizedMeasure.voices.forEach((voice, vIdx) => {
      voice.forEach((ng) => {
        const { data, timeDelta } = noteGroupingToPlayback(
          ng,
          tempoResolved,
          voiceOffsets[vIdx]
        );
        playbackData.push(...data);
        voiceOffsets[vIdx] += timeDelta;
      });
    });

    measureOffset = Math.max(...voiceOffsets);
  }

  return playbackData.length > 0 ? playbackData : null;
}

function noteGroupingToPlayback(
  ng: PlaybackNoteGrouping,
  tempo: Tempo,
  offsetTime: number
): { data: PartEventRich[]; timeDelta: number } {
  let currentTime = offsetTime;
  const playbackData: PartEventRich[] = [];
  ng.members.forEach((d) => {
    const seconds = noteDurationToSeconds(d.duration, tempo);
    if (d.type === "SONORITY") {
      d.notes.forEach((n) => {
        playbackData.push([
          currentTime,
          {
            duration: seconds,
            velocity: 0.7,
            step: n.step,
            octave: n.octave,
            accidental: n.accidental,
          },
        ]);
      });
    } else if (d.type === "REST") {
      // NO-OP.  time will be banked as normal
    } else {
      ensureExhaustive(d);
    }
    currentTime += seconds;
  });

  return {
    data: playbackData,
    timeDelta: currentTime - offsetTime,
  };
}

export function convertRepeats(measures: Measure[]) {
  const output = [] as Measure[];
  let copy = measures.slice();
  let done = false;

  while (!done) {
    const startRepeatIdx = copy.findIndex(
      (m) => m.leftBarline === BarlineType.REPEAT_BEGIN
    );

    if (startRepeatIdx < 0) {
      output.push(...copy);
      done = true;
      break;
    }

    const endRepeatIdx = copy.findIndex(
      (m) => m.rightBarline === BarlineType.REPEAT_END
    );

    if (endRepeatIdx < 0) {
      throw new Error("Unterminated Repeat");
    }

    const toOutput = copy.slice(0, startRepeatIdx);
    output.push(...toOutput);
    const repeatedMeasures = copy.slice(startRepeatIdx, endRepeatIdx + 1);
    output.push(...repeatedMeasures);
    output.push(...repeatedMeasures);
    copy = copy.slice(endRepeatIdx + 1);

    if (copy.length === 0) {
      done = true;
      break;
    }
  }

  return output;
}
