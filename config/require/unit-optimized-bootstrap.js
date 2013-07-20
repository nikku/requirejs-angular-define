/**
 * test bootstrap script
 */

(function(document, window, require) {

  require({
    baseUrl: '/base/',
    paths: {
      'angular-mocks' : 'test/lib/angular/angular-mocks'
    },
    shim: {
      'angular-mocks': { deps: [ 'angular' ] }
    },
    packages: [
      { name: 'test', location: 'test/unit/ngDefine' }
    ]
  });

  var tests = [];
  for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }

  tests.unshift('/base/test/unit/testabilityPatch.js');

  require(tests, function() {
    window.__karma__.start();
  });

})(document, window, require);