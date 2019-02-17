const gulp = require('gulp');
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const del = require('del');


// Clean
gulp.task('clean', () => {
	return del('./dist/'), del('./temp/');
});

// Run linting
gulp.task('tslint', () => {
    return gulp.src('src/**/*.ts')
        .pipe(tslint({ formatter: 'verbose' }))
        .pipe(tslint.report())
});

// Compile TypeScript
gulp.task('ts', () => {
	const tsProject = ts.createProject('tsconfig.json');
	return tsProject.src()
		.pipe(tsProject())
		.js
		.pipe(gulp.dest('dist'));
});

// Compile sass
gulp.task('sass', () => {
	return gulp.src('src/public/css/style.scss')
		.pipe(sass())
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/public/css'));
});

// Copy assets
gulp.task('assets', () => {
	return gulp.src('src/public/images/**/*.*')
		.pipe(gulp.dest('dist/public/images')),
	gulp.src('src/public/js/lib/*.js')
		.pipe(gulp.dest('dist/public/js/lib')),
	gulp.src('src/views/**/*.njk')
		.pipe(gulp.dest('dist/views'));
});

// Compress and copy javascript
gulp.task('js', () => {
	return gulp.src('src/public/js/*.js')
		.pipe(babel({ presets: ['env'] }))
		.pipe(uglify().on('error', e => { console.log(e) }))
		.pipe(gulp.dest('dist/public/js'));
});

// Run tasks
gulp.task('default', gulp.series(['clean', 'tslint', 'ts', 'sass', 'assets', 'js']));