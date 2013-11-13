var Promise = require('promise'),
    fs = require('fs'),
    fsPath = require('path'),
    readdir = Promise.denodeify(fs.readdir),
    stat = Promise.denodeify(fs.stat);

function statWithPath(path) {
  return new Promise(function(resolve, reject) {
    stat(path).
      then(function(stat) {
        stat.path = path;
        resolve(stat);
      }).
      then(null, reject);
  });
}

function statPaths(path, items) {
  return new Promise(function(resolve, reject) {
    var promises = items.map(function(item) {
      return statWithPath(fsPath.join(path, item));
    });

    return Promise.all(promises).
                   then(resolve, reject);
  });
}

function chooseDirectory(items) {
  for (var i = 0, len = items.length; i < len; i++) {
    if (items[i].isDirectory()) return items[i].path;
  }
  throw new Error('no directory path found');
}

function itemsInDirectory(path) {
  return new Promise(function(resolve, reject) {
    readdir(path).
      then(statPaths.bind(null, path)).
      then(chooseDirectory).
      then(resolve, reject);
  });
}

module.exports = itemsInDirectory;
