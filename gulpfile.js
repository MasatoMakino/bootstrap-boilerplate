const path = require("path");
const { series, parallel, src, dest, watch } = require("gulp");

const server = require("gulptask-dev-server")("./dist");
exports.server = server;

const ejsGlob = "./src/**/*.ejs";
const ejs = require("gulptask-ejs")([ejsGlob, "!./src/**/_*.ejs"], "./dist");
exports.ejs = ejs;

const sassDir = path.resolve("./src/scss");
const sass = require("gulptask-sass")(sassDir + "/**/style.scss", "./dist/css");
exports.sass = sass;

const imgDir = path.resolve("./src/img");
const images = require("gulptask-imagemin")(imgDir, "./dist");
exports.images = images;

const watchTasks = cb => {
  watch(ejsGlob, ejs);
  watch(imgDir + "/**/*", images);
  watch(sassDir + "/**/*", sass);
  cb();
};
exports.watchTasks = watchTasks;
