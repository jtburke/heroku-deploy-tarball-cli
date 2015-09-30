#!/usr/bin/env node

/**
 * Module dependencies.
 */

var path = require('path');
var program = require('commander');
var Source = require('./Source');
var Build = require('./Build');
var Credentials = require('./Credentials');

program
  .version('1.0.0')
  .option('-a, --app [my-heroku-slug]', 'App name')
  .option('-t, --tarball [file]', 'Tarball')
  .parse(process.argv);

var credentials = new Credentials('api.heroku.com');

var source = new Source({
  app: program.app,
  username: credentials.getUsername(),
  password: credentials.getPassword(),
  tarball: path.resolve(program.tarball),
});



source.upload().then(function (url) {
  var build = new Build({
    app: program.app,
    username: credentials.getUsername(),
    password: credentials.getPassword(),
    source: url
  });

  build.start();
});
