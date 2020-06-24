import { growFlower, growStem, growLeaves, setSign } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue, getFirst } from 'sparkar-scenequery';
import { range, randomSelect } from './RandomUtil';
import { toRadian } from 'sparkar-remap';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const Effect = require('./Effect');

const name = 'orchid';

export async function on(pos) {
    const colorList = ['Pink', 'White', 'Orange', 'Purple'];
    const color = randomSelect(colorList);
    const root = await Scene.root.findFirst(name);
    root.transform.position = pos;
    // root.transform.rotationY = toRadian(range(0, 360));
    root.hidden = false;

    const stem = await root.findFirst('stem_pivot');
    const pot = await root.findFirst('pot');

    const flowers = await root.findByPath(`flowers_pool/*`).then(setHiddenTrue);
    const leaves = await root.findByPath(`leaves_pool/*`).then(setHiddenTrue);

    const flowersGrowPoints = await root.findByPath(`**/flower_grow_point*`);
    const leavesGrowPoints = await root.findByPath(`**/leaf_grow_point*`);

    stem.hidden = true;

    // setSign(root, 'Red Rose', 'China', 'Rosa', 'Rosa chinensis', 'Meaning', 'I Love You');

    invokeOnce(TouchGestures.onTap(pot), async () => {
        // await Effect.rain();
        flowers.forEach(async f => {
            const block = await f.findByPath('*').then(getFirst);
            block.inputs.setBoolean(color, true);
        })
        await growStem(stem);
        await growFlower(flowersGrowPoints, flowers, 'xz');
        await growLeaves(leavesGrowPoints, leaves, 'xy');
    })
    return pot;
}