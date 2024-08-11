import { BubbleData } from "./Bubble";
import { Tile } from "../../../types/BubbleGridInterfaces";
import TileGridModel from "./TileGridModel";

export class BubbleModel {
    constructor(data: BubbleData) {
        this._data = data;
    }

    get data(): BubbleData {
        return this._data;
    }

    execute(tileGridModel: TileGridModel, currentTile: Tile) {

    }

    protected _data: BubbleData;
}