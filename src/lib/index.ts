import type { Measure, Pitch, BaseDuration } from "@/types";
import { StaveNote, Voice as VFVoice } from "vexflow4";

/**
 * Tone.js integration functions
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

  return playbackData.length > 0 ? playbackData : null;
}

/**
 * Vexflow integration functions
 */
export function mapMeasureToVFVoices(measure: Measure): VFVoice[] {
  const voices = measure.voices.map((voice) => {
    return voice.map((musicalEvent) => {
      if (musicalEvent.type === "REST") {
        return new StaveNote({
          keys: ["b/4"],
          duration: `${musicalEvent.duration}`,
          type: "r",
        });
      } else if (musicalEvent.type === "SONORITY") {
        const keys = musicalEvent.notes.map(
          (n) => `${n.step.toLowerCase()}/${n.octave}`
        );
        return new StaveNote({ keys, duration: `${musicalEvent.duration}` });
      }

      throw new Error("unrecognized element type: ", musicalEvent);
    });
  });

  const tickedVoices = voices.map((voice) => {
    return new VFVoice({
      // HARD CODED! hard code time signature data for now
      num_beats: 4,
      beat_value: 4,
    }).addTickables(voice);
  });

  return tickedVoices;
}
