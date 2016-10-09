// Include Gulp
var gulp = require('gulp');

// Include plugins
var plugins = require("gulp-load-plugins")({
	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
	replaceString: /\bgulp[\-.]/
});

// Gulp plumber error handler
var onError = function(err) {
	console.log(err);
}

// Default tasks
gulp.task('default', ['images', 'jshint', 'scripts', 'styles', 'fonts', 'watch']);

gulp.task('jshint', function() {

	var jsSrc = './src/scripts/*.js';

    return gulp.src(jsSrc)
    .pipe(plugins.plumber({
        errorHandler: onError
    }))
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.notify({ message: 'JS Hinting task complete' }));
});

// Compress and combine scripts
gulp.task('scripts', function() {

	var jsSrc = ['./src/scripts/*.js'],
		jsDst = './public/js';

	return gulp.src(plugins.mainBowerFiles().concat(jsSrc))
		.pipe(plugins.plumber({
	            errorHandler: onError
	        }))
		.pipe(plugins.filter('**/*.js'))
 		.pipe(plugins.concat('main.js'))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(jsDst))
        .pipe(plugins.notify({ message: 'Scripts task complete' }))
        .pipe(plugins.livereload());		

});

// Compress and combine scripts
gulp.task('styles', function() {

	var cssSrc = ['./src/styles/*.css'],
		cssDst = './public/css';

	return gulp.src(plugins.mainBowerFiles().concat(cssSrc))
		.pipe(plugins.plumber({
	            errorHandler: onError
	        }))
		.pipe(plugins.filter('**/*.css'))
		.pipe(plugins.order([
		]))
		.pipe(plugins.concat('main.css'))
		//.pipe(plugins.uglify())
		.pipe(gulp.dest(cssDst))
        .pipe(plugins.notify({ message: 'Styles task complete' }))
        .pipe(plugins.livereload());

});

// Font awesome icons
gulp.task('fonts', function() {
    var fontsDst = './public/fonts';

	return gulp.src(plugins.mainBowerFiles())
		.pipe(plugins.plumber({
	            errorHandler: onError
	        }))
		.pipe(plugins.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe(plugins.flatten())
		.pipe(gulp.dest(fontsDst))
        .pipe(plugins.notify({ message: 'Fonts task complete' }))
        .pipe(plugins.livereload());

});

// Minify images
gulp.task('images', function() {
    var imgSrc = './src/images/*',
        imgDst = './public/img';

    return gulp.src(imgSrc)
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.changed(imgDst))
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(imgDst))
        .pipe(plugins.notify({ message: 'Images task complete' }))
        .pipe(plugins.livereload());
});

// This handles watching and running tasks as well as telling our LiveReload server to refresh things
gulp.task('watch', function() {
	// Check for modifications in particular directories
	plugins.livereload.listen();

	// Whenever a stylesheet is changed, recompile
	gulp.watch('./src/styles/**/*.css', ['styles']);

	// If user-developed Javascript is modified, re-run our hinter and scripts tasks
	gulp.watch('./src/scripts/**/*.js', ['jshint', 'scripts']);

	// If an image is modified, run our images task to compress images
	gulp.watch('./src/images/**/*', ['images']);

	// Watch bower components
	gulp.watch(plugins.mainBowerFiles(), ['scripts', 'styles', 'fonts']);

});