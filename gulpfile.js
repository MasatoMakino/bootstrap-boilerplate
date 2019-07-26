const { series, parallel, src, dest, watch } = require("gulp");

const server = require("gulptask-dev-server")("./dist");
exports.server = server;

const ejsGlob = "./src/**/*.ejs";
const ejs = require("gulptask-ejs")([ejsGlob, "!./src/**/_*.ejs"], "./dist");
exports.ejs = ejs;

const watchTasks = cb => {
  watch(ejsGlob, ejs);
  cb();
};
exports.watchTasks = watchTasks;
