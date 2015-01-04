var gulp = require('gulp'),
    fs = require('fs'),
    path = require('path'),
    del = require('del'),
    md5 = require('MD5'),
    wrap = require('gulp-wrap'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    gulpTemplate = require('gulp-template'),
    fileSort = require('gulp-angular-filesort'),
    templateCache = require('gulp-angular-templatecache'),
    webserver = require('gulp-webserver');

var paths = {
    appScripts:    ['app/app.js', 'app/**/*.js'],
    appTemplates:  ['app/**/*.tpl.html'],
    appStyles:  ['app/styles/**/*.scss'],

    vendorScripts: [
    // Specify minified versions of vendor scripts
        'bower_modules/jquery/dist/jquery.min.js',
        'bower_modules/lodash/dist/lodash.min.js',
        'bower_modules/angular/angular.min.js',
        'bower_modules/angular-ui-router/release/angular-ui-router.min.js',
    ],
    indexHtml: 'app/index.html',
    tmp:       'tmp/',
    build:     'build/',
};

// Clean the build and temp directories
gulp.task('clean', function (cb) {
  del([].concat(paths.tmp, paths.build), cb);
});

// Compile Angular templates into a JS module
gulp.task('templates', function (cb) {
  return gulp.src(paths.appTemplates)
      .pipe(templateCache())
      .pipe(wrap('angular.module("templates", []); <%= contents %>'))
      .pipe(gulp.dest(paths.tmp));
});

// Concatenate and minify all app scripts and templates into app.js
gulp.task('scripts-app', ['templates'],  function() {
  return gulp.src([].concat(paths.tmp+'templates.js', paths.appScripts))
      .pipe(fileSort())
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('app.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.build));
});

// Concatenate all vendor scripts
gulp.task('scripts-vendor', function() {
  return gulp.src([].concat(paths.vendorScripts))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest(paths.build));
});

// Concatenate all Application styles
gulp.task('styles-app', function () {
    gulp.src(paths.appStyles)
        .pipe(sass())
        .pipe(concat('styles/app.css'))
        .pipe(gulp.dest(paths.build));
});


// Create index.html bootstrap file
gulp.task('index', ['scripts-vendor', 'scripts-app', 'styles-app'], function() {
    function renameFile(filename) {
        var path = paths.build+filename;
        if (fs.existsSync(path)) {
            var hash = md5(fs.readFileSync(path, 'utf8')).substring(0,10),
                newFilename = filename.substring(0,filename.lastIndexOf('.'))
                    + '_' + hash + filename.substring(filename.lastIndexOf('.')),
                newPath = paths.build+newFilename;
            fs.renameSync(path, newPath);
            return newFilename;
        }
        // If file did not exist, return original filename
        return filename;
    }

    var manifest = {
        vendorCss: renameFile('styles/vendor.css'),
        appCss: renameFile('styles/app.css'),
        vendorJs: renameFile('vendor.js'),
        appJs: renameFile('app.js')
    };

    return gulp.src(paths.indexHtml)
        .pipe(gulpTemplate(manifest))
        .pipe(gulp.dest(paths.build));
});


// Watch for file changes and execute appropriate tasks
gulp.task('watch', function(){
  gulp.watch([].concat(paths.appScripts, paths.appTemplates), ['scripts-app']);
  gulp.watch([].concat(paths.vendorScripts), ['scripts-vendor']);
  gulp.watch([].concat(paths.appStyles), ['styles-app']);
});


gulp.task('serve', ['build'], function() {
  gulp.src(path.resolve(paths.build))
      .pipe(webserver({
        port: 4200,
        livereload: true,
        //directoryListing: true,
        open: true,
        proxies: [
          {source: '/api', target: 'http://127.0.0.1:8000/api' },
          {source: '/static', target: 'http://127.0.0.1:8000/static' }
        ]
      }));
});


// Build application
gulp.task('build', ['index']);

// Gulp default task
gulp.task('default', ['serve', 'watch']);
