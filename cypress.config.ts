import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*{js,jsx,ts,tsx}', // use js as a test extension
    excludeSpecPattern:[
      '**/1-getting-started/*', 
      '**/2-advanced-examples/*'] // hide examples from cypress
  },

  // component: {
  //   devServer: {
  //     framework: "angular",
  //     bundler: "webpack",
  //   },
  //   specPattern: "**/*.cy.ts",
  // },
});
