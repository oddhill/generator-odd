var generators = require('yeoman-generator');
var git = require('nodegit');
var fse = require('fs-extra');
var mysql = require('mysql');
var exec = require('child_process').exec;

// Vars
var repo = null;
var cwd = process.cwd();

module.exports = generators.Base.extend({

  // ## Clone odddrupal

  // Clone https://github.com/oddhill/odddrupal.git.
  // And rename origin to odddrupal.
  clone: function () {
    var done = this.async();
    // Check if cwd is empty or not.
    var files = fse.readdirSync(cwd);
    if (files.length > 0) {
      // quit
      console.error('Current dir not empty! Emergency, quits.');
      return;
    }
    
    console.log('Cloning odddrupal to ' + cwd + '...');

    // Clone odddrupal to cwd
    var options = {
      remoteCallbacks: {
        certificateCheck: function() {
          return 1;
        }
      }
    };

    git.Clone.clone('https://github.com/oddhill/odddrupal.git', cwd, options).then(function(repository) {
      // Make sure we can use it later.
      repo = repository;

      // @TODO
      // The removal sohuld probably be done through nodegit, instead.

      // Remove origin remote ref
      var command = 'cd ' + cwd + ' && git remote rm origin';
      exec(command, function(err, stdout, stderr) {
        if (!err) {
          console.log('Done');
        }
        else {
          console.error('Unable to remove origin remote reference.');
        }

        // Continue
        done();
      });
    });
  },

  // Rename current branch to master
  createMaster: function () {
    var done = this.async();
    console.log('Renaming the 7.x branch to master...');
    // Rename current local branch to master
    git.Branch.lookup(repo, '7.x', git.Branch.BRANCH.LOCAL).then(function(branchRef) {
      var signature = git.Signature.default(repo);
      git.Branch.move(branchRef, 'master', 0, signature, 'Renamed 7.x to master').then(function(reference) {
        console.log('Done');
        done();
      });
    });
  },

  // ## Install odddrupal

  // Copy .htaccess.default to .htaccess.
  htaccess: function () {
    var done = this.async();
    fse.copy(cwd + '/.htaccess.default', cwd + '/.htaccess', function(err) {
      if (!err) {
        console.log('Copied .htaccess.default to .htaccess');
        done();
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
      else if (err.code == 'ER_DB_CREATE_EXISTS') {
        console.error('Db already exists');
      }
    });

    connection.end();
  },

  // Copy sites/default/settings.local.php.default to settings.local.php.
  dbSettings: function () {
    var done = this.async();
    fse.copy(cwd + '/sites/default/settings.local.php.default', cwd + '/sites/default/settings.local.php', function(err) {
      if (!err) {
        console.log('Copied settings.local.php.default to settings.local.php');

        done();

        // @TODO:
        // Add db settings to file.
      }
    });
  },

  // Make sure the files folder (sites/all/files) is 777.
  filesChmod: function () {
    var done = this.async();
    fse.ensureDir(cwd + '/sites/all/files', function(err) {
      if (!err) {
        fse.chmodSync(cwd + '/sites/all/files', 777);
        console.log('Created files dir');

        // Continue
        done();
      }
    });
  }

});
