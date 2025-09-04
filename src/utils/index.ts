import type { Measure, Pitch, BaseDuration } from "@/types";

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
  let currentTime = 0;
  const playbackData: PlaybackData[] = [];
  measures.forEach((m) => {
    const { elements } = m;
    elements.forEach((e) => {
      const seconds = noteDurationToSeconds(e.duration, bpm);
      if (e.type === "NOTE") {
        playbackData.push([
          currentTime,
          {
            duration: seconds,
            velocity: 0.7,
            step: e.pitch.step,
            octave: e.pitch.octave,
            accidental: e.pitch.accidental,
          },
        ]);
      } else if (e.type === "CHORD") {
        e.notes.forEach((n) => {
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
      } else if (e.type === "REST") {
        // NO-OP.  time will be banked as normal
      }

      currentTime += seconds;
    });
  });

  return playbackData.length > 0 ? playbackData : null;
}
