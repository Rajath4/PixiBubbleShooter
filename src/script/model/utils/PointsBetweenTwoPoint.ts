import { Point } from "pixi.js";
import { getDistanceBetweenTwoPoints } from "../../utils/utils";

/**
 * Get points between two specified points in a line.
 *
 * @param {Point} initialPoint Initial point to begin.
 * @param {Point} destinationPoint Destination point to reach.
 * @returns points between two point
 */
function getPointsBetweenTwoPoint(initialPoint: Point, destinationPoint: Point): Point[] {

    const points: Point[] = [];

    const distanceBTWPoints = 10;

    const xDist = destinationPoint.x - initialPoint.x;
    const yDist = destinationPoint.y - initialPoint.y;

    const distanceToCover = getDistanceBetweenTwoPoints(initialPoint, destinationPoint);
    const numberOfIteration = Math.floor(distanceToCover / distanceBTWPoints);

    const fractionOfTotal = distanceBTWPoints / distanceToCover;

    for (let i = 0; i < numberOfIteration; i++) {
        const point = new Point(
            initialPoint.x + xDist * fractionOfTotal,
            initialPoint.y + yDist * fractionOfTotal
        );
        points.push(point);
        initialPoint = point;
    }

    return points;
}

export { getPointsBetweenTwoPoint };