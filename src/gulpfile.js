var gulp = require('gulp');
var less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({browsers: ["last 2 versions"]});
// var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');

// var autoReload = false;

// gulp.task('browserSync', function() {
// 	if (autoReload) {
// 		browserSync.init({
// 			proxy: "http://localhost/bbt-movie-collision-2017/"
// 		});
// 	}
// });

// gulp.task('reload', function() {
// 	if (autoReload)
// 		browserSync.reload();
// });

gulp.task('less', function() {
	gulp.src('../src/less/*.less')
    .pipe(less({
    	plugins: [autoprefix]
    }))
    .pipe(gulp.dest('../css'))
    .pipe(minifyCSS())
	.pipe(rename({ extname: ".min.css" }))
	.pipe(gulp.dest('../css'));
});

gulp.task('js', function() {
	gulp.src('../src/js/*.js')
	.pipe(gulp.dest('../js'))
	.pipe(uglify())
	.pipe(rename({ extname: ".min.js" }))
	.pipe(gulp.dest('../js'));
});

gulp.task('watch', function() {
	gulp.watch('../src/less/*.less', ['less']);
	gulp.watch('../src/js/*.js', ['js']);
});

gulp.task('default', ['less', 'js', 'watch']);