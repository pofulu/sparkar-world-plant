const Persistence = require('Persistence');
const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');


const initData = {
    count: 0
}

export async function addPlayCount() {
    const userScope = Persistence.userScope;
    const currentCount = await getPlayTimes();
    currentCount++;
    await userScope.set('data', { count: currentCount });
}

export async function resetPlayCount() {
    const userScope = Persistence.userScope;
    await userScope.set('data', { count: 0 });
}

function getPersistenceData() {
    const userScope = Persistence.userScope;
    return userScope.get('data')
        .then(result => {
            if (result == undefined) {
                return { count: 0 };
            } else {
                return result;
            }
        }).catch(() => {
            return { count: 0 };
        });
}

/**
 * @returns {Promise<number>}
 */
export async function getPlayTimes() {
    const data = await getPersistenceData();
    return data.count;
}

export async function reset() {

}