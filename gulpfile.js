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
	gulp.watch(['index.html', 'missileman.js', 'src/**/*', 'assets/**'], electron.reload);
	gulp.task('reload:browser', function () {
		electron.restart();
	});

	gulp.task('reload:renderer', function () {
		electron.reload();
	});
});

gulp.task('build', function () {
	return browserify('missileman.js')
		.bundle()
		.pipe(source('missileman.bundle.js'))
		.pipe(buffer())
		// .pipe(uglify()) //does not work with ES6 template strings
		.pipe(gulp.dest('./'));
});
