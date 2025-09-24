import type {
  Measure,
  Durational,
  PartEventRich,
  TimeSignature,
  TupletGrouping,
  NoteGrouping,
  Tempo,
  ClefNames,
  NoteContextMember,
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
type TieLigation =
  | [StaveNote, StaveNote]
  | [StaveNote, null]
  | [null, StaveNote];
type ProcessNoteGroupResult = {
  notes: (StaveNote | ClefNote)[];
  tuplets: Tuplet[];
};

function ensureExhaustive(..._args: never[]) {
  throw new Error();
}

export function noteDurationToSeconds(
  { duration, dots }: Durational,
  tempo: Tempo,
  tupletContext: { numNotes: number; inTimeOf: number } = {
    numNotes: 1,
    inTimeOf: 1,
  }
): Seconds {
  const noteDuration = tempo.compound
    ? Number(duration) * 1.5
    : Number(duration);
  const beatUnit = Number(tempo.baseDuration);
  const beatUnitDuration = 60 / tempo.bpm;
  let durationSeconds = (beatUnit / noteDuration) * beatUnitDuration;

  const originalDurationSeconds = durationSeconds;

  // Dot modification
  if (dots && dots > 0) {
    for (let i = 0; i < dots; i++) {
      durationSeconds += originalDurationSeconds / Math.pow(2, i + 1);
    }
  }

  // Tuplet modification
  durationSeconds *= tupletContext.inTimeOf / tupletContext.numNotes;

  return durationSeconds;
}

export function generateClickTrack(
  tempo: Tempo,
  timeSig: TimeSignature
): PartEventRich[] {
  const playbackData: PartEventRich[] = [];
  let currentTime = 0;

  const numBeats = tempo.compound ? timeSig[0] / 3 : timeSig[0];
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

    const timeDelta = noteDurationToSeconds(
      {
        duration: tempo.baseDuration,
        ...(tempo.compound && { dots: 1 }),
      } as Durational,
      tempo
    );

    currentTime += timeDelta;
  }

  return playbackData;
}

export function measuresToPlayback(
  measures: Measure[],
  tempo: Tempo
): PartEventRich[] | null {
  if (measures.length === 0) return null;

  const playbackData: PartEventRich[] = [];
  measures.forEach((measure) => {
    measure.voices.forEach((voice) => {
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
  console.log(playbackData);

  return playbackData.length > 0 ? playbackData : null;
}

function noteGroupingToPlayback(
  ng: NoteGrouping,
  tempo: Tempo,
  offsetTime: number
): { data: PartEventRich[]; timeDelta: number } {
  let currentTime = offsetTime;
  const playbackData: PartEventRich[] = [];
  const isTuplet = ng.type === "TUPLET";
  ng.members
    .filter((m) => m.type !== "CLEF_CHANGE")
    .forEach((d) => {
      const tupletContext = isTuplet
        ? { numNotes: ng.numNotes, inTimeOf: ng.inTimeOf }
        : undefined;
      const seconds = noteDurationToSeconds(d, tempo, tupletContext);
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
    const [notes, tuplet] = mapTupletToStaveNotes(ng, clef);
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
  tieLigations: TieLigation[];
}): PostCreateHook {
  return function reportTieLigationsCb(newNoteData) {
    if (newNoteData.type === "REST") return newNoteData;

    const { staveNote, tieStart, tieEnd } = newNoteData;
    if (tieStart) {
      state.tieLigations.push([staveNote, null]);
    } else if (tieEnd) {
      const lastTie = state.tieLigations[state.tieLigations.length - 1];
      if (lastTie && lastTie[1] === null) {
        state.tieLigations[state.tieLigations.length - 1] = [
          lastTie[0],
          staveNote,
        ];
      } else {
        state.tieLigations.push([null, staveNote]);
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
    tieLigations: [] as TieLigation[],
  };
  const postCreateHooks = [
    treatAsBarRest(timeSig, state),
    reportTieLigations(state),
  ];

  // RUN
  const voices = measure.voices.map((voice) => {
    const data = voice.reduce(
      (
        acc: ProcessNoteGroupResult & { tieLigations: TieLigation[] },
        entry: NoteGrouping
      ) => {
        const { notes, tuplets } = processNoteGroup(entry, postCreateHooks);
        acc.notes.push(...notes);
        acc.tuplets.push(...tuplets);
        acc.tieLigations.push(...state.tieLigations);

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
  clef: ClefNames
): [(StaveNote | ClefNote)[], Tuplet] {
  const notes = tupletGroup.members.map((m) => mapMemberToNote(m, clef));
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
