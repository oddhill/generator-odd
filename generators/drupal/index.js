var generators = require('yeoman-generator');
var fse = require('fs-extra');

// Vars
var cwd = process.cwd();

module.exports = generators.Base.extend({

  // ## Clone odddrupal

  // Clone https://github.com/oddhill/odddrupal.git.
  // And rename origin to odddrupal.
  clone: function () {
    var self = this;
    var done = this.async();

    // Check if cwd is empty or not.
    var files = fse.readdirSync(cwd);
    if (files.length > 0) {
      // quit
      self.log('Current dir not empty! Emergency, quits.');
      process.exit();
      return;
    }

    self.log('Cloning odddrupal to ' + cwd + '...');

    // Clone odddrupal to cwd
    var clone = self.spawnCommand('git', ['clone', 'https://github.com/oddhill/odddrupal.git', cwd]);
    clone.on('close', function () {
      // Remove origin remote ref
      var rmRemote = self.spawnCommand('git', ['remote', 'rm', 'origin'], {cwd: cwd});
      rmRemote.on('close', function (code) {
        if (!code) {
          self.log('Done');
        }
        else {
          self.log('Unable to remove origin remote reference. Code: ' + code);
        }
        // Continue
        done();
      });
    });
  },

  // Rename current branch to master
  createMaster: function () {
    var self = this;
    var done = this.async();
    self.log('Renaming the 7.x branch to master...');
    // Rename current local branch to master
    var rename = self.spawnCommand('git', ['branch', '-m', '7.x', 'master']);
    rename.on('close', function () {
      self.log('Done');
      done();
    });
  },

  // ## Install odddrupal

  // Copy .htaccess.default to .htaccess.
  htaccess: function () {
    var self = this;
    var done = this.async();
    fse.copy(cwd + '/.htaccess.default', cwd + '/.htaccess', function(err) {
      if (!err) {
        self.log('Copied .htaccess.default to .htaccess');
        done();
      }
    });
  },

  // Copy sites/default/settings.local.php.default to settings.local.php.
  dbSettings: function () {
    var self = this;
    var done = this.async();
    fse.copy(cwd + '/sites/default/settings.local.php.default', cwd + '/sites/default/settings.local.php', function(err) {
      if (!err) {
        self.log('Copied settings.local.php.default to settings.local.php');

        done();
      }
    });
  },

  // Make sure the files folder (sites/all/files) is 777.
  filesChmod: function () {
    var self = this;
    var done = this.async();
    fse.ensureDir(cwd + '/sites/all/files', function(err) {
      if (!err) {
        fse.chmodSync(cwd + '/sites/all/files', 777);
        self.log('Created files dir');

        // Continue
        done();
      }
    });
  },

  end: function () {
    this.log('All done!');
    
    // Exit the process
    // This needs to be done because of a bug in the nodegit lib.
    // The nodegit process never exits..
    // https://github.com/nodegit/nodegit/issues/497
    process.exit();
  }

});
