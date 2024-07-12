import { Point } from "pixi.js";
import { IWeaponBubbleImpactInfo } from "./bubbleLayout/GamePlayEngineModelInterfaces";
import { BubbleFactoryController } from "./bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "./bubbleLayout/model/LayoutInterface";
import TileGridModel from "./bubbleLayout/model/TileGridModel";
import PostWeaponBubbleImpactSanityModel, { IPostWeaponBubbleImpactInfo } from "./PostWeaponBubbleImpactSanityModel";
import WeaponBubbleImpactComputationModel from "./weapon_impact/WeaponBubbleImpactComputationModel";
import WeaponBubble from "./WeaponBubble";
import WeaponBubbleModel from "./WeaponBubbleModel";
import GamePlayScoreModel from "./GamePlayScoreModel";
import TrajectoryInfoModel from "./TrajectoryInfoModel";
import { IGameModelDependency } from "./GamePlayEngineDependency";

export default class BubbleShooterGamePlayModel {
    constructor() {
        this._scoreModel = new GamePlayScoreModel();
        this._trajectoryInfoModel = new TrajectoryInfoModel();
        this._weaponBubbleImpactComputationModel = new WeaponBubbleImpactComputationModel();
        this._postWeaponBubbleImpactSanityModel = new PostWeaponBubbleImpactSanityModel();
        this._tileGridModel = new TileGridModel();

        this.setWeaponBubbleModel();
    }

    protected setWeaponBubbleModel() {
        this.weaponBubbleModel = new WeaponBubbleModel();
    }

    init(dependency: IGameModelDependency) {
        this.weaponBubbleModel.init(dependency.bubbleLayoutLayer, dependency.bubbleFactoryController);

        this.weaponBubbleImpactComputationModel.init({
            getLastVisibleRowIndex: dependency.getLastVisibleRowIndex,
            getFirstVisibleRowIndex: dependency.getFirstVisibleRowIndex
        });

        this._trajectoryInfoModel.init({
            bubbleLayerBoundaryRect: dependency.bubbleLayerBoundaryRect,
            convertBubbleLayerToGameLayer: dependency.convertBubbleLayerToGameLayer,
            convertGameLayerToBubbleLayer: dependency.convertGameLayerToBubbleLayer,
            getFirstVisibleRowIndex: dependency.getFirstVisibleRowIndex,
            getLastVisibleRowIndex: dependency.getLastVisibleRowIndex,
            radiusOfBubble: dependency.radiusOfBubble,
            getActiveWeaponBubble: dependency.getActiveWeaponBubble
        });

        this.postWeaponBubbleImpactSanityModel.init(dependency.getLastVisibleRowIndex);
    }

    onWeaponBubbleFired(touchPoint: Point, weaponBubble: WeaponBubble, tileGridModel: TileGridModel): IWeaponBubbleImpactInfo {
        const trajectoryInfo = this.trajectoryInfoModel.getTrajectoryInfo(touchPoint, tileGridModel.tiles);
        const weaponBubbleTileIndex = tileGridModel.getTileIndexFromPosition(trajectoryInfo.weaponBubbleDestinationPosition);

        if (weaponBubble.type === BubbleType.ColorBubble) {
            tileGridModel.getAndUpdateTileContent(weaponBubbleTileIndex, { type: BubbleType.ColorBubble, data: weaponBubble.content });
        }

        const weaponBubbleActedTiles = this.weaponBubbleImpactComputationModel.getWeaponBubbleActedTiles(weaponBubble.type, tileGridModel, weaponBubbleTileIndex);
        this.weaponBubbleImpactComputationModel.performWeaponBubbleImpact(weaponBubble.type, tileGridModel, weaponBubbleActedTiles);

        const postWeaponBubbleImpactInfo: IPostWeaponBubbleImpactInfo = this.postWeaponBubbleImpactSanityModel.getPostImpactInfo(tileGridModel, weaponBubbleActedTiles);

        const data: IWeaponBubbleImpactInfo = {
            trajectoryInfo: trajectoryInfo,
            weaponBubbleTileIndex: weaponBubbleTileIndex,
            weaponBubbleType: weaponBubble.type,
            weaponBubbleColor: weaponBubble.bubbleColor,
            weaponBubbleActedTiles: weaponBubbleActedTiles,
            fallingBubbles: postWeaponBubbleImpactInfo.fallingBubbles,
            score: null
        };

        data.score = this.scoreModel.getScore(data);

        return data;
    }

    get scoreModel(): GamePlayScoreModel {
        return this._scoreModel;
    }

    get weaponBubbleModel(): WeaponBubbleModel {
        return this._weaponBubbleModel;
    }

    set weaponBubbleModel(value: WeaponBubbleModel) {
        this._weaponBubbleModel = value;
    }

    get trajectoryInfoModel(): TrajectoryInfoModel {
        return this._trajectoryInfoModel;
    }

    get weaponBubbleImpactComputationModel(): WeaponBubbleImpactComputationModel {
        return this._weaponBubbleImpactComputationModel;
    }

    get postWeaponBubbleImpactSanityModel(): PostWeaponBubbleImpactSanityModel {
        return this._postWeaponBubbleImpactSanityModel;
    }

    get tileGridModel() {
        return this._tileGridModel;
    }

    private _trajectoryInfoModel: TrajectoryInfoModel = null;
    private _scoreModel: GamePlayScoreModel;
    private _weaponBubbleModel: WeaponBubbleModel;


    private _weaponBubbleImpactComputationModel: WeaponBubbleImpactComputationModel;
    private _postWeaponBubbleImpactSanityModel: PostWeaponBubbleImpactSanityModel;
    protected _tileGridModel: TileGridModel;

    private bubbleFactoryController: BubbleFactoryController;
}



