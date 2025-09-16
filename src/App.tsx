import * as Tone from "tone";
import { Renderer, Stave, Formatter, Beam, StemmableNote } from "vexflow4";
import { useEffect, useRef, useState } from "react";
import compositions from "@/assets/compositions";
import * as utils from "@/lib";
import type { PartEventSimple, Score } from "./types";

type Category = keyof typeof compositions;

function App() {
  const [audioCtxStarted, setAudioCtxStarted] = useState(false);
  const [category, setCategory] = useState<Category>("voices");
  const [score, setScore] = useState<Score>(compositions["voices"][0]);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [metronomeEvents, setMetronomeEvents] = useState<
    PartEventSimple[] | null
  >(null);
  const partRef = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const clickSynthRef = useRef<Tone.MembraneSynth>(null);
  const metronomeRef = useRef<Tone.Part | null>(null);
  const categoriesRef = useRef<Category[]>(
    Object.keys(compositions) as Category[]
  );

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
    const RENDERER_WIDTH = 600;
    renderer.resize(RENDERER_WIDTH, 220);
    const context = renderer.getContext();

    // HARD CODED: one track / first measure
    const targetMeasure = score.tracks[0].measures[0];
    const resolvedTimeSig = score.timeSignature;

    // Build voices
    const [voices, artifacts] = utils.mapMeasureToVFVoices(
      targetMeasure,
      resolvedTimeSig
    );

    // Pre-calc minimal note area (no justification)
    const formatter = new Formatter();
    const minNoteArea = formatter
      .joinVoices(voices)
      .preCalculateMinTotalWidth(voices);

    // Estimate clef/time glyph width; size stave accordingly
    const LEFT_GLYPHS_EST = 55;
    const RIGHT_PADDING = 20;

    const desiredNoteArea = Math.max(minNoteArea, 200);
    const STAVE_WIDTH = LEFT_GLYPHS_EST + desiredNoteArea + RIGHT_PADDING;

    const stave = new Stave(10, 40, STAVE_WIDTH);
    const xCenter = (RENDERER_WIDTH - stave.getWidth()) / 2;

    stave
      .addClef("treble")
      .addTimeSignature(`${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`)
      .setContext(context)
      .setX(xCenter)
      .draw();

    // Format with actual available note area between start/end
    const actualNoteArea = stave.getNoteEndX() - stave.getNoteStartX() - 5;
    formatter.format(voices, actualNoteArea);

    // Draw voices, beams, artifacts
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

  const compositionsInCategory: Score[] = compositions[category];

  const selectCategory = (cat: Category) => {
    setCategory(cat);
  };

  useEffect(() => {
    const firstInCategory = compositionsInCategory[0];
    if (firstInCategory) setScore(firstInCategory);
  }, [compositionsInCategory]);

  const selectComposition = (name: string) => {
    const target = compositionsInCategory.find((c) => c.name === name);
    if (target) setScore(target);
  };

  return (
    <main className="flex flex-col justify-center align-center mt-8">
      <div className="space-x-1 mx-auto">
        {categoriesRef.current.map((cat) => (
          <CompositionCategoryTab
            key={cat}
            category={cat}
            handleClick={() => selectCategory(cat)}
            className={`control-button ${
              category === cat ? "control-button--active" : ""
            }`}
          />
        ))}
      </div>
      <div id="vf" className="w-fit mx-auto min-h-56"></div>
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
      <div className="space-x-1 mx-auto mt-4">
        {compositionsInCategory.map(({ name }) => (
          <CompositionSwitchButton
            key={name}
            name={name}
            handleClick={selectComposition}
            className={`control-button ${
              score.name === name ? "control-button--active" : ""
            }`}
          />
        ))}
      </div>
    </main>
  );
}

function CompositionCategoryTab({
  category,
  handleClick,
  className,
}: {
  category: Category;
  handleClick: () => void;
  className?: string;
}) {
  return (
    <button onClick={handleClick} className={className}>
      {category}
    </button>
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
