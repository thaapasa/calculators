"use strict";

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: './public/js/calculators.js',
                dest: './public/js/calculators.min.js'
            }
        },
        browserify: {
            options: {
                transform: [
                    ["babelify", { presets: ["es2015", "react"] }]
                ]
            },
            client: {
                src: './src/app/main.js',
                dest: './public/js/calculators.js'
            },
            test: {
                src: './src/test/**/*.js',
                dest: './test/test.js'
            }
        },
        watch: {
            files: ["./src/app/**/*.js"],
            tasks: ["build"]
        }
    });

    grunt.registerTask("build", ["browserify:client"]);
    grunt.registerTask("build-test", ["browserify:test"]);
    grunt.registerTask("all", ["build", "build-test"]);
    grunt.registerTask("dev", ["build", "watch"]);

    grunt.registerTask("default", ["build"]);

};
