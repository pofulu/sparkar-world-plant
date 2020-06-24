import { randomSelect, range } from './RandomUtil';
import { BrownianMotion } from './BrownianMotion';
import { getFirst } from 'sparkar-scenequery';
import { PFTween, Ease } from 'sparkar-pftween';

const Scene = require('Scene');
const Reactive = require('Reactive');

export async function init() {
    const bufferflies = await Scene.root.findByPath('**/butterfly_root/*');
    bufferflies.forEach(set_bufferfly);
}

export async function on() {
    const scalein = async root => {
        const butterfly = await root.findFirst("butterfly");
        butterfly.transform.scale = new PFTween(0, range(0.7, 0.85), 600).setEase(Ease.easeOutBack).scale;
    }

    const bufferflies = await Scene.root.findByPath('**/butterfly_root/*');
    bufferflies.forEach(scalein);
}

export async function off() {
    const scaleout = async root => {
        const butterfly = await root.findFirst("butterfly");
        butterfly.transform.scale = new PFTween(0, range(0.7, 0.85), 600).setEase(Ease.easeOutBack).scale;
    }

    const bufferflies = await Scene.root.findByPath('**/butterfly_root/*');
    bufferflies.forEach(scaleout);
}

const type = ['Green', 'Blue', 'Yellow', 'Pink'];

async function set_bufferfly(root) {
    const setRotation = (sceneObject, transform) => {
        sceneObject.transform.rotationX = transform.rotationX;
        sceneObject.transform.rotationY = transform.rotationY;
        sceneObject.transform.rotationZ = transform.rotationZ;
    };

    const lookAt = (target, lookerParent, looker) => {
        const ptToLookAt = target.transform.position;
        const lookAtTransform = lookerParent.transform.lookAt(ptToLookAt);
        setRotation(looker, lookAtTransform);
    };

    const pivot = await root.findFirst("pivot");
    const followNull = await root.findFirst("followNull");
    const targetNull = await root.findFirst("targetNull");

    // Random color
    const butterfly = await root.findFirst("butterfly");
    butterfly.inputs.setBoolean(randomSelect(type), true);

    // Random animation
    const planeTracker0_root = await Scene.root.findByPath('**/planeTracker0/root').then(getFirst);

    pivot.worldTransform.position = targetNull.worldTransform.position.expSmooth(200);
    followNull.worldTransform.position = targetNull.worldTransform.position.expSmooth(200);

    new BrownianMotion(targetNull)
        .setPosition(
            { positionAmplitude: .3, positionScale: Reactive.pack3(1, 0.5, 1), positionFrequency: range(0.2, 0.35) },
            planeTracker0_root.worldTransform.position.expSmooth(2000)
        );

    // Do the look at
    lookAt(targetNull, followNull, pivot);
}
