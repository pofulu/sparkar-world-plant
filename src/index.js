import { Device } from 'sparkar-device';
import { addPlayCount } from './State';

const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');
const Plant = require('./Plant');

main();

async function main() {
    const all_init = [
        Plant.init(),
    ];

    await Promise.all(all_init);

    Reactive.or(Device.isCapturingPhoto, Device.isRecordingVideo).onOn().subscribe(() => {
        addPlayCount();
    })
}