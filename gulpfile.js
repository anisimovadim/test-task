const { src, dest } = require('gulp');
const gulp = require('gulp');
//gulp.src('path', {dot:true})
const browser_sync = require('browser-sync').create();
const del = require('del');
const scss = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const clean_css = require('gulp-clean-css');
const rename = require('gulp-rename');
//let bootstrap = require('bootstrap');
const fileinclude = require('gulp-file-include');
const uglify = require('gulp-uglify-es').default;
const buble = require('gulp-buble');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const ignore = require('gulp-ignore');
require('dotenv').config();

let project_folder="assets";
let source_folder=".";

let path = {
	build: {
		index:project_folder+"/",
		css:project_folder+"/css/",
		js:project_folder+"/js/",
		img:project_folder+"/img/",
        libs:project_folder+"/libs",
        fonts:project_folder+"/fonts"
	},
	src: {
		index:source_folder+"/*.{php,html,htaccess,ttf}",
		css:source_folder+"/scss/style.scss",
		js:source_folder+"/js/*.js",
		img:source_folder+"/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
        libs:source_folder+"/libs/**/*",
        fonts:source_folder+"/fonts/*"
	},
	watch: {
		index:source_folder+"/**/*.php",
		css:source_folder+"/scss/**/*.scss",
		js:source_folder+"/js/**/*.js",
		img:source_folder+"/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}",
	},
	clean: "./" + project_folder + "/",
}
function browserSync(){
	browser_sync.init({
		// proxy: "limits.local",
		// port: 3000,
		// notify: false
		server:{
			baseDir:'./' + project_folder
		}
	})
}
function index() {
	return src(path.src.index, {base: source_folder+'/'})
		.pipe(dest(path.build.index))
		.pipe(browser_sync.reload({stream:true}));
}

function clean () {
    return del(path.clean);
}

function img() {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(browser_sync.reload({stream:true}));
}
function libs() {
	return src(path.src.libs)
                .pipe(dest(path.build.libs))
		.pipe(browser_sync.reload({stream:true}));

}
function fonts() {
	return src(path.src.fonts)
                .pipe(dest(path.build.fonts))
		.pipe(browser_sync.reload({stream:true}));

}
function css() {
	return src(path.src.css)
                //.pipe(sourcemaps.init())
                .pipe(scss({
                    outputStyle:'expanded'
                }))
                .pipe(autoprefixer({
                    overrideBrowserslist:['last 5 versions'],
                    cascade: true
                }))
                .pipe(dest(path.build.css))
                .pipe(clean_css())
                //.pipe(sourcemaps.write())
                .pipe(rename({
                    extname:'.min.css'
                }))
                .pipe(dest(path.build.css))
		.pipe(browser_sync.reload({stream:true}));

}
function js() {
    if(!process.env.NODE_ENV || process.env.NODE_ENV == 'test') {
        return src(path.src.js)
                .pipe(ignore('*_prod.js*'))
                //.pipe(sourcemaps.init())
                .pipe(concat('script.js'))
                /*.pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                  }))*/
                .pipe(buble())
                .pipe(dest(path.build.js))
                .pipe(uglify())
                //.pipe(sourcemaps.write())
                .pipe(rename({
                    extname:'.min.js'
                }))
                .pipe(dest(path.build.js))
                .pipe(browser_sync.stream());
    } else if(process.env.NODE_ENV == 'production'){
        return src(path.src.js)
                .pipe(ignore('*_test.js*'))
                //.pipe(sourcemaps.init())
                .pipe(concat('script.js'))
                /*.pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                  }))*/
                .pipe(buble())
                .pipe(dest(path.build.js))
                .pipe(uglify())
                //.pipe(sourcemaps.write())

                .pipe(rename({
                    extname:'.min.js'
                }))
                .pipe(dest(path.build.js))
			.pipe(browser_sync.reload({stream:true}));

	}
}

function watchFiles(){
	/*gulp.watch([path.watch.index], index);*/
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.index], index);
}

let build = gulp.series(clean, gulp.parallel(css,js,img,index,libs,fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);



exports.index = index;
exports.libs = libs;
exports.fonts = fonts;
exports.css = css;
exports.js = js;
exports.img = img;
exports.build = build;
exports.watch = watch;
exports.default = watch;
