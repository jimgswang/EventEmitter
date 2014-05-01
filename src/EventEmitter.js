'use strict';

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
    return this;
};

/**
 * Trigger an event
 * @param {Mixed} evt - The event to trigger
 * @param {Mixed} [..var_args] - Optional arguments to pass to listener
 * @returns {Boolean} - true if evt trigged a listener 
 */
EventEmitter.prototype.emit = function(evt /*, var_args */) {

    var listeners = this._events[evt],
        args = Array.prototype.slice.call(arguments, 1),
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

    return this;
};

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
        listener();
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

    return this;
};

module.exports = EventEmitter;

