import "./App.css";
import * as Tone from "tone";
import { Renderer, Stave, StaveNote, Formatter } from "vexflow";
import { useLayoutEffect, useRef, useState } from "react";

type Pitch = {
  step: "C" | "D" | "E" | "F" | "G" | "A" | "B";
  octave: number;
  accidental?: "#" | "b" | "##" | "bb" | "natural";
};

type VexDuration = "q" | "h";

type Note = {
  type: "NOTE";
  pitch: Pitch;
  duration: VexDuration;
  startTime: string;
  velocity?: number; // 0-1, optional if only notation
  tie?: boolean;
  articulation?: string[]; // e.g., ["staccato", "accent"]
  dynamic?: string; // e.g., "p", "mf", "f"
};

type Rest = {
  type: "REST";
  duration: VexDuration;
  startTime: string;
};

type Chord = {
  type: "CHORD";
  notes: Pitch[];
  duration: VexDuration;
  startTime: string;
  velocity: number;
};

type Measure = {
  number: number;
  timeSignature: [number, number];
  elements: (Note | Rest | Chord)[];
};

type Track = {
  name: string;
  instrument?: string;
  measures: Measure[];
};

type Score = {
  bpm: number;
  keySignature: string; // e.g., "C", "Gm"
  tracks: Track[];
};

function vexToToneDur(input: "q" | "h") {
  switch (input) {
    case "q":
      return "8n";
    case "h":
      return "2n";
  }
}

const score: Score = {
  bpm: 120,
  keySignature: "C",
  tracks: [
    {
      name: "Piano Right Hand",
      instrument: "acoustic_grand_piano",
      measures: [
        {
          number: 1,
          timeSignature: [4, 4],
          elements: [
            {
              // single note
              type: "NOTE",
              pitch: { step: "C", octave: 4 },
              duration: "q",
              startTime: "0:1",
              velocity: 0.8,
            },
            {
              // rest
              type: "REST",
              duration: "q",
              startTime: "0:2",
            },
            {
              // chord
              type: "CHORD",
              notes: [
                { step: "E", octave: 4 },
                { step: "G", octave: 4 },
              ],
              duration: "h",
              startTime: "0:3",
              velocity: 0.8,
            },
          ],
        },
      ],
    },
  ],
};

function App() {
  // const score = useRef<EasyScore>(null);
  // const system = useRef<System>(null);
  const synthRef = useRef(new Tone.PolySynth(Tone.Synth).toDestination());
  const [audioCtxStarted, setAudioCtxStarted] = useState(false);

  useLayoutEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, 300);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // Convert Score to VexFlow notes
    const vfNotes = score.tracks[0].measures[0].elements.map((e) => {
      if (e.type === "REST") {
        return new StaveNote({ keys: ["b/4"], duration: `${e.duration}r` }); // r = rest
      } else if (e.type === "CHORD") {
        // chord
        const keys = e.notes.map((n) => `${n.step.toLowerCase()}/${n.octave}`);
        return new StaveNote({ keys, duration: `${e.duration}` });
      }

      // single note
      else if (e.type === "NOTE") {
        return new StaveNote({
          keys: [`${e.pitch.step.toLowerCase()}/${e.pitch.octave}`],
          duration: `${e.duration}`,
        });
      }

      throw new Error("unrecognized element type: ", e);
    });

    Formatter.FormatAndDraw(context, stave, vfNotes);

    return () => {
      const el = document.getElementById("vf");
      if (el) el.innerHTML = "";
    };
  }, []);

  const playMidi = async () => {
    const transport = Tone.getTransport();
    if (!audioCtxStarted) {
      await Tone.start();
      setAudioCtxStarted(true);
      transport.position = "0:0";
      transport.stop();

      score.tracks.forEach((track) => {
        track.measures.forEach((measure) => {
          measure.elements
            .filter((e) => e.type !== "REST")
            .forEach((e) => {
              if (e.type === "CHORD") {
                // chord
                e.notes.forEach((n) => {
                  synthRef.current.triggerAttackRelease(
                    `${n.step}${n.octave}`,
                    vexToToneDur(e.duration),
                    e.startTime,
                    e.velocity
                  );
                });
              } else if (e.type === "NOTE") {
                // single note
                synthRef.current.triggerAttackRelease(
                  `${e.pitch.step}${e.pitch.octave}`,
                  vexToToneDur(e.duration),
                  e.startTime,
                  e.velocity
                );
              }
            });
        });
      });
    } else {
      console.log("else", synthRef.current);
      transport.position = "0:0";
      transport.stop("1:1");
    }
  };
  return (
    <>
      <div id="vf"></div>
      <button onClick={playMidi}>Play</button>
    </>
  );
}

export default App;
