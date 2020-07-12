import path from 'path';

const DIRS = {
  self: './',
  scripts: 'scripts/',
  styles: 'styles/',
  images: 'images/',
  plugins: 'plugins/',
  locales: 'locales/',
  build: 'build/',
};

const joinSrcPath = (dir_name) => path.join('./src', dir_name);
const joinDistPath = (dir_name) => path.join('./dist', dir_name);
const root = path.resolve(__dirname, '../');

const getAbsPath = () => {
  const keys = Object.keys(DIRS);
  const tSrc = {};
  const tDist = {};
  keys.forEach((key) => {
    tSrc[key] = path.resolve(root, joinSrcPath(DIRS[key]));
    tDist[key] = path.resolve(root, joinDistPath(DIRS[key]));
  });
  return {
    src: tSrc,
    dist: tDist
  }
};

const getRePath = () => {
  const keys = Object.keys(DIRS);
  const tSrc = {};
  const tDist = {};
  keys.forEach((key) => {
    tSrc[key] = joinSrcPath(DIRS[key]);
    tDist[key] = joinDistPath(DIRS[key]);
  });
  return {
    src: tSrc,
    dist: tDist
  }
};

const certs = path.resolve(root, 'certs');

export default {
  abs: { ...getAbsPath() },
  re: { ...getRePath() },
  certs,
};
