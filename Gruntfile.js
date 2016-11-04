module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'public/js/calculators.js',
        dest: 'public/js/calculators.min.js'
      }
    },
    browserify: {
      client: {
        src: 'src/app/main.js',
        dest: 'public/js/calculators.js'
      }
    },
    watchify: {
      options: {
        detectGlobals: true,
        insertGlobals: false,
        ignoreMissing: false,
        debug: false,
        standalone: false,
        keepalive: true
      },
      client: {
        src: './src/app/main.js',
        dest: 'public/js/calculators.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-watchify');

  // Default task(s).
  grunt.registerTask('default', ['browserify']);

};
