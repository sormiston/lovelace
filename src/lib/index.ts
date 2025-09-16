import type {
  Measure,
  Durational,
  PartEventRich,
  TimeSignature,
  TupletGrouping,
  NoteGrouping,
} from "@/types";

import {
  Dot,
  StaveNote,
  Tuplet,
  Voice,
  Element as VFElement,
  VoiceMode,
} from "vexflow4";

type Seconds = number;
type ToVFVoiceResult = {
  notes: StaveNote[];
  artifacts: VFElement[];
};
function ensureExhaustive(..._args: never[]) {
  throw new Error();
}

export function noteDurationToSeconds(
  { duration, dots }: Durational,
  bpm: number,
  tupletContext: { numNotes: number; inTimeOf: number } = {
    numNotes: 1,
    inTimeOf: 1,
  }
): Seconds {
  const beatDuration = 60 / bpm;
  let baseDuration = 0;
  switch (duration) {
    case "1":
      baseDuration = 4 * beatDuration;
      break;
    case "2":
      baseDuration = 2 * beatDuration;
      break;
    case "4":
      baseDuration = 1 * beatDuration;
      break;
    case "8":
      baseDuration = 0.5 * beatDuration;
      break;
    case "16":
      baseDuration = 0.25 * beatDuration;
      break;
    case "32":
      baseDuration = 0.125 * beatDuration;
      break;
    case "64":
      baseDuration = 0.0625 * beatDuration;
      break;
    case "128":
      baseDuration = 0.03125 * beatDuration;
      break;
    default:
      ensureExhaustive(duration);
  }

  const originalBaseDuration = baseDuration;

  // Dot modification
  if (dots && dots > 0) {
    for (let i = 0; i < dots; i++) {
      baseDuration += originalBaseDuration / Math.pow(2, i + 1);
    }
  }

  // Tuplet modification
  baseDuration *= tupletContext.inTimeOf / tupletContext.numNotes;

  return baseDuration;
}

export function measuresToPlayback(
  measures: Measure[],
  bpm: number
): PartEventRich[] | null {
  if (measures.length === 0) return null;

  const playbackData: PartEventRich[] = [];
  measures.forEach((measure) => {
    measure.voices.forEach((voice) => {
      let currentTime = 0;
      voice.forEach((ng) => {
        const { data, timeDelta } = noteGroupingToPlayback(
          ng,
          bpm,
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
  bpm: number,
  offsetTime: number
): { data: PartEventRich[]; timeDelta: number } {
  let currentTime = offsetTime;
  const playbackData: PartEventRich[] = [];
  const isTuplet = ng.type === "TUPLET";
  ng.members.forEach((d) => {
    const tupletContext = isTuplet
      ? { numNotes: ng.numNotes, inTimeOf: ng.inTimeOf }
      : undefined;
    const seconds = noteDurationToSeconds(d, bpm, tupletContext);
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

type PostCreateHook = (d: StaveNote) => StaveNote;
const treatAsBarRest =
  (timeSig: TimeSignature, state: { voiceMode: VoiceMode }): PostCreateHook =>
  (n: StaveNote) => {
    if (!n.isRest()) return n;

    const [num, den] = timeSig;
    const voice = new Voice({ num_beats: num, beat_value: den }).setMode(
      Voice.Mode.SOFT
    );
    const barTicks = voice.getTotalTicks();
    const noteTicks = n.getTicks();
    // If the note's ticks equal OR GREATER THAN the total ticks in the bar, it's a bar rest
    const isBarRest = noteTicks.greaterThanEquals(barTicks);

    if (isBarRest) {
      n.setCenterAlignment(true);
      n.setIgnoreTicks(true);
      state.voiceMode = Voice.Mode.SOFT;
    }
    return n;
  };

function processNoteGroup(
  ng: NoteGrouping,
  postCreateHooks: PostCreateHook[]
): ToVFVoiceResult {
  const result: ToVFVoiceResult = { notes: [], artifacts: [] };
  if (ng.type === "SIMPLE") {
    const notes = ng.members.map((member) =>
      mapDurationalToStaveNote(member, postCreateHooks)
    );
    result.notes = notes;
  } else if (ng.type === "TUPLET") {
    const [notes, tuplet] = mapTupletToStaveNotes(ng);
    result.notes = notes;
    result.artifacts = [tuplet];
  } else {
    ensureExhaustive(ng);
  }

  return result;
}
/** PRINCIPLE FUNCTION CALL / ENTRY POINT FOR VEXFLOW VOICE CREATION */
export function mapMeasureToVFVoices(
  measure: Measure,
  timeSig: TimeSignature
): [Voice[], VFElement[]] {
  // SETUP
  // STATE IS MUTABLE!  Must be passed to postCreateHooks for configurability we will need later
  const state = {
    voiceMode: Voice.Mode.STRICT,
  };
  const postCreateHooks = [treatAsBarRest(timeSig, state)];

  // RUN
  const voices = measure.voices.map((voice) => {
    const data = voice.reduce(
      (acc: ToVFVoiceResult, entry: NoteGrouping) => {
        const { notes, artifacts } = processNoteGroup(entry, postCreateHooks);
        acc.notes.push(...notes);
        acc.artifacts.push(...artifacts);

        return acc;
      },
      { notes: [], artifacts: [] }
    );

    return data;
  });

  const { tickedVoices, artifacts } = voices.reduce(
    (acc, data) => {
      const voice = new Voice({
        num_beats: timeSig[0],
        beat_value: timeSig[1],
      })
        .setMode(state.voiceMode)
        .addTickables(data.notes);

      acc.tickedVoices.push(voice);
      acc.artifacts.push(...data.artifacts);

      return acc;
    },
    { tickedVoices: [], artifacts: [] } as {
      tickedVoices: Voice[];
      artifacts: VFElement[];
    }
  );

  return [tickedVoices, artifacts];
}

function mapTupletToStaveNotes(
  tupletGroup: TupletGrouping
): [StaveNote[], VFElement] {
  const notes = tupletGroup.members.map((m) => mapDurationalToStaveNote(m));
  const tuplet = new Tuplet(notes, {
    num_notes: tupletGroup.numNotes,
    notes_occupied: tupletGroup.inTimeOf,
  });

  return [notes, tuplet];
}

function mapDurationalToStaveNote(
  d: Durational,
  postCreateHooks?: PostCreateHook[]
) {
  const isRest = d.type === "REST";
  const keys = isRest
    ? ["b/4"]
    : d.notes.map((n) => `${n.step.toLowerCase()}/${n.octave}`);
  const { duration, dots } = d;
  let staveNote = new StaveNote({
    clef: "treble", // HARD CODED CLEF -- TODO: make dynamic
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

  staveNote = postCreateHooks
    ? postCreateHooks.reduce((acc, curr) => {
        return curr(acc);
      }, staveNote)
    : staveNote;

  return staveNote;
}

// export function tweakDots(notes: StaveNote[]) {
//   notes.forEach((note) => {
//     note.getModifiersByType("Dot").forEach((dot) => {
//       if (note.getDuration() === "8") {
//         dot.setXShift(dot.getXShift() - 10);
//         dot.setYShift(6);
//       }
//     });
//   });
// }
