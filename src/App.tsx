import "./App.css";
import * as Tone from "tone";
import { Renderer, Stave, StaveNote, Formatter } from "vexflow";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import * as compositions from "@/assets/compositions";

function vexToToneDur(input: "q" | "h") {
  switch (input) {
    case "q":
      return "4n";
    case "h":
      return "2n";
  }
}

function App() {
  // const score = useRef<EasyScore>(null);
  // const system = useRef<System>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, []);

  const [audioCtxStarted, setAudioCtxStarted] = useState(false);
  const [score] = useState(compositions.vexFlowTutAddNotes);

  // build once and keep a ref
  const partRef = useRef<Tone.Part | null>(null);

  const buildPart = useCallback(() => {
    const events: Array<[string, { note: string; vel?: number }]> = [];
    score.tracks.forEach((t) =>
      t.measures.forEach((m) =>
        m.elements.forEach((e) => {
          if (e.type === "REST") return;
          if (e.type === "CHORD") {
            e.notes.forEach((n) =>
              events.push([
                e.startTime,
                { note: `${n.step}${n.octave}`, vel: e.velocity },
              ])
            );
          } else {
            events.push([
              e.startTime,
              { note: `${e.pitch.step}${e.pitch.octave}`, vel: e.velocity },
            ]);
          }
        })
      )
    );

    if (partRef.current) partRef.current.dispose();
    partRef.current = new Tone.Part((time, ev) => {
      synthRef.current?.triggerAttackRelease(
        ev.note,
        vexToToneDur("q"),
        time,
        ev.vel
      );
    }, events).start(0);
  }, [score]);

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
  }, [score]);

  const playMidi = async () => {
    if (!audioCtxStarted) {
      await Tone.start();
      setAudioCtxStarted(true);
    }

    const transport = Tone.getTransport();
    transport.cancel(); // clears scheduled events
    transport.bpm.value = score.bpm;
    transport.position = "0:0";

    buildPart();
    transport.start(); // or stop(), pause(), etc.
  };

  // Optional stop
  const stopMidi = () => {
    const transport = Tone.getTransport();
    transport.position = 0;
    transport.stop();
  };

  return (
    <main className="flex flex-col justify-center align-center">
      <div id="vf" className="w-fit"></div>
      <div>
        <button onClick={playMidi} className="bg-neutral-400 border">
          Play
        </button>
        <button onClick={stopMidi} className="bg-neutral-400 border">
          Stop
        </button>
      </div>
    </main>
  );
}

export default App;
