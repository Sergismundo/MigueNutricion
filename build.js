const pug = require('pug')
const glob = require('glob')
const fs = require('fs-extra')
const sass = require('sass')

const publicSass = 'src/**/*.sass'
const publicPages = 'src/**/*.pug'
const privateComponents = 'src/components/**/*'

const sassFiles = glob.sync(publicSass, { ignore: privateComponents })
const pageFiles = glob.sync(publicPages, { ignore: privateComponents })
const otherFiles = glob.sync('src/**/*', { ignore: [publicSass, publicPages, privateComponents] })

fs.emptyDirSync('dist')

sassFiles.forEach(path => {
  const fileContent = sass.renderSync({ file: path }).css.toString()
  const destination = toDestPath(path, 'sass', 'css')
  fs.outputFileSync(destination, fileContent)
})

pageFiles.forEach(path => {
  const fileContent = pug.renderFile(path, { basedir: 'src' })
  const destination = toDestPath(path, 'pug', 'html')
  fs.outputFileSync(destination, fileContent)
})

otherFiles.forEach(path => {
  fs.copySync(path, path.replace('src', 'dist'))
})

function toDestPath(path, originExtension, destExtension) {
  return path.replace('src', 'dist').replace('pages', '').replace(originExtension, destExtension)
}
