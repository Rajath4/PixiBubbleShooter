import { Point } from "pixi.js";
import { Rect } from "../bubbleLayout/controllers/layoutMovement/DynamicBubbleLayoutMovementController";
import { toFixedPrecisionOfAPoint, toFixedPrecision } from "../utils";

/*****Vector functions */
/**
 * Subtracts one point from another and returns a new Point.
 */
function subtractPoints(point1: Point, point2: Point) {
    return new Point(point1.x - point2.x, point1.y - point2.y);
}

/**
 * Multiplies a point by a scalar and returns a new Point.
 */
function multiplyPointScalar(point: Point, scalar: number) {
    return new Point(point.x * scalar, point.y * scalar);
}

/**
 * Calculates the dot product of two points.
 */
function dotProduct(point1: Point, point2: Point) {
    return point1.x * point2.x + point1.y * point2.y;
}

/**
 * Reflects an incident vector off a surface with a given normal vector.
 */
function pReflect(incident: Point, normal: Point) {
    const dot = dotProduct(normal, incident);
    const twiceDotNormal = multiplyPointScalar(normal, 2 * dot);
    return subtractPoints(incident, twiceDotNormal);
}



function isSameDirection(n1: number, n2: number) {
    return ((n1 >= 0) === (n2 >= 0));       //returns true if n1 and n2 have same sign ie both +ve or both -ve
}

//Ref: https://www.geeksforgeeks.org/program-for-point-of-intersection-of-two-lines/
function getIntersectionPoint(point11: Point, point12: Point, point21: Point, point22: Point): Point {
    const fixedPoint11 = toFixedPrecisionOfAPoint(point11);
    const fixedPoint12 = toFixedPrecisionOfAPoint(point12);
    const fixedPoint21 = toFixedPrecisionOfAPoint(point21);
    const fixedPoint22 = toFixedPrecisionOfAPoint(point22);

    //Logic to find intersection point
    const a1 = fixedPoint12.y - fixedPoint11.y;
    const b1 = fixedPoint11.x - fixedPoint12.x;
    const c1 = a1 * fixedPoint11.x + b1 * fixedPoint11.y;

    const a2 = fixedPoint22.y - fixedPoint21.y;
    const b2 = fixedPoint21.x - fixedPoint22.x;
    const c2 = a2 * fixedPoint21.x + b2 * fixedPoint21.y;

    const delta = a1 * b2 - a2 * b1;

    if (delta === 0) {// The lines are parallel.
        return null;
    }

    let intersectionPoint = new Point((b2 * c1 - b1 * c2) / delta, (a1 * c2 - a2 * c1) / delta);
    intersectionPoint = toFixedPrecisionOfAPoint(intersectionPoint);

    if (checkIfIntersectionIsValid(fixedPoint11, fixedPoint12, fixedPoint21, fixedPoint22, intersectionPoint)) {
        return intersectionPoint
    }

    return null;
}

function checkIfIntersectionIsValid(point11: Point, point12: Point, point21: Point, point22: Point, intersectionPoint: Point) {
    //Checking if the given point is valid ie in boundary and is on the direction of the vector 
    if (intersectionPoint.x <= Math.max(point21.x, point22.x) && intersectionPoint.x >= Math.min(point21.x, point22.x)) {
        if (intersectionPoint.y <= Math.max(point21.y, point22.y) && intersectionPoint.y >= Math.min(point21.y, point22.y)) {
            //checking direction
            if (isSameDirection(point12.x - point11.x, intersectionPoint.x - point11.x) && isSameDirection(point12.y - point11.y, intersectionPoint.y - point11.y)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

export type CollisionPoint = { point: Point, reflectionVector: Point };


function getCollisionPointWithBorder(startPoint: Point, nextPoint: Point, rect: Rect) {
    // Left border
    let borderCollisionPoint = getIntersectionPoint(startPoint, nextPoint, new Point(rect.x, rect.y), new Point(rect.x, rect.y + rect.height));
    if (borderCollisionPoint) {
        const incident = new Point(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y);
        let normal = new Point(-1, 0);

        const reflectionVector = pReflect(incident, normal);
        return { point: borderCollisionPoint, reflectionVector: reflectionVector };
    }

    // Top border
    borderCollisionPoint = getIntersectionPoint(startPoint, nextPoint, new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y));
    if (borderCollisionPoint) {
        const incident = new Point(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y);
        let normal = new Point(0, -1);

        const reflectionVector = pReflect(incident, normal);
        return { point: borderCollisionPoint, reflectionVector: reflectionVector };
    }

    // Right border
    borderCollisionPoint = getIntersectionPoint(startPoint, nextPoint, new Point(rect.x + rect.width, rect.y), new Point(rect.x + rect.width, rect.y + rect.height));
    if (borderCollisionPoint) {
        const incident = new Point(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y);
        let normal = new Point(1, 0);

        const reflectionVector = pReflect(incident, normal);
        return { point: borderCollisionPoint, reflectionVector: reflectionVector };
    }

    // Bottom border
    borderCollisionPoint = getIntersectionPoint(startPoint, nextPoint, new Point(rect.x, rect.y + rect.height), new Point(rect.x + rect.width, rect.y + rect.height));
    if (borderCollisionPoint) {
        const incident = new Point(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y);
        let normal = new Point(0, 1);

        const reflectionVector = pReflect(incident, normal);
        return { point: borderCollisionPoint, reflectionVector: reflectionVector };
    }

    // If no collision is detected, than throwing an error
    console.error("No valid collision point found");
    throw "How it came here?"
}


export { getCollisionPointWithBorder };