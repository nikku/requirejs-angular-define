module.exports = function(config) {
  config.set({

    basePath: '../',

    frameworks: ['jasmine', 'requirejs' ],

    files: [
      { pattern: 'build/*.js', included: false },
      { pattern: 'lib/**/*.js', included: false },
      { pattern: 'test/lib/**/*.js', included: false },
      { pattern: 'test/unit/ngDefine/*.js', included: false },
      { pattern: 'test/unit/testapp/*.js', included: false },
      { pattern: 'test/unit/testapp/**/*.js', included: false },
      { pattern: 'test/unit/testabilityPatch.js', included: false },

      'config/require/unit-bootstrap.js'
    ],

    browsers: [ "Chrome" ], // "PhantomJS", "Firefox", "Chrome"

    autoWatch: true,

    junitReporter: {
      outputFile: '../build/tests-reports/js-unit.xml',
      suite: 'unit'
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