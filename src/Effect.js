import { Particle } from 'sparkar-particle';
import { PFTween, Ease } from 'sparkar-pftween';
import { delay } from '../../SPKAR Lib/Util';

const Scene = require('Scene');

export async function rain() {
    const cloud = await Scene.root.findFirst('cloud_pivot');
    await new PFTween(0, 1, 600)
        .setEase(Ease.easeOutBack)
        .bind(v => cloud.transform.scale = v.scale)
        .clip();

    const ps_rain = new Particle(await Scene.root.findFirst('ps_rain')).setFadeout().setScaleout();
    ps_rain.start(200);

    await delay(2000);

    ps_rain.stop();

    await new PFTween(1, 0, 600)
        .setEase(Ease.easeInBack)
        .bind(v => cloud.transform.scale = v.scale)
        .clip();
}