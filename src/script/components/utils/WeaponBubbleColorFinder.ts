import { ColorBubbleData } from "../bubbleLayout/model/Bubble";
import { BubbleType } from "../bubbleLayout/model/LayoutInterface";
import { TileGrid, TileStatus, Tile } from "../bubbleLayout/model/TileGrid";
import { getRandomItemFromListWithWeights } from "./RandomCalculator";

/**
 * Get a weapon bubble color
 * @param {*} tilesInGrid List of tile data
 * @param {*} listOfBubbleColorsInEntireLayout List of all bubbles color in layout
 * @param {*} probabilityOfWeaponBubbleFromLastRows Probability of getting bubbles from last rows
 * @param {*} randomNumber Server generated random number of that weapon bubble
 * @returns color of the weapon bubble
 */
function getWeaponBubbleColor(tilesInGrid: TileGrid, listOfBubbleColorsInEntireLayout: string[], probabilityOfWeaponBubbleFromLastRows: number) {
    let BubbleColorsInLastRow: string[] = [];

    const totalRowsFromEndToConsider = 5;

    const rowsToConsider = getLastNFilledRows(tilesInGrid, totalRowsFromEndToConsider);

    rowsToConsider.forEach((rowElements, row) => {
        rowElements.forEach((tile, colIndex) => {
            if (tile && tile.tileStatus === TileStatus.OCCUPIED && tile.content.type == BubbleType.ColorBubble) {
                const data = tile.content.data.model.data as ColorBubbleData;
                if (BubbleColorsInLastRow.indexOf(data.color) == -1) {
                    BubbleColorsInLastRow.push(data.color);
                }
            }
        });
    });

    const allPossibleBubbles = BubbleColorsInLastRow.concat(listOfBubbleColorsInEntireLayout);

    let allPossibleBubblesWeights = [];
    const weightOfEachColorInLayout = probabilityOfWeaponBubbleFromLastRows / BubbleColorsInLastRow.length;

    for (let i = 0; i < BubbleColorsInLastRow.length; i++) {
        allPossibleBubblesWeights.push(weightOfEachColorInLayout);
    }

    const weightOfOtherBubbleToAdd = (1 - probabilityOfWeaponBubbleFromLastRows) / listOfBubbleColorsInEntireLayout.length;
    for (let i = 0; i < listOfBubbleColorsInEntireLayout.length; i++) {
        allPossibleBubblesWeights.push(weightOfOtherBubbleToAdd);
    }

    const randomNumber = Math.random();
    const colorOfWeaponBubble = getRandomItemFromListWithWeights(allPossibleBubbles, allPossibleBubblesWeights, randomNumber);
    return colorOfWeaponBubble;
}



/**
 * Get the last N filled rows from the tile grid
 * @param tilesInGrid List of tile data
 * @param rowsToConsider Number of rows to consider
 * @returns List of last N filled rows
 */
function getLastNFilledRows(tilesInGrid: TileGrid, rowsToConsider: number): TileGrid {
    const rowsIndexWithTiles = Array.from(tilesInGrid.entries()).filter(([row, rowContents]) => rowContents.filter((tile: Tile) => tile && tile.tileStatus !== TileStatus.EMPTY).length > 0);
    const sortedBasedOnRowIndex = rowsIndexWithTiles.sort(([rowIndex1, row1], [rowIndex2, row2]) => rowIndex2 - rowIndex1);
    const lastNFilledRows = sortedBasedOnRowIndex.slice(-rowsToConsider);
    const tilesInGridToConsider = new Map<number, Tile[]>();

    lastNFilledRows.forEach(([key, value]) => {
        tilesInGridToConsider.set(key, value);
    });

    return tilesInGridToConsider;
}


export { getWeaponBubbleColor };
