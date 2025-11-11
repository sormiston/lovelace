import { useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Tone from "tone";
import { BarlineType } from "vexflow4";
import {
  Accidental,
  Barline,
  Beam,
  Formatter,
  Stave,
  StaveTie,
  StemmableNote,
} from "vexflow4";
import { toneJsUtils, vexflowUtils } from "@/lib";
import type { MeasureParams, PartEventRich, Score } from "@/types";

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

    // TODO: FTLOG split, order, and migrate this into lib/core/vexflowUtils
    // as necessary

    const targetMeasures = score.tracks[0].measures;
    const firstMeasure = targetMeasures[0];
    let nextStaveX = 10;

    let prevMeasureParams: MeasureParams = {
      timeSig: firstMeasure.timeSignature || score.timeSignature,
      tempo: firstMeasure.tempo || score.tempo,
      keySig: firstMeasure.keySignature || score.keySignature,
      clef: firstMeasure.voices[0][0].clef,
    };

    targetMeasures.forEach((measure, idx, arr) => {
      const isFirst = idx === 0;
      const isLast = idx === arr.length - 1;

      const resolvedTimeSig = measure.timeSignature || score.timeSignature;
      const resolvedTempo = measure.tempo || score.tempo;
      const resolvedKeySig = measure.keySignature || score.keySignature;
      const resolvedClef = measure.voices[0][0].clef;

      const {
        tickedVoices: voices,
        tuplets,
        tieLigations,
      } = vexflowUtils.parseMeasureToVFDrawables(
        measure,
        resolvedTimeSig,
        resolvedClef
      );

      Accidental.applyAccidentals(voices, resolvedKeySig);
      const beamConfig = vexflowUtils.generateBeamConfig(resolvedTimeSig);
      const beamsByVoice = voices.map((v) => {
        const stemmableNotes = v
          .getTickables()
          .filter((t) => t instanceof StemmableNote);
        return Beam.generateBeams(stemmableNotes, beamConfig);
      });

      const ties = tieLigations.map(
        ({ start, end, firstIndices, lastIndices }) =>
          new StaveTie({
            first_note: start,
            last_note: end,
            first_indices: firstIndices,
            last_indices: lastIndices,
          })
      );

      const formatter = new Formatter();
      const minNoteArea = formatter
        .joinVoices(voices)
        .preCalculateMinTotalWidth(voices);

      const leftGlyphWidth = isFirst
        ? vexflowUtils.measureLeftGlyphs({
            clef: resolvedClef,
            key: resolvedKeySig,
            time: `${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`,
          })
        : 0;

      // const RIGHT_PADDING = 20;
      const desiredNoteArea = minNoteArea + 85;
      // const staveWidth = leftGlyphWidth + desiredNoteArea + RIGHT_PADDING;
      const staveWidth = leftGlyphWidth + desiredNoteArea;

      let stave = new Stave(nextStaveX, 40, staveWidth);

      // TODO: will need to beef up conditions to include detected measure-to-measure changes in:
      // clef, timeSig, keySig
      if (isFirst) {
        stave
          .addClef(resolvedClef)
          .addTimeSignature(`${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`)
          .addKeySignature(resolvedKeySig);

        stave = vexflowUtils.attachStaveTempo(
          stave,
          resolvedTempo,
          leftGlyphWidth
        );
      }

      if (prevMeasureParams.timeSig !== resolvedTimeSig) {
        stave.addTimeSignature(`${resolvedTimeSig[0]}/${resolvedTimeSig[1]}`);
      }

      if (prevMeasureParams.keySig !== resolvedKeySig) {
        stave.addKeySignature(resolvedKeySig, prevMeasureParams.keySig);
      }

      if (isLast) {
        stave.setEndBarType(Barline.type.END);
      }

      if (measure.leftBarline === BarlineType.REPEAT_BEGIN) {
        stave.setBegBarType(Barline.type.REPEAT_BEGIN);
      }

      if (measure.rightBarline === BarlineType.REPEAT_END) {
        stave.setEndBarType(Barline.type.REPEAT_END);
      }

      stave.setContext(context);

      stave.draw();

      // const actualNoteArea = stave.getNoteEndX() - stave.getNoteStartX() - 5;
      formatter.formatToStave(voices, stave);

      voices.forEach((v) => v.draw(context, stave));
      beamsByVoice.flat().forEach((b) => b.setContext(context).draw());
      tuplets.forEach((a) => a.setContext(context).draw());

      ties.forEach((t) => {
        t.setContext(context).draw();
      });

      nextStaveX += stave.getWidth();

      prevMeasureParams = {
        timeSig: resolvedTimeSig,
        tempo: resolvedTempo,
        keySig: resolvedKeySig,
        clef: resolvedClef,
      };
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

    const events = toneJsUtils.scoreToClickTrack(score);
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
