import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import AssetsPlugin from 'assets-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";

import paths from './paths';
import buildCommonConfig from './common';
import { IndexPageInfos } from './constant';

const devconf = {
  devtool: 'source-map',
  profile: true,
  stats: 'normal',
  parallelism: 5,
  output:{
    path: paths.abs.dist.build,
    filename: "[name].[hash].bundle.js",
    chunkFilename: "[name].[hash].chunk.js"
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // 'NODE_ENV': JSON.stringify('production'),
        'API_HOST': JSON.stringify('https://www.abc.com'),
        'BUILD_ENV': JSON.stringify({
          version: process.env['BRANCH_NAME'],
          commit: process.env['GIT_COMMIT'],
          build: process.env['BUILD'],
        }),
        'MASTER_DOMAIN':  JSON.stringify('https://www.abc.com'),
      },
    }),
    new AssetsPlugin({
      path: paths.abs.dist.build,
    }),
    new HtmlWebpackPlugin({
      ...IndexPageInfos,
      api_status: '',
      node_env: 'production',
      title: 'Hello World',
      // favicon: path.resolve(paths.abs.src.images, 'favicon.ico'),
      filename:'index.html',
      hash: false,
      inject: false,
      template: path.resolve(paths.abs.dist.self, 'index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new OptimizeCSSAssetsPlugin(),
  ]
};
module.exports = merge(buildCommonConfig(), devconf);
