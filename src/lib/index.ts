import type { Measure, Pitch, BaseDuration, Rest, Sonority } from "@/types";
import { Dot, StaveNote, Voice } from "vexflow4";

/**
 * TONE.JS INTEGRATION
 */
export type PlaybackData = [
  number,
  {
    // time: number;
    duration: number;
    velocity: number;
  } & Pitch
];

type Seconds = number;

export function noteDurationToSeconds(
  duration: BaseDuration,
  bpm: number
): Seconds {
  const beatDuration = 60 / bpm;
  switch (duration) {
    case "1":
      return 4 * beatDuration;
    case "2":
      return 2 * beatDuration;
    case "4":
      return 1 * beatDuration;
    case "8":
      return 0.5 * beatDuration;
    case "16":
      return 0.25 * beatDuration;
    case "32":
      return 0.125 * beatDuration;
    case "64":
      return 0.0625 * beatDuration;
    case "128":
      return 0.03125 * beatDuration;
    default:
      throw new Error("Unrecognized note duration: " + duration);
  }
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
        const seconds = noteDurationToSeconds(musicalEvent.duration, bpm);
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
