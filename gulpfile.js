var gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache');

gulp.task('html', function () {
    gulp.src('app/**/*.tpl.html')
        .pipe(templateCache())
        .pipe(gulp.dest('build'));
});


gulp.task('default', ['html']);
