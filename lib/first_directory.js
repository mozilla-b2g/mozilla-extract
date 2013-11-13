var Promise = require('promise'),
    fs = require('fs'),
    fsPath = require('path'),
    readdir = Promise.denodeify(fs.readdir),
    stat = Promise.denodeify(fs.stat),
    debug = require('debug')('mozilla-extract:first_directory');

function statWithPath(path) {
  return new Promise(function(resolve, reject) {
    stat(path).
      then(function(details) {
        details.path = path;
        resolve(details);
      }).
      then(null, reject);
  });
}

function statPaths(path, items) {
  return new Promise(function(resolve, reject) {
    items = items.filter(function(item) {
      return !!item.trim();
    });

    debug('stats on', items);
    var promises = items.map(function(item) {
      return statWithPath(fsPath.join(path, item));
    });

    return Promise.all(promises).
                   then(resolve, reject);
  });
}

function chooseDirectory(items) {
  for (var i = 0, len = items.length; i < len; i++) {
    var item = items[i];
    debug('stat', item.path, item.isDirectory());
    if (item.isDirectory()) {
      debug('chose', item);
      return item.path;
    }
  }
  throw new Error('no directory path found');
}

function itemsInDirectory(path) {
  debug('locating first dir in', path);
  return new Promise(function(resolve, reject) {
    readdir(path).
      then(statPaths.bind(null, path)).
      then(chooseDirectory).
      then(resolve, reject);
  });
}

module.exports = itemsInDirectory;
