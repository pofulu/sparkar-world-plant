const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');
const Orchid = require('./Orchid');

main();

async function main() {
    // const count = await getPlayCount();

    // if (count == 0) {
    //     await setPot(0);
    // } else if (count == 1) {
    //     await setPot(0);
    //     await setPot(1);
    // } else if (count >= 2) {
    //     await setPot(1);
    //     await setPot(2);
    // }

    // Reactive.or(Device.isCapturingPhoto, Device.isRecordingVideo).onOn().subscribe(addPlayCount);

    Orchid.on();
}