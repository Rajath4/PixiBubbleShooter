import { Container, ContainerChild, Point, Size } from "pixi.js";
import { ColorBubbleData } from "./bubbleLayout/model/Bubble";
import { BubbleType } from "./bubbleLayout/model/LayoutInterface";
import { TileData, TileGrid } from "./bubbleLayout/model/TileGrid";
import BubbleShooterGamePlayModel from "./BubbleShooterGamePlayModel";
import { getPointsBetweenTwoPoint } from "./utils/PointsBetweenTwoPoint";

import { TrajectoryBubbleSprite } from "./bubbleLayout/model/TrajectoryBubbleSprite";
import { Rect } from "./bubbleLayout/controllers/layoutMovement/DynamicBubbleLayoutMovementController";
import { BubbleSprite } from "./bubbleLayout/model/BubbleSprite";

class TrajectoryBubbleSpritePool {
    private pool: TrajectoryBubbleSprite[] = [];

    /**
     * Gets a sprite from the pool or creates a new one if the pool is empty.
     */
    get(): TrajectoryBubbleSprite {
        if (this.pool.length > 0) {
            console.log("TrajectoryBubbleSpritePool: Reusing existing sprite", this.pool.length);
            return this.pool.pop();
        } else {
            return new TrajectoryBubbleSprite();
        }
    }

    /**
     * Returns a sprite to the pool for future reuse.
     */
    put(sprite: TrajectoryBubbleSprite): void {
        sprite.unuse();
        this.pool.push(sprite);
    }

    /**
     * Optional: Clears the pool, destroying all sprites.
     */
    clear(): void {
        for (const sprite of this.pool) {
            sprite.destroy(); // Make sure to properly destroy sprites to free up resources
        }
        this.pool = [];
    }

    size(): number {
        return this.pool.length;
    }
}



export class TrajectoryLayer extends Container {

    init(isFullTrajectory: boolean, radiusOfBubble: number, layerSize: Rect, tilesInGrid: TileGrid,
        convertGameLayerToBubbleLayer: (pos: Point) => Point,
        showVisualRepOfWeaponBubble: (pos: Point, data: TileData) => void,
        disableVisualRepOfWeaponBubble: () => void,
        gameModel: BubbleShooterGamePlayModel) {
        this.gameModel = gameModel;

        this.isFullTrajectory = isFullTrajectory;
        this.radiusOfBubble = radiusOfBubble;
        this.layerSize = layerSize;
        this.tilesInGrid = tilesInGrid;

        this.convertGameLayerToBubbleLayer = convertGameLayerToBubbleLayer;
        this.showVisualRepOfWeaponBubble = showVisualRepOfWeaponBubble;
        this.disableVisualRepOfWeaponBubble = disableVisualRepOfWeaponBubble;
    }

    private getTrajectoryBubble(color: string, initialPosition: Point, finalPosition: Point): TrajectoryBubbleSprite {
        let trajectoryBubble = this.trajectoryBubblePool.get();

        trajectoryBubble.init(color, new Point(initialPosition.x, initialPosition.y),
            new Point(finalPosition.x, finalPosition.y));

        return trajectoryBubble;
    }

    /**
     * It is used to display trajectory if canon has valid rotation
     * @param {Point} touchPoint User touch point.
     */
    show(touchPoint: Point, initialPosition: Point, data: ColorBubbleData): void {
        let weaponBubbleTrajectoryPath: Point[] = [];

        weaponBubbleTrajectoryPath = this.gameModel.trajectoryInfoModel.getTrajectoryInfo(touchPoint, this.tilesInGrid).predictedBubbleMovement;
        const finalDestinationPoint = weaponBubbleTrajectoryPath[weaponBubbleTrajectoryPath.length - 1];

        this.showVisualRepOfWeaponBubble(this.convertGameLayerToBubbleLayer(finalDestinationPoint), { type: BubbleType.ColorBubble, color: data.color });

        if (!this.isFullTrajectory) {
            if (weaponBubbleTrajectoryPath.length > 2) {
                weaponBubbleTrajectoryPath.length = 2;
            }
        }
        if (weaponBubbleTrajectoryPath.length > 0) {
            this.draw(data.color, new Point(initialPosition.x, initialPosition.y), weaponBubbleTrajectoryPath);
        }
    }

    private getFakeTrajectoryPosition(xPosition: number): number {
        if (xPosition > this.layerSize.x / 2) {
            return this.radiusOfBubble + xPosition;
        }
        return xPosition - this.radiusOfBubble;
    }

    /**
     * It is used to draw trajectory points in the given path
     * @param {*} initialPosition Initial Point of the trajectory
     * @param {*} trajectoryPath Trajectory path
     */
    private draw(trajectoryBubbleColor: string, initialPosition: Point, trajectoryPath: Point[]): void {
        this.removeAllTrajecBubbles();

        const edgeCorrection = (initialPosition: Point, pointBetweenTwoPoints: Point[]) => {
            if (parseInt(initialPosition.x.toFixed(0)) === parseInt(this.layerSize.x.toFixed(0)) || parseInt(initialPosition.x.toFixed(0)) === 0) {
                this.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, initialPosition, pointBetweenTwoPoints[0]));
            }
        };

        let i = 0, j, pointBetweenTwoPoints: Point[];

        const lastPoint = trajectoryPath.pop();;

        let trajectoryLineStartPoint = initialPosition;

        //Render all trajectory until last line
        for (i = 0; i < trajectoryPath.length; i++) {
            trajectoryPath[i].x = this.getFakeTrajectoryPosition(trajectoryPath[i].x);
            pointBetweenTwoPoints = getPointsBetweenTwoPoint(trajectoryLineStartPoint, trajectoryPath[i]);

            edgeCorrection(initialPosition, pointBetweenTwoPoints);
            for (j = 0; j < pointBetweenTwoPoints.length - 1; j++) {
                this.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, pointBetweenTwoPoints[j], pointBetweenTwoPoints[j + 1]));
            }

            trajectoryLineStartPoint = trajectoryPath[i];
        }


        //Render last line
        pointBetweenTwoPoints = getPointsBetweenTwoPoint(trajectoryLineStartPoint, lastPoint);
        let noOfPointsToShow = pointBetweenTwoPoints.length;

        if (!this.isFullTrajectory) {
            if (trajectoryPath.length > 1) {
                if (pointBetweenTwoPoints.length > 5) {
                    noOfPointsToShow = 5;
                }
            }
        }

        // edgeCorrection(initialPosition, pointBetweenTwoPoints);
        for (let j = 0; j < noOfPointsToShow - 1; j++) {
            this.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, pointBetweenTwoPoints[j], pointBetweenTwoPoints[j + 1]));
        }
    }

    remove(): void {
        this.removeAllTrajecBubbles();
        this.disableVisualRepOfWeaponBubble();
    }

    removeAllTrajecBubbles() {
        const allExistingBubbles = this.children.slice();

        allExistingBubbles.forEach((child: ContainerChild) => {
            this.trajectoryBubblePool.put(child as TrajectoryBubbleSprite);
        });

        this.removeChildren();
    }

    private isFullTrajectory: boolean;
    private radiusOfBubble: number;
    private layerSize: Rect;
    private tilesInGrid: TileGrid;

    private convertGameLayerToBubbleLayer: (pos: Point) => Point;
    private showVisualRepOfWeaponBubble: (pos: Point, data: TileData) => void;
    private disableVisualRepOfWeaponBubble: () => void;

    private trajectoryBubblePool: TrajectoryBubbleSpritePool = new TrajectoryBubbleSpritePool();

    private gameModel: BubbleShooterGamePlayModel;
}