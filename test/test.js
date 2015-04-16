var helpers = require('yeoman-generator').test;
var fse = require('fs-extra');
var path = require('path');
var assert = require('yeoman-generator').assert;

describe('generator-odd', function () {

  describe('When generating Oddbaby', function () {

    before(function (done) {
      // Run the generator
      helpers.run(path.join(__dirname, '../generators/baby'))
        .inDir(path.join(__dirname, './tmp'))
        .on('end', function () {
          done();
        });
    });

    it('Should clone Oddbaby', function () {
      assert.fileContent(__dirname + '/tmp/package.json', '"name": "oddbaby"');
    });

    it('Remove the git repository', function () {
      assert.noFile(__dirname + '/tmp/.git');
    });

    it('Should rename oddbaby.info', function () {
      assert.file(path.join(__dirname, './tmp/tmp.info'));
    });

    it('Should replace the word "oddbaby" in various files', function () {
      var files = ['template.php', 'preprocess.inc', 'theme.inc', 'js/main.js'];
      for (file in files) {
        assert.noFileContent(path.join(__dirname, './tmp/' + files[file]), 'oddbaby');
      }
    });

    after(function () {
      process.exit();
    });

  });

});