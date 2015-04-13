var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  // Download the oddbaby
  download: function () {
    // Create a new folder sites/all/themes/
    // Download odd baby and put them in sites/all/themes/NAME (NO GIT FILES HERE!!)

  },

  rename: function () {
    // Rename oddbaby.info till NAME.info. And change the name inside the file aswell.
    // template.php - Replace the word "oddbaby" to NAME
    // preprocess.inc - Replace the word "oddbaby" to NAME
    // theme.inc - Replace the word "oddbaby" to NAME
    // js/main.js - Replace the word "oddbaby" to NAME
  },

  install: function () {
    // Run npm-install
  }

});