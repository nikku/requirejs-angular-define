module.exports = function(grunt) {

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      ngDefine: {
        options: {
          name : 'ngDefine',
          baseUrl: './src',
          paths: {
            'angular': 'empty:'
          },
          out: 'build/ngDefine.min.js'
        }
      },
      ngr: {
        options: {
          optimize: 'none',
          name : 'ngr',
          baseUrl: './src',
          out: 'build/ngr.js'
        }
      }
    },

    ngr: {
      /**
       * Test configuration for ngr that optimizes
       * the module test/unit/testapp
       */
      testMinify: {
        options: {
          name : 'testapp/app',
          out: 'build/testapp/app.min.js',
          paths: {
            'ngDefine' : 'build/ngDefine.min',
            'jquery' : 'lib/jquery/jquery-2.0.0',
            'angular' : 'lib/angular/angular',
            'angular-resource' : 'lib/angular/angular-resource'
          },
          optimize: "uglify2", 
          shim: {
            'angular' : { deps: [ 'jquery' ], exports: 'angular' },
            'angular-resource': { deps: [ 'angular' ] },
            'angular-mocks': { deps: [ 'angular' ] }
          },
          packages: [
            { name: 'testapp', location: 'test/unit/testapp' },
            { name: 'my-module', location: 'test/unit/testapp/my-module' },
            { name: 'my-other-module', location: 'test/unit/testapp/my-other-module' }
          ]
        }
      }
    },

    karma: {
      unit: {
        configFile: 'config/karma.unit.js',
      },
      single: {
        configFile: 'config/karma.unit.js',
        singleRun: true,
        browsers: [ 'PhantomJS' ]
      },
      singleOptimized: {
        configFile: 'config/karma.unit.optimized.js',
        singleRun: true,
        browsers: [ 'PhantomJS' ]
      },
      singleNgr: {
        configFile: 'config/karma.unit.ngr.js',
        singleRun: true,
        browsers: [ 'PhantomJS' ]
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-requirejs');

  // default task: minify sources and publish to ./build
  grunt.registerTask( 'default', [ 'test' ]);

  // travis task
  grunt.registerTask('travis', [ 'default' ]);

  // sample task for ngDefine optimization
  grunt.registerMultiTask('ngr', 'Minify ngDefine powered application', function() {

    var done = this.async();

    var ngr = require('./build/ngr.js');

    ngr.optimize(this.data.options, function() {
      done('success');
    }, function(e) {
      console.log('Error during minify: ', e);
      done(new Error('With failures: ' + e));
    });
  });

  // test task
  grunt.registerTask( 'test', [ 'requirejs', 'ngr', 'karma:single', 'karma:singleOptimized', 'karma:singleNgr' ]);
};