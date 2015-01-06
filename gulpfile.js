// Load vendor manifest, set paths to application sources and vendor assets
var vendor = require('./vendor.json');
var paths = {
    appScripts:    ['app/app.js', 'app/**/*.js'],
    appTemplates:  ['app/**/*.tpl.html'],
    appStyles:  ['app/styles/**/*.scss'],

    vendorScripts: vendor.scripts || [],
    vendorStyles: vendor.styles || [],
    vendorFonts: vendor.fonts || [],

    indexHtml: 'app/index.html',
    tmp:       'tmp/',
    build:     'build/',
};


// Dependencies
var gulp = require('gulp'),
    chalk = require('chalk'),
    argv = require('yargs').argv,
    gulpIf = require('gulp-if'),
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
    webserver = require('gulp-webserver'),
    stdout = process.stdout;


// Welcome message and usage instruction
stdout.write(chalk.underline('Atarnia ngBoilerplate Gulpfile\n\n'));
stdout.write('Available command line options are:\n');
stdout.write(chalk.bold('--production') + ' - boolean flag, which specifies a production build (uglified) \n');
stdout.write(chalk.bold('--proxy /api:http://127.0.0.1:8000/api') + ' - specifies URLs to proxy in the format ' +
chalk.green('sourceUrl:destinationUrl') + '.\nThe proxy option may be repeated multiple times for different proxies. \n\n');

stdout.write(chalk.green('Example usage:\n'))
stdout.write('$ gulp --production --proxy /api:http://127.0.0.1:8000/api ' +
'--proxy /static:http://127.0.0.1:8000/static\n\n');

if(!paths.vendorScripts.length) {
    stdout.write(chalk.yellow('Notice: Your vendor.json manifest seems to have no paths in the "scripts" array.\n'));
}


// ** TASKS **
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
    if(argv.production) {
        stdout.write(chalk.bold('Generating a production (uglified) build.\n'))
    }

    return gulp.src([].concat(paths.tmp+'templates.js', paths.appScripts))
        .pipe(fileSort())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(sourcemaps.init())
        .pipe(gulpIf(argv.production, uglify()))
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


// Concatenate all Vendor styles
gulp.task('styles-vendor', function () {
    gulp.src(paths.vendorStyles)
        .pipe(concat('styles/vendor.css'))
        .pipe(gulp.dest(paths.build));
});


// Copy fonts to the build directory
gulp.task('fonts', function () {
    gulp.src(paths.vendorFonts)
        .pipe(gulp.dest(paths.build + 'fonts'));
});


// Create index.html bootstrap file
gulp.task('index', ['scripts-vendor', 'scripts-app', 'styles-app', 'styles-vendor', 'fonts'], function() {
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


// Run development web server
gulp.task('serve', ['build'], function() {
    var proxies = [];
    if (argv.proxy) {
        [].concat(argv.proxy).forEach(function(proxy){
            var source = proxy.substring(0, proxy.indexOf(':')),
                target = proxy.substring(proxy.indexOf(':')+1);
            stdout.write(chalk.bold('Setting up proxy: ' + source + ' => ' + target +  '\n'))
            proxies.push({source: source, target: target });
        })
    }

    gulp.src(path.resolve(paths.build))
        .pipe(webserver({
            port: 4200,
            livereload: true,
            //open: true,
            proxies: proxies
        }));
});


// Build application
gulp.task('build', ['index']);


// Gulp default task
gulp.task('default', ['serve', 'watch']);
