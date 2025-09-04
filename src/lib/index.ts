import type {
  Measure,
  Pitch,
  MusicalEvent,
  Rest,
  Sonority,
} from "@/types";
import { Dot, StaveNote, Voice } from "vexflow4";

/**
 * TONE.JS INTEGRATION
 */
export type PlaybackData = [
  number,
  {
    duration: number;
    velocity: number;
  } & Pitch
];

type Seconds = number;

export function noteDurationToSeconds(
  { duration, dots }: MusicalEvent,
  bpm: number
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
      throw new Error("Unrecognized note duration: " + duration);
  }

  const originalBaseDuration = baseDuration;
  if (dots && dots > 0) {
    for (let i = 0; i < dots; i++) {
      baseDuration += originalBaseDuration / Math.pow(2, i + 1);
    }
  }

  return baseDuration;
}

export function measuresToPlayback(
  measures: Measure[],
  bpm: number
): PlaybackData[] | null {
  if (measures.length === 0) return null;

  const playbackData: PlaybackData[] = [];
  measures.forEach((measure) => {
    measure.voices.forEach((voice) => {
      let currentTime = 0;
      voice.forEach((musicalEvent) => {
        const seconds = noteDurationToSeconds(musicalEvent, bpm);
        if (musicalEvent.type === "SONORITY") {
          musicalEvent.notes.forEach((n) => {
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
        } else if (musicalEvent.type === "REST") {
          // NO-OP.  time will be banked as normal
        }
        // bank the time to advance to start of next note event
        currentTime += seconds;
      });
    });
  });
  console.log(playbackData);
  return playbackData.length > 0 ? playbackData : null;
}

/**
 * VEXFLOW INTEGRATOIN
 */
export function mapMeasureToVFVoices(measure: Measure): Voice[] {
  const voices = measure.voices.map((voice) => {
    return voice.map((musicalEvent) => {
      if (musicalEvent.type === "REST") {
        return mapRestToStaveNote(musicalEvent);
      } else if (musicalEvent.type === "SONORITY") {
        return mapSonorityToStaveNote(musicalEvent);
      }

      throw new Error("unrecognized element type: ", musicalEvent);
    });
  });

  const tickedVoices = voices.map((voice) => {
    return new Voice({
      // HARD CODED! hard code time signature data for now
      num_beats: 4,
      beat_value: 4,
    }).addTickables(voice);
  });

  return tickedVoices;
}

function mapRestToStaveNote({ dots, duration }: Rest) {
  if (dots) {
    const dottedStaveNote = new StaveNote({
      keys: ["b/4"],
      duration,
      type: "r",
      dots,
    });

    // Attach dots
    for (let i = 0; i < dots; i++) {
      Dot.buildAndAttach([dottedStaveNote], { all: true });
    }

    return dottedStaveNote;
  }

  return new StaveNote({
    keys: ["b/4"],
    duration,
    type: "r",
  });
}

function mapSonorityToStaveNote({ notes, duration, dots }: Sonority) {
  const keys = notes.map((n) => `${n.step.toLowerCase()}/${n.octave}`);

  if (dots) {
    const dottedStaveNote = new StaveNote({
      keys,
      duration,
      dots,
    });

    for (let i = 0; i < dots; i++) {
      Dot.buildAndAttach([dottedStaveNote], { all: true });
    }

    return dottedStaveNote;
  }

  return new StaveNote({
    keys,
    duration,
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
