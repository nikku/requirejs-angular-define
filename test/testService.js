ngDefine('test', function(module) {

  function TestServiceProvider() {

    var initializedModules = [];

    this.moduleInitialized = function(module) {
      initializedModules.push(module);
    };

    this.$get = function() {

      return {
        initializedModules: function() {
          return initializedModules;
        }
      };
    };
  }

  module.provider('TestService', TestServiceProvider);
});