const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

function nodemonRun(cb) {
    var nodemonConfig = {
        script: './bin/www',
        ignore: ["./public/", "./src/"],
        ext: "js json ejs yaml"
    };
    nodemon(nodemonConfig);
    cb();
}

function copy(){
    return  gulp.src('public/**/*').pipe(gulp.dest('dist'));
}

function compileCSS() {
    return gulp.src('src/styl/*.styl')
            .pipe(sourcemaps.init())
            .pipe(stylus({
                compress: true
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/css'));
}

function compileMainJS() {
    return  gulp.src('src/js/partial/*.js')
                .pipe(sourcemaps.init())
                .pipe(concat('main.js'))               
                .pipe(babel({
                    presets: ['@babel/env']
                }))        
                .pipe(uglify())            
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('dist/js'));
}

function compileDepJS() {
    return  gulp.src('src/js/dependencies/*.js')
                .pipe(sourcemaps.init())
                .pipe(concat('dependencies.js'))                     
                .pipe(uglify())            
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('dist/js'));  
}

var preprocess = gulp.parallel(copy, compileCSS, compileMainJS, compileDepJS);

gulp.watch('src/css/*.styl', compileCSS);
gulp.watch('src/js/partial/*.js', compileMainJS);
gulp.watch('src/js/dependencies/*.js', compileDepJS);

exports.start = gulp.series(preprocess, nodemonRun);