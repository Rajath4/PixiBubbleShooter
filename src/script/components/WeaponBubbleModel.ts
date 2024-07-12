
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
        this._weaponBubbles = [new WeaponBubble(), new WeaponBubble(), new WeaponBubble()];
    }

    init(bubbleLayoutLayer: DynamicBubbleLayout, bubbleFactoryController: BubbleFactoryController) {
        this.bubbleLayoutLayer = bubbleLayoutLayer;
        this.bubbleFactoryController = bubbleFactoryController;

        this.onTurnStart();
    }

    onTurnStart() {
        this.usedWeaponBubbleIndex = [];
        this.remainingWeaponBubbleIndex = [0, 1, 2];
        this.computeCurrantTurnWeaponBubble();
        this.activeWeaponBubbleIndex = 0;

        this.weaponBubbleChangeObserver.notifyObservers(false);
    }

    onWeaponBubbleActionComplete() {
        if (this.isBoosterActivated) {
            this.onBoosterUsed();
        } else {
            this.weaponBubbleUsedInCurrentTurn++;

            this.getWeaponBubble().isUsed = true;

            this.remainingWeaponBubbleIndex.splice(0, 1);
            this.usedWeaponBubbleIndex.push(this.activeWeaponBubbleIndex);
            this.activeWeaponBubbleIndex = this.remainingWeaponBubbleIndex[0];
            if (this.remainingWeaponBubbleIndex.length > 0) {
                this.weaponBubbleChangeObserver.notifyObservers(false);
            }
        }
    }

    getWeaponBubble() {
        if (this._isBoosterActivated) {
            return this._activeBooster;
        }
        return this.weaponBubbles[this.activeWeaponBubbleIndex];
    }

    computeCurrantTurnWeaponBubble() {
        const currentTurnWeaponBubble: TileData[] = this.getWeaponBubbles();

        currentTurnWeaponBubble.forEach((bubbleData, index) => {
            const content = this.bubbleFactoryController.getColorBubbleContent({ color: bubbleData.color });
            this.weaponBubbles[index].setContent(content);
        });
    }

    protected getWeaponBubbles() {
        const currentTurnWeaponBubble: TileData[] = [];
        for (let i = 0; i < this.weaponBubblePerTurn; i++) {
            const type = BubbleType.ColorBubble;
            const bubbleColor = getWeaponBubbleColor(this.bubbleLayoutLayer.tiles, this.listOfBubbleColorsInEntireLayout, this.probabilityOfWeaponBubbleFromLastRows);

            currentTurnWeaponBubble.push({
                type: type,
                color: bubbleColor
            });
        }

        return currentTurnWeaponBubble;
    }

    get weaponBubbles() {
        return this._weaponBubbles;
    }


    swapWeaponBubble(toIndex: number) {
        const temp = this.weaponBubbles[this.activeWeaponBubbleIndex];
        this.weaponBubbles[this.activeWeaponBubbleIndex] = this.weaponBubbles[toIndex];
        this.weaponBubbles[toIndex] = temp;
    }

    get isAllWeaponBubbleConsumed() {
        return this.remainingWeaponBubbleIndex.length === 0;
    }


    private totalWeaponBubbleUsed = 0;
    protected weaponBubblePerTurn = 3;

    protected probabilityOfWeaponBubbleFromLastRows = 1;
    protected listOfBubbleColorsInEntireLayout = bubbleColorsInLayout;


    protected bubbleLayoutLayer: DynamicBubbleLayout = null;

    activeWeaponBubbleIndex = 0;
    private _weaponBubbles: WeaponBubble[] = [];
    remainingWeaponBubbleIndex:number[] = [];
    private usedWeaponBubbleIndex:number[] = [];

    private weaponBubbleUsedInCurrentTurn = 0;

    onBoosterUsed() {
        this._isBoosterActivated = false;
        this._activeBooster = null;
        this.weaponBubbleChangeObserver.notifyObservers(false);
    }

    get isBoosterActivated() {
        return this._isBoosterActivated;
    }

    get weaponBubbleChangeObserver() {
        return this._weaponBubbleChangedObserver
    }

    setActiveBooster(boosterType: BubbleType) {
        return;

        //TODO: HANDLE ME
        // this._isBoosterActivated = true;

        // const boosterWeaponBubble = new WeaponBubble();
        // boosterWeaponBubble.type = boosterType;
        // boosterWeaponBubble.sprite = this.bubbleFactoryController.getColorBubbleUI(boosterWeaponBubble.type, {});
        // this._activeBooster = boosterWeaponBubble;

        // this.weaponBubbleChangeObserver.notifyObservers(true);
    }

    private _isBoosterActivated = false;
    private _activeBooster: WeaponBubble = null;

    private _weaponBubbleChangedObserver: ObserverHandler = new ObserverHandler();
    private bubbleFactoryController: BubbleFactoryController;
}