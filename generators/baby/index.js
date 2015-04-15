var generators = require('yeoman-generator');
var fse = require('fs-extra');
var git = require('nodegit');
var replace = require('replace');

var cwd = process.cwd();
var theme_name = cwd.split('/');
theme_name = theme_name[theme_name.length-1];

module.exports = generators.Base.extend({

  // Download the oddbaby
  download: function () {
    var done = this.async();
    var self = this;

    self.log('Downloading Oddbaby...');

    // Download odd baby and put it in sites/all/themes/NAME
    var options = {
      remoteCallbacks: {
        certificateCheck: function() {
          return 1;
        }
      }
    };

    git.Clone.clone('https://github.com/oddhill/oddbaby.git', './', options).then(function(repository) {
      // Remove .git
      fse.unlink('./.git', function() {
        self.log('Done');
        done();
      });
    });
  },

  rename: function () {
    var self = this;
    // Rename oddbaby.info till NAME.info.
    fse.move('oddbaby.info', theme_name + '.info', function(err) {
      if (!err) {
        self.log('Renamed oddbaby.info to ' + theme_name + '.info');

        // @TODO:
        // Rename Odd baby name in info file.

        // template.php - Replace the word "oddbaby" to NAME
        // preprocess.inc - Replace the word "oddbaby" to NAME
        // theme.inc - Replace the word "oddbaby" to NAME
        // js/main.js - Replace the word "oddbaby" to NAME

        var files = ['template.php', 'preprocess.inc', 'theme.inc', 'js/main.js'];

        for (name in files) {
          replace({
            regex: 'oddbaby',
            ignoreCase: true,
            replacement: theme_name,
            paths: [files[name]],
            silent: true
          });

          self.log('Replaced oddbaby in ' + files[name]);
        }
      }
    });
  },

  install: function () {
    // Run npm-install
    this.npmInstall();
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