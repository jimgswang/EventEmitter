var expect = require('chai').expect,
    sinon = require('sinon'),
    EventEmitter = require('../src/EventEmitter');

describe('EventEmitter tests', function() {

    var emitter,
        foo,
        bar;

    beforeEach(function() {
        emitter = new EventEmitter();
        foo = sinon.spy();
        bar = sinon.spy();
    });

    describe('.on', function() {

        it('should throw error if foo is not a function', function() {
            var fn = emitter.on.bind(null, 'abc', 'abc');
            expect(fn).to.throw(TypeError);
        });

        it('should register event with emitter._events', function() {
            emitter.on('data', foo);
            expect(emitter._events.data[0]).to.equal(foo);
        });

        it('should be able to register multiple foos', function() {
            emitter.on('data', foo);
            emitter.on('data', bar);

            expect(emitter._events.data[0]).to.equal(foo);
            expect(emitter._events.data[1]).to.equal(bar);
        });

        it('should return itself', function() {
            expect(emitter.on('data', foo)).to.equal(emitter);
        });
    });


    describe('.emit', function() {

        beforeEach(function() {
            emitter.on('data', foo);
            emitter.on('data', bar);
        });

        it('should trigger listeners bound to event', function() {
            emitter.emit('data');

            expect(foo.calledOnce).to.be.true;
            expect(bar.calledOnce).to.be.true;
        });

        it('should trigger listeners in order', function() {
            emitter.emit('data');

            expect(foo.calledBefore(bar)).to.be.true;
        });

        it('should apply arguments to each listener', function() {
            var arg1 = 1,
                arg2 = '2',
                arg3 = {};

            emitter.emit('data', arg1, arg2, arg3);
            sinon.assert.calledWithExactly(foo, arg1, arg2, arg3);
        });

        it('should bind "this" to the emitter in listener', function(done) {
            var fn = function() {
                expect(this).to.equal(emitter);
                done();
            };

            emitter.on('data', fn);
            emitter.emit('data');
        });

        it('should return true if listeners were fired', function() {
            expect(emitter.emit('data')).to.be.true;
        });

        it('should return false if no listeners fired', function() {
            expect(emitter.emit('adf')).to.be.false;
        });

    });

    describe('.removeAllListeners', function() {

        beforeEach(function() {
            emitter.on('foo', foo);
            emitter.on('foo', function() {});
            emitter.on('bar', bar);
        });

        it('should remove all listeners if no parameter', function() {
            emitter.removeAllListeners();
            expect(emitter._events).to.be.empty;
        });


        it('should only remove listeners to specified event', function() {
            emitter.removeAllListeners('foo');
            expect(emitter._events.foo).to.be.undefined;
            expect(emitter._events.bar).to.not.be.undefined;
        });

        it('should return the emitter', function() {
            expect(emitter.removeAllListeners()).to.equal(emitter);
        });
    });
});

