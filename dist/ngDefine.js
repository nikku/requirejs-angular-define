
/**
 * ngParse - utility for parsing ngDefine module definitions
 * 
 * @version 1.1.0
 * @author Nico Rehwaldt <http://github.com/Nikku>
 *
 * @license (c) 2013 Nico Rehwaldt, MIT
 */

define('ngParse',[],function() {
  
  var MODULE_DEPENDENCY = /^module:([^:]*)(:(.*))?$/;
  var INTERNAL = /^ng/;

  function isFunction(value){ return typeof value == 'function'; }

  function isInternal(module) {
    return INTERNAL.test(module);
  }

  function asFileDependency(module) {
    return module.replace(/\./g, "/");
  }

  function toArray(arrayLike) {
    return Array.prototype.slice.call(arrayLike, 0);
  }

  /**
   * For each implementation as used by AngularJS
   */
  function forEach(obj, iterator, context) {
    var key;
    if (obj) {
      if (isFunction(obj)){
        for (key in obj) {
          if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context);
      } else if (isArrayLike(obj)) {
        for (key = 0; key < obj.length; key++)
          iterator.call(context, obj[key], key);
      } else {
        for (key in obj) {
          if (obj.hasOwnProperty(key)) {
            iterator.call(context, obj[key], key);
          }
        }
      }
    }
    return obj;
  }

  function parseNgModule(name, dependencies) {

    var files = [], 
        modules = [];

    forEach(dependencies, function(d) {
      var moduleMatch = d.match(MODULE_DEPENDENCY);
      if (moduleMatch) {
        var module = moduleMatch[1],
            path = moduleMatch[3];

        if (!path && !isInternal(module)) {
          // infer path from module name
          path = asFileDependency(module);
        }

        // add module dependency
        modules.push(module);

        if (path) {
          // add path dependency if it exists
          files.push(path);
        }
      } else {
        files.push(d);
      }
    });

    return { name: name, fileDependencies: files, moduleDependencies: modules };
  }

  return { parseNgModule: parseNgModule };
});
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

  define('ngDefine',[ 'angular', 'ngParse' ], function(angular, ngParse) {

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