ngDefine
========

[![Build Status](https://travis-ci.org/Nikku/requirejs-angular-define.png?branch=master)](https://travis-ci.org/Nikku/requirejs-angular-define)

A friendly integration of [AngularJS](http://angularjs.org/) into [RequireJS](http://requirejs.org/) powered applications.


How it Works
------------

Using `ngDefine` you can leverage [RequireJS](http://requirejs.org/) to define [AngularJS](http://angularjs.org/) modules and their dependencies in a declarative way. The modules can then be published as packages and are (re-)usable in RequireJS applications.

```javascript
ngDefine('my.module', [
  './bar',
  'module:ngResource',
  'module:my.other.module:my-other-module'
],
function(module) {
  // define the module
  module.value("foo", "bar");
});
```

`ngDefine` is built as a wrapper around `define` and gives you the same guarantees `define` does with respect to dependency loading (ie. fail if a required dependency could not be loaded). 
At the same time it creates the AngularJS module for you and makes sure that the module dependencies are correctly declared.


Sample Application
------------------

Have a look at the test suite (`./test`) for a sample application. 


Building ngDefined applications
-------------------------------

This will quickly guide you through the neccesary steps to build a application using `ngDefine`. 
We will check out how to employ `ngDefine` to [define AngularJS modules](#AngularJS-Module-Definition), how to [configure RequireJS](#RequireJS-Configuration) to pick up the correct dependencies as well as how to [bootstrap the application](#Application-Bootstrap).


### AngularJS Module Definition

AngularJS modules may be declared using `#ngDefine(name[, dependencies], callback)`. 
The function accepts the name of the module to be defined or looked up and a callback function that may define or configure the module.
A (optional) list of arbitrary RequireJS dependencies can be passed that are resolved before the callback function is executed.

The list of dependencies may define AngularJS dependencies in the form `module:{angularModuleName}[:{requirejsPath}]`. 
Each AngularJS module dependency may be specified with an optional path to the RequireJS file defining it. 
Note that if no path is given, the RequireJS path is produced by replacing all `.` with `/`. 


```javascript
ngDefine('app', [
  // require normal requireJS packages
  'angular',
  'jquery',

  // require package local files
  './foo',

  // require angular modules
  'module:ngResource',
  'module:my.module.bar:my-module/bar',
  'module:my.other.module:my-other-module',

  // require without a require js path -> locates the module under foo/baz
  'module:foo.baz'
],
function(module, angular, jquery) {
  // callback gets passed the defined module as the first parameter, 
  // all other objects defined by declared dependencies follow at parameter 1..n

  module // --> { .., name: 'app', .. }

  // define module now
  module.value("foo", "bar");
});
```

### RequireJS Configuration

As of RequireJS version 2.1.x a require configuration using `ngDefine` / AngularJS may look as follows:

```javascript
require({
  paths: {
    // include ngDefine script in path
    'ngDefine' : 'lib/ngDefine', 
    'angular' : 'lib/angular/angular',
    'angular-resource' : 'lib/angular/angular-resource'
    'jquery' : 'lib/jquery/jquery-2.0.0',
  },
  shim: {
    'angular' : { deps: [ 'jquery' ], exports: 'angular' },
    'angular-resource': { deps: [ 'angular' ] }
  },
  packages: [
    // application package
    { name: 'app', location: 'app', main: 'app.js' },

    // other angular modules
    { name: 'my-module', location: 'lib/my-module' },
    { name: 'my-other-module', location: 'lib/my-other-module' }
  ]
});
```

Note that [jQuery](http://jquery.com/) is an optional dependency and may be excluded from both the path as well as the angular shim configuration. 


### Application Bootstrap

`ngDefine` defines a global callback that may be used by module definitions. 
That is why bootstrapping must be done in a nested require which makes sure `ngDefine` is loaded prior to all module definitions.

After the application main module is ready, it can be bootstrapped using [`angular.bootstrap(name)`](http://docs.angularjs.org/api/angular.bootstrap).

```javascript
// require ngDefine and all angular modules you need
require([ 'ngDefine', 'angular', 'angular-resource' ], function(ngDefine, angular) {

  // enable debug to get module dependencies logged
  ngDefine.debug = true;

  // require the application
  require('app', function() {

    // bootstrap the application
    angular.bootstrap(document.body, ['app']);
  });
});
```


FAQ
---

**(1) Why should I use RequireJS? After all, AngularJS includes a dependency injection mechanism, doesn't it?**

AngularJS offers a dependency injection mechanism at runtime. 
When building applications a developer must know which script files to include into his application so that all runtime dependencies are met when the application is bootstrapped. 
AngularJS does not allow application developers to define these dependencies on the file level. 
However, that is exactly what RequireJS does. 

`ngDefine` simply employs RequireJS and gives developers the ability to declare AngularJS modules and their dependencies in a portable way. 
This way the modules can be reused and external dependencies can easily be resolved.

**(2) `ngDefine` bridges the gap between RequireJS and AngularJS?**

Not quite, read (1). There is no gap between RequireJS and AngularJS, as both serve different purposes during different stages of the application lifecycle. 
`ngDefine` allows you to leverage the power of both technologies. 

**(3) Can an application that uses `ngDefine` be minified?**

Yes, minification can be done through `ngr.js`, a wrapper to the [RequireJS](http://requirejs.org/docs/optimization.html) optimizer.
Refer to [example/optimize.html](https://github.com/Nikku/requirejs-angular-define/blob/master/example/ngr.html) for an example how optimization can be configured.

Currently, the optimizer is available for the browser and node environments, only.


License
-------

Use under terms of MIT license.
