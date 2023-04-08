const { defineConfig } = require('cypress');
const { startDevServer } = require('@cypress/webpack-dev-server');

module.exports = (async () => {
  const { default: webpackConfig } = await import('./webpack.config.cjs');

  const pluginConfig = (on, config) => {
    on('dev-server:start', (options) => {
      startDevServer({ options, webpackConfig });
    });

    return config;
  };

  return defineConfig({
    plugins: [pluginConfig],
    e2e: {
      specPattern: 'cypress/e2e-tests/**/*.cy.{js,jsx,ts,tsx}',
      supportFile: false,
    },
    component: {
      specPattern: 'cypress/component-tests/**/*.cy.{js,jsx,ts,tsx}',
    },
  });
})();
