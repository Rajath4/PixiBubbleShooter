import { Container, Point, Size } from "pixi.js";
import { BubbleFactoryController } from "../../model/BubbleFactoryController";
import { BubbleType } from "../../model/LayoutInterface";
import { TileData } from "../../model/TileGrid";
import TileGridDataModel from "../../model/TileGridDataModel";
import TileGridModel from "../../model/TileGridModel";
import { BubbleSprite } from "../../model/BubbleSprite";


export default class WeaponBubbleFinalPosVisualController {
    init(dependency: IWeaponBubbleFinalPosVisualControllerDependency) {
        this.bubbleFactory = dependency.bubbleFactory;
        // this.colorBubble = this.bubbleFactory.getColorBubbleUI({ color: "C1" }) as ColorBubble;
        // this.colorBubble.getComponent(UIOpacity).opacity = 150;

        this.visualRepOfWeaponBubbleFinalPosHolder = new Container();

        this.layerSize = dependency.layerSize;
        this.tileGridModel = dependency.tileGridModel;
        this.bubbleScaleFactor = dependency.bubbleScaleFactor;
        this.getTileGridModel = dependency.getTileGridModel;
        this.layoutNode = dependency.layoutNode;

        this.setupVisualRepOfWeaponBubble();
    }

    private setupVisualRepOfWeaponBubble() {
        this.visualRepOfWeaponBubbleFinalPosHolder.scale = this.bubbleScaleFactor;
        this.disableVisualRepOfWeaponBubble();
        this.layoutNode.addChild(this.visualRepOfWeaponBubbleFinalPosHolder);
    }

    showVisualRepOfWeaponBubble = (weaponBubbleDestinationPosition: Point, data: TileData) => {
        // const weaponBubbleGridIndex = this.tileGridModel.getTileIndexFromPosition(new Vec3(weaponBubbleDestinationPosition.x, weaponBubbleDestinationPosition.y));
        // if (data.type == BubbleType.ColorBubble) {
        //     this.visualRepOfWeaponBubbleFinalPosHolder.addChild(this.colorBubble.node);
        //     this.colorBubble.setColor(this.bubbleFactory.getBubbleColor(data.color));
        // } else {
        //     this.visualRepOfWeaponBubbleFinalPosHolder.addChild(this.bubbleFactory.getColorBubbleUI({ color: data.color }).node);
        // }
        // const pos = this.tileGridModel.getTileCoordinate(weaponBubbleGridIndex);
        // this.visualRepOfWeaponBubbleFinalPosHolder.setPosition(pos.x, pos.y);
    }

    disableVisualRepOfWeaponBubble = () => {
        // this.visualRepOfWeaponBubbleFinalPosHolder.removeAllChildren();
        // this.visualRepOfWeaponBubbleFinalPosHolder.setPosition(-this.layerSize.width, -this.layerSize.height);
    }

    private visualRepOfWeaponBubbleFinalPosHolder: Container = null;
    private layoutNode: Container;
    private layerSize: Size;
    private tileGridModel: TileGridModel;
    private bubbleScaleFactor: number;
    private getTileGridModel: () => TileGridDataModel;
    private colorBubble: BubbleSprite;
    private bubbleFactory: BubbleFactoryController;
}

export interface IWeaponBubbleFinalPosVisualControllerDependency {
    layoutNode: Container;
    layerSize: Size;
    tileGridModel: TileGridModel;
    bubbleScaleFactor: number;
    getTileGridModel: () => TileGridDataModel;
    bubbleFactory: BubbleFactoryController;
}