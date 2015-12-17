'use strict'

const generators = require('yeoman-generator')
const replace = require('replace')
const path = require('path')
const got = require('got')
const semver = require('semver')
const zlib = require('zlib')
const tar = require('tar')
const fs = require('fs')

const cwd = process.cwd()
let THEME_PATH = cwd
let THEME_NAME

module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments)
    this.argument('name', {type: String, required: false})
  },

  prompting: function () {
    let done = this.async()

    if (this.name) {
      THEME_PATH = path.join(cwd, this.name)
      THEME_NAME = this.name
      return done()
    }

    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your theme name',
      default: 'oddbaby'
    }, function (answers) {
      THEME_PATH = path.join(cwd, answers.name)
      THEME_NAME = answers.name
      done()
    })
  },

  // Download oddbaby
  download: function () {
    let done = this.async()
    let self = this

    self.log('Downloading Oddbaby...')

    // Get latest oddbaby-8 release from the api: /repos/:owner/:repo/releases/latest
    got('https://api.github.com/repos/oddhill/oddbaby-8/tags', { json: true, headers: { 'accept': 'application/vnd.github.v3+json' } })
      .then(function (res) {
        let versions = res.body.sort(function (a, b) {
          return semver.compare(b.name, a.name)
        })

        return versions[0].tarball_url
      })
      .then(function (tarURL) {
        // Download and extract the zip to public/themes
        got.stream(tarURL)
          .pipe(zlib.Unzip())
          .pipe(tar.Extract({ path: THEME_PATH, strip: 1 }))
          .on('end', function () {
            self.log('Done')
            done()
          })
      })
  },

  renameFilesContent: function () {
    // Replace oddbaby in the following files
    let files = ['oddbaby.breakpoints.yml', 'oddbaby.info.yml', 'oddbaby.theme']
    files.map(function (file, index) {
      files[index] = path.join(THEME_PATH, file)
    })

    replace({
      regex: 'oddbaby',
      replacement: THEME_NAME,
      paths: files,
      silent: true
    })
  },

  renameFiles: function () {
    // Rename oddbaby.* files.
    let files = ['oddbaby.breakpoints.yml', 'oddbaby.info.yml', 'oddbaby.libraries.yml', 'oddbaby.theme']
    files.map(function (file) {
      fs.renameSync(path.join(THEME_PATH, file), path.join(THEME_PATH, file.replace(/[^.]*/, THEME_NAME)))
    })
  },

  install: function () {
    // Run npm-install
    this.destinationRoot(THEME_PATH)
    this.installDependencies({bower: false})
  },

  end: function () {
    this.log('All done!')
  }

})
