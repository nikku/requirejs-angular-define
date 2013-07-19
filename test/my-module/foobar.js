ngDefine('my.module.bar', function(module) {
  module.config([ 'TestServiceProvider', function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('my.module.bar-foobar');
  }]);
});