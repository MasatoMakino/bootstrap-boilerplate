const path = require("path");
const { series, parallel, src, dest, watch } = require("gulp");

const srcDir = "./src/";
const distDir = "./dist/";

const server = require("gulptask-dev-server")(distDir);
exports.server = server;

const ejsGlob = srcDir + "**/*.ejs";
const ejs = require("gulptask-ejs")([ejsGlob, "!_*.ejs"], distDir);
exports.ejs = ejs;

const sassDir = path.resolve(srcDir, "scss");
const sass = require("gulptask-sass")(
  sassDir + "/**/style.scss",
  path.resolve(distDir, "css")
);
exports.sass = sass;

const imgDir = path.resolve(srcDir, "img");
const images = require("gulptask-imagemin")(imgDir, distDir);
exports.images = images;

const {
  bundleDevelopment,
  bundleProduction,
  watchBundle
} = require("gulptask-webpack")("./webpack.config.js");
exports.bundleDevelopment = bundleDevelopment;
exports.bundleProduction = bundleProduction;

const watchTasks = cb => {
  watchBundle();
  watch(ejsGlob, ejs);
  watch(imgDir + "/**/*", images);
  watch(sassDir + "/**/*", sass);
  cb();
};
exports.watchTasks = watchTasks;
