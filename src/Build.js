var request = require('request-promise');
var Promise = require('bluebird');
var Logger = require('./Logger');
var Chance = require('chance');
var through = require('through');

/**
 * @param {{}} options
 * @param {string} options.app
 * @param {string} options.username
 * @param {string} options.password
 * @param {string} options.source
 * @constructor
 */
function Build(options) {

  function create() {
    Logger.log('Build - creating...');

    return new Promise(function (resolve, reject) {
      request.post({
        url: 'https://api.heroku.com/apps/' + options.app + '/builds',
        headers: {
          'Accept': 'application/vnd.heroku+json; version=3'
        },
        auth: {
          username: options.username,
          password: options.password
        },
        json: true,
        body: {
          source_blob: {
            url: options.source,
            version: new Chance().hash()
          }
        }
      })
      .then(function (build) {
        Logger.ok(' \u2714 success');
        resolve(build.output_stream_url);
      })
      .catch(function (e) {
        Logger.error(' \u2718failed');
        reject(e);
      });
    });
  }

  function output(output_stream_url) {
    Logger.log('Build - outputting... ' + output_stream_url);

    request.get({
      url: output_stream_url,
      headers: {
        'Accept': 'application/vnd.heroku+json; version=3'
      },
      auth: {
        username: options.username,
        password: options.password
      },
      json: true
    }).pipe(through(function (data) {
      process.stdout.write(data);
    }));
  }

  this.start = function () {
    return new Promise(function (resolve, reject) {
      create()
        .then(function (output_stream_url) {
          output(output_stream_url);
          resolve();
        })
        .catch(function (e) {
            reject(e);
        });
    });
  };
}

module.exports = Build;