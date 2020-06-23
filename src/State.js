const Persistence = require('Persistence');
const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');

const userScope = Persistence.userScope;

const initData = {
    count: 0
}

//WIP
export async function addPlayCount() {
    const currentData = await getPersistenceData();
    currentData.count++;

    await userScope.set('data', { data: currentData });
}

export async function resetPlayCount() {
    const currentData = await getPersistenceData();
    currentData.count = 0;

    await userScope.set('data', { data: currentData });
}

async function getPersistenceData() {
    let request;
    try {
        request = await userScope.get('data');
        if (request == undefined) {
            request = { data: initData };
        }
    } catch (error) {
        request = { data: initData };
    }

    return request.data;
}

/**
 * @returns {Promise<number>}
 */
export async function getPlayTimes() {
    const currentData = await getPersistenceData();

    return currentData.count;
}

export async function reset() {

}