
const EventEmitter = require("node:events");

class EventManager extends EventEmitter {

    subscribe(eventName, listener) {
        if (typeof listener !== "function") {
            throw new TypeError("Listener must be a function");
        }

        this.on(eventName, listener);

        return () => this.off(eventName, listener);
    }

    subscribeOnce(eventName, listener) {
        if (typeof listener !== "function") {
            throw new TypeError("Listener must be a function");
        }

        this.once(eventName, listener);
    }

    publish(eventName, ...args) {
        return this.emit(eventName, ...args);
    }

    unsubscribe(eventName, listener) {
        this.off(eventName, listener);
    }

    getListeners(eventName) {
        return this.listeners(eventName);
    }

    clear(eventName) {
        if (eventName) {
            this.removeAllListeners(eventName);
        } else {
            this.removeAllListeners();
        }
    }
}

function createEventManager() {
    return new EventManager();
}

module.exports = {
    EventManager,
    createEventManager
};
