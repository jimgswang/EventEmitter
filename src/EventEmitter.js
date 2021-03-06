(function(root, name, definition) {
    'use strict';

    if(typeof module === 'object') {
        // CommonJS
        module.exports = definition();
    } 
    else if(typeof define === 'function' && define.amd) {
        // AMD
        define(definition);
    }
    else {
        // Global
        root[name] = definition();
    }
})(this, 'EventEmitter',  function x () {
    'use strict';

    var slice = Array.prototype.slice;

    /**
     * Create an EventEmitter
     * @constructor
     */
    function EventEmitter() {

        /**
         * A hash to hold all registered events and their listeners
         * properties are event names, their values are arrays of 
         * listeners for that event
         */
        this._events = {};
    }

    /**
     * Register an event that will trigger listener
     * @param {Mixed} evt - The event to listen for
     * @param {function} listener - The function to call when evt happens
     * @returns {Object} - Return the emitter
     */
    EventEmitter.prototype.on = function(evt, listener) {

        if(typeof listener !== 'function') {
            throw new TypeError('listener should be a function');
        }

        this._events[evt] = this._events[evt] || [];
        this._events[evt].push(listener);

        this.emit('newListener', evt, listener);
        return this;
    };

    /** 
     * Alias addListener to on
     */
    EventEmitter.prototype.addListener = EventEmitter.prototype.on;

    /**
     * Trigger an event
     * @param {Mixed} evt - The event to trigger
     * @param {Mixed} [..var_args] - Optional arguments to pass to listener
     * @returns {Boolean} - true if evt trigged a listener 
     */
    EventEmitter.prototype.emit = function(evt /*, var_args */) {

        var listeners = this._events[evt],
            args = slice.call(arguments, 1),
            self = this;

        if(listeners && listeners.length) {
            listeners.forEach(function(item) {
                if(typeof item === 'function') {
                    item.apply(self, args);
                }
                else if(typeof item === 'object' && item.outer) {
                    item.outer.apply(self, args);
                }
            });

            return true;
        }

        return false;
    };


    /**
     * Remove all listeners to an event. If no event is specified,
     * remove all listeners
     * @param {Mixed} [evt] - The event whose listeners to remove
     * @returns {Object} - Returns the emitter
     */
    EventEmitter.prototype.removeAllListeners = function(evt) {

        if(evt) {
            delete this._events[evt];
        }

        else {
            this._events = {};
        }
        
        return this;
    };

    /** Remove a listener from an event
     * @param {Mixed} evt - The event to remove from
     * @param {Function} listener - The listener to remove
     * @returns {Object} - Returns the emitter
     */
    EventEmitter.prototype.removeListener = function(evt, listener) {

        var listeners = this._events[evt];

        if(typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        if(listeners) {
            listeners.forEach(function(item, index, arr) {
                if(item === listener) {
                    arr.splice(index, 1);
                }
                else if(typeof item === 'object' && item.inner === listener) {
                    arr.splice(index,1);
                }
            });
        }

        this.emit('removeListener', evt, listener);
        return this;
    };

    /**
     * Alias .off to .removeListener
     */
    EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    /**
     * Register an event listener to be fired once
     * Once the event has triggered, the listener is removed
     * @param {Mixed} evt - The event to listen for
     * @param {Function} listener - The function to trigger
     * @returns {Object} - Return the emitter
     */
    EventEmitter.prototype.once = function(evt, listener) {

        var self = this,
            wrapper;

        if(typeof listener !== 'function') {
            throw new TypeError('listener must be a function');
        }

        wrapper = function wrap() {
            listener.apply(self, slice.call(arguments));
            self.removeListener(evt, listener);
        };

        /* Need to save a reference to listener so we can still delete it
         * .emit executes the outer function,
         * .removeListener removes based on inner function
         */

        this._events[evt] = this._events[evt] || [];
        this._events[evt].push({
            'outer': wrapper,
            'inner': listener
        });

        this.emit('newListener', evt, listener);

        return this;
    };

    /**
     * Return an array of listeners for an event
     * @param {Mixed} evt - The event whose listeners to get
     * @returns {Array} - An array of listeners for the event
     *                    Empty array if event isnt registered
     */
    EventEmitter.prototype.listeners = function(evt) {

        var listeners = this._events[evt];

        return listeners || [];
    };

    /**
     * Return the number of listeners for an event on an emitter
     * @param {EventEmitter} emitter - the emitter to check
     * @param {Mixed} evt - The event to check
     * @returns {Number} - The number of listeners for evt on emitter
     */
    EventEmitter.listenerCount = function(emitter, evt) {

        var isEventEmitter = emitter instanceof EventEmitter,
            listeners;

        if(!isEventEmitter) {
            return 0;
        }

        listeners = emitter._events[evt];

        return listeners ? listeners.length
                         : 0;
    }

    return EventEmitter;
});
