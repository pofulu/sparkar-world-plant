import { WorldObject } from './WorldObject';
import { shuffle } from './Util';
import { Device } from 'sparkar-device';
import { setSpeakersMute } from 'sparkar-scenequery';

const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

const State = require('./State');
const allFlowers = [
    require('./Orchid'),
    require('./Lily'),
    require('./Rose'),
    require('./Daisy'),
    require('./Tulip')
];

main();

async function main() {
    await WorldObject.init();
    const times = await State.getPlayTimes();
    const flowerList = shuffle(allFlowers);

    if (times == 0) {
        flowerList[0].on(Reactive.pack3(0, 0, 0));

    } else if (times == 1) {
        flowerList[0].on(Reactive.pack3(0.13, 0, 0));
        flowerList[1].on(Reactive.pack3(-0.13, 0, 0));

    } else if (times == 2) {
        flowerList[0].on(Reactive.pack3(0.13, 0, 0.1));
        flowerList[1].on(Reactive.pack3(0, 0, -0.1));
        flowerList[2].on(Reactive.pack3(-0.13, 0, 0.1));
    }

    Reactive.or(Device.isRecordingVideo, Device.isCapturingPhoto).onOn().subscribe(State.addPlayCount);
}
