ngDefine('testapp', function(module) {

  module.config([ 'TestServiceProvider', function(TestServiceProvider) {
    TestServiceProvider.moduleInitialized('testapp-foo');
  }]);
});