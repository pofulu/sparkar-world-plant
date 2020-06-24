import { growStems, setSign } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue, getFirst } from 'sparkar-scenequery';
import { PFTween, Ease } from 'sparkar-pftween';
import { Sound } from 'sparkar-sound';
import { randomSelect } from './RandomUtil';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const Effect = require('./Effect');

const name = 'daisy';

export async function on(pos) {
    const colorList = ['Red', 'Pink', 'Yellow', 'Purple'];
    const root = await Scene.root.findFirst(name);
    root.transform.position = pos;
    // root.transform.rotationY = toRadian(range(0, 360));
    root.hidden = false;

    const pot = await root.findFirst('pot');

    const stems = await root.findByPath('**/stem_pivot*').then(setHiddenTrue);
    // const flowers = await root.findByPath(`flowers_pool/*`).then(setHiddenTrue);
    // const leaves = await root.findByPath(`leaves_pool/*`).then(setHiddenTrue);

    // const flowersGrowPoints = await root.findByPath(`**/flower_grow_point*`);
    // const leavesGrowPoints = await root.findByPath(`**/leaf_grow_point*`);

    const sign = await setSign(root, 'Gerbera Daisy', 'South Africa', 'Transvaal daisy', 'Gerbera jamesonii', 'Meaning', 'Happiness & Cheerfulness');
    sign.hidden = true;

    invokeOnce(TouchGestures.onTap(pot), async () => {
        // await Effect.rain();
        stems.forEach(async stem => {
            const block = await stem.findByPath('*').then(getFirst);
            block.inputs.setBoolean(randomSelect(colorList), true);
        });
        await growStems(stems);
        // await growFlower(flowersGrowPoints, flowers, 'xz');
        // await growLeaves(leavesGrowPoints, leaves, 'xy');
        new Sound('sfx_pop').play();
        sign.transform.scale = new PFTween(0, 1, 500).onStartVisible(sign).setEase(Ease.easeOutBack).scale;
    })

    return pot;
}