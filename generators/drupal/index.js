var generators = require('yeoman-generator');
var git = require('nodegit');

module.exports = generators.Base.extend({

  // ## Clone odddrupal

  // REMOTE_URL
  // A remote url from a yo param!

  // Vars
  var repo = null;

  // Clone https://github.com/oddhill/odddrupal.git.
  // And rename origin to odddrupal.
  clone: function () {
    var cwd = process.cwd();
    // @todo
    // Check if cwd is empty or not.

    // Clone odddrupal to cwd
    git.Clone.clone('https://github.com/oddhill/odddrupal.git', cwd, null);

    // Rename origin
  },

  // Add your remote and name it origin.
  addRemote: function () {
    git.Remote.create(repo, REMOTE_URL, '');
  },

  // Publish odddrupal master on the new origin remote.
  // Add tracking between origin/master and the local master.
  publish: function () {

  },

  // Run some cleanup and remove odddrupal remote.
  cleanup: function () {

  },

  // ## Install odddrupal

  // Copy .htaccess.default to .htaccess.
  htaccess: function () {

  },

  // Create a new mysql db.
  createDb: function () {

  },

  // Copy sites/default/settings.local.php.default to settings.local.php.
  // Add db settings to file.
  dbSettings: function () {

  },

  // Make sure the files folder (sites/all/files) is 777.
  filesChmod: function () {

  }

});
