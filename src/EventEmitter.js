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
        listeners.forEach(function(listener) {
            listener.apply(self, args);
        });

        return true;
    }

    return false;
};


/**
 * Remove all listeners to an event. If no event is specified,
 * remove all listeners
 * @param {Mixed} [evt] - The event whose listeners to remove
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

module.exports = EventEmitter;


