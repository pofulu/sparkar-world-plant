//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– CONFIG

const PLANE_TRACKER_NAME = 'planeTracker0';
const ROOT_NAME = 'root';
const RING_NAME = 'manip_ring';

/*  Hierarchy

PLANE_TRACKER_NAME
└─ ROOT_NAME
   ├─ <your objcets>
   └─ RING_NAME
*/

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– Gestures

import { PFTween, Ease } from 'sparkar-pftween';
import { PFEventSource, invokeEvents } from './PFEventSource';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Shaders = require('Shaders');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const d2r = 0.0174532925;

const planeTracker0 = Scene.root.findFirst(PLANE_TRACKER_NAME);
const root = Scene.root.findByPath(`**/${PLANE_TRACKER_NAME}/${ROOT_NAME}`).then(first);
const manip_ring = Scene.root.findByPath(`**/${PLANE_TRACKER_NAME}/${ROOT_NAME}/${RING_NAME}`).then(first);

let gestureStartEvents = [];
let gestureFinishEvents = [];

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– Gestures

planeTracker0.then(planeTracker => {
    TouchGestures.onTap().subscribe(gesture => planeTracker.trackPoint(gesture.location));
    TouchGestures.onPinch().subscribe(gesture => setScale(gesture.scale));
    TouchGestures.onRotate().subscribe(gesture => setRotation(gesture.rotation.mul(-1)));
    TouchGestures.onPan().subscribe(gesture => setPosition(gesture.translation));
});

function setRotation(rotation) {
    root.then(root => {
        root.transform.rotationY = rotation.add(root.transform.rotationY.pinLastValue());
    });
}

function setPosition(position) {
    root.then(root => {
        root.transform.x = position.x.mul(0.0005).add(root.transform.x.pinLastValue());
        root.transform.z = position.y.mul(0.0005).add(root.transform.z.pinLastValue());
    });
}

function setScale(scale) {
    root.then(root => {
        root.transform.scaleX = scale.mul(root.transform.scaleX.pinLastValue());
        root.transform.scaleY = scale.mul(root.transform.scaleY.pinLastValue());
        root.transform.scaleZ = scale.mul(root.transform.scaleZ.pinLastValue());
    });
}

function first(array) {
    return array[0];
}

//–––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– Ring
manip_ring.then(manip_ring => {
    manip_ring.transform.rotationX = d2r * -90;
})

const shape = Reactive.mul(
    (() => {
        const sdf_circle = Shaders.sdfCircle(Reactive.pack2(.5, .5), .25);
        const sdf_annular = Shaders.sdfAnnular(sdf_circle, -0.08);

        const sdf_rectangle = Shaders.sdfRectangle(Reactive.pack2(.5, 1), Reactive.pack2(.4, .5), { sdfVariant: 'EXACT' });
        const sdf_scale = Shaders.sdfScale(sdf_rectangle, Reactive.pack2(.5, .5), Reactive.pack2(.5, .5));

        const sdf_difference = Shaders.sdfDifference(sdf_annular, sdf_scale);
        const step = Reactive.step(sdf_difference, 0.1);
        return step;
    })(),

    (() => {
        const sdf_rectangle = Shaders.sdfRectangle(Reactive.pack2(.5, 1), Reactive.pack2(.4, .5), { sdfVariant: 'SHARP' });
        const sdf_scale = Shaders.sdfScale(sdf_rectangle, Reactive.pack2(.5, .5), Reactive.pack2(.004, .003));
        const sdf_rotation = Shaders.sdfRotation(sdf_scale, Reactive.pack2(.5, .5), 3.141);
        const sdf_translation = Shaders.sdfTranslation(sdf_rotation, Reactive.pack2(0, 0.235))
        const step = Reactive.step(sdf_translation, 0.04);
        return step;
    })()
)

const ani_fadeout = new PFTween(1, 0, 2000)
    .setEase(Ease.easeInOutSine)
    .apply(false);

const ani_breath = new PFTween(.5, 1, 500)
    .setLoops()
    .setMirror()
    .setEase(Ease.easeInOutSine)
    .apply(false);

let ani_counter_breath = 0;
let current;

TouchGestures.onRotate().subscribe(gestureEvent);
TouchGestures.onPan().subscribe(gestureEvent);
TouchGestures.onPinch().subscribe(gestureEvent);
TouchGestures.onLongPress().subscribe(gestureEvent);
TouchGestures.onTap().subscribe(fadeout);

fadeout();

function fadeout() {
    current = 'fadeout';
    mixShape();
}

function breath() {
    current = 'breath';
    mixShape();
}

function gestureEvent(gesture) {
    ani_counter_breath++;
    animate();
    invokeEvents(gestureStartEvents);

    gesture.state.eq('ENDED').onOn().subscribe(() => {
        ani_counter_breath--
        animate();
        invokeEvents(gestureFinishEvents);
    });
}

function animate() {
    switch (ani_counter_breath) {
        case 0: fadeout(); break;
        case 1: breath(); break;
        default: break;
    }
}

function mixShape() {
    const trans = Reactive.pack4(1, 1, 1, 0);

    manip_ring
        .then(obj => obj.getMaterial())
        .then(mat => {
            if (current == 'fadeout') {
                ani_fadeout.replay();
                const ani = Reactive.pack4(1, 1, 1, ani_fadeout.scalar);
                mat.setTextureSlot('DIFFUSE', Reactive.mix(ani, trans, shape))
            } else if (current == 'breath') {
                ani_breath.replay();
                const ani = Reactive.pack4(1, 1, 1, ani_breath.scalar);
                mat.setTextureSlot('DIFFUSE', Reactive.mix(ani, trans, shape))
            }
        });
}

export function onGestureStart() {
    return new PFEventSource(() => gestureStartEvents);
}

export function onGestureFinish() {
    return new PFEventSource(() => gestureFinishEvents);
}