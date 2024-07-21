import { Color } from "pixi.js";
import { ColorBubbleData, RockBubbleData } from "./Bubble";
import { BubbleContent, SpecialBubbleType, SpecialBubbleContent } from "./TileGrid";
import { BubbleModelFactory } from "./BubbleModelFactory";
import { BubbleUIFactory } from "./BubbleUIFactory";

export function getAllBubbleColors() {
    return {
        "C1": {
            "r": 255,
            "g": 191,
            "b": 41
        },
        "C2": {
            "r": 180,
            "g": 25,
            "b": 179
        },
        "C3": {
            "r": 10,
            "g": 64,
            "b": 204
        },
        "C4": {
            "r": 19,
            "g": 137,
            "b": 25
        },
        "C5": {
            "r": 202,
            "g": 24,
            "b": 16
        },
        "C6": {
            "r": 2,
            "g": 124,
            "b": 203
        }
    };
}

export enum GamePlayResult {
    WON,
    LOST,
    DRAW,
    ABORTED
}


export class BubbleFactoryController {
    constructor() {
        this._uiFactory = new BubbleUIFactory();
        this._modelFactory = new BubbleModelFactory();
        this.bubbleColors = getAllBubbleColors();
    }

    getColorBubbleContent(data: ColorBubbleData): BubbleContent {
        const model = this._modelFactory.getColorBubble(data);
        const ui = this.getColorBubbleUI(data);

        return {
            model,
            ui
        };
    }

    getSpecialBubbleContent(type: SpecialBubbleType, data: RockBubbleData): SpecialBubbleContent {
        const model = this._modelFactory.getSpecialBubble(type, data);
        const specialBubble = this._uiFactory.getSpecialBubble(type, data);

        return {
            type,
            model,
            ui: specialBubble
        };
    }

    getColorBubbleUI(data: ColorBubbleData) {
        const colorBubble = this._uiFactory.getColorBubble(data);
        colorBubble.setColor(this.getBubbleColor(data.color));
        return colorBubble;
    }

    /**
   * It will return the color in rgb values of the given bubble colour.
   *
   * @param {*} color 
   * @returns color(r,g,b,a);
   */
    getBubbleColor(color: string) {
        const colorRGB = this.bubbleColors[color];
        if (!colorRGB) throw new Error("Color not found : " + color);
        return new Color(`rgb(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, 1)`);
    }
    private bubbleColors: any;


    private _modelFactory: BubbleModelFactory;
    private _uiFactory: BubbleUIFactory;

}