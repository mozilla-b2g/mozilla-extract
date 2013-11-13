var Promise = require('promise'),
    dmg = require('dmg'),
    firstDirectory = require('./first_directory'),
    debug = require('debug')('mozilla-extract:dmg');

// promise wrapped libaries
var mount = Promise.denodeify(dmg.mount);
var unmount = Promise.denodeify(dmg.unmount);
var ncp = Promise.denodeify(require('ncp'));

function unmountSlow(path) {
  return new Promise(function(resolve, reject) {
    process.nextTick(function() {
      unmount(path).then(resolve, reject);
    });
  });
}

function extract(dmgPath, target) {
  debug('extract', dmgPath, target);
  // local variable used for unmounting path
  var mountPath;
  function setMountPath(path) {
    return mountPath = path;
  }

  function copyToDestination(source) {
    return ncp(source, target);
  }

  // mount the path
  return mount(dmgPath).
    then(setMountPath).
    then(firstDirectory).
    then(copyToDestination).
    then(function() { return unmountSlow(mountPath); }).
    then(function() { return target; });
}

module.exports = Promise.nodeify(extract);
