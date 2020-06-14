// 实现这个项目的构建任务
const { src, dest, watch, parallel, series } = require("gulp");
const BrowserSync = require("browser-sync");
const gulpSwig = require("gulp-swig");
const gulpSass = require("gulp-sass");
const gulpBabel = require("gulp-babel");
const del = require("del");
const gulpImagemin = require("gulp-imagemin");
const gulpHtmlmin = require("gulp-htmlmin");
const gulpCleanCss = require("gulp-clean-css");
const gulpUglify = require("gulp-uglify");
const gulpIf = require("gulp-if");
const gulpUseref = require("gulp-useref");

const { data } = require("./page.config");

// 路径定义
const config = {
  src: "src",
  dist: "dist",
  temp: "temp",
  public: "public",
  path: {
    page: "**/*.html",
    style: "assets/styles/**/*.scss",
    script: "assets/scripts/**/*.js",
    image: "assets/images/**/*.{jpg,jpeg,png,gif,svg}",
    font: "assets/fonts/**/*.{eot,svg,ttf,woff,woff2}",
  },
};
// 开发服务器
const server = BrowserSync.create();

const devServer = () => {
  // 监听源代码的修改，执行对应的编译任务
  watch(config.path.page, { cwd: config.src }, page);
  watch(config.path.style, { cwd: config.src }, style);
  watch(config.path.script, { cwd: config.src }, script);

  // 监听src下静态文件, public的静态文件的变动，重载到本地服务器
  watch([config.path.image, config.path.font], {
    cwd: config.src,
  });
  watch("**", { cwd: config.public }, server.reload);

  server.init({
    open: true,
    notify: false,
    server: {
      baseDir: [config.temp, config.src, config.public],
      routes: {
        "/node_modules": "node_modules", // 路由映射
      },
    },
  });
};

// HTML模板编译
const page = () => {
  return src(config.path.page, {
    base: config.src,
    cwd: config.src,
    ignore: ["{layouts,partials}/**"],
  })
    .pipe(gulpSwig({ defaults: { locals: data, cache: false } }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// scss模板编译
const style = () => {
  return src(config.path.style, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpSass({ outputStyle: "expanded" }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// js新特性编译
const script = () => {
  return src(config.path.script, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpBabel({ presets: [require("@babel/preset-env")] }))
    .pipe(dest(config.temp))
    .pipe(server.reload({ stream: true }));
};

// 根据压缩构建注释，处理引用，针对不同类型的资源进行压缩
const useref = () => {
  return src(config.path.page, {
    base: config.temp,
    cwd: config.temp,
  })
    .pipe(gulpUseref({ searchPath: [".", ".."] }))
    .pipe(gulpIf(/\.css$/, gulpCleanCss()))
    .pipe(gulpIf(/\.js$/, gulpUglify()))
    .pipe(
      gulpIf(
        /\.html$/,
        gulpHtmlmin({
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
        })
      )
    )
    .pipe(dest(config.dist));
};

// 图片压缩
const image = () => {
  return src(config.path.image, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpImagemin({}))
    .pipe(dest(config.dist));
};

// 字体处理
const font = () => {
  return src(config.path.font, {
    base: config.src,
    cwd: config.src,
  })
    .pipe(gulpImagemin({}))
    .pipe(dest(config.dist));
};

// public目录处理
const extra = () => {
  return src("**", { base: config.public, cwd: config.public })
    .pipe(gulpImagemin())
    .pipe(dest(config.dist));
};

// 目录清理
const cleanDev = () => {
  return del(config.temp);
};
const clean = () => {
  return del([config.dist, config.temp]);
};

// ===========================================================

// 组合任务定义
const compile = parallel(page, style, script);

// 开发环境编译任务
const serve = series(cleanDev, compile, devServer);

// 生产环境构建任务
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);

module.exports = {
  clean,
  serve,
  build,
};
