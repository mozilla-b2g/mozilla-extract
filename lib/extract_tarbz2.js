var Promise = require('promise'),
    debug = require('debug')('mozilla-extract:tarbz2'),
    firstDirectory = require('./first_directory');

// promise wrapped apis
var exec = Promise.denodeify(require('child_process').exec);
var ncp = Promise.denodeify(require('ncp'));
var tmpDir = Promise.denodeify(require('tmp').dir);

function decompress(source, dest) {
  var command = ['tar', '-vxjf', source, '-C', dest];
  debug('untar', command);
  return exec(command.join(' '));
}

function extract(source, dest) {
  var workingDir;
  function setWorkingDir(dir) {
    debug('working dir', dir);
    return workingDir = dir;
  }

  debug('extract', source, dest);
  return tmpDir({ unsafeCleanup: true }).
    then(setWorkingDir).
    then(decompress.bind(this, source)).
    then(function() {
      return firstDirectory(workingDir);
    }).
    then(function(productDir) {
      return ncp(productDir, dest);
    }).
    then(function() { return dest });
}

module.exports = Promise.nodeify(extract);
