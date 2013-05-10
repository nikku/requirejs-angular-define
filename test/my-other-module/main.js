ngDefine('my.other.module', [
  'module:test:test/testService'
],
function(module) {
  module.config(function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('my.other.module');
  });
});