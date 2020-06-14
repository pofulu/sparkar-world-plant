
import { PFTween, Ease } from 'sparkar-pftween';
import { getFirst, setHiddenTrue } from 'sparkar-scenequery';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';
import { invokeOnce } from 'sparkar-invoke';

const Diagnostics = require('Diagnostics');
const Scene = require('Scene');
const TouchGestures = require('TouchGestures');
const Reactive = require('Reactive');
const Materials = require('Materials');

const Effect = require('./Effect');

export async function init() {
    const stem = await Scene.root.findByPath('**/planeTracker0/**/stem_pivot').then(getFirst).then(setHiddenTrue);

    const flowers = await Scene.root.findByPath('**/planeTracker0/**/flowers_pool/*').then(setHiddenTrue);
    const flowersGrowPoints = await Scene.root.findByPath('**/planeTracker0/**/flower_grow_point*').then(setHiddenTrue);

    const leaves = await Scene.root.findByPath('**/planeTracker0/**/leaves_pool/*').then(setHiddenTrue);
    const leavesGrowPoints = await Scene.root.findByPath('**/planeTracker0/**/leaf_grow_point*').then(setHiddenTrue);

    const seed = await Scene.root.findFirst('seed_pivot');

    const pot = await Scene.root.findByPath('**/pot_pivot/cube').then(getFirst);

    invokeOnce(TouchGestures.onTap(pot), async () => {
        await Effect.rain();
        await hideSeed(seed);
        await growStem(stem);
        await growLeaves(leavesGrowPoints, leaves);
        growFlower(flowersGrowPoints, flowers);
    })
}

async function growStem(stem) {
    const scale = new PFTween(0, 7.5, 2000)
        .setEase(Ease.easeInOutSine)
        .onStartVisible(stem)
        .bind(v => stem.transform.scaleY = v.scalar)
        .clip;

    await scale();
}

/**
 * @param {any[]} points
 * @param {any[]} flowers
 */
async function growFlower(points, flowers) {
    const count = Math.min(points.length, flowers.length);

    for (let i = 0; i < count; i++) {
        const flower = flowers[i];
        const point = points[i];
        flower.worldTransform.position = point.worldTransform.position;
        flower.transform.rotationY = toRadian(range(0, 360));
        flower.transform.scale = Reactive.scale(range(0.6, 0.7), range(0.3, 0.5), range(0.6, 0.7))
        flower.hidden = false;
    }
}

/**
 * @param {any[]} points
 * @param {any[]} leaves 
 */
async function growLeaves(points, leaves) {
    const mat_leaf = await Materials.findFirst('mat_leaf');
    const count = Math.min(points.length, leaves.length);

    let clips = [];

    for (let i = 0; i < count; i++) {
        const leaf_pivot = leaves[i];
        const point = points[i];
        const leaf = await leaf_pivot.findByPath('*').then(getFirst);

        leaf_pivot.worldTransform.position = point.worldTransform.position;
        leaf_pivot.transform.rotationX = toRadian(range(60, 120));
        leaf_pivot.transform.rotationY = toRadian(range(0, 360));
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

async function hideSeed(seed) {
    const scalein = new PFTween(1, 0, 400)
        .setEase(Ease.easeInBack)
        .bind(v => seed.transform.scale = v.scale)
        .clip;

    await scalein();
}