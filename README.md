ngDefine
========

[![Build Status](https://travis-ci.org/Nikku/requirejs-angular-define.png?branch=master)](https://travis-ci.org/Nikku/requirejs-angular-define)

This project seamlessly integrates [AngularJS](http://angularjs.org/) into [RequireJS](http://requirejs.org/) based applications.


Overview
========

Using __ngDefine__ you can leverage [RequireJS](http://requirejs.org/) to package [AngularJS](http://angularjs.org/) modules into reusable components.

```javascript
ngDefine('my.module', [
  'jquery',
  './bar',
  'module:ngResource',
  'module:my.other.module:my-other-module'
], function(module, $) {

  // define the module
  module.value("foo", "bar");
});
```

__ngDefine__ allows you to declare both plain RequireJS dependencies and AngularJS modules that get resolved using RequireJS before the module definition callback is called. 
Read more about it in the [docs](http://nikku.github.io/requirejs-angular-define/).


Resources
=========

- [Website](http://nikku.github.io/requirejs-angular-define/)
- [Issue tracker](https://github.com/Nikku/requirejs-angular-define/issues)
- [Sample Application](https://github.com/Nikku/requirejs-angular-define/tree/master/test/unit/testapp)


Build it
========

1. Fork + clone [the repository](https://github.com/Nikku/requirejs-angular-define).
2. Install dependencies via `npm install`.
3. Build the library via `grunt`.


License
=======

Use under terms of MIT license.
