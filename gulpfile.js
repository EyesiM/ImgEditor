var concat = require('gulp-concat')
var connect = require('gulp-connect')
var gulp = require('gulp')
var gutil = require('gulp-util')
var inject = require('gulp-inject')
var plumber = require('gulp-plumber')
var rimraf = require('rimraf')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var svgmin = require('gulp-svgmin')
var svgstore = require('gulp-svgstore')
var uglify = require('gulp-uglify')
var babel = require("gulp-babel");
// const browserify = require('browserify');
// const source = require('vinyl-source-stream');

//
// Variables
//
var srcDir = './src';
var distDir = './build';
var buildDir = './src/plugin/darkroom';
var isDebug = !gutil.env.prod;


var browserify = require('browserify'),
source = require('vinyl-source-stream'),
buffer = require('vinyl-buffer'),
standalonify = require('standalonify'),
argv = require('yargs').argv;

// gulp.task('build-js', function () {
//   return browserify({
//     entries: './src/build/js/photo.js'  //指定打包入口文件
//   })
//     .plugin(standalonify, {  //使打包后的js文件符合UMD规范并指定外部依赖包
//       name: 'FlareJ'
//     })
//     .bundle()  //合并打包
//     .pipe(source(getJsLibName()))  //将常规流转换为包含Stream的vinyl对象，并且重命名
//     .pipe(buffer())  //将vinyl对象内容中的Stream转换为Buffer
//     .pipe(gulp.dest('./build/'));  //输出打包后的文件
// });

// function getJsLibName() {
//   var libName = 'flarej.js';
//   if (argv.min) {  //按命令参数"--min"判断是否为压缩版
//     libName = 'flarej.min.js';
//   }

//   return libName;
// }

//
// Default
//
gulp.task('default', ['build'], function() {
  gulp.start('watch');
});

//
// Clean
//
gulp.task('clean', function(cb) {
  rimraf(distDir, cb);
});

//
// Build
//
gulp.task('build', ['clean'], function() {
  gulp.start('scripts', 'convertJS', 'styles');
});

//
// Watch
//
gulp.task('watch', ['server'], function() {
  gulp.watch(srcDir + '/plugin/**/*.js', ['scripts']);
  gulp.watch(srcDir + '/plugin/**/*.js', ['convertJS']);
  gulp.watch(srcDir + '/plugin/**/*.scss', ['styles']);
});

// //
// // Server
// //
gulp.task('server', function() {
  connect.server({
    root: './',
    port: 2222,
    livereload: false
  });
});

//
// Javascript
//
gulp.task('scripts', function () {
  var svgs = gulp.src(srcDir + '/plugin/darkroom/icons/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))
    // .pipe(gulp.dest(distDir));

  function fileContents (filePath, file) {
    return file.contents.toString();
  }

  var files = [
    srcDir + '/plugin/darkroom/js/core/bootstrap.js',
    srcDir + '/plugin/darkroom/js/core/darkroom.js',
    srcDir + '/plugin/darkroom/js/core/transformation.js',
    srcDir + '/plugin/darkroom/js/core/plugin.js',
    srcDir + '/plugin/darkroom/js/core/ui.js',
    srcDir + '/plugin/darkroom/js/core/utils.js',
    srcDir + '/plugin/darkroom/js/**/*.js',
    srcDir + '/plugin/darkroom/js/plugins/darkroom.history.js',
    srcDir + '/plugin/darkroom/js/plugins/darkroom.rotate.js',
    srcDir + '/plugin/darkroom/js/plugins/darkroom.crop.js',
    srcDir + '/plugin/darkroom/js/plugins/darkroom.save.js',
  ];

  gulp.src(files)
    .pipe(plumber())
    .pipe(isDebug ? sourcemaps.init() : gutil.noop())
      .pipe(concat('darkroom.js', {newLine: ';'}))
      .pipe(inject(svgs, { transform: fileContents }))
      .pipe(isDebug ? gutil.noop() : uglify({mangle: false}))
    .pipe(isDebug ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest('./temp'))
})

// 编译并压缩js
gulp.task('convertJS', function(){
  return gulp.src('./temp/darkroom.js')    //es6代码         
    .pipe(babel())
    .pipe(gulp.dest('./src/plugin/'))
})

//
// Stylesheet
//
gulp.task('styles', function () {
  gulp.src(srcDir + '/plugin/darkroom/css/darkroom.scss')
    .pipe(plumber())
    .pipe(isDebug ? sourcemaps.init() : gutil.noop())
      .pipe(sass({
        outputStyle: isDebug ? 'nested' : 'compressed'
      }))
    .pipe(isDebug ? sourcemaps.write() : gutil.noop())
    .pipe(gulp.dest(buildDir))
})
