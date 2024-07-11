import { RockBubbleData } from "./Bubble";
import { BubbleModel } from "./BubbleModel";

export class RockBubbleModel extends BubbleModel {
    constructor(data: RockBubbleData) {
        super(data);
    }

    get data(): RockBubbleData {
        return this._data as RockBubbleData;
    }
}