import type {
  Measure,
  Durational,
  TimeSignature,
  TupletGrouping,
  NoteGrouping,
  Tempo,
  ClefNames,
  TieAnchor,
  TieLigation,
  ProcessNoteGroupResult,
} from "@/types";

import { ClefNote, NoteSubGroup, type RenderContext } from "vexflow4";
import {
  Dot,
  StaveNote,
  Tuplet,
  Voice,
  Beam,
  StaveTempo,
  Stave,
  Renderer,
} from "vexflow4";

import { ensureExhaustive } from "../_utils";

type RichNewStaveNote = {
  staveNote: StaveNote;
  clef: ClefNames;
} & Readonly<Durational>;
type PostCreateHook = (newNoteData: RichNewStaveNote) => RichNewStaveNote;

// START: AI GEN stuff; TODO: humanize

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

// END: AI GEN stuff

// START: PostCreateHook callbacks
type toVFRunState = {
  voiceMode: typeof Voice.Mode.STRICT | typeof Voice.Mode.SOFT;
  prevClef: ClefNames;
  tieState: {
    open: TieAnchor[];
    closed: TieLigation[];
  };
};

function treatAsBarRest(
  timeSig: TimeSignature,
  state: toVFRunState
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

function reportTieLigations(state: toVFRunState): PostCreateHook {
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

function inlineClefChange(state: toVFRunState): PostCreateHook {
  return function inlineClefChangeCb(newNoteData) {
    if (state.prevClef !== newNoteData.clef) {
      const clefNoteSubGroup = new NoteSubGroup([
        new ClefNote(newNoteData.clef, "small"),
      ]);
      newNoteData.staveNote.addModifier(clefNoteSubGroup);
    }

    state.prevClef = newNoteData.clef;

    return newNoteData;
  };
}

// END: PostCreateHook callbacks

/** PRINCIPLE FUNCTION CALL / ENTRY POINT FOR VEXFLOW VOICE CREATION */
export function parseMeasureToVFDrawables(
  measure: Measure,
  timeSig: TimeSignature,
  clef: ClefNames
) {
  // SETUP
  // STATE IS MUTABLE!  Must be passed to postCreateHooks for configurability we will need later
  const state: toVFRunState = {
    voiceMode: Voice.Mode.STRICT,
    prevClef: clef,
    tieState: {
      open: [],
      closed: [],
    },
  };
  const postCreateHooks = [
    treatAsBarRest(timeSig, state),
    reportTieLigations(state),
    inlineClefChange(state),
  ];

  // RUN
  const artifacts = {
    tuplets: [] as Tuplet[],
    tieLigations: [] as TieLigation[],
  };

  const voices = measure.voices.map((voice) => {
    state.tieState.open.length = 0;
    state.tieState.closed.length = 0;

    const voiceNotes = voice
      .map((ng) => {
        const { notes, tuplets } = processNoteGroup(ng, postCreateHooks);
        artifacts.tuplets.push(...tuplets);
        if (state.tieState.closed.length > 0) {
          artifacts.tieLigations.push(...state.tieState.closed);
          state.tieState.closed.length = 0;
        }

        return notes;
      })
      .flat();

    return voiceNotes;
  });

  const tickedVoices = voices.map((staveNotes) => {
    const voice = new Voice({
      num_beats: timeSig[0],
      beat_value: timeSig[1],
    })
      .setMode(state.voiceMode)
      .addTickables(staveNotes);

    return voice;
  });

  return {
    tickedVoices,
    tuplets: artifacts.tuplets,
    tieLigations: artifacts.tieLigations,
  };
}

function processNoteGroup(ng: NoteGrouping, postCreateHooks: PostCreateHook[]) {
  const result: ProcessNoteGroupResult = {
    notes: [],
    tuplets: [],
  };
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

function mapTupletToStaveNotes(
  tupletGroup: TupletGrouping,
  clef: ClefNames,
  postCreateHooks: PostCreateHook[]
): //TODO: improve typing
[StaveNote[], Tuplet] {
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
  m: Durational,
  clef: ClefNames,
  postCreateHooks?: PostCreateHook[]
) {
  const isRest = m.type === "REST";

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
    const initial: RichNewStaveNote = { ...m, clef, staveNote };
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

export function attachStaveTempo(
  stave: Stave,
  tempo: Tempo,
  leftGlyphWidth: number
) {
  if (!tempo) return stave;
  const staveTempo = new StaveTempo(
    {
      duration: tempo.baseDuration,
      ...(tempo.compound && { dots: 1 }),
      bpm: tempo.bpm,
    },
    leftGlyphWidth * -1 + 5,
    -10
  );
  stave.addModifier(staveTempo);

  return stave;
}

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

export function measureLeftGlyphs(opts: {
  clef?: string;
  key?: string;
  time?: string;
}) {
  const ctx = makeContext({ width: 500, height: 120 });

  // Baseline (empty) stave.
  const s0 = new Stave(10, 30, 420).setContext(ctx).draw();
  const base = s0.getNoteStartX();

  // Stave with modifiers.
  const s1 = new Stave(10, 30, 420);
  if (opts.clef) s1.addClef(opts.clef);
  if (opts.key) s1.addKeySignature(opts.key);
  if (opts.time) s1.addTimeSignature(opts.time);
  s1.setContext(ctx).draw();
  const withMods = s1.getNoteStartX();

  return withMods - base;
}
