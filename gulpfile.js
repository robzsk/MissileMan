'use strict';

var gulp = require('gulp'),
  electron = require('electron-connect').server.create(),
  uglify = require('gulp-uglify'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer');

gulp.task('serve', function () {
  // Start browser process
  electron.start();

  gulp.watch('index.js', electron.restart);

  gulp.watch(['index.html', '*.js', 'scripts/*.js'], electron.reload);
});

gulp.task('reload:browser', function () {
  electron.restart();
});

gulp.task('reload:renderer', function () {
  electron.reload();
});

gulp.task('browserify', function () {
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

gulp.task('default', ['serve']);

gulp.task('build', ['browserify']);
