var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('default', function() {
  return gulp.src('./src/*.ts')
  .pipe(ts({
    target: "es5",
    module: "commonjs",
    declaration: false,
    noImplicitAny: false,
    removeComments: true,
    noLib: false
  }))
  .pipe(gulp.dest('./dist/'));
});
