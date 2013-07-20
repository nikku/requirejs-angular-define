/**
 * ngDefine - a friendly integration of AngularJS into RequireJS powered applications
 *
 * See https://github.com/Nikku/requirejs-angular-define for details.
 *
 * @version 1.1.0
 * @author Nico Rehwaldt <http://github.com/Nikku>
 *
 * @license (c) 2013 Nico Rehwaldt, MIT
 */

(function(window) {

  define([ 'angular', 'ngParse' ], function(angular, ngParse) {

    //////// utilities /////////

    function toArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike, 0);
    }


    ///////// main /////////
    
    function internalModule(angular, name, dependencies, body) {

      if (!body) {
        body = dependencies;
        dependencies = null;
      }

      var definition = ngParse.parseNgModule(name, dependencies || []);

      var module, exists;

      var moduleDependencies = definition.moduleDependencies,
          fileDependencies = definition.fileDependencies;

      try {
        angular.module(name);
        exists = true;
      } catch (e) {
        exists = false;
      }

      if (moduleDependencies.length && exists) {
        throw new Error(
          "Cannot re-define angular module " + name + " with new dependencies [" + moduleDependencies + "]. " +
          "Make sure the module is not defined else where or define a sub-module with additional angular module dependencies instead.");
      }

      if (moduleDependencies.length || !exists) {
        module = angular.module(name, moduleDependencies);
        debugLog(name, "defined with dependencies", moduleDependencies);
      } else {
        module = angular.module(name);
        debugLog(name, "looked up");
      }

      define(fileDependencies, function() {
        var results = toArray(arguments);
        results.unshift(module);

        body.apply(window, results);

        debugLog(name, "loaded");
        return module;
      });
    }


    //////// module exports /////////

    var exports = function(name, dependencies, body) {
      if (!dependencies) {
        throw new Error("wrong number of arguments, expected name[, dependencies], body");
      }
      internalModule(angular, name, dependencies, body);
    };

    if (typeof window !== undefined && !window.ngDefine) {
      window.ngDefine = exports;
    }


    ///////// logging /////////

    var debugLog = (function() {
      var log;

      // IE 9 logging #!?.
      if (Function.prototype.bind && window.console && window.console.log) {
        log = Function.prototype.bind.call(window.console.log, window.console);
      }

      return function() {
        if (!exports.debug || !log) {
          return;
        }

        var args = toArray(arguments);
        args.unshift("[ngDefine]");

        log.apply(log, args);
      };
    })();


    ///////// export //////////
    return exports;
  });
})(window);