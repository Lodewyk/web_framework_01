/**
 * Handles events
 * 
 * @TODO more detail
 */

// type alias/annotation for "on" method callback, indicating a method that returns nothing (`() => {}` would indicate a method that returns an object)
type Callback = () => void;

export class Eventing {
    // store callback events for "on" function
    events: {[key: string]: Callback[]} = {}; // [key: string] indicates that this will be an array with string keys (key names are unknown at time of creation) containing arrays of callback methods

    // register new event
    on = (event: string, callback: Callback): void => {
        const handlers = this.events[event] || []; // `|| []` handles the first time this is called by defaulting to an empty array if there is no key in this.event with the name {event}
        handlers.push(callback);
        this.events[event] = handlers;
    }

    // trigger event
    trigger = (event: string): void => {
        const handlers = this.events[event];

        // check that the handler(s) are defined, return if not
        if (!handlers || handlers.length === 0) {
            return;
        }

        // loop through saved events and run all the callback functions registered to the event name
        handlers.forEach(callback => {
            callback();
        });
    }
}