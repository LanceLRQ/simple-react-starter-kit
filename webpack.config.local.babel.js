import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import WebpackBar from 'webpackbar';
import optimist from 'optimist';

const { argv } = optimist;
const colorMapping = {
  production: '#ff7875',
  // online: '#69c0ff',
  local: '#52c41a',
};

let ApiMapping = 'local';
let ApiBranch = 'master';
// 检测需要以哪种模式运行
if (argv.l || argv.local) {
  ApiMapping = 'local';
} else if (argv.p || argv.production) {
  ApiMapping = 'production';
}

module.exports = require('./webpack/dev.js')(
  ApiMapping,
  ApiBranch,
  [
    new BundleAnalyzerPlugin({
      analyzerPort: 8848,
      openAnalyzer: false,
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ['Your application is running here: http://localhost:3000'],
      },
      clearConsole: false,
    }),
    new WebpackBar({
      profile: false,
      color: colorMapping[ApiMapping],
    })
  ]
);
