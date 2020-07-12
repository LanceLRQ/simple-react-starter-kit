// import fs from 'fs';
import path from 'path';
import paths from './paths';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from "html-webpack-plugin";
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

import buildCommonConfig from './common';
import { IndexPageInfos } from './constant';

/**
 * Generate Development Mode
 * @param apiMapping    API mapping type for client
 * @param apiBranch     Branch name，reserved.
 * @param diyPlugins    Register webpack plugins.
 * @returns {*}
 */
const genDevConf = (apiMapping, apiBranch, diyPlugins=[]) => {
  let masterDomain = 'http://localhost:3000';
  console.log('----------------------------------------------');
  if (apiMapping === 'local') {
     console.log(`API Client: \x1B[44m\x1B[37mLocal API Mode\x1B[0m`);
  } else if (apiMapping === 'production') {
    masterDomain = `https://www.abc.com`;
    console.log(`API Client: \x1B[42m\x1B[37mProduction API Mode\x1B[0m`);
  } else {
    console.error('Unknown API mapping');
    process.exit();
  }
  console.log('----------------------------------------------\x1B[0m\n');
  const API_HOST_MAPPINGS = {
    'local': 'http://localhost',
    'production': `https://www.abc.com`,
  };
  const API_BASE_MAPPINGS = {
    'local': '',
    'online': '/api',
    'production':  '',
  };
  const WEBSOCKET_HOST_MAPPING = {
    // 'local': 'wss://localhost'
  };
  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        // 'NODE_ENV': JSON.stringify('development'),
        'API_ROOT': JSON.stringify('/api'),
        'API_BRANCH': JSON.stringify(apiBranch),
        'API_MAPPING': JSON.stringify(apiMapping),
        'BUILD_ENV': JSON.stringify({
          version: process.env['BRANCH_NAME'],
          commit: process.env['GIT_COMMIT'],
          build: process.env['BUILD'],
          api_branch: apiBranch,
        }),
        'MASTER_DOMAIN': JSON.stringify(masterDomain),
        'WEBSOCKET_HOSTING': JSON.stringify(WEBSOCKET_HOST_MAPPING[apiMapping] || ''),
      },
    }),
    new HtmlWebpackPlugin({
      ...IndexPageInfos,
      node_env: 'development',
      api_status: `[DEV: ${apiMapping === 'production' ? 'Online' : 'Local'}] `,
      // favicon: path.resolve(paths.abs.src.images, 'favicon.ico'),
      filename:'index.html',
      hash: true,
      inject: false,
      template: path.resolve(paths.abs.dist.self, 'index.html'),
      minify: { // Minify HTML files
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([{
      // HardSource works with mini-css-extract-plugin but due to how
      // mini-css emits assets, assets are not emitted on repeated builds with
      // mini-css and hard-source together. Ignoring the mini-css loader
      // modules, but not the other css loader modules, excludes the modules
      // that mini-css needs rebuilt to output assets every time.
      test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
    }]),
    ...diyPlugins,
  ];
  const apiHost = API_HOST_MAPPINGS[apiMapping] || API_HOST_MAPPINGS.local;
  const apiBase = API_BASE_MAPPINGS[apiMapping];
  return merge(buildCommonConfig(), {
    devtool: 'cheap-source-map',      // fast compile speed.
    // devtool: 'source-map',
    stats: 'normal',
    parallelism: 5,
    output:{
      path: paths.abs.dist.build,
      filename: '[name].[hash].bundle.js',
      chunkFilename: '[name].[hash].chunk.js'
    },
    plugins,
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom'
      },
    },
    devServer: {
      // https: {
      //   key: fs.readFileSync(path.resolve(paths.certs, 'server.key')),
      //   cert: fs.readFileSync(path.resolve(paths.certs, 'server.crt')),
      //   ca: fs.readFileSync(path.resolve(paths.certs, 'ca.pem')),
      // },
      stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        chunks: true,
        chunkModules: true,
        moduleTrace: true,
        errorDetails: true,
        // 添加资源信息
        // assets: true,
      },
      overlay: true,
      historyApiFallback: {
        rewrites: [
          // { from: /^\//, to: '/index.html' },
          // { from: /^\/wechat\/\w+\/iframe/, to: '/blank.html' },
        ]
      },
      hot: true,
      inline: true,
      progress: true,     // Show packing progress bar
      compress: true,
      port: 3000,
      host: '0.0.0.0',
      disableHostCheck: true,
      proxy: {
        // '/resource': {
        //   target: apiHost,
        //   changeOrigin: true,
        //   secure: false,
        //   logLevel: 'debug',
        //   pathRewrite: {'^/resource': `${apiBase}/resource`}
        // },
        '/api': {
          target: apiHost,
          changeOrigin: true,
          secure: false,
          logLevel: 'info',
          pathRewrite: {'^/api': `${apiBase}`}
        },
        '/api/ws': {
          target: apiHost.replace('https', 'wss').replace('http', 'ws'),
          changeOrigin: true,
          ws: true,
          // Add this:
          onError(err) {
            console.log('Suppressing WDS proxy upgrade error:', err);
          },
          logLevel: 'debug',
          pathRewrite: {'^/api/ws': `${apiBase}/ws`}
        }
      }
    },
  });
};
process.on('uncaughtException', function (err) {
  // 防止WS意外崩溃
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});
module.exports = genDevConf;
