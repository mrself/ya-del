var gulp = require('gulp'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	browserSync = require('browser-sync').create(),
	source = require('vinyl-source-stream'),
	watch = require('gulp-watch'),
	bundleLogger = require('./gulp-utils/bundleLogger');

var outputFile = 'app.js';
gulp.task('watchify', function() {
	var bundler = browserify({
			cache: {}, packageCache: {}, fullPaths: false,
			entries: outputFile,
			dest: './test/' + outputFile
		}),
		watcher = watchify(bundler),
		bundle = function() {
			bundleLogger.start(outputFile);
			return watcher
				.bundle()
				.pipe(source(outputFile))
				.pipe(gulp.dest('./test'))
				.on('end', function() {
					bundleLogger.end(outputFile);
					setTimeout(browserSync.reload, 1500);
				});
		};

	watcher.on('update', bundle);
	bundleLogger.watch(outputFile);
	return bundle();

});
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: './test'
		},
		files: ['./test/*', 'del.js'],
		open: false
	});
});
// gulp.task('watch', function() {
// 	watch(['./test/*', 'del.js'], function() {
// 		browserSync.reload();
// 	});
// });
gulp.task('default', ['watchify', 'browser-sync']);