suite('first_directory', function() {
  var subject = require('./first_directory');
  var assert = require('assert');
  var fsPath = require('path');

  var withDir = fsPath.resolve(__dirname + '/../test/fixtures/withdir');
  var withoutDir = fsPath.resolve(__dirname + '/../test/fixtures/withoutdir');

  test('with dir', function(done) {
    subject(withDir).
      then(function(path) {
        var expected = withDir + '/dir';
        assert.ok(
          path.indexOf(expected) !== -1,
          path + ' should include ' + withDir + '/dir'
        );
        done();
      }).
      // catch errors
      then(null, done);
  });

  test('without dir', function(done) {
    subject(withoutDir).
      then(function(input) {
        done(new Error('expected failure!'));
      }).
      then(null, function(error) {
        assert.ok(error);
        done();
      });
  });
});
