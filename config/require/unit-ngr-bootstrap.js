/**
 * test bootstrap script
 */

(function(document, window, require) {

  require({
    baseUrl: '/base/',
    packages: [
      { name: 'testapp', location: 'test/unit/testapp' }
    ]
  });

  var tests = [];
  for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }

  require(tests, function() {
    window.__karma__.start();
  });

})(document, window, require);