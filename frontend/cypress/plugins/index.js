const webpack = require('@cypress/webpack-dev-server');
const webpackConfig = require('../../webpack.config');

module.exports = (on, config) => {
  on('dev-server:start', (options) => {
    return webpack.startDevServer({ options, webpackConfig });
  });

  return config;
};
