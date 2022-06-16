import gulp from "gulp";
const { series, src, dest, watch } = gulp;

const srcDir = "./src/";
const distDir = "./dist/";

const copyGlob = "./src/**/*.+(htm|html)";
const copy = () => {
  return src(copyGlob, { base: srcDir }).pipe(dest(distDir));
};

import revisionTask from "@masatomakino/gulptask-revision";
const revision = revisionTask.generateTasks({
  distDir: distDir,
});

const watchTasks = (cb) => {
  watch(copyGlob, copy);
  cb();
};

const build_dev = copy;
const build_production = series(copy, revision);
const start_dev = series(build_dev, watchTasks);

export { build_dev, build_production, start_dev };
