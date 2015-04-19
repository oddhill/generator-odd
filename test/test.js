var helpers = require('yeoman-generator').test;
var fse = require('fs-extra');
var path = require('path');
var assert = require('yeoman-generator').assert;

describe('generator-odd', function () {

  describe('When generating Oddbaby', function () {

    before(function (done) {
      this.timeout(10000);
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

  });

  describe('When generating Odddrupal', function () {

    before(function (done) {
      this.timeout(0);
      // Run the generator
      helpers.run(path.join(__dirname, '../generators/drupal'))
        .inDir(path.join(__dirname, './tmp'))
        .on('end', function () {
          done();
        });
    });

    it('Clone Odddrupal', function () {
      assert.file(__dirname + '/tmp/index.php');
    });

    it('Should remove remote reference', function () {
      return false;
    });

    it('Rename 7.x to master', function () {
      return false;
    });

    it('Should create .htaccess file', function () {
      return false;
    });

    it('Should create settings.local.php file', function () {
      return false;
    });

    it('Should change permission on files dir', function () {
      return false;
    });

  });

});