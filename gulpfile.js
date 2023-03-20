var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass')(require('sass'));

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/assets/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/assets/css"))
        .pipe(browserSync.stream());
});

// Move the javascript files into our /src/assets/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest("src/assets/js"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series('sass', function() {

    browserSync.init({
        server: "./src"  
    });

    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss', 'src/assets/scss/*.scss'], gulp.series('sass'));
    gulp.watch("src/*.html").on('change', browserSync.reload); 
    gulp.watch("src/assets/js/*.js").on('change', browserSync.reload); 
}));

//Move Fonts Folder to src/assets/webfonts
gulp.task('fonts', () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*')
  .pipe(gulp.dest('src/assets/webfonts'));
});

//Move Font Awesome CSS to src/assets/css
gulp.task('fa', () => {
  return gulp.src('node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css')
  .pipe(gulp.dest('src/assets/css'));
});

gulp.task('default', gulp.parallel('js','serve','fonts','fa'));