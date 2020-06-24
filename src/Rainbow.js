import { randomSelect } from './RandomUtil';
import { visibleCount } from './Util';

const Scene = require('Scene');
const Reactive = require('Reactive');
const Diagnostics = require('Diagnostics');

export async function on() {
    const rainbow = await Scene.root.findFirst('rainbow');

    const pulseList = [
        'RB1 Ani Start',
        'Rb2 Ani Start',
        'RB3 Ani Start',
        'RB4 Ani Start'
    ];

    const booleanList = [
        'RB1 Visible',
        'Rb2 Visible',
        'RB3 Visible',
        'RB4 Visible'
    ];

    const index = randomSelect([0, 1, 2, 3])

    rainbow.inputs.setBoolean(booleanList[index], true);
    rainbow.inputs.setPulse(pulseList[index], Reactive.once());
}