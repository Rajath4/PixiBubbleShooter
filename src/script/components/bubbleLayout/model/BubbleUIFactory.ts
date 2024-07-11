
import { ColorBubbleData, RockBubbleData } from "./Bubble";
import { BubbleSprite } from "./BubbleSprite";
import { SpecialBubbleType } from "./TileGrid";

export class BubbleUIFactory  {
  
    getColorBubble(data: ColorBubbleData) {
        const bubble = new BubbleSprite();
        return bubble;
    }

    getSpecialBubble(type: SpecialBubbleType, data: RockBubbleData) {
        // const specialBubble = instantiate(this.rockBubblePrefab);
        // return specialBubble.getComponent(RockBubble);

        const bubble = new BubbleSprite();
        return bubble;
    }

}