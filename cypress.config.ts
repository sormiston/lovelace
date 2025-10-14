/* eslint-disable @typescript-eslint/no-unused-vars */
import { defineConfig } from "cypress";
import { addMatchImageSnapshotPlugin } from "@simonsmith/cypress-image-snapshot/plugin";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on);
    },
    screenshotOnRunFailure: false,
  },
});
