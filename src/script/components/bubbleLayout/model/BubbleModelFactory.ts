
import { ColorBubbleData, RockBubbleData } from "./Bubble";
import { ColorBubbleModel } from "./ColorBubbleModel";
import { RockBubbleModel } from "./RockBubbleModel";
import { SpecialBubbleType } from "../../../types/BubbleGridInterfaces";

export class BubbleModelFactory {
    constructor() {

    }

    getColorBubble(data: ColorBubbleData) {
        return new ColorBubbleModel(data);
    }

    getSpecialBubble(type: SpecialBubbleType, data: RockBubbleData) {
        return new RockBubbleModel(data);
    }

}