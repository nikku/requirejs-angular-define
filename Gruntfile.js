module.exports = function(grunt) {

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          name : 'ngDefine',
          baseUrl: './src',
          paths: {
            'angular': 'empty:'
          },
          out: 'build/ngDefine.min.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask( 'default', [ 'requirejs' ]);
};