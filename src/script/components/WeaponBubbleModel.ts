
import { DynamicBubbleLayout } from "./bubbleLayout/DynamicBubbleLayout";
import { BubbleFactoryController } from "./bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "./bubbleLayout/model/LayoutInterface";
import { TileData } from "./bubbleLayout/model/TileGrid";
import { ObserverHandler } from "./bubbleLayout/ObserverHandler";
import { bubbleColorsInLayout } from "./bubbleLayout/StaticBubbleLayout";
import { getWeaponBubbleColor } from "./utils/WeaponBubbleColorFinder";
import WeaponBubble from "./WeaponBubble";

export default class WeaponBubbleModel {
    constructor() {

    }

    init(bubbleLayoutLayer: DynamicBubbleLayout, bubbleFactoryController: BubbleFactoryController) {
        this.bubbleLayoutLayer = bubbleLayoutLayer;
        this.bubbleFactoryController = bubbleFactoryController;
        this.activeWeaponBubble = new WeaponBubble();

        this.setupWeaponBubbles();
    }

    onWeaponBubbleActionComplete() {
        this.totalWeaponBubbleUsed++;
        this.setupWeaponBubbles();
    }

    private setupWeaponBubbles() {
        const bubbleColor = getWeaponBubbleColor(this.bubbleLayoutLayer.tiles, this.listOfBubbleColorsInEntireLayout, this.probabilityOfWeaponBubbleFromLastRows);
        this.activeWeaponBubble.setContent(this.bubbleFactoryController.getColorBubbleContent({ color: bubbleColor }));
    }

    getWeaponBubble() {
        return this.activeWeaponBubble;
    }



    private totalWeaponBubbleUsed = 0;

    protected probabilityOfWeaponBubbleFromLastRows = 1;
    protected listOfBubbleColorsInEntireLayout = bubbleColorsInLayout;


    protected bubbleLayoutLayer: DynamicBubbleLayout = null;
    private bubbleFactoryController: BubbleFactoryController;
    private activeWeaponBubble: WeaponBubble;
}