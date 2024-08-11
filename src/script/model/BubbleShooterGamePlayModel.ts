import { Point } from "pixi.js";
import { IWeaponBubbleImpactInfo } from "../components/bubbleLayout/GamePlayEngineModelInterfaces";
import { BubbleFactoryController } from "../components/bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "../components/bubbleLayout/model/LayoutInterface";
import TileGridModel from "../components/bubbleLayout/model/TileGridModel";
import PostWeaponBubbleImpactSanityModel, { IPostWeaponBubbleImpactInfo } from "./PostWeaponBubbleImpactSanityModel";
import WeaponBubble from "../components/WeaponBubble";
import WeaponBubbleModel from "../components/WeaponBubbleModel";
import ScoreComputationModel from "./ScoreComputationModel";
import TrajectoryComputationModel from "./TrajectoryComputationModel";
import { IGameModelDependency } from "../types/GamePlayEngineDependency";
import { PlayerSessionDataModel } from "./PlayerSessionDataModel";
import WeaponBubbleImpactComputationModel from "./weapon_impact/WeaponBubbleImpactComputationModel";

export default class BubbleShooterGamePlayModel {
    constructor() {
        this._scoreComputationModel = new ScoreComputationModel();
        this._trajectoryComputationModel = new TrajectoryComputationModel();
        this._weaponBubbleImpactComputationModel = new WeaponBubbleImpactComputationModel();
        this._postWeaponBubbleImpactSanityModel = new PostWeaponBubbleImpactSanityModel();
        this._tileGridModel = new TileGridModel();
        this.weaponBubbleModel = new WeaponBubbleModel();

        this._playerSessionDataModel = new PlayerSessionDataModel();
    }

    init(dependency: IGameModelDependency) {
        this.weaponBubbleModel.init(dependency.bubbleLayoutLayer, dependency.bubbleFactoryController);

        this.weaponBubbleImpactComputationModel.init({
            getLastVisibleRowIndex: dependency.getLastVisibleRowIndex,
            getFirstVisibleRowIndex: dependency.getFirstVisibleRowIndex
        });

        this._trajectoryComputationModel.init({
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
        const trajectoryInfo = this.trajectoryComputationModel.getTrajectoryInfo(touchPoint, tileGridModel.tiles);
        const weaponBubbleTileIndex = tileGridModel.getTileIndexFromPosition(trajectoryInfo.weaponBubbleDestinationPosition);

        if (weaponBubble.type === BubbleType.ColorBubble) {
            tileGridModel.updateTileContent(weaponBubbleTileIndex, { type: BubbleType.ColorBubble, data: weaponBubble.content });
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

        data.score = this.scoreComputationModel.getScore(data);

        return data;
    }

    get scoreComputationModel(): ScoreComputationModel {
        return this._scoreComputationModel;
    }

    get weaponBubbleModel(): WeaponBubbleModel {
        return this._weaponBubbleModel;
    }

    set weaponBubbleModel(value: WeaponBubbleModel) {
        this._weaponBubbleModel = value;
    }

    get trajectoryComputationModel(): TrajectoryComputationModel {
        return this._trajectoryComputationModel;
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

    get playerSessionDataModel() {
        return this._playerSessionDataModel;
    }

    private _trajectoryComputationModel: TrajectoryComputationModel = null;
    private _scoreComputationModel: ScoreComputationModel;
    private _weaponBubbleModel: WeaponBubbleModel;


    private _weaponBubbleImpactComputationModel: WeaponBubbleImpactComputationModel;
    private _postWeaponBubbleImpactSanityModel: PostWeaponBubbleImpactSanityModel;
    protected _tileGridModel: TileGridModel;

    private bubbleFactoryController: BubbleFactoryController;

    private _playerSessionDataModel:PlayerSessionDataModel;
}



