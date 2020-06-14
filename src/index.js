
const Diagnostics = require('Diagnostics');
const Plant = require('./Plant');

main();

async function main() {
    const all_init = [
        Plant.init(),
    ];

    await Promise.all(all_init);
}