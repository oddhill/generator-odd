const generators = require('yeoman-generator')
const fse = require('fs-extra')
const replace = require('replace')
const path = require('path')

const cwd = process.cwd()
let theme_path = cwd
let theme_name

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments)
    this.argument('name', {type: String, required: false})
  },

  prompting: function () {
    let done = this.async()

    if (this.name) {
      theme_path = path.join(cwd, this.name)
      theme_name = this.name
      return done()
    }

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your theme name',
      default: 'oddbaby'
    }, function (answers) {
      theme_path = path.join(cwd, answers.name)
      theme_name = answers.name
      done()
    })
  },

  // Download oddbaby
  download: function () {
    let done = this.async()
    let self = this

    self.log('Downloading Oddbaby...')

    // @TODO:
    // - Get latest oddbaby-8 release from the api: /repos/:owner/:repo/releases/latest
    // - Download and extract the zip to public/themes

    self.log('Done')
    done()
  },

  renameFiles: function () {
    // @TODO:
    // - Rename oddbaby.* files.
    // - oddbaby.breakpoints.yml
    // - oddbaby.info.yml
    // - oddbaby.libraries.yml
    // - oddbaby.theme
  },

  renameFilesContent: function () {
    // @TODO:
    // - Rename `oddbaby` in oddbaby.info.yml
    // - Rename `oddbaby` in oddbaby.breakpoints.yml
    // - Rename `oddbaby` in oddbaby.theme
  },

  install: function () {
    // Run npm-install
    this.destinationRoot(theme_path)
    this.installDependencies({bower: false})
  },

  end: function () {
    this.log('All done!')
  }

})
