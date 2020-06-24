import { growFlower, growStem, growLeaves, setSign } from './Plant';
import { invokeOnce } from 'sparkar-invoke';
import { setHiddenTrue } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';
import { PFTween, Ease } from 'sparkar-pftween';
import { Sound } from 'sparkar-sound';

const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const Effect = require('./Effect');

const name = 'rose';

export async function on(pos) {
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
    const sign = await setSign(root, 'Red Rose', 'China', 'Rosa', 'Rosa chinensis', 'Meaning', 'I Love You');
    sign.hidden = true;

    invokeOnce(TouchGestures.onTap(pot), async () => {
        await Effect.rain();
        await growStem(stem);
        await growFlower(flowersGrowPoints, flowers, 'xz');
        await growLeaves(leavesGrowPoints, leaves, 'xy');
        new Sound('sfx_pop').play();
        sign.transform.scale = new PFTween(0, 1, 500).onStartVisible(sign).setEase(Ease.easeOutBack).scale;
    })

    return pot;
}