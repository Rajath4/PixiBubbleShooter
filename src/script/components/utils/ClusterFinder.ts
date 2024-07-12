import { ColorBubbleData } from '../bubbleLayout/model/Bubble';
import { BubbleType } from '../bubbleLayout/model/LayoutInterface';
import { TileIndex, TileGrid, ColorBubbleActedTiles, Tile, TileStatus } from '../bubbleLayout/model/TileGrid';
import { getNearByPosFromDirection } from './getNearByFromDirection';

export default class ClusterFinder {
  // Finds and returns a complete cluster of tiles
  getCompleteCluster(targetTileIndex: TileIndex, tileGrid: TileGrid, lowRange: number, highRange: number, startWithShifted: boolean): ColorBubbleActedTiles {
    const targetTile = this.getTile(tileGrid, targetTileIndex);
    this.validateTile(targetTile);

    const targetColor = (targetTile.content.data.model.data as ColorBubbleData).color;
    const colorCluster: TileIndex[] = [targetTileIndex];
    const specialBubbleCluster: TileIndex[] = [];

    for (const tileIndex of colorCluster) {
      this.processAdjacentTiles(tileIndex, tileGrid, lowRange, highRange, targetColor, colorCluster, specialBubbleCluster);
    }

    return { allBubblesNearby: [...colorCluster, ...specialBubbleCluster], colorBubbles: colorCluster, specialBubbles: specialBubbleCluster };
  }

  // Returns a tile from the grid given its index
  private getTile(tileGrid: TileGrid, tileIndex: TileIndex): Tile {
    return tileGrid.get(tileIndex.row)[tileIndex.column];
  }

  // Validates if a tile is not empty and is a color bubble
  private validateTile(tile: Tile): void {
    if (tile.tileStatus === TileStatus.EMPTY || tile.content.type !== BubbleType.ColorBubble) {
      console.error('Tile is empty or not a color bubble', tile);
      throw new Error('Tile is empty or not a color bubble');
    }
  }

  // Processes all adjacent tiles of a given tile
  private processAdjacentTiles(currentTileIndex: TileIndex, tileGrid: TileGrid, lowRange: number, highRange: number, targetColor: string, colorCluster: TileIndex[], specialBubbleCluster: TileIndex[]): void {
    for (let direction = 1; direction <= 6; direction++) {
      const adjacentTileIndex = getNearByPosFromDirection(currentTileIndex, direction);
      if (this.isValidPosition(adjacentTileIndex, tileGrid, lowRange, highRange)) {
        this.processTile(adjacentTileIndex, tileGrid, targetColor, colorCluster, specialBubbleCluster);
      }
    }
  }

  // Checks if a tile position is valid
  private isValidPosition(tileIndex: TileIndex, tileGrid: TileGrid, lowRange: number, highRange: number): boolean {
    const validRow = tileIndex.row >= (lowRange - 1) && tileIndex.row < highRange && tileGrid.has(tileIndex.row);
    const validColumn = tileIndex.column >= 0 && tileGrid.has(tileIndex.row) && tileIndex.column < tileGrid.get(tileIndex.row).length;
    return validRow && validColumn;
  }

  // Processes a tile and adds it to the appropriate cluster
  private processTile(tileIndex: TileIndex, tileGrid: TileGrid, targetColor: string, colorCluster: TileIndex[], specialBubbleCluster: TileIndex[]): void {
    const tile = this.getTile(tileGrid, tileIndex);
    if (tile.tileStatus === TileStatus.OCCUPIED) {
      if (tile.content.type === BubbleType.ColorBubble) {
        const tileColor = (tile.content.data.model.data as ColorBubbleData).color;
        if (tileColor === targetColor && !this.arrayContains(colorCluster, tileIndex)) {
          colorCluster.push(tileIndex);
        }
      } else if ((tile.content.type === BubbleType.SpecialBubble) && !this.arrayContains(specialBubbleCluster, tileIndex)) {
        specialBubbleCluster.push(tileIndex);
      }
    }
  }

  // Checks if an array of tile indices contains a specific tile index
  private arrayContains(tileIndexArray: TileIndex[], targetTileIndex: TileIndex): boolean {
    return tileIndexArray.some(tileIndex => tileIndex.row === targetTileIndex.row && tileIndex.column === targetTileIndex.column);
  }
}