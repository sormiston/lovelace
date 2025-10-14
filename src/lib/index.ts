import type {
  BaseDuration,
  Measure,
  Durational,
  PartEventRich,
  TimeSignature,
  TupletGrouping,
  NoteGrouping,
  Tempo,
  ClefNames,
  NoteContextMember,
  Sonority,
} from "@/types";

import { ClefNote, type RenderContext } from "vexflow4";
import {
  Dot,
  StaveNote,
  Tuplet,
  Voice,
  VoiceMode,
  Beam,
  StaveTempo,
  Stave,
  Renderer,
} from "vexflow4";

type Seconds = number;
type Fraction = {
  numerator: number;
  denominator: number;
};
type TieLigation = {
  start: StaveNote;
  end: StaveNote;
  firstIndices: number[];
  lastIndices: number[];
};
type TieAnchor = {
  note: StaveNote;
  keyIndexMap: Map<string, number[]>;
};
type ProcessNoteGroupResult = {
  notes: (StaveNote | ClefNote)[];
  tuplets: Tuplet[];
};

type PlaybackRest = { type: "REST"; duration: Fraction };
type PlaybackSonority = {
  type: "SONORITY";
  duration: Fraction;
  notes: Sonority["notes"];
};
type PlaybackDurational = PlaybackRest | PlaybackSonority;

type PlaybackSimpleGrouping = {
  type: "SIMPLE";
  members: PlaybackDurational[];
};

type PlaybackTupletGrouping = {
  type: "TUPLET";
  members: PlaybackDurational[];
  numNotes: number;
  inTimeOf: number;
  unitDuration: BaseDuration;
};

type PlaybackNoteGrouping = PlaybackSimpleGrouping | PlaybackTupletGrouping;

function ensureExhaustive(..._args: never[]) {
  throw new Error();
}

export function generateClickTrack(
  tempo: Tempo,
  timeSig: TimeSignature
): PartEventRich[] {
  const playbackData: PartEventRich[] = [];
  let currentTime = 0;

  const numBeats = tempo.compound ? timeSig[0] / 3 : timeSig[0];
  const beatFraction = tempo.compound
    ? durationWithDotsToFraction(tempo.baseDuration, 1)
    : coerceDurationToFraction(tempo.baseDuration);
  const beatDurationSeconds = noteDurationToSeconds(beatFraction, tempo);

  for (let i = 0; i < numBeats; i++) {
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

  return playbackData;
}

export function noteDurationToSeconds(
  duration: Fraction,
  tempo: Tempo
): Seconds {
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

function buildKeyIndexMap(note: StaveNote): Map<string, number[]> {
  const keyIndexMap = new Map<string, number[]>();
  note.getKeys().forEach((key, index) => {
    const indices = keyIndexMap.get(key);
    if (indices) {
      indices.push(index);
    } else {
      keyIndexMap.set(key, [index]);
    }
  });
  return keyIndexMap;
}

function createTieAnchor(note: StaveNote): TieAnchor {
  return {
    note,
    keyIndexMap: buildKeyIndexMap(note),
  };
}

function deriveChordTieSegments(
  startAnchor: TieAnchor,
  endAnchor: TieAnchor
): TieLigation[] {
  const segments: TieLigation[] = [];
  startAnchor.keyIndexMap.forEach((startIndices, key) => {
    const endIndices = endAnchor.keyIndexMap.get(key);
    if (!endIndices || endIndices.length === 0) return;
    const pairCount = Math.min(startIndices.length, endIndices.length);
    for (let i = 0; i < pairCount; i++) {
      segments.push({
        start: startAnchor.note,
        end: endAnchor.note,
        firstIndices: [startIndices[i]],
        lastIndices: [endIndices[i]],
      });
    }
  });
  return segments;
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
    if (member.type === "CLEF_CHANGE") continue;

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
    console.log("pendingTie", pendingTie);
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

export function measuresToPlayback(
  measures: Measure[],
  tempo: Tempo
): PartEventRich[] | null {
  if (measures.length === 0) return null;

  const playbackData: PartEventRich[] = [];
  const transformedMeasures = measures.map((measure) =>
    measure.voices.map(transformVoiceForPlayback)
  );

  transformedMeasures.forEach((measureVoices) => {
    measureVoices.forEach((voice) => {
      let currentTime = 0;
      voice.forEach((ng) => {
        const { data, timeDelta } = noteGroupingToPlayback(
          ng,
          tempo,
          currentTime
        );
        playbackData.push(...data);
        currentTime += timeDelta;
      });
    });
  });

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

/**
 * VEXFLOW INTEGRATION
 */

function processNoteGroup(ng: NoteGrouping, postCreateHooks: PostCreateHook[]) {
  const result: ProcessNoteGroupResult = { notes: [], tuplets: [] };
  const { clef } = ng;
  if (ng.type === "SIMPLE") {
    const notes = ng.members.map((member) =>
      mapMemberToNote(member, clef, postCreateHooks)
    );
    result.notes = notes;
  } else if (ng.type === "TUPLET") {
    const [notes, tuplet] = mapTupletToStaveNotes(ng, clef, postCreateHooks);
    result.notes = notes;
    result.tuplets = [tuplet];
  } else {
    ensureExhaustive(ng);
  }

  return result;
}

type RichNewStaveNote = { staveNote: StaveNote } & Readonly<Durational>;
type PostCreateHook = (newNoteData: RichNewStaveNote) => RichNewStaveNote;

function treatAsBarRest(
  timeSig: TimeSignature,
  state: { voiceMode: VoiceMode }
): PostCreateHook {
  return function treatAsBarRestCb(data) {
    const { staveNote } = data;
    if (!staveNote.isRest()) return data;

    const [num, den] = timeSig;
    const voice = new Voice({ num_beats: num, beat_value: den }).setMode(
      Voice.Mode.SOFT
    );
    const barTicks = voice.getTotalTicks();
    const noteTicks = staveNote.getTicks();
    // If the note's ticks equal OR GREATER THAN the total ticks in the bar, it's a bar rest
    const isBarRest = noteTicks.greaterThanEquals(barTicks);

    if (isBarRest) {
      staveNote.setCenterAlignment(true);
      staveNote.setIgnoreTicks(true);
      state.voiceMode = Voice.Mode.SOFT;
    }
    return { ...data, staveNote };
  };
}

function reportTieLigations(state: {
  tieState: { open: TieAnchor[]; closed: TieLigation[] };
}): PostCreateHook {
  return function reportTieLigationsCb(newNoteData) {
    if (newNoteData.type === "REST") return newNoteData;

    const { staveNote, tieStart, tieEnd } = newNoteData;
    const startsTie = tieStart === true;
    const endsTie = tieEnd === true;
    const currentAnchor = createTieAnchor(staveNote);

    const tieStack = state.tieState.open;
    const activeAnchor = tieStack[tieStack.length - 1];

    if (activeAnchor) {
      const segments = deriveChordTieSegments(activeAnchor, currentAnchor);
      if (segments.length > 0) {
        state.tieState.closed.push(...segments);
      }
      tieStack[tieStack.length - 1] = currentAnchor;

      if (endsTie) {
        tieStack.pop();
        if (startsTie) {
          tieStack.push(currentAnchor);
        }
      }
    } else if (startsTie) {
      tieStack.push(currentAnchor);
      if (endsTie) {
        tieStack.pop();
      }
    }

    return newNoteData;
  };
}

/** PRINCIPLE FUNCTION CALL / ENTRY POINT FOR VEXFLOW VOICE CREATION */
export function mapMeasureToVFVoices(measure: Measure, timeSig: TimeSignature) {
  // SETUP
  // STATE IS MUTABLE!  Must be passed to postCreateHooks for configurability we will need later
  const state = {
    voiceMode: Voice.Mode.STRICT,
    tieState: {
      open: [] as TieAnchor[],
      closed: [] as TieLigation[],
    },
  };
  const postCreateHooks = [
    treatAsBarRest(timeSig, state),
    reportTieLigations(state),
  ];

  // RUN
  const voices = measure.voices.map((voice) => {
    state.tieState.open.length = 0;
    state.tieState.closed.length = 0;
    const data = voice.reduce(
      (
        acc: ProcessNoteGroupResult & { tieLigations: TieLigation[] },
        entry: NoteGrouping
      ) => {
        const { notes, tuplets } = processNoteGroup(entry, postCreateHooks);
        acc.notes.push(...notes);
        acc.tuplets.push(...tuplets);
        if (state.tieState.closed.length > 0) {
          acc.tieLigations.push(...state.tieState.closed);
          state.tieState.closed.length = 0;
        }

        return acc;
      },
      { notes: [], tuplets: [], tieLigations: [] } as ProcessNoteGroupResult & {
        tieLigations: TieLigation[];
      }
    );

    return data;
  });

  const { tickedVoices, tuplets, tieLigations } = voices.reduce(
    (acc, data) => {
      const voice = new Voice({
        num_beats: timeSig[0],
        beat_value: timeSig[1],
      })
        .setMode(state.voiceMode)
        .addTickables(data.notes);

      acc.tickedVoices.push(voice);
      acc.tuplets.push(...data.tuplets);
      acc.tieLigations.push(...data.tieLigations);

      return acc;
    },
    {
      tickedVoices: [] as Voice[],
      tuplets: [] as Tuplet[],
      tieLigations: [] as TieLigation[],
    }
  );

  return { tickedVoices, tuplets, tieLigations };
}

function mapTupletToStaveNotes(
  tupletGroup: TupletGrouping,
  clef: ClefNames,
  postCreateHooks: PostCreateHook[]
): [(StaveNote | ClefNote)[], Tuplet] {
  const notes = tupletGroup.members.map((m) =>
    mapMemberToNote(m, clef, postCreateHooks)
  );
  const tuplet = new Tuplet(notes, {
    num_notes: tupletGroup.numNotes,
    notes_occupied: tupletGroup.inTimeOf,
  });

  return [notes, tuplet];
}

function determineRestKey(clef: ClefNames) {
  const table = {
    treble: ["b/4"],
    bass: ["d/3"],
    alto: ["c/4"],
    tenor: ["b/3"],
    percussion: ["c/5"],
  };

  return table[clef] || ["b/4"];
}

function mapMemberToNote(
  m: NoteContextMember,
  clef: ClefNames,
  postCreateHooks?: PostCreateHook[]
) {
  const isRest = m.type === "REST";
  const isClefNote = m.type === "CLEF_CHANGE";

  if (isClefNote) {
    const clefNote = new ClefNote(m.newClef, "small");
    return clefNote;
  }

  const keys = isRest
    ? determineRestKey(clef)
    : m.notes.map(
        (n) => `${n.step.toLowerCase()}${n.accidental || ""}/${n.octave}`
      );

  const { duration, dots } = m;

  const staveNote = new StaveNote({
    clef,
    keys,
    duration,
    dots,
    ...(isRest && { type: "r" }),
    auto_stem: true,
  });

  if (dots) {
    for (let i = 0; i < dots; i++) {
      Dot.buildAndAttach([staveNote], { all: true });
    }
  }

  if (postCreateHooks && postCreateHooks.length) {
    const initial: RichNewStaveNote = { ...m, staveNote };
    const processed = postCreateHooks.reduce<RichNewStaveNote>((acc, curr) => {
      return curr(acc);
    }, initial);

    return processed.staveNote;
  }

  return staveNote;
}

type BeamConfig = Parameters<typeof Beam.generateBeams>[1];
export function generateBeamConfig([num, den]: TimeSignature): BeamConfig {
  /**
   * getDefaultBeamGroups is a VexFlow utility that provides standard beam groupings
   * https://github.com/0xfe/vexflow/blob/master/src/beam.ts#L98
   */
  const defaultGroups = Beam.getDefaultBeamGroups(`${num}/${den}`);

  return {
    groups: defaultGroups,
    beam_middle_only: true,
    beam_rests: true,
  };
}

export function attachStaveTempo(stave: Stave, tempo: Tempo) {
  if (!tempo) return stave;
  const staveTempo = new StaveTempo(
    {
      duration: tempo.baseDuration,
      ...(tempo.compound && { dots: 1 }),
      bpm: tempo.bpm,
    },
    0,
    -10
  );

  stave.addModifier(staveTempo);

  return stave;
}

type SetupFn = (s: Stave) => void;
type ContextSetup = { width: number; height: number };
/**
 * Create a VexFlow rendering context.
 * If no rootDiv is provided, an offscreen div will be created.
 */
export function makeContext(
  { width, height }: ContextSetup,
  rootDiv?: HTMLDivElement
): RenderContext {
  // You can render offscreen by not attaching this DIV to the DOM.
  const div = rootDiv || document.createElement("div");
  const renderer = new Renderer(div, Renderer.Backends.SVG);
  renderer.resize(width, height);
  return renderer.getContext();
}

/**
 * Measures how many pixels the given setup (clef/key/time) pushes the note-start X.
 */
export function measureStartWidth(setup?: SetupFn): number {
  const ctx = makeContext({ width: 500, height: 120 });

  // Baseline (empty) stave.
  const s0 = new Stave(10, 30, 420).setContext(ctx).draw();
  const base = s0.getNoteStartX();

  // Stave with modifiers.
  const s1 = new Stave(10, 30, 420);
  if (setup) setup(s1);
  s1.setContext(ctx).draw();
  const withMods = s1.getNoteStartX();

  return withMods - base;
}

/** Convenience helpers */
export function measureClef(clef: string) {
  return measureStartWidth((s) => s.addClef(clef));
}

export function measureKeySignature(key: string) {
  return measureStartWidth((s) => s.addKeySignature(key));
}

export function measureTimeSignature(ts: string) {
  return measureStartWidth((s) => s.addTimeSignature(ts));
}

/** Measure combos (accounts for kerning/spacing between glyphs) */
export function measureCombo(opts: {
  clef?: string;
  key?: string;
  time?: string;
}) {
  return measureStartWidth((s) => {
    if (opts.clef) s.addClef(opts.clef);
    if (opts.key) s.addKeySignature(opts.key);
    if (opts.time) s.addTimeSignature(opts.time);
  });
}
