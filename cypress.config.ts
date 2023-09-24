import { defineConfig } from "cypress";

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,

  // to hide log in data define process env variables
  env: {
    username: 'artem.bondar16@gmail.com', // data from cypress.env.json takes prio over this file. add credts to the local config.
    password: 'CypressTest1',
    apiUrl: 'https://api.realworld.io'
  },

  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*{js,jsx,ts,tsx}', // use js as a test extension
    excludeSpecPattern:[
      '**/1-getting-started/*', 
      '**/2-advanced-examples/*'
    ] // hide examples from cypress
  }

});
