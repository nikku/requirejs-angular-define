define([ 'ngDefine' ], function() {

  return describe('ngDefine()', function() {

    describe('should throw error', function() {

      it("when redefining angular module with additional dependencies", function() {

        var foo, bar;

        ngDefine('myerror.module', ['module:ng'], function() {
          this.foo = true;
        });

        expect(function() {
          ngDefine('myerror.module', ['module:ng'], function() {
            this.bar = true;
          });
        }).toThrow();

      });
    });
  });
});