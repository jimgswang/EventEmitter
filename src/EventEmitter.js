'use strict';


function EventEmitter() {
    /**
     * A hash to hold all registered events and their listeners
     * properties are event names, their values are arrays of 
     * listeners for that event
     */
    this._events = {};
}

EventEmitter.prototype.on = function(eventName, listener) {

}

module.exports = EventEmitter;


