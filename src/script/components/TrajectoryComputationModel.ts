import { Point } from "pixi.js";
import { ITrajectoryInfo } from "./bubbleLayout/GamePlayEngineModelInterfaces";
import { TileGrid } from "./bubbleLayout/model/TileGrid";
import { ITrajectoryInfoDependency } from "./GamePlayEngineDependency";
import TrajectoryGenerator from "./TrajectoryGenerator";


export default class TrajectoryComputationModel {
    constructor() {
        this.generator = new TrajectoryGenerator();
    }

    init(dependency: ITrajectoryInfoDependency) {
        this.dependency = dependency;
    }

    getTrajectoryInfo(touchPoint: Point, tileGrid: TileGrid): ITrajectoryInfo {
        const predictedBubbleMovement = this.generator.getTrajectory(
            this.dependency.getActiveWeaponBubble().getPosition(),
            touchPoint,
            this.dependency.bubbleLayerBoundaryRect,
            tileGrid,
            this.dependency.getLastVisibleRowIndex(), this.dependency.getFirstVisibleRowIndex(),
            this.dependency.radiusOfBubble,
            this.dependency.convertBubbleLayerToGameLayer);

        const finalDestinationPoint = this.dependency.convertGameLayerToBubbleLayer(predictedBubbleMovement[predictedBubbleMovement.length - 1])

        let weaponBubbleDestinationPosition;

        if (predictedBubbleMovement[predictedBubbleMovement.length - 1].y === this.dependency.radiusOfBubble) {
            weaponBubbleDestinationPosition = new Point(-1, -1);
        } else {
            weaponBubbleDestinationPosition = finalDestinationPoint;
        }

        return {
            predictedBubbleMovement: predictedBubbleMovement,
            weaponBubbleDestinationPosition: weaponBubbleDestinationPosition
        }
    }

    private generator: TrajectoryGenerator;
    private dependency: ITrajectoryInfoDependency = null;
}

