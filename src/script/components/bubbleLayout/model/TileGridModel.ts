import { Point } from "pixi.js";
import { deepClone, deepCloneMap } from "./DeepClone";
import { Tile, TileData, TileIndex, TileStatus, TileContent, TileGrid } from "./TileGrid";

export default class TileGridModel {
    constructor() {
        this._tiles = new Map<number, Tile[]>();
    }

    init(data: TileData[][], isStartWithShifted: boolean) {

        this.isStartWithShifted = isStartWithShifted;

        this.totalNumberOfColumnsInGrid = 10; //TODO: HANDLE ME
    }

    /**
     * It will create a new Tile at specified of type in specified row and column.
     *
     * @param {TileIndex} tileIndex Row and Column of the bubble in grid
     * @param {BubbleType} type Type of the bubble
     * @param {BubbleData} data Data of the bubble
     * @returns {Tile}
     */
    private createTile(tileIndex: TileIndex): Tile {
        return {
            tileIndex,
            position: this.getTileCoordinate(tileIndex),
            tileStatus: TileStatus.EMPTY,
            content: null,
            isRenderedOnGrid: false
        };
    }

    addTiles(fromRow: number, toRow: number) {
        // Initialize the two-dimensional tile array
        for (let i = fromRow; i <= toRow; i++) {
            this.tiles.set(i, []);
            for (let j = 0; j < this.totalNumberOfColumnsInGrid; j++) {
                this.tiles.get(i)[j] = this.createTile({ row: i, column: j });
            }
        }
    }

    addTilesTillRow(toRow: number) {
        this.addTiles(this.getMaxRowIndex() + 1, toRow);
    }

    private getMaxRowIndex() {
        return Math.max(...this.tiles.keys());
    }

    /**
     *  Get the tile coordinate
     * @param {Number} column row of the tile in layout matrix
     * @param {Number} row column of the tile in layout matrix
     */
    getTileCoordinate(tileIndex: TileIndex) {
        let columnPos = tileIndex.column * this.widthOfEachTile;
        columnPos += this.getColumnOffset(tileIndex.row);

        // Since the anchor point is top-left, we calculate the y position directly without inversion.
        const rowPos = tileIndex.row * this.heightOfBubbleRow;

        return new Point(columnPos, rowPos);
    }



    /**
   *Get the closest grid position
   * @param {Number} x x axis position
   * @param {Number} y y axis position
   * @returns
   */
    getTileIndexFromPosition(pos: Point): TileIndex {
        // Adjust the y position to find the corresponding row, assuming y starts from the top going downwards
        const row = Math.round(pos.y / this.heightOfBubbleRow);

        // Calculate the column, considering any offset that might apply to staggered rows
        const columnOffset = this.getColumnOffset(row);
        const column = Math.floor((pos.x - columnOffset) / this.widthOfEachTile);

        return { row, column };
    }


    private getColumnOffset(row: number) {
        let rowBasedOffset = 0;
        if (this.isStartWithShifted) {
            rowBasedOffset = (row % 2) == 0 ? this.widthOfEachTile * 0.5 : 0;
        } else {
            rowBasedOffset = (row % 2) == 0 ? 0 : this.widthOfEachTile * 0.5;
        }
        return rowBasedOffset;
    }


    /**
   * This will return a tile the tile of specified row and column. A new tile will be created if the tile is not present.
   *
   * @param {Number} row Row of the bubble in grid
   * @param {Number} column Column of the bubble in grid
   * @returns {Tile} 
   */
    getTile(tileIndex: TileIndex) {
        if (!this.tiles.has(tileIndex.row)) { //Check for undefined row           
            this.tiles.set(tileIndex.row, []);
            for (let i = 0; i < this.totalNumberOfColumnsInGrid; i++) {
                this.tiles.get(tileIndex.row)[i] = this.createTile({ row: tileIndex.row, column: i });
            }
            return this.tiles.get(tileIndex.row)[tileIndex.column];
        }

        return this.tiles.get(tileIndex.row)[tileIndex.column]; // Return the tile
    }

    /**
    * It will add a bubble of specified type in specified row and column
    *
    * @param {Number} row Row of the bubble in grid
    * @param {Number} column Column of the bubble in grid
    * @param {String} bubbleColor Bubble Color of the bubble
    */
    updateTileContent(tileIndex: TileIndex, content: TileContent) {
        const tile = this.getTile(tileIndex);
        if (tile.tileStatus === TileStatus.EMPTY) { //TODO: HANDLE ME
            tile.tileStatus = TileStatus.OCCUPIED;
            tile.content = content;
        } else {
            throw new Error('Tile is already has bubble: ' + JSON.stringify(tileIndex));
        }

        return tile;
    }

    /**
     * It will make the corresponding tile empty
     *
     * @param {Number} row Row of the bubble in grid
     * @param {Number} column Column of the bubble in grid
     */
    emptyTile(tileIndex: TileIndex) {
        this.tiles.get(tileIndex.row)[tileIndex.column].tileStatus = TileStatus.EMPTY;
        this.tiles.get(tileIndex.row)[tileIndex.column].content = null;
    }

    isTileRowAvailable(row: number) {
        return this.tiles.has(row);
    }

    getMaxRenderedRowIndex() {
        const allRenderedRows = Array.from(this.tiles.keys()).filter(row => this.tiles.get(row).some(tile => tile.isRenderedOnGrid));
        return Math.max(...allRenderedRows);
    }


    get tiles(): TileGrid {
        return this._tiles;
    }

    get widthOfEachTile(): number {
        return this._widthOfEachTile;
    }

    set widthOfEachTile(value: number) {
        this._widthOfEachTile = value;
        this._heightOfEachTile = this._widthOfEachTile;     //Dynamically specify tile height based on tile width
        this._heightOfBubbleRow = (this._widthOfEachTile * Math.sqrt(3)) / 2;     //The height of the equilateral triangle is a√3/2
    }

    get heightOfEachTile(): number {
        return this._heightOfEachTile;
    }

    set heightOfEachTile(value: number) {
        this._heightOfEachTile = value;
    }

    get isStartWithShifted(): boolean {
        return this._isStartWithShifted;
    }

    set isStartWithShifted(value: boolean) {
        this._isStartWithShifted = value;
    }

    get heightOfBubbleRow(): number {
        return this._heightOfBubbleRow;
    }

    set heightOfBubbleRow(value: number) {
        this._heightOfBubbleRow = value;
    }

    get totalNumberOfColumnsInGrid(): number {
        return this._totalNumberOfColumnsInGrid;
    }

    set totalNumberOfColumnsInGrid(value: number) {
        this._totalNumberOfColumnsInGrid = value;
    }

    private _tiles: TileGrid;

    private _widthOfEachTile: number;

    private _heightOfEachTile: number;

    private _isStartWithShifted: boolean;

    private _heightOfBubbleRow: number;

    private _totalNumberOfColumnsInGrid: number;

    setDirty(tiles: TileGrid, clonedProperty: any) {
        this._tiles = tiles;
        this._widthOfEachTile = clonedProperty._widthOfEachTile;
        this._heightOfEachTile = clonedProperty._heightOfEachTile;
        this._isStartWithShifted = clonedProperty._isStartWithShifted;
        this._heightOfBubbleRow = clonedProperty._heightOfBubbleRow;
        this._totalNumberOfColumnsInGrid = clonedProperty._totalNumberOfColumnsInGrid;
    }

    getClone(): TileGridModel {
        const clone = deepClone(this);
        const clonedModel = new TileGridModel();
        const tiles = deepCloneMap(this._tiles);
        clonedModel.setDirty(tiles, clone);
        return clonedModel;
    }
}