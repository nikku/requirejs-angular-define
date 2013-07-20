ngDefine('my.other.module', [
  'module:test:testapp/testService'
],
function(module) {
  module.config([ 'TestServiceProvider', function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('my.other.module');
  }]);
});