
import { PFTween, Ease } from 'sparkar-pftween';
import { range } from './RandomUtil';
import { toRadian } from 'sparkar-remap';
import { getFirst, logName } from 'sparkar-scenequery';

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
        flower.transform.scale = new PFTween(0, size, 1000).setDelay(i * 100).setEase(Ease.easeOutQuad).scale;
        flower.hidden = false;
    }
}

/**
 * @param {any[]} points
 * @param {any[]} leaves 
 */
export async function growLeaves(points, leaves, ranRot, onGrow) {
    const count = Math.min(points.length, leaves.length);

    let clips = [];

    for (let i = 0; i < count; i++) {
        const leaf_pivot = leaves[i];
        const point = points[i];

        leaf_pivot.worldTransform.position = point.worldTransform.position;

        if (ranRot.indexOf('x') !== -1) leaf_pivot.transform.rotationX = point.transform.rotationX.add(toRadian(range(-10, 10)));
        if (ranRot.indexOf('y') !== -1) leaf_pivot.transform.rotationY = point.transform.rotationY.add(toRadian(range(-10, 10)));
        if (ranRot.indexOf('z') !== -1) leaf_pivot.transform.rotationZ = point.transform.rotationZ.add(toRadian(range(-10, 10)));

        const scalein = new PFTween(0, 1, 1000)
            .bind(v => leaf_pivot.transform.scale = v.scale)
            .onStartVisible(leaf_pivot)
            .setDelay(i * 80)
            .setEase(Ease.easeOutSine)
            .clip;

        clips.push(scalein);

        if (onGrow != undefined)
            onGrow(leaf_pivot, point);
    }

    await PFTween.combine(clips)();
}

export async function setSign(root, name, origin, genus, species, meaning_header, meaning) {
    const _name = await root.findFirst('name');
    const _origin = await root.findFirst('origin');
    const _genus = await root.findFirst('genus');
    const _species = await root.findFirst('species');
    const _meaning_header = await root.findFirst('meaning header');
    const _meaning = await root.findFirst('meaning');

    _name.transform.y = 55;
    _name.text = name;
    _origin.transform.y = 35;
    _origin.text = origin;
    _genus.transform.y = 20;
    _genus.text = genus;
    _species.transform.y = 10;
    _species.text = species;
    _meaning_header.transform.y = -15;
    _meaning_header.text = meaning_header;
    _meaning.transform.y = -35;
    _meaning.text = meaning;

    return await root.findByPath('sign*').then(getFirst);
}