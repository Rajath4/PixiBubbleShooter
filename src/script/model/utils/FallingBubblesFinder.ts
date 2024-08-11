import { TileGrid, TileGridContents, TileIndex, TileStatus } from "../../types/BubbleGridInterfaces";

export default class FallingBubblesFinder {

    /**
     * Returns an object containing arrays of falling bubbles.
     * @param grid A map of rows of tiles.
     * @param startWithShifted Whether to start with a shifted grid.
     * @returns An object containing arrays of falling bubbles.
     */
    getFallingBubbles(grid: TileGrid, topRowIndex: number): TileGridContents {
        let falling: TileIndex[] = this.findUnreachableTiles(grid, topRowIndex);
        return { bubbles: falling };
    }

    private findUnreachableTiles(grid: TileGrid, topRowIndex: number): TileIndex[] {
        const unreachableTiles: TileIndex[] = [];
        const reachableTiles: TileIndex[] = [];

        const rowsToCheck = Array.from(grid.keys()).sort((a, b) => b - a).filter((row) => row >= topRowIndex);

        for (const row of rowsToCheck) {
            const rowContents = grid.get(row);
            for (const [column, tile] of rowContents.entries()) {
                if (tile.tileStatus != TileStatus.EMPTY) {
                    const isReachable = this.isReachableToTop({ row, column }, grid, topRowIndex, reachableTiles);
                    if (isReachable) {
                        reachableTiles.push({ row, column });
                    } else {
                        unreachableTiles.push({ row, column });
                    }
                }
            }
        }

        return unreachableTiles;
    }

    private isReachableToTop(TileIndex: TileIndex, grid: TileGrid, topRowIndex: number, reachableTiles: TileIndex[]): boolean {
        const visited = new Set<string>();
        const queue: TileIndex[] = [TileIndex];

        while (queue.length > 0) {
            const currentTile = queue.shift();
            const key = `${currentTile.row},${currentTile.column}`;

            if (visited.has(key)) {
                continue;
            }

            visited.add(key);

            if (this.arrayContains(reachableTiles, currentTile)) {
                return true;
            }

            if (currentTile.row === topRowIndex) {
                return true;
            }

            const currentRow = grid.get(currentTile.row);
            const isValidTile = currentTile.column < currentRow.length && currentTile.column >= 0
                && currentRow[currentTile.column]?.tileStatus != TileStatus.EMPTY;

            if (!isValidTile) {
                continue;
            }

            const neighbors = this.getNeighborOffsets(currentTile.row);

            for (const { rowOffset, colOffset } of neighbors) {
                const neighborRowIndex = currentTile.row + rowOffset;
                const neighborColIndex = currentTile.column + colOffset;

                if (!grid.has(neighborRowIndex)) {
                    continue;
                }

                const neighborRow = grid.get(neighborRowIndex);

                const isValidTile = neighborColIndex < neighborRow.length && neighborColIndex >= 0
                    && neighborRow[neighborColIndex]?.tileStatus != TileStatus.EMPTY;

                if (isValidTile && !visited.has(`${neighborRowIndex},${neighborColIndex}`)) {
                    queue.push({ row: neighborRowIndex, column: neighborColIndex });
                }
            }
        }
    }

    private arrayContains(array: any[], value: any): boolean {
        return array.some(item => item.row === value.row && item.column === value.column);
    }

    private getNeighborOffsets(row: number) {
        const isShifted = Math.abs(row) % 2 === 1;

        if (isShifted) {
            return [
                { rowOffset: -1, colOffset: 0 },
                { rowOffset: -1, colOffset: 1 },
                { rowOffset: 0, colOffset: -1 },
                { rowOffset: 0, colOffset: 1 },
                { rowOffset: 1, colOffset: 0 },
                { rowOffset: 1, colOffset: 1 },
            ];
        } else {
            return [
                { rowOffset: -1, colOffset: -1 },
                { rowOffset: -1, colOffset: 0 },
                { rowOffset: 0, colOffset: -1 },
                { rowOffset: 0, colOffset: 1 },
                { rowOffset: 1, colOffset: 0 },
                { rowOffset: 1, colOffset: -1 },
            ];
        }
    }
}
