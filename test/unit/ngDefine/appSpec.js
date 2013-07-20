define([ 'testapp/app', 'my-module/service', 'angular-mocks' ], function(app, service) {

  return describe('ngDefine()', function() {

    beforeEach(module('testapp'));

    describe('should bootstrap services', function() {

      it("in module and files relative to it", inject([ 'TestService', function(TestService) {

        var loadedModules = TestService.initializedModules();
        expect(loadedModules).toContain('testapp');
        expect(loadedModules).toContain('testapp-foo');

      }]));

      it("in required module and files relative to it", inject([ 'TestService', function(TestService) {

        var loadedModules = TestService.initializedModules();
        expect(loadedModules).toContain('my.module.bar');
        expect(loadedModules).toContain('my.module.bar-foobar');

      }]));

      it("in required module located by name", inject([ 'TestService', function(TestService) {

        var loadedModules = TestService.initializedModules();
        expect(loadedModules).toContain('test.baz');
      }]));

      it("in required module defined via package main.js", inject([ 'TestService', function(TestService) {

        var loadedModules = TestService.initializedModules();
        expect(loadedModules).toContain('my.other.module');
      }]));
    });

    it("should allow requires without module definition", inject([ 'TestService', function(TestService) {
      expect(service.loaded).toBe(true);
    }]));
  });
});