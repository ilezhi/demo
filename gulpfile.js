var gulp = require('gulp');


gulp.task('copycss', function() {
  return gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
            .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('copyjs', function() {
  return gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js',
                    './node_modules/echarts/dist/echarts.min.js',
                  './node_modules/jquery/dist/jquery.min.js'])
            .pipe(gulp.dest('./public/javascripts'));
})

gulp.task('default', ['copycss', 'copyjs']);
