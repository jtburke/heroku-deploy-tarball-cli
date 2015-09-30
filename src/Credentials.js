var netrc = require('node-netrc');

function Credentials(machine) {
  var nrc = netrc(machine);

  this.getUsername = function getUsername() {
    return nrc.login;
  };

  this.getPassword = function getPassword() {
    return nrc.password;
  };
}

module.exports = Credentials;