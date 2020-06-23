
import { PFTween, Ease } from 'sparkar-pftween';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';

export async function growStem(stem, index = 0) {
    const scale = new PFTween(0, stem.transform.scaleX.pinLastValue(), 2000)
        .setEase(Ease.easeInOutSine)
        .onStartVisible(stem)
        .setDelay(index * 300)
        .bind(v => stem.transform.scale = v.scale)
        .clip;

    await scale();
}

export async function growStems(stems) {
    await Promise.all(stems.map(growStem));
}

/**
 * @param {any[]} points
 * @param {any[]} flowers
 */
export async function growFlower(points, flowers, ranRot) {
    const count = Math.min(points.length, flowers.length);

    for (let i = 0; i < count; i++) {
        const flower = flowers[i];
        const point = points[i];
        flower.worldTransform.position = point.worldTransform.position;

        if (ranRot.indexOf('x') !== -1) flower.transform.rotationX = point.transform.rotationX.add(toRadian(range(-45, 45)));
        if (ranRot.indexOf('y') !== -1) flower.transform.rotationY = point.transform.rotationY.add(toRadian(range(-45, 45)));
        if (ranRot.indexOf('z') !== -1) flower.transform.rotationZ = point.transform.rotationZ.add(toRadian(range(-45, 45)));

        const size = range(1.2, 1.5);
        flower.transform.scale = new PFTween(0, size, 1000).setDelay(i * 80).setEase(Ease.easeOutQuad).scale;
        flower.hidden = false;
    }
}

/**
 * @param {any[]} points
 * @param {any[]} leaves 
 */
export async function growLeaves(points, leaves, ranRot = true) {
    const count = Math.min(points.length, leaves.length);

    let clips = [];

    for (let i = 0; i < count; i++) {
        const leaf_pivot = leaves[i];
        const point = points[i];

        leaf_pivot.worldTransform.position = point.worldTransform.position;

        if (ranRot) {
            leaf_pivot.transform.rotationX = point.transform.rotationX.add(toRadian(range(0, 30)));
            leaf_pivot.transform.rotationY = point.transform.rotationY.add(toRadian(range(0, 30)));
            leaf_pivot.transform.rotationZ = point.transform.rotationZ;
        }

        const scalein = new PFTween(0, 1, 1000)
            .bind(v => leaf_pivot.transform.scale = v.scale)
            .onStartVisible(leaf_pivot)
            .setDelay(i * 80)
            .setEase(Ease.easeOutSine)
            .clip;

        clips.push(scalein);
    }

    await PFTween.combine(clips)();
}