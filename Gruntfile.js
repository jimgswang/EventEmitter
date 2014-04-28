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
        }
    });


    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
