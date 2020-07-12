import path from 'path';
import { merge } from 'webpack-merge';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

import { buildLoader } from './loader';
import paths from './paths';


const buildCommonConfig = (env = { NODE_ENV: 'development' }) => {
  const buildEntries = (p) => {
    const bundle = [];
    if (env.NODE_ENV === 'development'){
      bundle.push('react-hot-loader/patch');
    }
    bundle.push('babel-polyfill');
    bundle.push(p);
    return bundle
  };
  const common_config = {
    optimization: {
      minimize: false,
      runtimeChunk: {
        name: "manifest"
      },
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        automaticNameDelimiter: '.',
        name: true,
        cacheGroups: {
          default: {
            priority: -20,
            minChunks: 1,
            reuseExistingChunk: true
          },
          lodash: {
            chunks: 'all',
            test: /lodash/,
            priority: 90,
            name: 'lodash',
          },
          moment: {
            chunks: 'all',
            test: /moment/,
            priority: 90,
            name: 'moment',
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'initial',
            enforce: true,
          },
        }
      }
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[name].[hash].css"
      }),
      // new CopyWebpackPlugin([
      //   { from: 'src/static', to: 'static' },
      // ]),
      new HardSourceWebpackPlugin(),
    ],
    entry: {
      index: buildEntries(path.resolve(paths.abs.src.scripts, 'index.jsx')),
    },
    resolve: {
      alias: {
        scripts: paths.abs.src.scripts,
        styles: paths.abs.src.styles,
        images: paths.abs.src.images,
        '@': paths.abs.src.self,
      },
      extensions: ['.js', '.jsx', 'ts', 'tsx', '.scss', '.less', '.jsonp'],
    },
  };
 return merge(common_config, buildLoader(env));
};

export default buildCommonConfig;
