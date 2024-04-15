import path from "path";
import gulp from "gulp";
import newer from "gulp-newer";
import sourceImport from "emcjs/_build_tools/sourceImport.js";

const __dirname = path.resolve();
const NODE_FOLDER = path.resolve(__dirname, "node_modules");
const OUT_PATH = path.resolve(__dirname, "editor/web/");
const SCRIPT_PATH = path.resolve(__dirname, "src");
const EMCJS_PATH = path.resolve(NODE_FOLDER, "emcjs/src");

const REBUILD = process.argv.indexOf("-rebuild") >= 0;

console.log({REBUILD});

/* JS START */
function copyJS(files, dest) {
    let res = gulp.src(files);
    if (!REBUILD) {
        res = res.pipe(newer(dest));
    }
    res = res.pipe(sourceImport());
    res = res.pipe(gulp.dest(dest));
    return res;
}

function copyJSEditors() {
    const FILES = [
        `${SCRIPT_PATH}/**/*.js`
    ];
    const DST = `${OUT_PATH}/JSEditors`;
    return copyJS(FILES, DST);
}

function copyEmcJS() {
    const FILES = [
        `${EMCJS_PATH}/**/*.js`,
        `!${EMCJS_PATH}/*.js`
    ];
    const DST = `${OUT_PATH}/emcJS`;
    return copyJS(FILES, DST);
}

function copyEmcJSCSS() {
    const FILES = [
        `${EMCJS_PATH}/_style/**/*.css`
    ];
    let res = gulp.src(FILES);
    if (!REBUILD) {
        res = res.pipe(newer(`${OUT_PATH}/emcJS/_style`));
    }
    res = res.pipe(gulp.dest(`${OUT_PATH}/emcJS/_style`));
    return res;
}

export const build = gulp.parallel(
    copyJSEditors,
    copyEmcJS,
    copyEmcJSCSS
);
