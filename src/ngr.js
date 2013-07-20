/**
 * ngr.js - a wrapper to r.js, the RequireJS optimizer that allows it to optimize
 *          ngDefine powered applications.
 *
 * See https://github.com/Nikku/requirejs-angular-define for details.
 *
 * @version 1.1.0
 * @author Nico Rehwaldt <http://github.com/Nikku>
 *
 * @license (c) 2013 Nico Rehwaldt, MIT
 */


 /* global process:false, navigator:false, document:false */

(function (console, args) {

  var libraryLoaded;

  var env;

  var requirejs;
  var esprima;

  var ngr = {};

  if (typeof process !== 'undefined' && process.versions && !!process.versions.node) {
    requirejs = require('requirejs');    
    env = 'node';
  } else if (typeof navigator !== 'undefined' && typeof document !== 'undefined') {
    requirejs = window.requirejs;
    env = 'browser';
  }

  function loadLib(completeFn) {

    /** provides the ngr library */
    function internalLoad(req) {
      
      var esprima = req('esprima');

      var ngParse = (function() {

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
      })();
      
      var argPropName = 'arguments';

      // from an esprima example for traversing its ast.
      function traverse(object, visitor) {
          var key, child;

          if (!object) {
              return;
          }

          if (visitor.call(null, object) === false) {
              return false;
          }
          for (key in object) {
              if (object.hasOwnProperty(key)) {
                  child = object[key];
                  if (typeof child === 'object' && child !== null) {
                      if (traverse(child, visitor) === false) {
                          return false;
                      }
                  }
              }
          }
      }

      //ngDefine()
      function hasNgDefine(node) {
        return node && node.type === 'CallExpression' && node.callee &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'ngDefine';
      }

      //ngDefine() in file contents?
      function usesNgDefine(fileContents) {
        var found = false;

        traverse(esprima.parse(fileContents), function (node) {
          if (hasNgDefine(node)) {
            found = true;

            //Stop traversal
            return false;
          }
        });

        return found;
      }

      /**
       * Pulls out dependencies from an array literal with just string members.
       * If string literals, will just return those string values in an array,
       * skipping other items in the array.
       *
       * @param {Node} node an AST node.
       *
       * @returns {Array} an array of strings.
       * If null is returned, then it means the input node was not a valid
       * dependency.
       */
      function getValidDeps(node) {
        if (!node || node.type !== 'ArrayExpression' || !node.elements) {
          return;
        }

        var deps = [];

        node.elements.some(function (elem) {
          if (elem.type === 'Literal') {
            deps.push(elem.value);
          }
        });

        return deps.length ? deps : undefined;
      }

      /**
       * returns parameters for this FunctionExpression node
       */
      function getParams(node) {
        if (!node || node.type !== 'FunctionExpression' || !node.params) {
          return;
        }

        var params = [];

        node.params.some(function (elem) {
          if (elem.type === 'Identifier') {
            params.push(elem.name);
          }
        });

        return params.length ? params : undefined;
      }

      /**
       * Determines if a specific node is a valid ngDefine call.
       *
       * @param {Array} node
       * @param {Function} onMatch a function to call when a match is found.
       * It is passed the match name, and the config, name, deps possible args.
       * The config, name and deps args are not normalized.
       *
       * @returns {String} a JS source string with the valid require/define call.
       * Otherwise null.
       */
      function parseNode(node, onMatch) {
        var name, deps, factory, 
          args = node && node[argPropName],
          callName = hasNgDefine(node);
          
        if (hasNgDefine(node) && args && args.length) {
          name = args[0];
          deps = args[1];
          factory = args[2];

          if (name.type === 'ArrayExpression') {
            throw new Error('unexpected syntax, exected ngDefine(string, [array{string}, ] function), found ngDefine(Array)');
          } else if (name.type === 'FunctionExpression') {
            throw new Error('unexpected syntax, exected ngDefine(string, [array{string}, ] function), found ngDefine(factory)');
          } else if (name.type !== 'Literal') {
            throw new Error('unexpected syntax, exected ngDefine(string, [array{string}, ] function), found ngDefine(object)');
          }

          if (name && name.type === 'Literal' && deps) {
            if (deps.type === 'FunctionExpression') {
              //deps is the factory
              factory = deps;
              deps = null;
            } else if (deps.type === 'ObjectExpression') {
              throw new Error('unexpected syntax, exected ngDefine(string, [array{string}, ] function), found ngDefine(object)');
            } else if (deps.type === 'Identifier' && args.length === 2) {
              throw new Error('unexpected syntax, exected ngDefine(string, [array{string}, ] function), found ngDefine(mod, functionIdentifier)');
            }
          }

          if (deps && deps.type === 'ArrayExpression') {
            deps = getValidDeps(deps);
          } else if (factory && factory.type === 'FunctionExpression') {
            deps = [];
          } else if (deps || factory) {
            //Does not match the shape of a ngDefine call.
            return;
          }

          //Just save off the name as a string instead of an AST object.
          if (name && name.type === 'Literal') {
            name = name.value;
          }

          return onMatch(name, deps, getParams(factory), factory, node);
        }
      }

      /**
       * Handles parsing a file recursively for ngDefine calls.
       * 
       * @param {Array} parentNode the AST node to start with.
       * @param {Function} onMatch function to call on a parse match.
       * @param {Object} [options] This is normally the build config options if
       * it is passed.
      */
      function recurse(object, onMatch, options) {
        var key, child;

        if (!object) {
           return;
        }

        if (parseNode(object, onMatch) === false) {
          return;
        }

        for (key in object) {
          if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null) {
               recurse(child, onMatch, options);
            }
          }
        }
      }

      /** public API exposed by ngr internal library */

      ngr.optimize = function(options, completeFn) {

        var registry = { urlMapping: {}, modules: {} };

        var onBuildRead = options.onBuildRead;
        var onBuildWrite = options.onBuildWrite;

        options.onBuildRead = function(moduleName, url, contents) {
          var newContents = ngr.expandNgDefine(moduleName, url, contents, registry);

          if (onBuildRead) {
            newContents = onBuildRead(moduleName, url, newContents);
          }

          return newContents;
        };

        options.onBuildWrite = function(moduleName, url, content) {

          // module has been written
          ngr.moduleWritten(moduleName, url, content, registry);

          return content;
        };

        requirejs.optimize(options, completeFn);
      };

      ngr.moduleWritten = function(moduleName, url, fileContents, registry) {

        if (!registry) {
          return;
        }

        var modName = registry.urlMapping[url];
        if (modName) {
          registry.modules[modName].written = true;
        }
      };

      ngr.expandNgDefine = function(moduleName, url, fileContents, registry) {

        if (!usesNgDefine(fileContents)) {
          return fileContents;
        }

        registry = registry || {};

        var modules = registry.modules || {};
        var urlMapping = registry.urlMapping || {};

        var ast = esprima.parse(fileContents, { range: true });

        var contents = '';

        recurse(ast, function(name, dependencies, args, factory, node) {

          // register module in url -> module map
          urlMapping[url] = name;

          var ngModule = ngParse.parseNgModule(name, dependencies || []);

          var moduleDef = modules[name];

          if (!moduleDef) {
            moduleDef = modules[name] = {
              dependencies: ngModule.moduleDependencies, 
              written: false
            };
          }

          var moduleDepsString = moduleDef.dependencies.join('", "');
          if (moduleDepsString) {
            moduleDepsString = '"' + moduleDepsString + '"';
          }

          // add angular dependency unless already present
          if (ngModule.fileDependencies.indexOf('angular') == -1) {
            ngModule.fileDependencies.push('angular');
          }

          var fileDepsString = ngModule.fileDependencies.join('", "');
          if (fileDepsString) {
            fileDepsString = '"' + fileDepsString + '"';
          }

          var modVarName = args[0] || "__module";

          // requireArgs = factoryArgs(1 .. n)
          var requireArgs = args.slice(1);
          var requireArgsString = requireArgs.join(', ');

          // factoryCallArgs __module, requireArgs(1 .. n)
          var factoryCallArgs = requireArgs.slice(0);
          factoryCallArgs.unshift(modVarName);
          var factoryCallArgsString = factoryCallArgs.join(', ');

          contents += fileContents.substring(0, node.range[0]);

          contents += '(function(angular) {\n';
          contents += '  var ' + modVarName + ' = ';
          if (moduleDef.written) {
            contents += 'angular.module("' + ngModule.name + '");\n';
          } else {
            contents += 'angular.module("' + ngModule.name + '", [' + moduleDepsString + ']);\n';
          }

          contents += '  define([' + fileDepsString + '], function(' + requireArgsString + ') {\n';
          contents += '    (' + fileContents.substring(factory.range[0], factory.range[1]) + ')(' + factoryCallArgsString + ');\n';
          contents += '    return ' + modVarName + ';\n';
          contents += '  });\n';
          contents += '})(window.angular);';

          contents += fileContents.substring(node.range[1] + 1);
        });

        return contents;
      };
    };

    requirejs.tools.useLib('build', function(req) {

      internalLoad(req);
      // marks as loaded
      libraryLoaded = true;

      completeFn(ngr);
    });
  }

  function withLib(completeFn) {

    if (libraryLoaded) {
      completeFn(ngr);
    } else {
      loadLib(completeFn);
    }
  }

  var exports = {

    optimize: function(options, completeFn, errorFn) {

      withLib(function(ngr) {
        ngr.optimize(options, completeFn, errorFn);
      });
    },

    withLib: function(callback) {
      
      withLib(function(ngr) {
        callback(ngr);
      });
    }
  };

  if (typeof define === 'function') {
    define('ngr', [], function() {
      return exports;
    });
  }

  if (env == 'browser') {
    window.ngr = exports;
  }

  if (env == 'node') {
    module.exports = exports;  
  }
})((typeof console !== 'undefined' ? console : undefined),
   (typeof Packages !== 'undefined' || (typeof window === 'undefined' && typeof Components !== 'undefined' && Components.interfaces) ?
    Array.prototype.slice.call(arguments, 0) : []));