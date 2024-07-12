import { Container } from "pixi.js";



export class TrajectoryLayer extends Container {
    // @property(Prefab)
    // trajectoryBubblePrefab: Prefab = null;

    // init(isFullTrajectory: boolean, radiusOfBubble: number, layerSize: Size, tilesInGrid: TileGrid,
    //     convertGameLayerToBubbleLayer: (pos: Vec2) => Vec2,
    //     showVisualRepOfWeaponBubble: (pos: Vec2, data: TileData) => void,
    //     disableVisualRepOfWeaponBubble: () => void,
    //     gameModel: BubbleShooterGamePlayModel) {
    //     this.gameModel = gameModel;

    //     this.isFullTrajectory = isFullTrajectory;
    //     this.radiusOfBubble = radiusOfBubble;
    //     this.layerSize = layerSize;
    //     this.tilesInGrid = tilesInGrid;

    //     this.convertGameLayerToBubbleLayer = convertGameLayerToBubbleLayer;
    //     this.showVisualRepOfWeaponBubble = showVisualRepOfWeaponBubble;
    //     this.disableVisualRepOfWeaponBubble = disableVisualRepOfWeaponBubble;

    //     this.trajectoryBubblePool = new NodePool('TrajectoryBubbleSprite');
    // }

    // private getTrajectoryBubble(color: string, initialPosition: Vec2, finalPosition: Vec2): Node {
    //     let trajectoryBubble = null;
    //     if (this.trajectoryBubblePool.size() > 0) {
    //         trajectoryBubble = this.trajectoryBubblePool.get();
    //     } else {
    //         trajectoryBubble = instantiate(this.trajectoryBubblePrefab);
    //     }

    //     trajectoryBubble.getComponent(TrajectoryBubbleSprite).init(color, new Vec3(initialPosition.x, initialPosition.y),
    //         new Vec3(finalPosition.x, finalPosition.y));

    //     return trajectoryBubble;
    // }

    // /**
    //  * It is used to display trajectory if canon has valid rotation
    //  * @param {Vec2} touchPoint User touch point.
    //  */
    // show(touchPoint: Vec3, initialPosition: Vec3, data: ColorBubbleData): void {
    //     let weaponBubbleTrajectoryPath: Vec2[] = [];

    //     weaponBubbleTrajectoryPath = this.gameModel.trajectoryInfoModel.getTrajectoryInfo(touchPoint, this.tilesInGrid).predictedBubbleMovement;
    //     const finalDestinationPoint = weaponBubbleTrajectoryPath[weaponBubbleTrajectoryPath.length - 1];

    //     this.showVisualRepOfWeaponBubble(this.convertGameLayerToBubbleLayer(finalDestinationPoint), { type: BubbleType.ColorBubble, color: data.color });

    //     if (!this.isFullTrajectory) {
    //         if (weaponBubbleTrajectoryPath.length > 2) {
    //             weaponBubbleTrajectoryPath.length = 2;
    //         }
    //     }
    //     if (weaponBubbleTrajectoryPath.length > 0) {
    //         this.draw(data.color, new Vec2(initialPosition.x, initialPosition.y), weaponBubbleTrajectoryPath);
    //     }
    // }

    // private getFakeTrajectoryPosition(xPosition: number): number {
    //     if (xPosition > this.layerSize.x / 2) {
    //         return this.radiusOfBubble + xPosition;
    //     }
    //     return xPosition - this.radiusOfBubble;
    // }

    // /**
    //  * It is used to draw trajectory points in the given path
    //  * @param {*} initialPosition Initial Point of the trajectory
    //  * @param {*} trajectoryPath Trajectory path
    //  */
    // private draw(trajectoryBubbleColor: string, initialPosition: Vec2, trajectoryPath: Vec2[]): void {

    //     this.removeAllTrajecBubbles();

    //     const edgeCorrection = (initialPosition: Vec2, pointBetweenTwoPoints: Vec2[]) => {
    //         if (parseInt(initialPosition.x.toFixed(0)) === parseInt(this.layerSize.x.toFixed(0)) || parseInt(initialPosition.x.toFixed(0)) === 0) {
    //             this.node.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, initialPosition, pointBetweenTwoPoints[0]));
    //         }
    //     };

    //     let i = 0, j, pointBetweenTwoPoints: Vec2[];

    //     const lastPoint = trajectoryPath.pop();;

    //     let trajectoryLineStartPoint = initialPosition;

    //     //Render all trajectory until last line
    //     for (i = 0; i < trajectoryPath.length; i++) {
    //         trajectoryPath[i].x = this.getFakeTrajectoryPosition(trajectoryPath[i].x);
    //         pointBetweenTwoPoints = getPointsBetweenTwoPoint(trajectoryLineStartPoint, trajectoryPath[i]);

    //         // edgeCorrection(initialPosition, pointBetweenTwoPoints);
    //         for (j = 0; j < pointBetweenTwoPoints.length - 1; j++) {
    //             this.node.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, pointBetweenTwoPoints[j], pointBetweenTwoPoints[j + 1]));
    //         }

    //         trajectoryLineStartPoint = trajectoryPath[i];
    //     }


    //     //Render last line
    //     pointBetweenTwoPoints = getPointsBetweenTwoPoint(trajectoryLineStartPoint, lastPoint);
    //     let noOfPointsToShow = pointBetweenTwoPoints.length;

    //     if (!this.isFullTrajectory) {
    //         if (trajectoryPath.length > 1) {
    //             if (pointBetweenTwoPoints.length > 5) {
    //                 noOfPointsToShow = 5;
    //             }
    //         }
    //     }

    //     // edgeCorrection(initialPosition, pointBetweenTwoPoints);
    //     for (let j = 0; j < noOfPointsToShow - 1; j++) {
    //         this.node.addChild(this.getTrajectoryBubble(trajectoryBubbleColor, pointBetweenTwoPoints[j], pointBetweenTwoPoints[j + 1]));
    //     }
    // }

    // remove(): void {
    //     this.removeAllTrajecBubbles();
    //     this.disableVisualRepOfWeaponBubble();
    // }

    // removeAllTrajecBubbles() {
    //     const allExistingBubbles = this.node.children.slice();

    //     allExistingBubbles.forEach((child: Node) => {
    //         if (DEBUG) {
    //             if (!child.getComponent(TrajectoryBubbleSprite)) {
    //                 throw new Error("Child is not TrajectoryBubbleSprite");
    //             }
    //         }
    //         this.trajectoryBubblePool.put(child);
    //     });

    //     this.node.removeAllChildren();
    // }

    // private isFullTrajectory: boolean;
    // private radiusOfBubble: number;
    // private layerSize: Size;
    // private tilesInGrid: TileGrid;

    // private convertGameLayerToBubbleLayer: (pos: Vec2) => Vec2;
    // private showVisualRepOfWeaponBubble: (pos: Vec2, data: TileData) => void;
    // private disableVisualRepOfWeaponBubble: () => void;

    // private trajectoryBubblePool: NodePool;

    // private gameModel: BubbleShooterGamePlayModel;
}