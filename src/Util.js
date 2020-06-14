const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');
const Time = require('Time');

export function isSignal(value) {
    return value != undefined && typeof value.pinLastValue === 'function';
}

export function isEventSource(value) {
    return value != undefined && typeof value.unsubscribe === 'function';
}

export function isSceneObject(value) {
    return value != undefined && typeof value.hidden === 'function';
}

/**
 *
 * @param {EventSource} eventSource
 * @param {{(any?:any):void}} call
 */
export function invokeOnce(eventSource, call) {
    const once = eventSource.subscribe(any => {
        once.unsubscribe();
        call(any);
    });

    return once;
}

/**
 *
 * @param {EventSource} eventSource
 * @param {{(any?:any):void}} call
 * @return {Promise<any>}
 */
export function invokeOnceThen(eventSource, call) {
    return new Promise(resolve => {
        invokeOnce(eventSource, i => {
            call(i);
            resolve(i);
        })
    })
}

/**
 *
 * @param {EventSource[]} eventSourceList
 * @param {{(any?:any):void}} call
 */
export function invokeOnceList(eventSourceList, call) {
    let events = [];
    eventSourceList.forEach(i => {
        events.push(i.subscribe(any => {
            call(any);
            unsubscribeAll();
        }));
    })

    function unsubscribeAll() {
        events.forEach(e => {
            e.unsubscribe();
        });
    }
}

/**
 * 
 * @param {EventSource[]} eventSourceList 
 * @param {{(any?:any):void}} call 
 */
export function subscribeList(eventSourceList, call) {
    eventSourceList.forEach(i => {
        i.subscribe(call);
    });
}

/**
 * @returns {BoolSignal}
 */
export function inRange(value, min, max) {
    value = typeof value.pinLastValue === 'function' ? value : Reactive.val(value);
    min = typeof min.pinLastValue === 'function' ? min : Reactive.val(min);
    max = typeof max.pinLastValue === 'function' ? max : Reactive.val(max);
    return value.ge(Reactive.min(min, max)).and(value.le(Reactive.max(min, max)));
}

/**
 * @param {SceneObjectBase[]} sceneObjects 
 */
export function visibleCount(sceneObjects) {
    return Reactive.sumList(sceneObjects.map(i => i.boundingBoxVisible.ifThenElse(1, 0)));
}

export function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function delay(ms) {
    ms = Number(ms)
    ms = Number.isNaN(ms) ? +0 : Math.max(ms, +0)

    return new Promise(resolve => Time.setTimeout(resolve, ms))
}

export function twinkling(obj, counts, duration) {
    for (let i = 0; i < counts * 2; i++) {
        Time.setTimeout(() => obj.hidden = !obj.hidden.pinLastValue(), i * duration / (counts * 2));
    }
}

export const onSetSignal = (signal, callback = () => { }) => invokeOnce(signal.monitor({ 'fireOnInitialValue': true }).select('newValue'), callback);
export const onSetSignalThen = (signal, callback = () => { }) => invokeOnceThen(signal.monitor({ 'fireOnInitialValue': true }).select('newValue'), callback);

/**
 * @param {ScalarSignal} count 
 * @param {{(iteration: number):void}} callback
 */
export function loop(count, callback) {
    onSetSignal(count, v => {
        for (let i = 0; i < v; i++) {
            callback(i);
        }
    })
}