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

        it('emits newListener event with event name and listener args', function() {
            var emitSpy = sinon.spy(emitter, 'emit');
            
            emitter.on('foo', foo);

            sinon.assert.calledOnce(emitSpy);
            sinon.assert.calledWith(emitSpy, 'newListener', 'foo', foo);

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

    describe('.removeListener', function() {

        var baz;

        beforeEach(function() {
            baz = sinon.spy();

            emitter.on('foo', foo);
            emitter.on('foo', baz);
            emitter.on('bar', bar);
        });

        it('should remove only one listener for event', function() {
            emitter.removeListener('foo', baz);
            expect(emitter._events.foo.length).to.equal(1);
            expect(emitter._events.foo[0]).to.equal(foo);
        });


        it('should throw error if listener is not a function', function() {
            var fn = emitter.removeListener.bind(emitter, 'foo', 'foo');
            expect(fn).to.throw(TypeError);
        });

        it('should return the emitter', function() {
            expect(emitter.removeListener('foo', foo)).to.equal(emitter);
        });

        it('should be able to remove listener added by .once', function() {
            var qux = sinon.spy();
            emitter.once('bar', qux);
            emitter.removeListener('bar', qux);

            expect(emitter._events.bar.length).to.equal(1);
            expect(emitter._events.bar[0]).to.equal(bar);
        });

        it('should emit removeListener event with event name and listener args', function() {
            var emitSpy = sinon.spy(emitter, 'emit');
            emitter.removeListener('foo', foo);

            sinon.assert.calledOnce(emitSpy);
            sinon.assert.calledWith(emitSpy, 'removeListener', 'foo', foo);
        });
    });

    describe('.once', function() {

        it('should throw error if listener is not a function', function() {
            var fn = emitter.once.bind(null, 'abc', 'abc');
            expect(fn).to.throw(TypeError);
        });

        it('should register a listener', function() {
            emitter.once('foo', foo);
            expect(emitter._events.foo.length).to.equal(1);
        });

        it('should run registered function', function() {
            emitter.once('foo', foo);
            emitter.emit('foo');

            expect(foo.calledOnce).to.be.true;
        });

        it('should remove listener after .emit', function() {
            emitter.once('foo', foo);
            emitter.emit('foo');

            expect(emitter._events.foo).to.be.empty;
        });

        it('should pass all parameters from listener', function() {
            var arg1 = 1,
                arg2 = '2',
                arg3 = {};

            emitter.once('foo', foo);
            emitter.emit('foo', arg1, arg2, arg3);
            sinon.assert.calledWithExactly(foo, arg1, arg2, arg3);
        });

        it('should return the emitter', function() {
            expect(emitter.once('foo', foo)).to.equal(emitter);
        });


        it('emits newListener event with event name and listener args', function() {
            var emitSpy = sinon.spy(emitter, 'emit');
            
            emitter.once('foo', foo);

            sinon.assert.calledOnce(emitSpy);
            sinon.assert.calledWith(emitSpy, 'newListener', 'foo', foo);

        });
    });

    describe('.listeners', function() {

        beforeEach(function() {
            emitter.on('foo', foo);
            emitter.on('bar', bar);
        });

        it('should return an array of listeners for an event', function() {
            expect(emitter.listeners('foo')).to.deep.equal([foo]);
        });

        it('should return an empty array for unregistered events', function() {
            expect(emitter.listeners('abcd')).to.deep.equal([]);
        });

    });

    describe('.addListener', function() {

        it('should be alias to .on', function() {
            expect(emitter.addListener).to.equal(emitter.on);
        });
    });

    describe('.off', function() {

        it('should alias to .removeListener', function() {
            expect(emitter.off).to.equal(emitter.removeListener);
        });
    });

    describe('EventEmitter.listenerCount', function() {

        beforeEach(function() {
            emitter.on('foo', foo);
            emitter.on('foo', function() {});
            emitter.on('bar', bar);
        });

        it('should return 0 for non emitters', function() {
            expect(EventEmitter.listenerCount(1)).to.equal(0);
        });

        it('should return 0 for no listeners', function() {
            expect(EventEmitter.listenerCount(emitter, 'baz')).to.equal(0);
        });

        it('should return number of listeners', function() {

            expect(EventEmitter.listenerCount(emitter, 'foo')).to.equal(2);
        });
    });
});

