let privates = instantiatePrivateMap();

export class PFEventSource {
    constructor(getCallbackStorage) {
        privates(this).callbackGetter = getCallbackStorage;
    }

    /**
     * @param {{(event:any):void}} callback 
     */
    subscribe(callback) {
        privates(this).callbackGetter().push(callback);
        return new PFSubscription(privates(this).callbackGetter, callback);
    }
}

class PFSubscription {
    constructor(getCallbackStorage, lastEvent) {
        privates(this).callbackGetter = getCallbackStorage;
        privates(this).lastEvent = lastEvent;
    }

    unsubscribe() {
        removeItemOnce(privates(this).callbackGetter(), privates(this).lastEvent);
    }
}

export function invokeEvents(events, ...param) {
    events.forEach(event => event.apply(null, param));
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function instantiatePrivateMap() {
    const map = new WeakMap();
    return obj => {
        let props = map.get(obj);
        if (!props) {
            props = {};
            map.set(obj, props);
        }
        return props;
    };
}