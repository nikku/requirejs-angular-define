ngDefine('my.module.bar', function(module) {
  module.config(function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('my.module.bar-foobar');
  });
});