const {defineConfig} = require('cypress')

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseURL: 'http://localhost:3000/api',
  },
};

