import { TileIndex, TileGrid, Tile, TileStatus } from "../bubbleLayout/model/TileGrid";
import { getNearByPosFromDirection } from "./getNearByFromDirection";

export class BubblesWithinRangeFinder {
    /**
     * Get bubbles within a specified range of a given TileIndex in a grid.
     *
     * @param {number} x Column index of the grid.
     * @param {number} y Row index of the grid.
     * @param {TileGrid} gridLayoutMap Map of tiles.
     * @param {number} lowRange Lowest row index to consider.
     * @param {number} highRange Highest row index to consider.
     * @param {number} range Number of tiles to look for.
     * @param {boolean} startShifted Tells if the first row is shifted or not.
     * @returns An object containing arrays of nearby bubbles and specialBubbles.
     */
    getBubblesWithinRange(
        tileIndex: TileIndex,
        gridLayoutMap: TileGrid,
        lowRange: number,
        highRange: number,
        range: number,
        startShifted: boolean
    ): { bubbles: TileIndex[] } {
        const nearbyBubbles: TileIndex[] = [];
        this.getNearbyRecursively(tileIndex, nearbyBubbles, lowRange, highRange, gridLayoutMap, range, startShifted);
        return { bubbles: nearbyBubbles };
    }

    getNearbyRecursively(
        tileIndex: TileIndex,
        nearbyBubbles: TileIndex[],
        lowRange: number,
        highRange: number,
        tiles: Map<number, Tile[]>,
        range: number,
        startShifted: boolean
    ): void {
        if (range === 0) {
            return;
        }
        for (let k = 1; k <= 6; k++) {
            const newpos = getNearByPosFromDirection(tileIndex, k);
            if (newpos.row >= lowRange && newpos.row < highRange) {
                const row = tiles.get(newpos.row);
                if (row && row[newpos.column] && row[newpos.column].tileStatus != TileStatus.EMPTY) {
                    if (!this.ArrayContains(nearbyBubbles, newpos)) {
                        nearbyBubbles.push(newpos);
                    }
                }
                this.getNearbyRecursively(newpos, nearbyBubbles, lowRange, highRange, tiles, range - 1, startShifted);
            }
        }
    }

    private ArrayContains(arr: TileIndex[], pos: TileIndex): boolean {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].column === pos.column && arr[i].row === pos.row) {
                return true;
            }
        }
        return false;
    }

}




