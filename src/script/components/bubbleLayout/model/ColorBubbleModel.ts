
import { ColorBubbleData } from "./Bubble";
import { BubbleModel } from "./BubbleModel";
import { Tile } from "../../../types/BubbleGridInterfaces";
import TileGridModel from "./TileGridModel";

export class ColorBubbleModel extends BubbleModel {
    get data(): ColorBubbleData {
        return this._data as ColorBubbleData;
    }

    setColor(color: string) {
        this.data.color = color;
    }

    execute(tileGridModel: TileGridModel, currentTile: Tile) {
        tileGridModel.emptyTile(currentTile.tileIndex);
    }
}