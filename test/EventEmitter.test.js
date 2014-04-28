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
            var fn = emitter.on.bind(null, 'abc', 'abc');
            expect(fn).to.throw(TypeError);
        });

        it('should register event with emitter._events', function() {
            var listener = sinon.spy();
            emitter.on('data', listener);
            expect(emitter._events.data[0]).to.equal(listener);
        });

        it('should be able to register multiple listeners', function() {
            var listener1 = sinon.spy();
            var listener2 = sinon.spy();
            emitter.on('data', listener1);
            emitter.on('data', listener2);

            expect(emitter._events.data[0]).to.equal(listener1);
            expect(emitter._events.data[1]).to.equal(listener2);
        });

        it('should return itself', function() {

            var listener = sinon.spy();
            expect(emitter.on('data', listener)).to.equal(emitter);

        });
    });

});

