import { Point } from "pixi.js";
import { getDistanceBetweenTwoPoints } from "../../utils";
import { BubblesWithinRangeFinder } from "../../utils/BubblesWithinRangeFinder";
import { TileIndex, Tile, TileGrid } from "../model/TileGrid";

export default class NeighborsBubbleShakingController {
    constructor(getTile: (tileIndex: TileIndex) => Tile, tiles: TileGrid, isStartWithShifted: boolean) {
        this.getTile = getTile;
        this.tiles = tiles;
        this.isStartWithShifted = isStartWithShifted;

        this.bubblesWithinRangeFinder = new BubblesWithinRangeFinder();
    }

    perform(finalGridPosition: TileIndex, finalPositionInPixel: Point, lastVisibleRowIndex: number) {
        //TODO:FIX ME
        const bubbles = this.bubblesWithinRangeFinder.getBubblesWithinRange(finalGridPosition, this.tiles, lastVisibleRowIndex, 1000, 1, this.isStartWithShifted)
        for (let bubble of bubbles.bubbles) {
            const tile: Tile = this.getTile(bubble);
            const dist = getDistanceBetweenTwoPoints(finalPositionInPixel, tile.position)
            let x = finalPositionInPixel.x - tile.position.x;
            let y = finalPositionInPixel.y - tile.position.y;
            x = (x / dist) * 2.5;
            y = (y / dist) * 2.5;
            // const seq = tween(tile.content.data.ui.node)
            //     .by(0.05, { position: new Vec3(-x, -y, 0) })
            //     .by(0.05, { position: new Vec3(x, y, 0) })
            //     .start();
        }
    }

    private getTile: (tileIndex: TileIndex) => Tile;
    private tiles: TileGrid;
    private isStartWithShifted: boolean;

    private bubblesWithinRangeFinder: BubblesWithinRangeFinder;
}