'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

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

gulp.task('default', ['serve']);
