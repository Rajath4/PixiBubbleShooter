import { Point } from "pixi.js";

/**
 * Distance between two points P(x1,y1) and Q(x2,y2) is given by: d(P, Q) = √ (x2 − x1)^2 + (y2 − y1)^2 
 * @param {*} point1
 * @param {*} point2
 */
const getDistanceBetweenTwoPoints = (point1:Point, point2:Point) => Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));


/**
 * To solve for time use the formula for time, t = d/s which means time equals distance divided by speed.
 * @param {*} speed
 * @param {*} distance
 */
const getTimeRequiredToTravelSpecifiedDistance = (speed:number, distance:number) => distance / speed;


const precisionFactor = 2;
const toFixedPrecision = (number:number) => parseFloat(number.toFixed(precisionFactor));


const toFixedPrecisionOfAPoint = (point: Point) => {
    return new Point(toFixedPrecision(point.x), toFixedPrecision(point.y));
}


const degToRad = (angle:number) => (angle * (Math.PI / 180));


/**
 * Returns angle in radian between two points
 * @param {*} Point1
 * @param {*} Point2
 * @returns
 */
const getAngleBetweenTwoPoints = (Point1:Point, Point2:Point) => {
    const distanceBetweenWeaponBubbleAndTouchPoint = {
        x: (Point1.x - Point2.x),
        y: (Point1.y - Point2.y)
    };

    //Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
    const mouseAngleInRadian = Math.atan2(distanceBetweenWeaponBubbleAndTouchPoint.y, distanceBetweenWeaponBubbleAndTouchPoint.x);

    return mouseAngleInRadian;
}


/**
* Converts the value from radian to degree
* @param {Number} angle  
*/
const radToDeg = (angle:number) => (angle * (180 / Math.PI));


const millisecondsToSeconds = (milliseconds:number) => Math.floor(milliseconds / 1000);


const secondsToMilliseconds = (seconds:number) => (seconds * 1000);


// const millisToMinutesAndSeconds = (milliseconds) => {
//     const minutes = Math.floor(milliseconds / 60000);
//     const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
//     return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
// }

const fourDigitNumberToFractions = (number:number) => (number / 9999);


/**
 * To calculate the diagonal length of a rectangle.
 * @param {*} width Width of the rectangle
 * @param {*} length Length of the rectangle
 * @returns diagonal length of a rectangle
 */
const getDiagonalLengthOfRectangle = (width:number, length:number) => toFixedPrecision(Math.sqrt(Math.pow(width, 2) + Math.pow(length, 2)));


/**
 * It will return the length of hypotenuse.
 * @param {*} opposite Length of opposite side.
 * @param {*} adjacent Length of adjacent side.
 */
const getLengthOfHypotenuse = (opposite:number, adjacent:number) => Math.sqrt(Math.pow(opposite, 2) + Math.pow(adjacent, 2));


// const intTrimmer = (number) => {
//     if (number > 999) {
//         return (parseFloat(number / 1000).toFixed(1) + "K");

//     } else {
//         return (Math.round(number));
//     }
// }

//TODO: Move this to a separate file
function getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}


export const getRandomEnumValue = <T>(anEnum: T): T[keyof T] => {
    const enumValues = (Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown) as T[keyof T][];

    const randomIndex = Math.floor(Math.random() * enumValues.length);
    const randomEnumValue = enumValues[randomIndex];
    return randomEnumValue;
}

// export const delay = (seconds: number, component: Component) => new Promise(resolve => !component ? setTimeout(resolve, seconds * 1000) : component.scheduleOnce(resolve, seconds));


export function getRandomItemsFromArray<T>(arr: T[], defaultIndex: number, count: number): T[] {
    const indices = new Set<number>();
    if (defaultIndex != -1) {
        indices.add(defaultIndex);
    }

    while (indices.size < count) {
        const index = Math.floor(Math.random() * arr.length);
        indices.add(index);
    }

    const sortedIndices = Array.from(indices).sort((a, b) => a - b);
    const result = sortedIndices.map((index) => arr[index]);

    return result;
}

export function getScaleFactor() {
    const designWidth = 1080;  // Design resolution width
    const designHeight = 1920; // Design resolution height
    const scaleX = window.innerWidth / designWidth;
    const scaleY = window.innerHeight / designHeight;
    return Math.min(scaleX, scaleY); // Choose the smaller scale to fit the design within the screen
}

export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => resolve);
    // return new Promise(resolve => setTimeout(resolve, ms));
}

export {
    degToRad, fourDigitNumberToFractions, getAngleBetweenTwoPoints, getDiagonalLengthOfRectangle, getDistanceBetweenTwoPoints, getLengthOfHypotenuse, getRandomElement
    // intTrimmer
    , getTimeRequiredToTravelSpecifiedDistance, millisecondsToSeconds, radToDeg,
    // millisToMinutesAndSeconds,
    secondsToMilliseconds, toFixedPrecision, toFixedPrecisionOfAPoint
};

