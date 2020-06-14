const Persistence = require('Persistence');
const Diagnostics = require('Diagnostics');

const userScope = Persistence.userScope;


//WIP

export async function addPlayCount() {
    // await userScope.get('data').then(result => {
    //     result.count = 0;
    // }).catch(Diagnostics.log);
}

/**
 * @returns {Promise<number>}
 */
export async function getPlayCount() {
    userScope.get('')
}

export async function reset() {

}