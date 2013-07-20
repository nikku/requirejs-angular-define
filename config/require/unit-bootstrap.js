/**
 * test bootstrap script
 */

(function(document, window, require) {

  require({
    baseUrl: '/base/',
    paths: {
      'ngDefine' : 'build/ngDefine.min',
      'jquery' : 'lib/jquery/jquery-2.0.0',
      'angular' : 'lib/angular/angular',
      'angular-resource' : 'lib/angular/angular-resource',
      'angular-mocks' : 'test/lib/angular/angular-mocks'
    },
    shim: {
      'angular' : { deps: [ 'jquery' ], exports: 'angular' },
      'angular-resource': { deps: [ 'angular' ] },
      'angular-mocks': { deps: [ 'angular' ] },
    },
    packages: [
      { name: 'test', location: 'test/unit/ngDefine' },
      { name: 'testapp', location: 'test/unit/testapp' },
      { name: 'my-module', location: 'test/unit/testapp/my-module' },
      { name: 'my-other-module', location: 'test/unit/testapp/my-other-module' }
    ]
  });

  var tests = [];
  for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }

  require([
    'ngDefine'
  ], function(ngDefine) {

    tests.unshift('/base/test/unit/testabilityPatch.js');

    require(tests, function() {
      window.__karma__.start();
    });
  });

})(document, window, require);