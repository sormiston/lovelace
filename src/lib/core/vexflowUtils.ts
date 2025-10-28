import type {
  Measure,
  Durational,
  TimeSignature,
  TupletGrouping,
  NoteGrouping,
  Tempo,
  ClefNames,
  NoteContextMember,
  TieAnchor,
  TieLigation,
  ProcessNoteGroupResult,
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

import { ensureExhaustive } from "../_utils";

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
