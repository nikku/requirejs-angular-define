/**
 * ngParse - utility for parsing ngDefine module definitions
 * 
 * @version 1.1.0
 * @author Nico Rehwaldt <http://github.com/Nikku>
 *
 * @license (c) 2013 Nico Rehwaldt, MIT
 */

define(function() {
  
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