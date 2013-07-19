define(function() {

  var FILE_FULL =  
    "ngDefine('testapp', [\n" +
    "  'angular',\n" +
    "  'jquery',\n" +
    "  './foo',\n" +
    "  'module:ngResource',\n" +
    "  'module:my.module.bar:my-module/bar',\n" + 
    "  'module:test.baz'\n" +
    "], function(module, angular, jquery) {\n" +
    "  // module + dependencies\n" +
    "  function foo(asdf) {\n" + 
    "    console.log(asdf + '!');\n" + 
    "  }\n" + 
    "\n" +
    "  foo('hello');\n" + 
    "});"

  var FILE_MINIMAL = "ngDefine('testapp', function(module) { })";

  var DECLARATION = /ngDefine\((.+\))\s+\{/m;
  var BODY_DECLARATION = /function\((.*)\)$/m;
  
  var MODULES = /\[(.*)\]/m;

  function trim(str) {
    return str.replace(/^\s+|\s+$/g,'');
  }

  function stripQuotes(str) {
    return str.replace(/^*\s+"'|"'\s*$/g,'');
  }

  function parseNgDefine(content) {
    var match = DECLARATION.exec(FILE_FULL);

    if (!match) {
      return null;
    }

    var signature = match[1];
    var modulesMatch = MODULES.exec(signature);

    var dependencies = modulesMatch ? modulesMatch[1] : null;

    if (modulesMatch) {
      signature = signature.replace(MODULES, "[]");
    }

    dependencies = dependencies.split(/\s*,\s*/);
    
    console.log(signature);

    var bodyArgs = BODY_DECLARATION.exec(signature);
    if (bodyArgs) {
      bodyArgs = bodyArgs[1].split(/\s*,\s*/);
    } else {
      bodyArgs = [];
    }

    return {
      dependencies: dependencies, 
      bodyArgs: bodyArgs
    };
  }

  return describe('ngDefine()', function() {

    describe('ngr.js transformation', function() {

      it("asdf", function() {

        var ngModuleDefinition = parseNgDefine(FILE_FULL);
        
        expect(ngModuleDefinition).toBeDefined();
        expect(ngModuleDefinition.bodyArgs).toEqual("foo");
        expect(ngModuleDefinition.dependencies).toEqual("foo");
      });
    });
  });
});