var generators = require('yeoman-generator')
var fse = require('fs-extra')
var path = require('path')

// Vars
var cwd = process.cwd()
var site_path

module.exports = generators.Base.extend({

  prompting: function () {
    var done = this.async()
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your site name',
      default: 'odddrupal'
    }, function (answers) {
      site_path = path.join(cwd, answers.name)
      done()
    })
  },

  // ## Clone odddrupal

  // Clone https://github.com/oddhill/odddrupal.git.
  // And rename origin to odddrupal.
  clone: function () {
    var self = this
    var done = this.async()

    self.log('Cloning odddrupal to ' + site_path + '...')

    // Clone odddrupal to cwd
    var clone = self.spawnCommand('git', ['clone', 'https://github.com/oddhill/odddrupal.git', site_path])
    clone.on('close', function () {
      // Remove origin remote ref
      var rmRemote = self.spawnCommand('git', ['remote', 'rm', 'origin'], {cwd: site_path})
      rmRemote.on('close', function (code) {
        if (!code) {
          self.log('Done')
        } else {
          self.log('Unable to remove origin remote reference. Code: ' + code)
        }
        // Continue
        done()
      })
    })
  },

  // Rename current branch to master
  createMaster: function () {
    var self = this
    var done = this.async()
    self.log('Renaming the 7.x branch to master...')
    // Rename current local branch to master
    var rename = self.spawnCommand('git', ['branch', '-m', '7.x', 'master'], {cwd: site_path})
    rename.on('close', function () {
      self.log('Done')
      done()
    })
  },

  // ## Install odddrupal

  // Copy .htaccess.default to .htaccess.
  htaccess: function () {
    var self = this
    var done = this.async()
    fse.copy(path.join(site_path, '.htaccess.default'), path.join(site_path, '.htaccess'), function (err) {
      if (!err) {
        self.log('Copied .htaccess.default to .htaccess')
        done()
      }
    })
  },

  // Copy sites/default/settings.local.php.default to settings.local.php.
  dbSettings: function () {
    var self = this
    var done = this.async()
    fse.copy(path.join(site_path, 'sites/default/settings.local.php.default'), path.join(site_path, 'sites/default/settings.local.php'), function (err) {
      if (!err) {
        self.log('Copied settings.local.php.default to settings.local.php')
        done()
      }
    })
  },

  // Make sure the files folder (sites/all/files) is 777.
  filesChmod: function () {
    var self = this
    var done = this.async()
    fse.ensureDir(path.join(site_path, 'sites/all/files'), function (err) {
      if (!err) {
        self.log('Created files dir')
        // Make sure files folder is 777
        fse.chmod(path.join(site_path, 'sites/all/files'), '777', function () {
          self.log('Changed permissions on files dir to 777.')

          // Continue
          done()
        })
      }
    })
  },

  end: function () {
    this.log('All done!')
  }

})
