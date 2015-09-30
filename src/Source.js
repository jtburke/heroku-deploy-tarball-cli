var fs = require('fs');
var request = require('request-promise');
var Promise = require('bluebird');
var Logger = require('./Logger');

/**
 * @param {{}} options
 * @param {string} options.app
 * @param {string} options.username
 * @param {string} options.password
 * @param {string} options.tarball
 * @constructor
 */
function Source(options) {
  function create() {
    return new Promise(function (resolve, reject) {
      Logger.log('Create Source - creating...');
      request
        .post({
          url: 'https://api.heroku.com/apps/' + options.app + '/sources',
          headers: {
            'Accept': 'application/vnd.heroku+json; version=3'
          },
          auth: {
            username: options.username,
            password: options.password
          }
        })
        .then(function (body) {
          var source = JSON.parse(body);

          Logger.ok('\u2714 success: ' + source.source_blob.get_url);

          resolve({
            put_url: source.source_blob.put_url,
            get_url: source.source_blob.get_url
          });
        })
        .catch(function (e) {
          Logger.error('\u2718 error');
          reject(e);
        });
    });
  }

  function upload(urls) {
    Logger.log('Upload - uploading...');
    return new Promise(function (resolve, reject) {
      fs.readFile(options.tarball, function (err, data) {
        if (err) {
          reject(err);
        }

        request
          .put({
            url: urls.put_url,
            body: data,
            headers: {
              'Content-type': ''
            }
          })
          .then(function () {
            Logger.ok('\u2714 success ' + urls.get_url);
            resolve(urls.get_url);
          })
          .catch(function (e) {
            Logger.ok('\u2718 failed');
            reject(e);
          });
      });
    });
  }

  this.upload = function () {
    return new Promise(function (resolve, reject) {
      create()
        .then(upload)
        .then(function (uploadUrl) {
          resolve(uploadUrl);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  }
}

module.exports = Source;