var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  templateCache = require('gulp-angular-templatecache');

var paths = {
  appScripts:    ['app/app.js', 'app/**/*.js'],
  appTemplates:  ['app/**/*.tpl.html'],
  vendorScripts: [
    // Specify minified versions of vendor scripts
    'bower_modules/jquery/dist/jquery.min.js',
    'bower_modules/angular/angular.min.js',
    'bower_modules/angular-ui-router/release/angular-ui-router.min.js',
  ],
  tmp:   'tmp/',
  build: 'build/'
};

gulp.task('templates', function (cb) {
  return gulp.src(paths.appTemplates)
    .pipe(templateCache())
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('scripts-app', ['templates'],  function() {
  return gulp.src([].concat(paths.tmp+'templates.js', paths.appScripts))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('scripts-vendor', function() {
  return gulp.src([].concat(paths.vendorScripts))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.build));
});

gulp.task('default', ['scripts-app', 'scripts-vendor']);
