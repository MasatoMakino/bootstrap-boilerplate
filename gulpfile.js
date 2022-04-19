import path from "path";
import rimraf from "rimraf";
import gulp from "gulp";
const { series, parallel, src, dest, watch } = gulp;

const srcDir = "./src/";
const distDir = "./dist/";

import devServerTask from "gulptask-dev-server";
const server = devServerTask.generateTask(distDir);

const ejsGlob = srcDir + "**/*.ejs";
import ejsTask from "gulptask-ejs";
const ejs = ejsTask.generateTask([ejsGlob, "!./**/_*.ejs"], distDir);

const sassDir = path.resolve(srcDir, "scss");
import sassTask from "gulptask-sass";
const sass = sassTask.generateTask({
  base: sassDir,
  entryPoints: sassDir + "/**/style.scss",
  distDir: path.resolve(distDir, "css"),
});

const imgDir = path.resolve(srcDir, "img");
import imageminTask from "gulptask-imagemin";
const images = imageminTask.generateTask(imgDir, distDir);

const copyGlob = "./src/**/*.+(htm|html)";
const copy = () => {
  return src(copyGlob, { base: srcDir }).pipe(dest(distDir));
};

import webpackTask from "gulptask-webpack";
const { bundleDevelopment, bundleProduction, watchBundle } =
  webpackTask.generateTasks({
    configPath: "./webpack.config.cjs",
  });

const clean = (cb) => {
  rimraf(distDir, cb);
};

import revisionTask from "gulptask-revision";
const revision = revisionTask.generateTasks({
  distDir: distDir,
});

const watchTasks = (cb) => {
  watchBundle();
  watch(ejsGlob, ejs);
  watch(copyGlob, copy);
  watch(imgDir + "/**/*", images);
  watch(sassDir + "/**/*", sass);
  cb();
};
const startServer = series(watchTasks, server);

const generate_dev = parallel(sass, ejs, bundleDevelopment, images, copy);
const generate_production = parallel(sass, ejs, bundleProduction, images, copy);

const build_dev = series(clean, generate_dev);
const build_production = series(clean, generate_production, revision);
const start_dev = series(build_dev, startServer);

export { build_dev, build_production, start_dev };
