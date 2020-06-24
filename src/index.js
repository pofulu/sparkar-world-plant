import { WorldObject } from './WorldObject';
import { shuffle, invokeOnceList } from './Util';
import { Device } from 'sparkar-device';
import { invokeOnce } from 'sparkar-invoke';
import { randomSelect } from './RandomUtil';

const Reactive = require('Reactive');
const Scene = require('Scene');
const Textures = require('Textures');
const TouchGestures = require('TouchGestures');
const Diagnostics = require('Diagnostics');

const Picker = require('sparkar-picker-handler');
const DataManager = require('./DataManager');
const Butterfly = require('./Butterfly');
const Rainbow = require('./Rainbow');


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
    await Butterfly.init();

    const times = await DataManager.getPlayTimes();
    const flowerList = shuffle(allFlowers);
    const effectList = randomSelect([Butterfly, Rainbow]);

    if (times == 0) {
        const pot0 = await flowerList[0].on(Reactive.pack3(0, 0, 0));
        invokeOnce(TouchGestures.onTap(pot0), effectList.on);

    } else if (times == 1) {
        const pot0 = await flowerList[0].on(Reactive.pack3(0.13, 0, 0));
        const pot1 = await flowerList[1].on(Reactive.pack3(-0.13, 0, 0));

        invokeOnceList([
            TouchGestures.onTap(pot0),
            TouchGestures.onTap(pot1),
        ], effectList.on);

    } else if (times == 2) {
        const pot0 = await flowerList[0].on(Reactive.pack3(0.13, 0, 0.1));
        const pot1 = await flowerList[1].on(Reactive.pack3(0, 0, -0.1));
        const pot2 = await flowerList[2].on(Reactive.pack3(-0.13, 0, 0.1));

        invokeOnceList([
            TouchGestures.onTap(pot0),
            TouchGestures.onTap(pot1),
            TouchGestures.onTap(pot2),
        ], effectList.on);
    }

    Reactive.or(Device.isRecordingVideo, Device.isCapturingPhoto).onOn().subscribe(State.addPlayCount);
    set_pot_textures();
}

async function set_pot_textures() {
    const all_pots = await Scene.root.findByPath('**/pot');
    const all_textures = await Textures.findUsingPattern('pot_*');

    Picker.setVisible(true);
    await Picker.configUsingNames([
        'picker_camo',
        'picker_heart',
        'picker_simple',
        'picker_glassphoto',
        'picker_metal',
        'picker_meditpattern',
        'picker_bppattern'
    ]);

    const set_texture = texture => all_pots.forEach(pot => pot.inputs.setShader('pot texture', texture.signal))

    Picker.subscribeKeywords('camo', () => set_texture(all_textures.find(t => t.name.indexOf('camo') !== -1)));
    Picker.subscribeKeywords('heart', () => set_texture(all_textures.find(t => t.name.indexOf('heart') !== -1)));
    Picker.subscribeKeywords('simple', () => set_texture(all_textures.find(t => t.name.indexOf('simple') !== -1)));
    Picker.subscribeKeywords('glassphoto', () => set_texture(all_textures.find(t => t.name.indexOf('glassphoto') !== -1)));
    Picker.subscribeKeywords('metal', () => set_texture(all_textures.find(t => t.name.indexOf('metal') !== -1)));
    Picker.subscribeKeywords('meditpattern', () => set_texture(all_textures.find(t => t.name.indexOf('meditpattern') !== -1)));
    Picker.subscribeKeywords('bppattern', () => set_texture(all_textures.find(t => t.name.indexOf('bppattern') !== -1)));
}