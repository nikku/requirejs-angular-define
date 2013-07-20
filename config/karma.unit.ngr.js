module.exports = function(config) {
  config.set({

    basePath: '../',

    frameworks: [ 'jasmine', 'requirejs' ],

    files: [
      'lib/require/r.js/r.js',
      'build/ngr.js',

      { pattern: 'lib/**/*.js', included: false },
      { pattern: 'test/lib/**/*.js', included: false },
      { pattern: 'test/unit/ngr/*.js', included: false },
      { pattern: 'test/unit/testapp/*.js', included: false },
      { pattern: 'test/unit/testapp/**/*.js', included: false },
      { pattern: 'test/unit/testabilityPatch.js', included: false },

      'config/require/unit-ngr-bootstrap.js'
    ],

    browsers: [ "Chrome" ], // "PhantomJS", "Firefox", "Chrome"

    autoWatch: true,

    junitReporter: {
      outputFile: '../build/tests-reports/js-unit.xml',
      suite: 'unit-ngr'
    },

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-requirejs'
    ]
  });
};