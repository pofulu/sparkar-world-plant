import { growFlower, growStems, growLeaves, setSign } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';
import { getFirst } from 'sparkar-scenequery';
import { Sound } from 'sparkar-sound';
import { PFTween, Ease } from 'sparkar-pftween';
import { randomSelect } from './RandomUtil';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');

const Effect = require('./Effect');

const name = 'tulip';

export async function on(pos) {
    const colorList = ['blue', 'orange', 'yellow', 'red'];
    const root = await Scene.root.findFirst(name);
    root.transform.position = pos;
    // root.transform.rotationY = toRadian(range(0, 360));
    root.hidden = false;

    const pot = await root.findFirst('pot');

    const stems = await root.findByPath('**/stem_pivot*').then(setHiddenTrue);
    const flowers = await root.findByPath(`flowers_pool/*`).then(setHiddenTrue);
    const leaves = await root.findByPath(`leaves_pool/*`).then(setHiddenTrue);

    const flowersGrowPoints = await root.findByPath(`**/flower_grow_point*`);
    const leavesGrowPoints = await root.findByPath(`**/left_grow_point*`);

    const sign = await setSign(root, 'Tulip', 'Turkey, Istanbul', 'Tulipa', 'Tulipa gesneriana', 'Meaning', 'Perfect Love');
    sign.hidden = true;

    invokeOnce(TouchGestures.onTap(pot), async () => {
        // await Effect.rain();
        stems.forEach(async stem => {
            const block = await stem.findByPath('*').then(getFirst);
            block.inputs.setBoolean(randomSelect(colorList), true);
        });
        await growStems(stems);
        await growFlower(flowersGrowPoints, flowers, 'xz');
        await growLeaves(leavesGrowPoints, leaves, 'xy', async (leaf, point) => {
            leaf.transform.rotationY = point.transform.rotationY.add(toRadian(range(-180, 180)));
            const child = await leaf.findByPath('*').then(getFirst);
            const size = range(1.8, 2.5);
            child.transform.scale = Reactive.pack3(size, size, size);
        });
        new Sound('sfx_pop').play();
        sign.transform.scale = new PFTween(0, 1, 500).onStartVisible(sign).setEase(Ease.easeOutBack).scale;
    })
    return pot;
}