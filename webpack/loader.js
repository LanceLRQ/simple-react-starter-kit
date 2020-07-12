import HappyPack from 'happypack';
import autoprefixer from 'autoprefixer';
import paths from './paths';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// const APP_DIR = path.resolve(__dirname, './src');
// const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

// const animation = /node_modules\/animate.css/;
// const antd = /node_modules\/antd/;


const BABEL_LOADER_ID = 'babel';
const TS_LOADER_ID = 'typescript';
const CSS_LOADER_ID = 'css';
const SASS_LOADER_ID = 'sass';
// const LESS_LOADER_ID = 'less';
const STYLE_LOADER_ID = 'style';
const getHappyLoaderName = id => `happypack/loader?id=${id}`;

const buildLoaderBase = (env) => {

  // AntDesign
  // const antdTheme = require('../src/styles/antd/theme.js').default;

  const babel_plugins = [
    // ["import", { "libraryName": "antd", "style": true }], // for ant.design.
    ["lodash", { "id": ["lodash", "recompose"] }],
    ["transform-decorators-legacy"]
  ];
  if(env.NODE_ENV === 'development'){
    babel_plugins.push(['react-hot-loader/babel']);
  }
  return {
    module: {
      rules: [
        // Babel Loader
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: [paths.abs.src.scripts],
          use: [getHappyLoaderName(BABEL_LOADER_ID)],
        },
        // TS Loader
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          include: [paths.abs.src.scripts],
          use: [{
            loader: 'ts-loader',
          }]
        },
        // Url Loader
        {
          test: /\.(jpe?g|png|gif|tiff|webp|ttf|woff|woff2|eot)$/,
          // include: [paths.abs.src.images],
          // exclude: [paths.abs.src.svgs],
          use: [{
            loader: 'file-loader',
            options: {
              name: env.NODE_ENV === "development" ? '[hash].[ext]?debug=[path][name]' : '[hash].[ext]',
              outputPath: 'static',
              publicPath: function(path){
                return '/static/' + path;
              }
            },
          }],
        },
        // Svg Loader
        // {
        //   test: /\.svg$/,
        //   loader: 'svg-sprite-loader',
        //   include: [paths.abs.src.svgs],
        //   options: {
        //     symbolId: 'svg-[name]'
        //   }
        // },
        // Antd Less Loader
        // {
        //   test: /\.less$/,
        //   // include: [antd],
        //   use: [
        //     // { loader: 'cache-loader' },
        //     { loader: 'style-loader' },
        //     getHappyLoaderName(CSS_LOADER_ID),
        //     getHappyLoaderName(LESS_LOADER_ID),
        //   ],
        // },
        // //Monaco
        // {
        //   test: /\.css$/,
        //   include: MONACO_DIR,
        //   use: [
        //     { loader: 'style-loader' },
        //     { loader: 'css-loader' },
        //     getHappyLoaderName(STYLE_LOADER_ID),
        //     getHappyLoaderName(CSS_LOADER_ID)
        //   ],
        // },
        // Style Loader
        {
          test: /\.(scss|sass|css)$/,
          // include: [paths.abs.src.styles, antd],
          use: [
            MiniCssExtractPlugin.loader,
            // 'cache-loader',
            getHappyLoaderName(CSS_LOADER_ID),
            {
              loader: 'postcss-loader',
              options: {
                plugins() {
                  return [
                    autoprefixer({
                      // browsers: [],
                      cascade: false,
                    })
                  ];
                },
              },
            },
            getHappyLoaderName(SASS_LOADER_ID)
          ],
        },
      ],
    },
    plugins: [
      new HappyPack({
        id: BABEL_LOADER_ID,
        loaders: [{
          loader: 'babel-loader',
          options: {
            plugins: babel_plugins,
            presets: [
              ["env", {
                "modules": false,
                "targets": {
                  "browsers": [
                    "chrome >= 43",
                    "safari >= 7",
                    "ie >= 11",
                    "firefox >= 48"
                  ]
                }
              }],
              ["stage-0"],
              ["react"]
            ],
          },
        }],
        threads: 2,
      }),
      new HappyPack({
        id: CSS_LOADER_ID,
        loaders: ['css-loader'],
        threads: 2,
      }),
      // new HappyPack({
      //   id: LESS_LOADER_ID,
      //   loaders: [{
      //     loader: 'less-loader',
      //     options: {
      //       modifyVars: antdTheme,
      //       javascriptEnabled: true,
      //     },
      //   }],
      //   threads: 2,
      // }),
      new HappyPack({
        id: STYLE_LOADER_ID,
        loaders: [{
          loader: 'style-loader',
        }],
        threads: 2,
      }),
      new HappyPack({
        id: SASS_LOADER_ID,
        loaders: [{
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            // data: "@import '~styles/themes/index.scss';",
          },
        }],
        threads: 4,
      }),
      // new HappyPack({
      //   id: STYLE_LOADER_ID,
      //
      // })
    ]
  };
};

export const buildLoader = (env) => {
  return buildLoaderBase(env);
};
