module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/** ngDefine v1.0.0 | (c) Nico Rehwaldt <http://github.com/Nikku>, 2013 | license: MIT */\n'
      },
      build: {
        src: 'src/ngDefine.js',
        dest: 'build/ngDefine.min.js'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};