import * as Tone from "tone";
import { Renderer, Stave, Formatter, Beam, StemmableNote } from "vexflow4";
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
      // HARD CODED & BASIC -- just 1 measure, naive quarter note groupings
      const targetMeasure = score.tracks[0].measures[0];
      const resolvedTimeSig =
        targetMeasure.timeSignature || score.timeSignature;
      // calclulate how many quarter notes in a bar
      const quarterNotesPerBar = (resolvedTimeSig[0] * 4) / resolvedTimeSig[1];
      console.log("quarterNotesPerBar", quarterNotesPerBar);
      // build array of metronome click events for one measure
      // e.g., ["0:0:00", "C5"], ["0:1:00", "C5"], ["0:2:00", "C5"], ["0:3:00", "C5"]
      // TODO - handle time signatures with fractional quarter notes (e.g., 6/8)
      setMetronomeEvents(
        new Array(quarterNotesPerBar)
          .fill(null)
          .map((_, i) => [`0:${i}:00`, "C5"])
      );
    }

    return () => {
      setMetronomeEvents(null);
    };
  }, [score, metronomeActive]);

  /** CREATE & SET TONE.JS PLAYBACK PARTS */
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
  };

  /** VEXFLOW RENDER EFFECT - DEPS: SCORE*/
  useEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(600, 220);
    const context = renderer.getContext();

    // HARD CODED: one track / first measure
    const targetMeasure = score.tracks[0].measures[0];
    const resolvedTimeSig = score.timeSignature;

    // 1) Build voices (independent of stave width)
    const [voices, artifacts] = utils.mapMeasureToVFVoices(
      targetMeasure,
      resolvedTimeSig
    );

    // 2) First pass formatter to find minimal note area (no justification)
    const firstPass = new Formatter();
    firstPass.joinVoices(voices).format(voices, 0); // width=0 => no justify
    const minNoteArea = firstPass.getMinTotalWidth(); // minimal width needed for notes

    // 3) Estimate left glyph (clef + time) width; after drawing we’ll recompute actual note area
    const LEFT_GLYPHS_EST = 55; // empirical; adjust if needed
    const RIGHT_PADDING = 20;

    const desiredNoteArea = Math.max(minNoteArea, 220); // enforce a comfortable minimum
    const STAVE_WIDTH = LEFT_GLYPHS_EST + desiredNoteArea + RIGHT_PADDING;

    const stave = new Stave(10, 40, STAVE_WIDTH);
    stave
      .addClef("treble")
      .addTimeSignature(`${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`)
      .setContext(context)
      .draw();

    // 4) Second pass: actual available note area between start/end
    const actualNoteArea = stave.getNoteEndX() - stave.getNoteStartX() - 5; // slight fudge factor
    const formatter = new Formatter();
    formatter.joinVoices(voices).format(voices, actualNoteArea);

    // 5) Draw voices, beams, artifacts
    const beamsByVoice = voices.map((v) => {
      const stemmableNotes = v
        .getTickables()
        .filter((t) => t instanceof StemmableNote);
      return Beam.generateBeams(stemmableNotes);
    });

    voices.forEach((v) => v.draw(context, stave));
    beamsByVoice.flat().forEach((b) => b.setContext(context).draw());
    artifacts.forEach((a) => a.setContext(context).draw());

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
    transport.cancel();
    transport.bpm.value = score.bpm;
    transport.position = "0:0";

    buildPlaybackPart();
    transport.start();
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
