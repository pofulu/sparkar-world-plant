import { growFlower, growStem } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { getFirst, setHiddenFalse, setHiddenTrue, setScaleZero } from 'sparkar-scenequery';

const Effect = require('./Effect');
const Scene = require('Scene');
const TouchGestures = require('TouchGestures');

const name = 'orchid';

export async function on() {
    await Scene.root.findByPath(`**/planeTracker0/**/${name}`).then(getFirst).then(setHiddenFalse);
    const stem = await Scene.root.findByPath(`**/planeTracker0/**/${name}/**/stem_pivot`).then(setScaleZero).then(getFirst);
    const flowers = await Scene.root.findByPath(`**/planeTracker0/**/${name}/flowers_pool/*`).then(setHiddenTrue);
    const flowersGrowPoints = await Scene.root.findByPath(`**/planeTracker0/**/${name}/**/flower_grow_point*`);
    const pot = await Scene.root.findByPath(`**/planeTracker0/**/${name}/pot_pivot/pot`).then(getFirst);
    invokeOnce(TouchGestures.onTap(pot), async () => {
        await Effect.rain();
        await growStem(stem);
        await growFlower(flowersGrowPoints, flowers);
    })
}