/**
 * It will return a random item based on its weight
 * Ref: https://codetheory.in/weighted-biased-random-number-generation-with-javascript-based-on-probability/
 * @param {Array} list list of items
 * @param {Array} weight weights of the items
 * @returns random item based on its weight
 */
function getRandomItemFromListWithWeights(list:any, weight:any, randomNumber:any) {
    // var total_weight = weight.reduce(function (prev, cur, i, arr) {
    //     return prev + cur;
    // });

    // We need a random number between 0 to 1 (total_weight)
    var random_num = randomNumber;
    var weight_sum = 0;

    for (var i = 0; i < list.length; i++) {
        weight_sum += weight[i];

        if (random_num <= weight_sum) {
            return list[i];
        }
    }
    throw "Random selection failed";
}

function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export { getRandomItemFromListWithWeights, getRandomNumber };

