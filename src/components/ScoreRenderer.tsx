import { useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Tone from "tone";
import {
  Accidental,
  Beam,
  Formatter,
  Stave,
  StaveTie,
  StemmableNote,
} from "vexflow4";
import { toneJsUtils, vexflowUtils } from "@/lib";
import type { PartEventRich, Score } from "@/types";

export interface ScoreRendererHandle {
  play: () => Promise<void>;
}

export type ScoreRendererProps = {
  score: Score;
  metronomeActive: boolean;
  ref: React.Ref<ScoreRendererHandle>;
};

export default function ScoreRenderer({
  score,
  metronomeActive,
  ref,
}: ScoreRendererProps) {
  const [audioCtxStarted, setAudioCtxStarted] = useState(false);
  const [metronomeEvents, setMetronomeEvents] = useState<
    PartEventRich[] | null
  >(null);

  const partRef = useRef<Tone.Part | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const clickSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const metronomeRef = useRef<Tone.Part | null>(null);

  useImperativeHandle(ref, () => ({
    play: playMidi,
  }));
  /**
   * ***** ON COMPONONENT MOUNT / UNMOUNT *****
   */
  // INIT SYNTHESIZERS W/ REF
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

    return () => {
      synthRef.current?.dispose();
      synthRef.current = null;
      clickSynthRef.current?.dispose();
      clickSynthRef.current = null;
    };
  }, []);

  // INIT PLAYBACK PARTS W/ REF
  useEffect(() => {
    return () => {
      partRef.current?.dispose();
      partRef.current = null;
      metronomeRef.current?.dispose();
      metronomeRef.current = null;
    };
  }, []);

  /**
   * ***** WATCHERS: [score] *****
   */
  // RENDER VEXFLOW
  useEffect(() => {
    const div = document.getElementById("vf") as HTMLDivElement;
    if (!div) return;
    const RENDERER_WIDTH = 650;
    const context = vexflowUtils.makeContext(
      { width: RENDERER_WIDTH, height: 220 },
      div
    );

    const targetMeasure = score.tracks[0].measures[0];
    const resolvedTimeSig = score.timeSignature;
    const resolvedTempo = targetMeasure.tempo || score.tempo;
    const resolvedKeySig = targetMeasure.keySignature || score.keySignature;
    const resolvedClef = targetMeasure.voices[0][0].clef;

    const {
      tickedVoices: voices,
      tuplets,
      tieLigations,
    } = vexflowUtils.parseScoreToVFDrawables(
      targetMeasure,
      resolvedTimeSig,
      resolvedClef
    );

    Accidental.applyAccidentals(voices, resolvedKeySig);

    const formatter = new Formatter();
    const minNoteArea = formatter
      .joinVoices(voices)
      .preCalculateMinTotalWidth(voices);

    const leftGlyphWidth = vexflowUtils.measureLeftGlyphs({
      clef: resolvedClef,
      key: resolvedKeySig,
      time: `${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`,
    });
    const RIGHT_PADDING = 20;

    const desiredNoteArea = Math.max(minNoteArea, 200);
    const staveWidth = leftGlyphWidth + desiredNoteArea + RIGHT_PADDING;

    let stave = new Stave(10, 40, staveWidth);
    const xCenter = (RENDERER_WIDTH - stave.getWidth()) / 2;

    stave
      .addClef(resolvedClef)
      .addTimeSignature(`${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`)
      .addKeySignature(resolvedKeySig)
      .setContext(context)
      .setX(xCenter);

    stave = vexflowUtils.attachStaveTempo(stave, resolvedTempo);

    stave.draw();

    const actualNoteArea = stave.getNoteEndX() - stave.getNoteStartX() - 5;
    formatter.format(voices, actualNoteArea);

    const beamConfig = vexflowUtils.generateBeamConfig(resolvedTimeSig);
    const beamsByVoice = voices.map((v) => {
      const stemmableNotes = v
        .getTickables()
        .filter((t) => t instanceof StemmableNote);
      return Beam.generateBeams(stemmableNotes, beamConfig);
    });

    voices.forEach((v) => v.draw(context, stave));
    beamsByVoice.flat().forEach((b) => b.setContext(context).draw());
    tuplets.forEach((a) => a.setContext(context).draw());
    const ties = tieLigations.map(
      ({ start, end, firstIndices, lastIndices }) =>
        new StaveTie({
          first_note: start,
          last_note: end,
          first_indices: firstIndices,
          last_indices: lastIndices,
        })
    );

    ties.forEach((t) => {
      t.setContext(context).draw();
    });

    return () => {
      const el = document.getElementById("vf");
      if (el) el.innerHTML = "";
    };
  }, [score]);

  /**
   * ***** WATCHERS: [score, metronomeActive] *****
   */
  // GENERATE METRONOME EVENTS
  useEffect(() => {
    if (!metronomeActive) {
      setMetronomeEvents(null);
      return;
    }

    const { measures } = score.tracks[0];
    let offset = 0;
    const events: PartEventRich[] = [];

    for (const m of measures) {
      const resolvedTempo = m.tempo || score.tempo;
      const resolvedTimeSig = m.timeSignature || score.timeSignature;

      const { playbackData, offset: newOffset } =
        toneJsUtils.generateClickTrack(resolvedTempo, resolvedTimeSig, offset);

      offset = newOffset;
      events.push(...playbackData);
    }

    console.log(events);

    setMetronomeEvents(events);

    return () => {
      setMetronomeEvents(null);
    };
  }, [score, metronomeActive]);

  /**
   * ***** METHODS *****
   */
  const buildPlaybackPart = () => {
    const targetMeasures = score.tracks[0].measures;
    const tempoResolved = targetMeasures[0].tempo || score.tempo;
    const events = toneJsUtils.measuresToPlayback(
      targetMeasures,
      tempoResolved
    );

    if (partRef.current) partRef.current.dispose();

    if (events) {
      partRef.current = new Tone.Part((time, ev) => {
        synthRef.current?.triggerAttackRelease(
          `${ev.step}${ev.accidental || ""}${ev.octave}`,
          ev.duration,
          time,
          ev.velocity
        );
      }, events).start(0);
    }

    if (metronomeRef.current) metronomeRef.current.dispose();
    if (metronomeActive && metronomeEvents) {
      metronomeRef.current = new Tone.Part((time, ev) => {
        clickSynthRef.current?.triggerAttackRelease(
          `${ev.step}${ev.octave}`,
          ev.duration,
          time,
          ev.velocity
        );
      }, metronomeEvents).start(0);
    }
  };

  async function playMidi() {
    if (!audioCtxStarted) {
      await Tone.start();
      setAudioCtxStarted(true);
    }

    const transport = Tone.getTransport();
    transport.cancel();
    transport.bpm.value = score.tempo.bpm;
    transport.position = "0:0";

    buildPlaybackPart();
    transport.start();
  }

  return <div id="vf" className="w-fit mx-auto min-h-56" />;
}
