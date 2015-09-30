var chalk = require('chalk');
function Logger() {
  function log(message) {
    console.log(chalk.white('[heroku-deploy-tarball-cli] ') + message);
  }

  this.log = function (message) {
    log(message);
  };

  this.ok = function (message) {
    log(chalk.green(message));
  };

  this.error = function (message) {
    log(chalk.red(message));
  };
}

module.exports = new Logger();