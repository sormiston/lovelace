import "./App.css";
import * as Tone from "tone";
import { Renderer, Stave, Formatter } from "vexflow";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import * as compositions from "@/assets/compositions";
import * as utils from "@/lib";

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

  const partRef = useRef<Tone.Part | null>(null);

  const buildPlaybackPart = useCallback(() => {
    const targetMeasures = score.tracks[0].measures; // HARD-CODE: will need some measure range selection later
    const bpm = score.bpm;
    const events = utils.measuresToPlayback(targetMeasures, bpm);

    if (!events) return;

    if (partRef.current) partRef.current.dispose();
    partRef.current = new Tone.Part((time, ev) => {
      synthRef.current?.triggerAttackRelease(
        `${ev.step}${ev.accidental || ""}${ev.octave}`,
        ev.duration,
        time,
        ev.velocity
      );
    }, events).start(0);
  }, [score.tracks, score.bpm]);

  useLayoutEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, 300);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // HARD CODE!  Just one measure for now
    const voices = utils.scoreMeasureToVFVoices(score.tracks[0].measures[0]);
    // Format and justify the notes to 400 pixels.
    new Formatter().joinVoices(voices).format(voices, 300);

    // Render voices.
    voices.forEach(function (v) {
      v.draw(context, stave);
    });

    // CLEAN-UP
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

    buildPlaybackPart();
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
