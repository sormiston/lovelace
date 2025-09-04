import * as Tone from "tone";
import { Renderer, Stave, Formatter } from "vexflow4";
import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import compositions from "@/assets/compositions";
import * as utils from "@/lib";

function App() {
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
    };
  }, []);

  const [audioCtxStarted, setAudioCtxStarted] = useState(false);
  const [score, setScore] = useState(compositions[0]);
  const partRef = useRef<Tone.Part | null>(null);

  const buildPlaybackPart = useCallback(() => {
    console.log("building playback part");
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
  }, [score]);

  useLayoutEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, 350);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // HARD CODE!  Just one measure for now
    const voices = utils.mapMeasureToVFVoices(score.tracks[0].measures[0]);
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

  const switchComposition = (name: string) => {
    const foundComposition = compositions.find((c) => c.name === name);
    if (!foundComposition) throw new Error("Could not find composition");
    setScore(foundComposition);
  };

  return (
    <main className="flex flex-col justify-center align-center">
      <div className="space-x-1">
        {compositions.map(({ name }) => (
          <CompositionSwitchButton
            key={name}
            name={name}
            handleClick={switchComposition}
            className="control-button"
          />
        ))}
      </div>
      <div id="vf" className="w-fit"></div>
      <div className="space-x-1">
        <button onClick={playMidi} className="control-button">
          Play
        </button>
        <button onClick={stopMidi} className="control-button">
          Stop
        </button>
      </div>
    </main>
  );
}

function CompositionSwitchButton({
  name,
  handleClick,
  className,
}: {
  name: string;
  handleClick: (x: string) => void;
  className?: string;
}) {
  return (
    <button onClick={() => handleClick(name)} className={className}>
      {name}
    </button>
  );
}
export default App;
