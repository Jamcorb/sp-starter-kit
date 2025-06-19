'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

// Register an empty/no-op 'lint' task to override the built-in one
build.subTask('lint', function (gulp, buildOptions, done) {
  console.log('Lint task disabled');
  done(); // Finish immediately
});

build.initialize(require('gulp'));
