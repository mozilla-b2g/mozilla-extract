var Promise = require('promise');

var fs = require('fs'),
    fsPath = require('path'),
    ncp = require('ncp').ncp,
    tmp = require('tmp'),
    debug = require('debug')('mozilla-extract');

/**
 * Extracts the firefox or b2g runtime from a compressed format.
 *
 * @param {String} source on the filesystem (compressed)
 * @param {String} target on the file system (destination decompressed)
 * @param {Function} callback [err, path].
 */
function extract(source, target, callback) {
  debug('request', source, target);

  var impl;
  if (source.split('.').pop() === 'dmg') {
    impl = require('./lib/extract_dmg');
  }

  if (source.substr(-7) === 'tar.bz2') {
    impl = require('./lib/extract_tarbz2');
  }

  if (!impl) {
    throw new Error('cannot handle extension for file: ' + source);
  }

  impl(source, target, callback);
}

module.exports = extract;
