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
      voice.forEach((voiceable) => {
        const seconds = noteDurationToSeconds(voiceable.duration, bpm);
        if (voiceable.type === "NOTE") {
          playbackData.push([
            currentTime,
            {
              duration: seconds,
              velocity: 0.7,
              step: voiceable.pitch.step,
              octave: voiceable.pitch.octave,
              accidental: voiceable.pitch.accidental,
            },
          ]);
        } else if (voiceable.type === "CHORD") {
          voiceable.notes.forEach((n) => {
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
        } else if (voiceable.type === "REST") {
          // NO-OP.  time will be banked as normal
        }

        currentTime += seconds;
      });
    });
  });

  return playbackData.length > 0 ? playbackData : null;
}

/**
 * Vexflow integration functions
 */
export function scoreMeasureToVFVoices(measure: Measure): VFVoice[] {
  const voices = measure.voices.map((voice) => {
    return voice.map((voiceable) => {
      if (voiceable.type === "REST") {
        return new StaveNote({
          keys: ["b/4"],
          duration: `${voiceable.duration}r`,
        });
      } else if (voiceable.type === "CHORD") {
        // chord
        const keys = voiceable.notes.map(
          (n) => `${n.step.toLowerCase()}/${n.octave}`
        );
        return new StaveNote({ keys, duration: `${voiceable.duration}` });
      }

      // single note
      else if (voiceable.type === "NOTE") {
        return new StaveNote({
          keys: [
            `${voiceable.pitch.step.toLowerCase()}/${voiceable.pitch.octave}`,
          ],
          duration: `${voiceable.duration}`,
        });
      }

      throw new Error("unrecognized element type: ", voiceable);
    });
  });

  const tickedVoices = voices.map((voice) => {
    return new VFVoice({
      // HARD CODED! hard code time signature data for now
      numBeats: 4,
      beatValue: 4,
    }).addTickables(voice);
  });

  return tickedVoices;
}
