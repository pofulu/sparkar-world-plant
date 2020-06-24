import { toRadian } from 'sparkar-remap'
import { fbm } from './Perlin';

const Reactive = require('Reactive');
const Time = require('Time');
const Scene = require('Scene');

const privates = instantiatePrivateMap();

const fbmNorm = Reactive.val(1 / 0.75);
const runtime = Time.ms.div(Reactive.val(1000));

export class BrownianMotion {
    /**
     * @param {SceneObjectBase} sceneObject 
     */
    constructor(sceneObject) {
        privates(this).time = [];
        privates(this).sceneObject = sceneObject;

        this.baseRotation = Reactive.pack3(
            sceneObject.transform.rotationX.pinLastValue(),
            sceneObject.transform.rotationY.pinLastValue(),
            sceneObject.transform.rotationZ.pinLastValue(),
        );

        this.basePosition = Reactive.pack3(
            sceneObject.transform.x.pinLastValue(),
            sceneObject.transform.y.pinLastValue(),
            sceneObject.transform.z.pinLastValue()
        );

        this.baseScale = Reactive.pack3(
            sceneObject.transform.scaleX.pinLastValue(),
            sceneObject.transform.scaleY.pinLastValue(),
            sceneObject.transform.scaleZ.pinLastValue()
        );

        this.rehash();
    }

    /**
     * @param {Object} [config]
     * @param {BoolSignal} config.enablePositionNoise
     * @param {PointSignal} config.positionScale
     * @param {ScalarSignal} config.positionAmplitude
     * @param {number} config.positionFractalLevel
     * @param {ScalarSignal} config.positionFrequency
     */
    setPosition(config, offset) {
        const enablePositionNoise = config && config.enablePositionNoise ? config.enablePositionNoise : true;
        const positionScale = config && config.positionScale ? config.positionScale : Reactive.pack3(1, 1, 0);
        const positionAmplitude = config && config.positionAmplitude ? config.positionAmplitude : Reactive.val(0.1);
        const positionFractalLevel = config && config.positionFractalLevel ? config.positionFractalLevel : 3;
        const positionFrequency = config && config.positionFrequency ? config.positionFrequency : Reactive.val(0.1);

        const time = privates(this).time;
        const sceneObject = privates(this).sceneObject;

        if (enablePositionNoise) {
            time[0] = time[0].add(runtime.mul(positionFrequency));
            time[1] = time[1].add(runtime.mul(positionFrequency));
            time[2] = time[2].add(runtime.mul(positionFrequency));

            let n = Reactive.pack3(
                fbm(time[0], positionFractalLevel),
                fbm(time[1], positionFractalLevel),
                fbm(time[2], positionFractalLevel)
            )
                .mul(positionScale)
                .mul(positionAmplitude)
                .mul(fbmNorm);

            sceneObject.transform.position = Reactive.pack3(
                this.basePosition.add(n).x.add(offset.x),
                this.basePosition.add(n).y.add(offset.y),
                this.basePosition.add(n).z.add(offset.z)
            );
        }
        return this;
    }

    /** 
     * @param {Object} [config]
     * @param {BoolSignal} config.enableRotationNoise
     * @param {PointSignal} config.rotationScale
     * @param {ScalarSignal} config.rotationAmplitude
     * @param {number} config.rotationFractalLevel
     * @param {ScalarSignal} config.rotationFrequency
     */
    setRotation(config) {
        const enableRotationNoise = config && config.enableRotationNoise ? config.enableRotationNoise : true;
        const rotationScale = config && config.rotationScale ? config.rotationScale : Reactive.pack3(0, 0, 1);
        const rotationAmplitude = config && config.rotationAmplitude ? config.rotationAmplitude : Reactive.val(30);
        const rotationFractalLevel = config && config.rotationFractalLevel ? config.rotationFractalLevel : 3;
        const rotationFrequency = config && config.rotationFrequency ? config.rotationFrequency : Reactive.val(0.1);

        const time = privates(this).time;
        const sceneObject = privates(this).sceneObject;

        if (enableRotationNoise) {
            time[3] = time[3].add(runtime.mul(rotationFrequency));
            time[4] = time[4].add(runtime.mul(rotationFrequency));
            time[5] = time[5].add(runtime.mul(rotationFrequency));

            const n = Reactive.pack3(
                fbm(time[3], rotationFractalLevel),
                fbm(time[4], rotationFractalLevel),
                fbm(time[5], rotationFractalLevel)
            )
                .mul(rotationScale)
                .mul(rotationAmplitude)
                .mul(fbmNorm);

            sceneObject.transform.rotationX = toRadian(n.x).add(this.baseRotation.x);
            sceneObject.transform.rotationY = toRadian(n.y).add(this.baseRotation.y);
            sceneObject.transform.rotationZ = toRadian(n.z).add(this.baseRotation.z);
        }
        return this;
    }

    /**
     * 
     * @param {Object} [config]
     * @param {BoolSignal} config.enableScaleNoise
     * @param {PointSignal} config.scaleScale
     * @param {ScalarSignal} config.scaleAmplitude
     * @param {number} config.scaleFractalLevel
     * @param {ScalarSignal} config.scaleFrequency
     */
    setScale(config) {
        const enableScaleNoise = config && config.enableScaleNoise ? config.enableScaleNoise : true;
        const scaleScale = config && config.scaleScale ? config.scaleScale : Reactive.pack3(1, 1, 0);
        const scaleAmplitude = config && config.scaleAmplitude ? config.scaleAmplitude : Reactive.val(1);
        const scaleFractalLevel = config && config.scaleFractalLevel ? config.scaleFractalLevel : 3;
        const scaleFrequency = config && config.scaleFrequency ? config.scaleFrequency : Reactive.val(0.1);

        const time = privates(this).time;
        const sceneObject = privates(this).sceneObject;

        if (enableScaleNoise) {
            time[6] = time[6].add(runtime.mul(scaleFrequency));
            time[7] = time[7].add(runtime.mul(scaleFrequency));
            time[8] = time[8].add(runtime.mul(scaleFrequency));

            const n = Reactive.pack3(
                fbm(time[6], scaleFractalLevel),
                fbm(time[7], scaleFractalLevel),
                fbm(time[8], scaleFractalLevel)
            )
                .mul(scaleScale)
                .mul(scaleAmplitude)
                .mul(fbmNorm);

            sceneObject.transform.scaleX = n.x.add(this.baseScale.x);
            sceneObject.transform.scaleY = n.y.add(this.baseScale.y);
            sceneObject.transform.scaleZ = n.z.add(this.baseScale.z);
        }
        return this;
    }

    rehash() {
        for (var i = 0; i < 9; i++) {
            privates(this).time[i] = Reactive.val(Math.random() * 10000 - 10000);
        }
    }
}

function instantiatePrivateMap() {
    const map = new WeakMap();
    return obj => {
        let props = map.get(obj);
        if (!props) {
            props = {};
            map.set(obj, props);
        }
        return props;
    };
}