"use client";
import { useEffect, useRef, useState } from "react";
import compositions from "@/data/compositions";
import type { Score } from "@/types";
import ScoreRenderer, {
  type ScoreRendererHandle,
} from "@/components/ScoreRenderer";

export type Category = keyof typeof compositions;

export default function Demo() {
  const [category, setCategory] = useState<Category>("simple");
  const [score, setScore] = useState<Score>(compositions["simple"][0]);
  const [metronomeActive, setMetronomeActive] = useState(false);
  const categoriesRef = useRef<Category[]>(
    Object.keys(compositions) as Category[]
  );
  const scoreRendererRef = useRef<ScoreRendererHandle | null>(null);
  const compositionsInCategory: Score[] = compositions[category];


  useEffect(() => {
    const firstInCategory = compositionsInCategory[0];
    if (firstInCategory) setScore(firstInCategory);
  }, [compositionsInCategory]);

  const selectComposition = (name: string) => {
    const target = compositionsInCategory.find((c) => c.name === name);
    if (target) setScore(target);
  };

  const playMidi = async () => {
    await scoreRendererRef.current?.play();
  };

  return (
    <main className="flex flex-col justify-center align-center mt-8">
      <div className="space-x-1 space-y-1 mx-auto px-[20%]">
        <select onChange={(e) => setCategory(e.target.value as Category)}>
          {categoriesRef.current.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select onChange={(e) => selectComposition(e.target.value)}>
          {compositionsInCategory.map(({ name }) => (
            <option
              key={name}
              value={name}
              onClick={() => selectComposition(name)}
            >
              {name}
            </option>
          ))}
        </select>
      </div>

      <ScoreRenderer
        score={score}
        metronomeActive={metronomeActive}
        ref={scoreRendererRef}
      />
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
