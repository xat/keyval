var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('minimize', function() {
    return gulp.src('keyval.js')
        .pipe(uglify())
        .pipe(concat('keyval.min.js'))
        .pipe(gulp.dest(''));
});

gulp.task('default', ['minimize']);