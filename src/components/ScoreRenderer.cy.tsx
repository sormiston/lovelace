import React, { useEffect, useRef, useState } from "react";
import type { Score } from "@/types";
import ScoreRenderer, { type ScoreRendererHandle } from "./ScoreRenderer";
import compositions from "@/data/compositions";

const Wrapper = ({ score }: { score: Score }) => {
  const ref = useRef<ScoreRendererHandle>(null);
  const [handle, setHandle] = useState<ScoreRendererHandle | null>(null);

  useEffect(() => setHandle(ref.current), []);

  return (
    <>
      <ScoreRenderer ref={ref} metronomeActive={false} score={score} />
      {/* <button onClick={() => handle?.play()}>trigger</button> */}
    </>
  );
};
describe("<ScoreRenderer />", () => {
  it("renders", () => {
    cy.viewport(1000, 600);
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Wrapper score={compositions.simple[0]} />);
  });
});
