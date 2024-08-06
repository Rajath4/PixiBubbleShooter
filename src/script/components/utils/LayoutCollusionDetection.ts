import { Point } from 'pixi.js';
import { TileGrid, TileStatus } from '../bubbleLayout/model/TileGrid';
import { getDistanceBetweenTwoPoints } from '../utils';

/**
 * Function returns collusin point if it happens anywhere in given line or else it will return {x:-1,y:-1}
 * @param {Point} p1 
 * @param {Point} p2 
 * @param {TileGrid} tiles 
 * @param {number} radius 
 * @param {(position: Point) => Point} nodeSpaceConverter 
 * @returns {Point} collusion point
 */
function getCollusionPoint(p1: Point, p2: Point, tiles: TileGrid, radius: number, nodeSpaceConverter: (position: Point) => Point): Point {
    let shortestDistance: number = null;
    let collusionPoint = new Point(-1, -1);

    tiles.forEach((rowElements, row) => {
        rowElements.forEach((tile, colIndex) => {
            if (tile && tile.tileStatus != TileStatus.EMPTY) {
                // Adjust the position calculation for the new anchor point
                let bubbleCenterPosition = new Point(
                    tile.position.x + radius,
                    tile.position.y + radius
                );
                let bubblePosition = nodeSpaceConverter(bubbleCenterPosition);
                if (distenceToline(bubblePosition, p1, p2) <= 1.5 * radius) {
                    let m = getSlope(p1, p2);
                    let yint = getYIntercept(m, p1);
                    let points = findCircleLineIntersections(1.5 * radius, bubblePosition, m, yint);
                    let mindistence;
                    let PointOnLine;
                    let distance1 = getDistanceBetweenTwoPoints(points.p1, p1);
                    let distence2 = getDistanceBetweenTwoPoints(points.p2, p1);
                    if (distance1 < distence2) {
                        if (isInSegment(points.p1, p1, p2)) {
                            mindistence = distance1;
                            PointOnLine = points.p1;
                        }
                        else if (isInSegment(points.p2, p1, p2)) {
                            mindistence = distence2;
                            PointOnLine = points.p2;
                        }
                        else {
                            // continue;
                        }
                    }
                    else {
                        if (isInSegment(points.p2, p1, p2)) {
                            mindistence = distence2;
                            PointOnLine = points.p2;
                        }
                        else if (isInSegment(points.p1, p1, p2)) {
                            mindistence = distance1;
                            PointOnLine = points.p1;
                        }
                        else {
                            // continue;
                        }
                    }
                    if (mindistence < shortestDistance || shortestDistance == null) {
                        shortestDistance = mindistence;
                        collusionPoint = PointOnLine;
                    }
                }
            }
        });
    });
    return collusionPoint;
}

/**
 * function returns true if point p is in the boundaries of P1 and P2
 * NOTE: function doesn't check if the point is on line segment it only checks if x and y are in range
 * @param {Point} p 
 * @param {Point} P1 
 * @param {Point} P2 
 * @returns {boolean} true if point is in segment, false otherwise
 */
function isInSegment(p: Point, P1: Point, P2: Point): boolean {
    if (p.x <= Math.max(P1.x, P2.x) && p.x >= Math.min(P1.x, P2.x)) {
        if (p.x <= Math.max(P1.x, P2.x) && p.x >= Math.min(P1.x, P2.x)) {
            return true;
        }
    }
    return false;
}

/**
 * Calculates the slope of a line given two points
 * @param {Point} P1 
 * @param {Point} P2 
 * @returns {number} slope of the line
 */
function getSlope(P1: Point, P2: Point): number {
    if ((P2.x - P1.x) === 0) {
        console.warn("(P2.x - P1.x)<0.01");
    }
    return (P2.y - P1.y) / (P2.x - P1.x);
}

/**
 * Calculates the y-intercept of a line given its slope and a point on the line
 * @param {number} m 
 * @param {Point} p1 
 * @returns {number} y-intercept of the line
 */
function getYIntercept(m: number, p1: Point): number {
    return p1.y - m * p1.x;
}

/**
 * Calculates the distance between a point and a line formed by two other points
 * @param {Point} p 
 * @param {Point} P1 
 * @param {Point} P2 
 * @returns {number} distance from the point to the line
 */
function distenceToline(p: Point, P1: Point, P2: Point): number {
    let nominator = Math.abs((P2.y - P1.y) * p.x - (P2.x - P1.x) * p.y + P2.x * P1.y - P2.y * P1.x);
    return nominator / Math.sqrt((P2.y - P1.y) * (P2.y - P1.y) + (P2.x - P1.x) * (P2.x - P1.x));
}

/**
 * Finds points which are on line having m as slope and n as y intersect and intersecting with circle with radius and center
 * @param {number} radius radius of circle
 * @param {Point} centre center of circle
 * @param {number} m slope of line
 * @param {number} n y-intercept of line
 * @returns {{p1: Point, p2: Point}} points of intersection
 */
function findCircleLineIntersections(radius: number, centre: Point, m: number, n: number): { p1: Point, p2: Point } {
    // circle: (x - centre.x)^2 + (y - centre.y)^2 = radius^2
    // line: y = m * x + n
    // r: circle radius
    // centre.x: x value of circle centre
    // centre.y: y value of circle centre
    // m: slope
    // n: y-intercept

    // get a, b, c values
    var a = 1 + Math.pow(m, 2);
    var b = -centre.x * 2 + (m * (n - centre.y)) * 2;
    var c = Math.pow(centre.x, 2) + Math.pow(n - centre.y, 2) - Math.pow(radius, 2);

    // get discriminant
    var d = Math.pow(b, 2) - 4 * a * c;
    if (d >= 0) {
        // insert into quadratic formula
        let x1 = (-b + Math.sqrt((b * b) - 4 * a * c)) / (2 * a);
        let x2 = (-b - Math.sqrt((b * b) - 4 * a * c)) / (2 * a);
        let y1 = m * x1 + n;
        let y2 = m * x2 + n;
        return { p1: new Point(x1, y1), p2: new Point(x2, y2) };
    }
    // no intersection
    // return [];

    //TODO: Check me
    return { p1: new Point(null, null), p2: new Point(null, null) };
}

export { getCollusionPoint };
