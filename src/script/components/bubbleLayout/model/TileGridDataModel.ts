import { bubbleColorsInLayout } from "../StaticBubbleLayout";
import { BubbleType } from "./LayoutInterface";
import { TileData, TileIndex } from "./TileGrid";


export default class TileGridDataModel {
    init(data: TileData[][]) {
        this.layoutPrefilledContentData = data;
    }

    getTilePrefilledData(tileIndex: TileIndex): TileData {
        const row = tileIndex.row % this.layoutPrefilledContentData.length;

        if (tileIndex.row >= this.layoutPrefilledContentData.length) {
            const data = this.layoutPrefilledContentData[row][tileIndex.column];
            if (data.type === BubbleType.ColorBubble) {
                data.color = bubbleColorsInLayout[Math.floor(Math.random() * bubbleColorsInLayout.length)];
            }
            return data;
        }

        return this.layoutPrefilledContentData[row][tileIndex.column];
    }

    private layoutPrefilledContentData: TileData[][];
}