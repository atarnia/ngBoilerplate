var gulp = require('gulp'),
  del = require('del'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  gulpTemplate = require('gulp-template'),
  fileSort = require('gulp-angular-filesort');
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
  indexHtml: 'app/index.html',
  tmp:       'tmp/',
  build:     'build/',
};


gulp.task('clean', function (cb) {
  del([].concat(paths.tmp, paths.build), cb);
});

gulp.task('templates', function (cb) {
  return gulp.src(paths.appTemplates)
    .pipe(templateCache())
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('scripts-app', ['templates'],  function() {
  return gulp.src([].concat(paths.tmp+'templates.js', paths.appScripts))
    .pipe(fileSort())
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


gulp.task('index', function() {
  return gulp.src(paths.indexHtml)
    .pipe(gulpTemplate({
      vendorCss: 'vendor.css',
      appCss: 'app.css',
      vendorJs: 'vendor.js',
      appJs: 'app.js',
    }))
    .pipe(gulp.dest(paths.build))
});

gulp.task('watch', function(){
	gulp.watch([].concat(paths.appScripts, paths.appTemplates), ['scripts-app']);
	gulp.watch([].concat(paths.vendorScripts), ['scripts-vendor']);
});

gulp.task('default', ['scripts-vendor', 'scripts-app', 'index']);
