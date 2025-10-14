"use client";
import { useEffect, useRef, useState } from "react";
import compositions from "@/data/compositions";
import type { Score } from "@/types";
import CompositionSwitchButton from "@/components/CompositionSwitchButton";
import CompositionCategoryTab from "@/components/CompositionCategoryTag";
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

  const playMidi = async () => {
    await scoreRendererRef.current?.play();
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
