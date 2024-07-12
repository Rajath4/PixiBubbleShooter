import { ColorBubbleData } from "../bubbleLayout/model/Bubble";
import { BubbleType } from "../bubbleLayout/model/LayoutInterface";
import { TileIndex, TileGrid } from "../bubbleLayout/model/TileGrid";
import { BubblesWithinRangeFinder } from "./BubblesWithinRangeFinder";
import ClusterFinder from "./ClusterFinder";
import { getNearByPosFromDirection } from "./getNearByFromDirection";


export class ColorBlastImpactedBubblesFinder {
    constructor() {
        this.bubblesWithinRangeFinder = new BubblesWithinRangeFinder();
        this.clusterFinder = new ClusterFinder();
    }
    /**
     * Get the bubbles impacted by a color blast.
     *
     * @param {TileIndex} tileIndex Index of the tile.
     * @param {Map<number, Tile[]>} gridLayoutMap Map of tiles.
     * @param {number} lowRange Lowest row index to consider.
     * @param {number} highRange Highest row index to consider.
     * @param {number} depth Number of tiles to look for.
     * @param {boolean} startShifted Tells if the first row is shifted or not.
     * @returns An object containing arrays of nearby bubbles and the dominant color.
     */
    getColorBlastImpactedBubbles(tileIndex: TileIndex, gridLayoutMap: TileGrid, lowRange: number, highRange: number, depth: number, startShifted: boolean) {
        const nearby = this.bubblesWithinRangeFinder.getBubblesWithinRange(tileIndex, gridLayoutMap, lowRange, highRange, depth, startShifted).bubbles;
        let highestNumber = null;
        let dominantColor = null;
        for (let k = 1; k <= 6; k++) {
            const newpos = getNearByPosFromDirection(tileIndex, k);
            if (newpos.row >= lowRange && newpos.row < highRange) {
                const row = gridLayoutMap.get(newpos.row);
                if (row && row[newpos.column] && row[newpos.column].content.type === BubbleType.ColorBubble) {
                    const data = row[newpos.column].content.data.model.data as ColorBubbleData;
                    const color = data.color;
                    const clusters = this.clusterFinder.getCompleteCluster(newpos, gridLayoutMap, lowRange, highRange, startShifted);
                    const length = clusters.colorBubbles.length;
                    if (highestNumber === null || highestNumber < length) {
                        highestNumber = length;
                        dominantColor = color;
                    }
                }
            }
        }
        return { colorBubbles: nearby, dominantColor };
    }

    private bubblesWithinRangeFinder: BubblesWithinRangeFinder;
    private clusterFinder: ClusterFinder;
}

