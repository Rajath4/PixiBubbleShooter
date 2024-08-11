import { Point } from "pixi.js";
import { TileGrid } from "../types/BubbleGridInterfaces";
import { CollisionPoint, getCollisionPointWithBorder } from "./utils/BorderCollusionPointDetector";
import { getCollusionPoint } from "./utils/LayoutCollusionDetection";
import { Rect } from "../types/GamePlayEngineDependency";

export default class TrajectoryGenerator {
    /**
       * It will give trajectory coordinates
       * @param {*} rayStartPoint Start point of the ray
       * @param {*} rayEndPoint End point of the ray
       * @returns List of trajectory coordinates
       */
    getTrajectory(rayStartPoint: Point, rayEndPoint: Point, boundaryRect: Rect, tilesInGrid: TileGrid, lowRange: number, highRange: number, radiusOfBubble: number, nodeSpaceConverter:any) {
        const bubbleTrajectory: Point[] = [];
        // var i = 0;//Debug TODO: Remove in production

        console.error("Params", rayStartPoint, rayEndPoint, boundaryRect, tilesInGrid, lowRange, highRange, radiusOfBubble, nodeSpaceConverter);

        const bottomDiffuse = 2 * boundaryRect.y;

        while (true) {
            const nextDestinationPoint: CollisionPoint = getCollisionPointWithBorder(
                rayStartPoint,
                rayEndPoint,
                boundaryRect
            );
            console.error("nextDestinationPoint", nextDestinationPoint.point);
            const bubbleCollusionPoint = getCollusionPoint(rayStartPoint, nextDestinationPoint.point, tilesInGrid, radiusOfBubble, nodeSpaceConverter)

            if (bubbleCollusionPoint != undefined && bubbleCollusionPoint.x != -1 && bubbleCollusionPoint.y != -1) {
                nextDestinationPoint.point = bubbleCollusionPoint;
                bubbleTrajectory.push(nextDestinationPoint.point);
                break;

            }
            else {
                bubbleTrajectory.push(nextDestinationPoint.point);

            }
            if (bottomDiffuse >= nextDestinationPoint.point.y) {
                break
            }
            if (lowRange <= 0 && nextDestinationPoint.point.y >= boundaryRect.y + boundaryRect.height)
                break
            rayStartPoint = nextDestinationPoint.point;

            if (rayStartPoint.y === radiusOfBubble)
                break;
            // if (i > 1000)//Debug TODO: Remove in production
            //   break;
            rayEndPoint = new Point(nextDestinationPoint.point.x + nextDestinationPoint.reflectionVector.x, nextDestinationPoint.point.y + nextDestinationPoint.reflectionVector.y);
            // i++;//Debug TODO: Remove in production

        }
        return bubbleTrajectory;
    }
}




