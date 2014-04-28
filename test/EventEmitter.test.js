var expect = require('chai').expect,
    sinon = require('sinon'),
    EventEmitter = require('../src/EventEmitter');

describe('EventEmitter tests', function() {

    var emitter;

    beforeEach(function() {
        emitter = new EventEmitter();
    });

    describe('.on', function() {

        it('should throw error if listener is not a function', function() {
            expect(emitter.on('abc', 'abc')).to.throw(TypeError);
        });

        it('should register event with emitter._events', function() {
            var listener = sinon.spy();
            emitter.on('data', listener);
            expect(emitter._events.data[0] === listener);
        });
    });

});

