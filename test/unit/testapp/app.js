ngDefine('testapp', [
  'angular',
  'jquery',
  './foo',
  'module:ngResource',
  'module:my.module.bar:my-module/bar',
  'module:my.other.module:my-other-module',
  'module:test:testapp/testService',
  'module:testapp.baz',
  'angular-resource'
], function(module, angular, jquery) {

  module.config(['TestServiceProvider', '$resourceProvider', function(TestServiceProvider, $resourceProvider) {
    TestServiceProvider.moduleInitialized('testapp');
  }]);
});