"use client";
import { useReducer, useRef, useState } from "react";
import { scores } from "@/data/compositions";
import type { Score } from "@/types";
import ScoreRenderer, {
  type ScoreRendererHandle,
} from "@/components/ScoreRenderer";

type ScoreSelectState = {
  availablePools: string[];
  selectedPool: string;
  availableCategories: string[];
  selectedCategory: string;
  availableScoreNames: string[];
  selectedScore: Score;
};

type ScoreSelectAction =
  | { type: "SET_POOL"; pool: string }
  | { type: "SET_CATEGORY"; category: string }
  | { type: "SET_SCORE_NAME"; scoreName: string };

function scoreSelectReducer(
  state: ScoreSelectState,
  action: ScoreSelectAction
) {
  switch (action.type) {
    case "SET_POOL": {
      const availableCategories = Object.keys(scores[action.pool]);
      const firstCategory = availableCategories[0];
      const availableScoreNames = scores[action.pool][firstCategory].map(
        (s: Score) => s.name
      ) as string[];

      return {
        ...state,
        selectedPool: action.pool,
        availableCategories,
        selectedCategory: firstCategory,
        availableScoreNames,
        selectedScore: scores[action.pool][firstCategory][0] as Score,
      };
    }

    case "SET_CATEGORY": {
      const availableScoreNames = scores[state.selectedPool][
        action.category
      ].map((s: Score) => s.name) as string[];

      return {
        ...state,
        selectedCategory: action.category,
        availableScoreNames,
        selectedScore: scores[state.selectedPool][action.category][0] as Score,
      };
    }

    case "SET_SCORE_NAME": {
      const availableScores =
        scores[state.selectedPool][state.selectedCategory];
      const targetScore = availableScores.find(
        (s: Score) => s.name === action.scoreName
      );

      if (!targetScore) {
        throw new Error(`Score not found: ${action.scoreName}`);
      }

      return {
        ...state,
        selectedScore: targetScore as Score,
      };
    }
  }
}

const initialScoreSelectState: ScoreSelectState = {
  availablePools: Object.keys(scores),
  selectedPool: "singleMeasureScores",
  availableCategories: Object.keys(scores.singleMeasureScores),
  selectedCategory: "simple",
  availableScoreNames: scores["singleMeasureScores"]["simple"].map(
    (s) => s.name
  ),
  selectedScore: scores["singleMeasureScores"]["simple"][0],
};

export default function Demo() {
  const [scoreSelectState, scoreSelectDispatch] = useReducer(
    scoreSelectReducer,
    initialScoreSelectState
  );
  const [metronomeActive, setMetronomeActive] = useState(false);
  const scoreRendererRef = useRef<ScoreRendererHandle | null>(null);

  const playMidi = async () => {
    await scoreRendererRef.current?.play();
  };

  return (
    <main className="flex flex-col justify-center align-center mt-8">
      <div className="space-x-1 space-y-1 mx-auto px-[20%]">
        <select
          onChange={(e) =>
            scoreSelectDispatch({ type: "SET_POOL", pool: e.target.value })
          }
          className="border rounded-sm p-2"
        >
          {scoreSelectState.availablePools.map((pool) => (
            <option key={pool} value={pool}>
              {pool}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            scoreSelectDispatch({
              type: "SET_CATEGORY",
              category: e.target.value,
            })
          }
          className="border rounded-sm p-2"
        >
          {scoreSelectState.availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          onChange={(e) =>
            scoreSelectDispatch({
              type: "SET_SCORE_NAME",
              scoreName: e.target.value,
            })
          }
          className="border rounded-sm p-2"
        >
          {scoreSelectState.availableScoreNames.map((scoreName) => (
            <option key={scoreName} value={scoreName}>
              {scoreName}
            </option>
          ))}
        </select>
      </div>

      <ScoreRenderer
        score={scoreSelectState.selectedScore}
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
