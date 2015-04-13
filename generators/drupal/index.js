var generators = require('yeoman-generator');
var git = require('nodegit');
var fse = require('fs-extra');
var mysql = require('mysql');

// Vars
var repo = null;
var cwd = process.cwd();

module.exports = generators.Base.extend({

  // ## Clone odddrupal

  // Clone https://github.com/oddhill/odddrupal.git.
  // And rename origin to odddrupal.
  clone: function () {
    // Check if cwd is empty or not.
    fse.emptyDirSync(cwd, function(err) {
      console.log(err);
      if (err) {
        // quit
        console.error('Current dir not empty! Emergency, quits.');
        return;
      }
      else {
        console.log('Cloning odddrupal to ' + cwd + ' ...');
      }
    });

    // Clone odddrupal to cwd
    git.Clone.clone('https://github.com/oddhill/odddrupal', cwd, null).then(function(repository) {
      // Make sure we can use it later.
      repo = repository;

      // Remove remote
      git.Remote.delete(repo, 'origin');

      console.log('Cloned odddrupal into ' + cwd);
    });
  },

  // Rename current branch to master
  createMaster: function () {
    // Rename current local branch to master
    git.Branch.lookup(repo, '7.x', git.Branch.GIT_BRANCH_LOCAL).then(function(branchRef) {
      var signature = git.Signature.default(repo);
      git.Branch.move(branchRef, 'master', true, signature, null).then(function(reference) {
        console.log('Renamed the branch 7.x to master.');
      });
    });
  },

  // ## Install odddrupal

  // Copy .htaccess.default to .htaccess.
  htaccess: function () {
    fse.copy(cwd + '.htaccess.default', cwd + '.htaccess', function(err) {
      if (!err) {
        console.log('Copied .htaccess.default to .htaccess');
      }
    });
  },

  // Create a new mysql db.
  createDb: function () {
    // Connect to mysql
    var connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: ''
    });

    connection.connect();

    var db_name = cwd.split('/');
    db_name = db_name[db_name.length-1];

    connection.query('CREATE DATABASE ' + db_name, function (err) {
      if (!err) {
        console.log('Added a new database named ' + db_name + '.');
      }
    });

    connection.end();
  },

  // Copy sites/default/settings.local.php.default to settings.local.php.
  dbSettings: function () {
    fse.copy(cwd + 'sites/default/settings.local.php.default', cwd + 'sites/default/settings.local.php', function(err) {
      if (!err) {
        console.log('Copied settings.local.php.default to settings.local.php');

        // @TODO:
        // Add db settings to file.
      }
    });
  },

  // Make sure the files folder (sites/all/files) is 777.
  filesChmod: function () {
    fse.ensureDirSync(cwd + 'sites/all/files', function(err) {
      if (!err) {
        fse.chmodSync(cwd + 'sites/all/files', 777);
        console.log('Created files dir');
      }
    });
  }

});
