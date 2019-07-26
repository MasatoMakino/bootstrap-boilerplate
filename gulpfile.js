const path = require("path");
const { series, parallel, src, dest, watch } = require("gulp");

const server = require("gulptask-dev-server")("./dist");
exports.server = server;

const ejsGlob = "./src/**/*.ejs";
const ejs = require("gulptask-ejs")([ejsGlob, "!./src/**/_*.ejs"], "./dist");
exports.ejs = ejs;

const imgDir = path.resolve("./src/img");
const images = require("gulptask-imagemin")(imgDir, "./dist");
exports.images = images;

const watchTasks = cb => {
  watch(ejsGlob, ejs);
  watch(imgDir + "/**/*", images);
  cb();
};
exports.watchTasks = watchTasks;
