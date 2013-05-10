ngDefine('testapp', function(module) {

  module.config(function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('testapp-foo');
  });
});