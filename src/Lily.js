import { growFlower, growStem, growLeaves, setSign, growStems } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue, getFirst } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';
import { PFTween, Ease } from 'sparkar-pftween';
import { Sound } from 'sparkar-sound';
import { randomSelect } from './RandomUtil';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const Effect = require('./Effect');

const name = 'lily';

export async function on(pos) {
    const colorList = ['Pink', 'White', 'Orange', 'Purple'];
    const root = await Scene.root.findFirst(name);
    root.transform.position = pos;
    // root.transform.rotationY = toRadian(range(0, 360));
    root.hidden = false;

    const stems = await root.findByPath('**/stem_pivot*').then(setHiddenTrue);
    const pot = await root.findFirst('pot');

    const flowers = await root.findByPath(`flowers_pool/*`).then(setHiddenTrue);
    const leaves = await root.findByPath(`leaves_pool/*`).then(setHiddenTrue);

    const flowersGrowPoints = await root.findByPath(`**/flower_grow_point*`);
    const leavesGrowPoints = await root.findByPath(`**/leaf_grow_point*`);

    const sign = await setSign(root, 'Stargazer Lily', 'USA, California', 'Lilium', 'Lilium orientalis', 'Meaning', 'Innocence & Purity');
    sign.hidden = true;

    await invokeOnce(TouchGestures.onTap(pot), async () => {
        // await Effect.rain();
        stems.forEach(async stem => {
            const block = await stem.findByPath('*').then(getFirst);
            block.inputs.setBoolean(randomSelect(colorList), true);
        });
        await growStems(stem);
        await growFlower(flowersGrowPoints, flowers, 'xz');
        await growLeaves(leavesGrowPoints, leaves, 'xy', async (leaf, point) => {
            leaf.transform.rotationY = point.transform.rotationY.add(toRadian(range(-180, 180)));
            const child = await leaf.findByPath('*').then(getFirst);
            const size = range(1, 2.5);
            child.transform.scale = Reactive.pack3(size, size, size);
        });
        new Sound('sfx_pop').play();
        sign.transform.scale = new PFTween(0, 1, 500).onStartVisible(sign).setEase(Ease.easeOutBack).scale;
    });

    return pot;
}