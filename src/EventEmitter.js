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
 * @param {Mixed} eventName - The event to listen for
 * @param {function} listener - The function to call when eventName happens
 * @returns {Object} - Return the emitter
 */
EventEmitter.prototype.on = function(eventName, listener) {

    if(typeof listener !== 'function') {
        throw new TypeError('listener should be a function');
    }

    this._events[eventName] = this._events[eventName] || [];
    this._events[eventName].push(listener);
    return this;
}

module.exports = EventEmitter;


