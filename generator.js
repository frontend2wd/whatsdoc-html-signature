const config = require('./config.json')
const path = require('path')
const staticFile = require('./data/static.json')
const members = require('./data/users.json')
const fs = require('fs')
const ejs = require('ejs')
const minify = require('html-minifier').minify

const run = async () => {
  const statics = {}
  //   const fs = require('fs').promises
  const prefix = 'data:image/jpeg;base64,'
  const fileTemplate = await fs.promises.readFile(path.join(__dirname, './template/main.ejs'), { encoding: 'utf8' })
  // const fileTemplate = await fs.promises.readFile(path.join(__dirname, './template/new-template.ejs'), { encoding: 'utf8' })
  const styles = fs.readFileSync(path.join(__dirname, './template/style.css')).toString()

  for (itm of members) {
    // const avatarPath = path.join(__dirname, '/data/avatars/', `${itm.name}.jpg`)
    // const avatar = await await fs.promises.readFile(avatarPath, { encoding: 'base64' })
    // const avatarString = `${prefix}${avatar}`
    const rendered = ejs.render(fileTemplate, {
      //   ...statics,
      //   avatar: avatarString,
      styles: styles,
      user: itm,
      config: config,
    })
    const fileUserPath = path.join(__dirname, 'dist', `${itm.name}.html`)

    const result = minify(rendered, {
      removeAttributeQuotes: true,
      caseSensitive: true,
      minifyCSS: true,
      minifyURLs: true,
      quoteCharacter: true,
      removeEmptyAttributes: true,
      removeEmptyElements: true,
      useShortDoctype: true,
      html5: true,
      collapseWhitespace: true,
    })
    console.log(`${itm.name} : ${result.length}`)
    fs.promises.writeFile(fileUserPath, result)
  }
  // render  index
  const indexTemplate = await fs.promises.readFile(path.join(__dirname, './template/index.ejs'), { encoding: 'utf8' })
  const renderedUser = ejs.render(indexTemplate, {
    users: members,
  })
  fs.promises.writeFile(path.join(__dirname, './dist/index.html'), renderedUser)
}

// retutrn
run()
