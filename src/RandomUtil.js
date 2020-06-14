const Random = require('Random');

const random = () => Random.random();

/**
 * @param {Array} array 
 */
export function randomSelect(array) {
    return array[random() * array.length | 0];
}

/**
 * @param {number} probability 0~1
 */
export function getChance(probability) {
    return random() < probability;
}

export function randomSign() {
    return this.getChance(0.5) ? 1 : -1;
}

export function range(min, max) {
    return random() * (Math.max(min, max) - Math.min(min, max)) + Math.min(min, max);
}

/**
 * @param {Array} list 
 * @param {number[]} weight 
 */
export function randomSelectIn(list, weight) {
    let total_weight = weight.reduce((prev, cur) => prev + cur);
    let random_num = this.range(0, total_weight);
    let weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];
        weight_sum = +weight_sum.toFixed(2);

        if (random_num <= weight_sum) {
            return list[i];
        }
    }
}

/**
 * i.e. min:0, max:5 => return [1,4,5,2,3,0]
 * @param {Number} min 
 * @param {Number} max
 */
export function getRandomShuffleIntArrayInclusive(min, max) {
    let all = [];
    for (let i = min; i < max + 1; i++) {
        all.push(i);
    }
    for (let i = all.length - 1; i > 0; i--) { // Randon Shuffle
        let j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
}
