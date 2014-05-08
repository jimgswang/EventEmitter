'use strict';

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        mochacli: {
            options: {
                reporter: 'spec',
                'check-leaks': true,
            },
            src: ['test/**/*.js']
        },

        watch: {
            test: {
                files: ['test/**/*.js', 'src/**/*.js'],
                tasks: ['mochacli']
            }
        },

        uglify: {
            my_target: {
                files: {
                    'dist/EventEmitter.min.js': ['src/EventEmitter.js']
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build', ['mochacli', 'uglify']);
};
