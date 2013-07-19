ngDefine('testapp', [
  'angular',
  'jquery',
  './foo',
  'module:ngResource',
  'module:my.module.bar:my-module/bar',
  'module:my.other.module:my-other-module',
  'module:test:test/testService',
  'module:test.baz',
  'angular-resource'
], function(module, angular, jquery) {

  module.config(['TestServiceProvider', '$resourceProvider', function(TestServiceProvider, $resourceProvider) {
    TestServiceProvider.moduleInitialized('testapp');
  }]);
});