ngDefine('testapp.baz', [
  'module:test:testapp/testService'
],
function(module) {
  module.config([ 'TestServiceProvider', function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('test.baz');
  }]);
});