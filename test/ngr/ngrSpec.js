define([ 'ngr' ], function(ngr) {

  describe('ngr expandNgDefine()', function() {

    function expectTransform(src, expected) {
      var called;

      runs(function() {
        ngr.withLib(function(lib) {

          var result = lib.expandNgDefine('testmodule', './testmodule', src);
          expect(result).toEqual(expected);

          called = true;
        });
      });

      waitsFor(function() {
        return called;
      });
    }

    describe('should handle', function() {

      it('simple ngDefine', function() {

        var src = 
          'ngDefine("asdf", function(module) {\n' + 
          '  module.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var module = angular.module("asdf", []);\n' +
          '  define(["angular"], function() {\n' +
          '    (function(module) {\n' +
          '  module.foo();\n' +
          '})(module);\n' +
          '    return module;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });

      it('custom module param', function() {

        var src = 
          'ngDefine("asdf", function(mod) {\n' + 
          '  mod.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var mod = angular.module("asdf", []);\n' +
          '  define(["angular"], function() {\n' +
          '    (function(mod) {\n' +
          '  mod.foo();\n' +
          '})(mod);\n' +
          '    return mod;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });
    
      it('require dependencies', function() {

        var src = 
          'ngDefine("asdf", [ "sdf" ], function(module, sdf) {\n' + 
          '  module.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var module = angular.module("asdf", []);\n' +
          '  define(["sdf", "angular"], function(sdf) {\n' +
          '    (function(module, sdf) {\n' +
          '  module.foo();\n' +
          '})(module, sdf);\n' +
          '    return module;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });

      it('simple angular module dependencies', function() {

        var src = 
          'ngDefine("asdf", [ "module:a" ], function(module, a) {\n' + 
          '  module.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var module = angular.module("asdf", ["a"]);\n' +
          '  define(["a", "angular"], function(a) {\n' +
          '    (function(module, a) {\n' +
          '  module.foo();\n' +
          '})(module, a);\n' +
          '    return module;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });

      it('angular module dependency + explicit module location', function() {

        var src = 
          'ngDefine("asdf", [ "module:a:./a" ], function(module, aa) {\n' + 
          '  module.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var module = angular.module("asdf", ["a"]);\n' +
          '  define(["./a", "angular"], function(aa) {\n' +
          '    (function(module, aa) {\n' +
          '  module.foo();\n' +
          '})(module, aa);\n' +
          '    return module;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });

      it('complex module definition', function() {

        var src = 
          'ngDefine("asdf", [ \n' +
          '  "a", \n' +
          '  "b", \n' +
          '  "module:c.c", \n' +
          '  "module:d:./d", \n' +
          '  "module:e:e/e" \n' +
          '], function(module, a, b) {\n' + 
          '  module.foo();\n' + 
          '});';

        var expected = 
          '(function(angular) {\n' +
          '  var module = angular.module("asdf", ["c.c", "d", "e"]);\n' +
          '  define(["a", "b", "c/c", "./d", "e/e", "angular"], function(a, b) {\n' +
          '    (function(module, a, b) {\n' +
          '  module.foo();\n' +
          '})(module, a, b);\n' +
          '    return module;\n' +
          '  });\n' +
          '})(window.angular);';

        expectTransform(src, expected);
      });
    });
  });
});