ngDefine('test.baz', [
  'module:test:test/testService'
],
function(module) {
  module.config(function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('test.baz');
  });
});