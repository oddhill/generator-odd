var generators = require('yeoman-generator')
var fse = require('fs-extra')
var replace = require('replace')
var path = require('path')

var cwd = process.cwd()
var theme_path = cwd
var theme_name

module.exports = generators.Base.extend({

  prompting: function () {
    var done = this.async()
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your theme name',
      default: 'oddbaby'
    }, function (answers) {
      theme_path = path.join(cwd, answers.name)
      theme_name = answers.name
      done()
    }.bind(this))
  },

  // Download the oddbaby
  download: function () {
    var done = this.async()
    var self = this

    self.log('Downloading Oddbaby...')

    // Download odd baby and put it in sites/all/themes/NAME
    var clone = self.spawnCommand('git', ['clone', 'https://github.com/oddhill/oddbaby.git', theme_path])
    clone.on('close', function () {
      // Remove .git
      fse.remove(path.join(theme_path, '.git'), function (err) {
        if (!err) {
          self.log('Done')
          done()
        }
      })
    })
  },

  rename: function () {
    var self = this
    // Rename oddbaby.info till NAME.info.
    fse.move(path.join(theme_path, 'oddbaby.info'), path.join(theme_path, theme_name + '.info'), function (err) {
      if (!err) {
        self.log('Renamed oddbaby.info to ' + theme_name + '.info')

        // Rename Odd baby name in info file.
        replace({
          regex: 'odd baby',
          ignoreCase: true,
          replacement: theme_name,
          paths: [path.join(theme_path, theme_name + '.info')],
          silent: true
        })

        // template.php - Replace the word "oddbaby" to NAME
        // preprocess.inc - Replace the word "oddbaby" to NAME
        // theme.inc - Replace the word "oddbaby" to NAME
        // js/main.js - Replace the word "oddbaby" to NAME

        var files = ['template.php', 'preprocess.inc', 'theme.inc', 'js/main.js']

        for (var name in files) {
          replace({
            regex: 'oddbaby',
            ignoreCase: true,
            replacement: theme_name,
            paths: [path.join(theme_path, files[name])],
            silent: true
          })

          self.log('Replaced oddbaby in ' + files[name])
        }
      }
    })
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
