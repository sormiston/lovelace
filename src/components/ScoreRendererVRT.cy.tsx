import compositions from "@/data/compositions";
import { Wrapper } from "./ScoreRenderer.cy";

describe("VRT :: <ScoreRenderer />", () => {
  const categories = Object.keys(compositions) as (keyof typeof compositions)[];
  categories.forEach((category) => {
    compositions[category].forEach((score) => {
      it(`${category}:${score.name} matches snapshot`, () => {
        cy.viewport(1000, 600);
        cy.mount(<Wrapper score={score} />);
        cy.get("#vf").matchImageSnapshot();
      });
    });
  });
});
