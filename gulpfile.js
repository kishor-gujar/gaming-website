var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var gulpFlatmap = require('gulp-flatmap');

var pkg = require('./package.json');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function() {
    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('app/vendor/bootstrap'));

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
    .pipe(gulp.dest('app/vendor/jquery'));

    // font-awesome
    gulp.src([
        './node_modules/font-awesome/**/*',
    ])
    .pipe(gulp.dest('app/vendor/font-awesome'));

    // npm install slick-carousel
    gulp.src([
        './node_modules/slick-carousel/slick/**/*',
    ])
    .pipe(gulp.dest('app/vendor/slick-carousel'));

})


gulp.task('sass', function () {
    return gulp.src("app/scss/*.scss")
     .pipe(gulpFlatmap(function (stream) {  // the stream contains a single file 
        return stream
           .pipe(sourcemaps.init())
           .pipe(sass())
           .on('error', sass.logError)
           .pipe(sourcemaps.write('./maps'))
     }))
     .pipe(gulp.dest('app/css'))
     .pipe(browserSync.stream());
   });


// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'vendor']);