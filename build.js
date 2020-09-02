const pug = require('pug');
const glob = require('glob');
const fs = require('fs-extra');
const sass = require('sass');

const sassFiles = glob.sync('src/**/*.sass');
const pageFiles = glob.sync('src/pages/**/*.pug');

fs.emptyDirSync('dist')

sassFiles.forEach(path => {
    const fileContent = sass.renderSync({file: path}).css.toString()
    const destination = toDestPath(path, 'sass', 'css')
    fs.outputFileSync(destination, fileContent)
})

pageFiles.forEach(path => {
    const fileContent = pug.renderFile(path, { basedir: 'src' })
    const destination = toDestPath(path, 'pug', 'html')
    fs.outputFileSync(destination, fileContent)
})

function toDestPath(path, originExtension, destExtension) {
    return path.replace('src', 'dist').replace('pages', '').replace(originExtension, destExtension)
}
