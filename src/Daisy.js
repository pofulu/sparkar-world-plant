import { growFlower, growStems, growLeaves } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue, setScaleZero } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const Effect = require('./Effect');

const name = 'daisy';

export async function on(pos) {
    const root = await Scene.root.findFirst(name);
    root.transform.position = pos;
    root.transform.rotationY = toRadian(range(0, 360));
    root.hidden = false;

    const pot = await root.findFirst('pot');
    
    const stems = await root.findByPath('**/stem_pivot*').then(setHiddenTrue);
    const flowers = await root.findByPath(`flowers_pool/*`).then(setHiddenTrue);
    const leaves = await root.findByPath(`leaves_pool/*`).then(setHiddenTrue);

    const flowersGrowPoints = await root.findByPath(`**/flower_grow_point*`);
    const leavesGrowPoints = await root.findByPath(`**/leaf_grow_point*`);

    invokeOnce(TouchGestures.onTap(pot), async () => {
        await Effect.rain();
        await growStems(stems);
        await growFlower(flowersGrowPoints, flowers, 'xz');
        await growLeaves(leavesGrowPoints, leaves, 'xy');
    })

    return pot;
}