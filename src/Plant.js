
import { PFTween, Ease } from 'sparkar-pftween';
import { getFirst } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';

const Reactive = require('Reactive');
const Materials = require('Materials');
const Diagnostics = require('Diagnostics');

export async function growStem(stem) {
    const scale = new PFTween(0, 1, 2000)
        .setEase(Ease.easeInOutSine)
        .onStartVisible(stem)
        .bind(v => stem.transform.scale = v.scale)
        .clip;

    await scale();
}

/**
 * @param {any[]} points
 * @param {any[]} flowers
 */
export async function growFlower(points, flowers) {
    const count = Math.min(points.length, flowers.length);

    for (let i = 0; i < count; i++) {
        const flower = flowers[i];
        const point = points[i];
        flower.worldTransform.position = point.worldTransform.position;
        flower.transform.rotationY = toRadian(range(0, 360));
        const size = range(1.6, 2);
        flower.transform.scale = new PFTween(0, size, 1000).setDelay(i * 80).setEase(Ease.easeOutQuad).scale;
        flower.hidden = false;
    }
}

/**
 * @param {any[]} points
 * @param {any[]} leaves 
 */
export async function growLeaves(points, leaves) {
    const mat_leaf = await Materials.findFirst('mat_leaf');
    const count = Math.min(points.length, leaves.length);

    let clips = [];

    for (let i = 0; i < count; i++) {
        const leaf_pivot = leaves[i];
        const point = points[i];
        const leaf = await leaf_pivot.findByPath('*').then(getFirst);

        leaf_pivot.worldTransform.position = point.worldTransform.position;
        leaf_pivot.transform.rotationX = point.transform.rotationX.add(toRadian(range(60, 120)));
        leaf_pivot.transform.rotationY = point.transform.rotationY.add(toRadian(range(0, 360)));
        leaf_pivot.transform.rotationZ = point.transform.rotationZ;
        leaf.material = mat_leaf;

        const scalein = new PFTween(0, range(1, 2), 1000)
            .bind(v => {
                leaf_pivot.transform.scaleX = v.scalar;
                leaf_pivot.transform.scaleY = range(.7, 1.2);
                leaf_pivot.transform.scaleZ = range(1, 2);
            })
            .onStartVisible(leaf_pivot)
            .setDelay(i * 80)
            .setEase(Ease.easeOutSine)
            .clip;

        clips.push(scalein);
    }

    await PFTween.combine(clips)();
}

// export async function grow() {
//     await Scene.root.findByPath(`**/planeTracker0/**/${name}`).then(getFirst).then(setHiddenFalse);
//     const stem = await Scene.root.findByPath(`**/planeTracker0/**/${name}/**/stem_pivot`).then(getFirst);
//     const flowers = await Scene.root.findByPath(`**/planeTracker0/**/${name}/flowers_pool/*`).then(setHiddenTrue);
//     const flowersGrowPoints = await Scene.root.findByPath(`**/planeTracker0/**/${name}/**/flower_grow_point*`);
//     const leaves = await Scene.root.findByPath(`**/planeTracker0/**/${name}/leaves_pool/*`).then(setHiddenTrue);
//     const leavesGrowPoints = await Scene.root.findByPath(`**/planeTracker0/**/${name}/**/leaf_grow_point*`);
//     const pot = await Scene.root.findByPath(`**/planeTracker0/**/${name}/pot_pivot/pot`).then(getFirst);
//     invokeOnce(TouchGestures.onTap(pot), async () => {
//         Diagnostics.log('hi')
//         await Effect.rain();
//         await growStem(stem);
//         // await growLeaves(leavesGrowPoints, leaves);
//         await growFlower(flowersGrowPoints, flowers);
//     })
// }