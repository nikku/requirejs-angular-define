ngDefine('test.baz', [
  'module:test:test/testService'
],
function(module) {
  module.config([ 'TestServiceProvider', function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('test.baz');
  }]);
});