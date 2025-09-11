import type {
  Measure,
  Durational,
  PartEventRich,
  TimeSignature,
  TupletGrouping,
  NoteContext,
  NoteGrouping,
} from "@/types";

import { Dot, StaveNote, Tuplet, Voice, Element as VFElement } from "vexflow4";

type Seconds = number;
function ensureExhaustive(..._args: never[]) {}

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
  ng.members.forEach((d) => {
    const tupletContext =
      ng.type === "TUPLET"
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
export function mapMeasureToVFVoices(
  measure: Measure,
  timeSig: TimeSignature
): [Voice[], VFElement[]] {
  const voices = measure.voices.map((voice) => {
    const data = voice.reduce(
      (acc, entry) => {
        switch (entry.type) {
          case "SIMPLE":
            acc.notes.push(...mapToStaveNotes(entry.members));
            break;
          case "TUPLET":
            {
              const [tupletGroupNotes, tupletDrawable] =
                mapTupletToStaveNotes(entry);
              acc.notes.push(...tupletGroupNotes);
              acc.artifacts.push(tupletDrawable);
            }
            break;

          default:
            // all entry types handled
            ensureExhaustive(entry);
        }

        return acc;
      },
      { notes: [], artifacts: [] } as {
        // TODO!:  abstract/promote this type if sees much uses
        notes: StaveNote[];
        artifacts: VFElement[];
      }
    );

    return data;
  });

  const { tickedVoices, artifacts } = voices.reduce(
    (acc, data) => {
      const voice = new Voice({
        num_beats: timeSig[0],
        beat_value: timeSig[1],
      }).addTickables(data.notes);

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
  const notes = mapToStaveNotes(tupletGroup.members);
  const tuplet = new Tuplet(notes, {
    num_notes: tupletGroup.numNotes,
    notes_occupied: tupletGroup.inTimeOf,
  });

  return [notes, tuplet];
}

function mapToStaveNotes(members: NoteContext["members"]): StaveNote[] {
  return members.map((member) => mapDurationalToStaveNote(member));
}

function mapDurationalToStaveNote(d: Durational) {
  const isRest = d.type === "REST";
  const keys = isRest
    ? ["b/4"]
    : d.notes.map((n) => `${n.step.toLowerCase()}/${n.octave}`);
  const { duration, dots } = d;
  if (dots) {
    const dottedStaveNote = new StaveNote({
      keys,
      duration,
      dots,
      ...(isRest && { type: "r" }),
    });

    for (let i = 0; i < dots; i++) {
      Dot.buildAndAttach([dottedStaveNote], { all: true });
    }

    return dottedStaveNote;
  }

  return new StaveNote({
    keys,
    duration,
    ...(isRest && { type: "r" }),
  });
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
