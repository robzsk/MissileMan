'use strict';

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer');

gulp.task('default', function () {
  var electron = require('electron-connect').server.create();
  electron.start();
  gulp.watch(['index.js'], electron.restart);
  gulp.watch(['index.html', 'missileman.js', 'level.json', 'src/**/*'], electron.reload);
  gulp.task('reload:browser', function () {
    electron.restart();
  });

  gulp.task('reload:renderer', function () {
    electron.reload();
  });
});

gulp.task('build', function () {
  // TODO: don't ignore returns
  gulp.src('./assets/**')
    // .pipe(imagemin())
    .pipe(gulp.dest('./build/assets'));
  gulp.src('./level.json')
    .pipe(gulp.dest('./build'));
  return browserify('missileman.js')
    .bundle()
    .pipe(source('missileman.bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build/'));
});
