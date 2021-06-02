const path = require("path");
const rimraf = require("rimraf");
const { series, parallel, src, dest, watch } = require("gulp");

const srcDir = "./src/";
const distDir = "./dist/";

const server = require("gulptask-dev-server").generateTask(distDir);

const ejsGlob = srcDir + "**/*.ejs";
const ejs = require("gulptask-ejs").generateTask(
  [ejsGlob, "!./**/_*.ejs"],
  distDir
);

const sassDir = path.resolve(srcDir, "scss");
const sass = require("gulptask-sass").generateTask({
  base: sassDir,
  entryPoints: sassDir + "/**/style.scss",
  distDir: path.resolve(distDir, "css"),
});

const imgDir = path.resolve(srcDir, "img");
const images = require("gulptask-imagemin").generateTask(imgDir, distDir);

const copyGlob = "./src/**/*.+(htm|html)";
const copy = () => {
  return src(copyGlob, { base: srcDir }).pipe(dest(distDir));
};

const { bundleDevelopment, bundleProduction, watchBundle } =
  require("gulptask-webpack").generateTasks({
    configPath: "./webpack.config.js",
  });

const clean = (cb) => {
  rimraf(distDir, cb);
};

const revision = require("gulptask-revision").generateTasks({
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
exports.build_dev = build_dev;
exports.build_production = build_production;
exports.start_dev = series(build_dev, startServer);
