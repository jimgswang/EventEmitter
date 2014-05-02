EventEmitter
============
Platform agnostic Node style EventEmitters. Bringing events to the browser without any other dependencies! Supports AMD, CommonJS and global export

    var emitter = new EventEmitter();
    emitter.on('evt', function(data) {
        console.log(data);
    });

    emitter.emit('evt', {foo: 'bar' });

Inherit
--------

    function MyClass() {
        EventEmitter.call(this);
    }

    MyClass.prototype = Object.create(EventEmitter.prototype);
    MyClass.prototype.constructor = MyClass;

    var instance = new MyClass();
    instance.once('evt', function(data) {
        console.log(data);
    });

    instance.emit('evt', 'this will be logged');
    instance.emit('evt', 'this will not');

API
-------

EventEmitter supports the full API specified at [http://nodejs.org/api/events.html](http://nodejs.org/api/events.html) with two exceptions: There is no concept of Node's domains, and no .setMaxListeners - add as many as you want (be responsible).

Legacy browsers
-------

This library uses two ECMAScript5 functions. If you want to use it in older environments, then polyfill Function.prototype.bind and Array.prototype.forEach available at MDN [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill) and [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Polyfill)
