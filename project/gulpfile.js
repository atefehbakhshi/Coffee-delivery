"use strict";
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
function compileSass(done) {
  src("assets/style/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("assets/style/css"));
  done();
}

function watchSass() {
  watch("assets/style/scss/*.scss", compileSass);
}

exports.default = series(compileSass, watchSass);
