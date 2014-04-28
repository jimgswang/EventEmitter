'use strict';


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

EventEmitter.prototype.emit = function(evt) {

    var listeners = this._events[evt],
        args = Array.prototype.slice.call(arguments, 1),
        self = this;

    if(listeners) {
        listeners.forEach(function(listener) {
            listener.apply(self, args);
        });
    }
};

module.exports = EventEmitter;


