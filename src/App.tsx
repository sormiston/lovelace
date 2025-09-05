import * as Tone from "tone";
import { Renderer, Stave, Formatter } from "vexflow4";
import { useEffect, useRef, useState } from "react";
import compositions from "@/assets/compositions";
import * as utils from "@/lib";
import type { PartEventSimple, Score } from "./types";

function App() {
  const [audioCtxStarted, setAudioCtxStarted] = useState(false);
  const [score, setScore] = useState<Score>(compositions[2]);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [metronomeEvents, setMetronomeEvents] = useState<
    PartEventSimple[] | null
  >(null);
  const partRef = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const clickSynthRef = useRef<Tone.MembraneSynth>(null);
  const metronomeRef = useRef<Tone.Part | null>(null);

  // SYNTH SET-UP / TEARDOWN
  useEffect(() => {
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    clickSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 1,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        sustain: 0,
        release: 0.1,
      },
    }).toDestination();

    // CLEAN-UP
    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
      clickSynthRef.current?.dispose();
      clickSynthRef.current = null;
    };
  }, []);

  // METRONOME SETUP / TEARDOWN
  useEffect(() => {
    if (metronomeActive) {
      // HARD CODED -- just 1 measure
      setMetronomeEvents(
        new Array(4).fill(null).map((_, i) => [`0:${i}:00`, "C5"])
      );
    }

    return () => {
      setMetronomeEvents(null);
    };
  }, [score, metronomeActive]);

  const buildPlaybackPart = () => {
    console.log("building playback part");
    const targetMeasures = score.tracks[0].measures;
    const bpm = score.bpm;
    const events = utils.measuresToPlayback(targetMeasures, bpm);

    if (!events) return;

    // Clean up existing part
    if (partRef.current) partRef.current.dispose();

    // Create main playback part
    partRef.current = new Tone.Part((time, ev) => {
      synthRef.current?.triggerAttackRelease(
        `${ev.step}${ev.accidental || ""}${ev.octave}`,
        ev.duration,
        time,
        ev.velocity
      );
    }, events).start(0);

    if (metronomeRef.current) metronomeRef.current.dispose();
    if (metronomeActive && metronomeEvents) {
      metronomeRef.current = new Tone.Part((time, note) => {
        clickSynthRef.current?.triggerAttackRelease(note, "32n", time);
      }, metronomeEvents).start(0);
    }

    Tone.getTransport().start();
  };

  useEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(500, 200);
    const context = renderer.getContext();

    const STAVE_WIDTH = 350; // MAGIC NUMBER!
    const stave = new Stave(10, 40, STAVE_WIDTH);
    stave.addClef("treble").addTimeSignature("4/4");
    stave.setContext(context).draw();

    // FORMAT
    // HARD CODE!  Just one measure for now
    const voices = utils.mapMeasureToVFVoices(score.tracks[0].measures[0]);
    // dangerous to create new Formatter instances on each callback run?  consider holding as ref
    const noteArea = stave.getNoteEndX() - stave.getNoteStartX();
    new Formatter().joinVoices(voices).format(voices, noteArea);
    // TWEAKS --- may become necessary -- unbeamed 8th note dotes currently hanging far from note heads
    // voices.forEach((voice) =>
    //   utils.tweakDots(voice.getTickables().filter((t) => isStaveNote(t)))
    // );
    // DRAW
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
  // const stopMidi = () => {
  //   const transport = Tone.getTransport();
  //   transport.position = 0;
  //   transport.stop();
  // };

  const switchComposition = (name: string) => {
    const foundComposition = compositions.find((c) => c.name === name);
    if (!foundComposition) throw new Error("Could not find composition");
    setScore(foundComposition);
  };

  return (
    <main className="flex flex-col justify-center align-center">
      <div className="space-x-1 mx-auto">
        {compositions.map(({ name }) => (
          <CompositionSwitchButton
            key={name}
            name={name}
            handleClick={switchComposition}
            className={`control-button ${
              score.name === name ? "control-button--active" : ""
            }`}
          />
        ))}
      </div>
      <div id="vf" className="w-fit mx-auto"></div>
      <div className="space-x-1 mx-auto">
        <button onClick={playMidi} className="control-button">
          Play
        </button>
        <button
          onClick={() => setMetronomeActive(!metronomeActive)}
          className={`control-button ${
            metronomeActive ? "control-button--active" : ""
          }`}
        >
          + metronome
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
