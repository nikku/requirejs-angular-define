ngDefine('my.module.bar', [
  "./foobar",
  "./asdf",
  'module:test:test/testService'
],
function(module) {
  module.config(function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('my.module.bar');
  });
});