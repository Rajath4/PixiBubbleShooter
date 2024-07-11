import { Application, Color, Container, Point, Size, Sprite } from "pixi.js";
import { ColorBubbleData } from "./model/Bubble";
import { BubbleFactoryController } from "./model/BubbleFactoryController";
import { BubbleType } from "./model/LayoutInterface";
import { TileData, TileStatus, Tile } from "./model/TileGrid";
import TileGridDataModel from "./model/TileGridDataModel";
import TileGridModel from "./model/TileGridModel";

export const bubbleColorsInLayout = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'];

export function getDummyLayout():any[][] {
    const bubbleLayoutData = [];
    for (let i = 0; i < 12; i++) {
        bubbleLayoutData.push([]);
        for (let j = 0; j < 10; j++) {
            const array = bubbleColorsInLayout;
            const randomIndex = Math.floor(Math.random() * array.length);
            // Access and return the random element


            // if (i == 0 && j == 3) {
            //     bubbleLayoutData[i].push({
            //         type: BubbleType.Rock,
            //     });
            // } else {
                bubbleLayoutData[i].push({
                    type: BubbleType.ColorBubble,
                    color: array[randomIndex],
                });
            // }
        }
    }

    return bubbleLayoutData;
}

export class StaticBubbleLayout {
    private app: Application;
    private container: Container;

    constructor(app: Application) {
        this.app = app;
        this.container = new Container();
        this.app.stage.addChild(this.container);

        const testSprite = Sprite.from('background');
        this.container.addChild(testSprite);
        testSprite.tint = new Color('red');


    }


    init(layoutPrefilledContentData: TileData[][], isStartWithShifted: boolean, layerSize: Size, tileGridModel: TileGridModel, bubbleFactoryController: BubbleFactoryController) {
        this._layerSize = layerSize;

        this.container.removeChildren();

        this.tileGridModel = tileGridModel;
        this._dataModel = new TileGridDataModel();
        this.dataModel.init(layoutPrefilledContentData);
        this.tileGridModel.init(layoutPrefilledContentData, isStartWithShifted);

        this.bubbleFactoryController = bubbleFactoryController;

        this.tileGridModel.widthOfEachTile = this.layerSize.width / (this.tileGridModel.totalNumberOfColumnsInGrid + 0.5);     //Dynamically specify tile width based on screen width and number of columns

        this._bubbleScaleFactor = 0.95 ;
        this._radiusOfBubble = this.tileGridModel.widthOfEachTile / 2;     //Radius of the bubble (Used to detect collision)
  
        console.error('init ', this.tileGridModel.widthOfEachTile)

        this.renderInitialLayout(10);
    }

    renderInitialLayout(totalNumberOfRowsToRender: number) {
        this.getTileGridModel().addTiles(0, totalNumberOfRowsToRender);
        this.renderBubbleLayoutContent(0, totalNumberOfRowsToRender);
    }

    protected renderBubbleLayoutContent(fromRow: number, toRow: number) {
        for (let i = fromRow; i <= toRow; i++) {
            for (let j = 0; j < this.tileGridModel.totalNumberOfColumnsInGrid; j++) {
                const tile = this.tiles.get(i)[j];
                const tileData = this.dataModel.getTilePrefilledData(tile.tileIndex);
                if (tileData != null && tileData.type === BubbleType.ColorBubble) {
                    const data = tileData as ColorBubbleData;
                    const content = this.bubbleFactoryController.getColorBubbleContent(data);
                    tile.tileStatus = TileStatus.OCCUPIED;
                    tile.content = {
                        data: content,
                        type: BubbleType.ColorBubble
                    }
                    this.addTileContentToGridUI(tile);
                }
            }
        }
    }

    /**
     * It will calculate the centroid of the given array of points
     *
     * @param {[]} arr
     * @returns {Point} 
     */
    private centroidOfPoints(arr: Point[]) {
        const x = arr.map(function (a) { return a.x });
        const y = arr.map(function (a) { return a.y });
        const minX = Math.min.apply(null, x);
        const maxX = Math.max.apply(null, x);
        const minY = Math.min.apply(null, y);
        const maxY = Math.max.apply(null, y);
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    }


    /**
     * Setup the bubble to the layout
     * @param {Tile} tile Instance of Tile Class
     */
    protected addTileContentToGridUI(tile: Tile) {
        if (tile.tileStatus === TileStatus.EMPTY) {
            throw new Error('Tile is set empty');
        };
        const bubbleNode = tile.content.data.ui;
        bubbleNode.setScale(this.bubbleScaleFactor) ;
        bubbleNode.setWorldPosition(tile.position);
        this.container.addChild(bubbleNode.node);
        tile.isRenderedOnGrid = true;
        console.log('addTileContentToGridUI ', tile.position.x)
        console.log('addTileContentToGridUI ', bubbleNode.node.getSize())
    }

    get tiles() {
        return this.tileGridModel.tiles;
    }

    getTileGridModel() {
        return this.tileGridModel;
    }

    get layerSize(): Size {
        return this._layerSize;
    }

    get isStartWithShifted(): boolean {
        return this.tileGridModel.isStartWithShifted;
    }

    get radiusOfBubble(): number {
        return this._radiusOfBubble;
    }

    get bubbleScaleFactor(): number {
        return this._bubbleScaleFactor;
    }

    get dataModel(): TileGridDataModel {
        return this._dataModel;
    }

    private _layerSize: Size;
    private _radiusOfBubble: number;
    private _bubbleScaleFactor: number;

    protected tileGridModel: TileGridModel;
    protected bubbleFactoryController: BubbleFactoryController;
    private _dataModel: TileGridDataModel;
}

