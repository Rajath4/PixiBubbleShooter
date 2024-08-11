import { Point } from "pixi.js";
import { getDistanceBetweenTwoPoints } from "../../../utils/utils";
import { Tile, TileGrid, TileIndex } from "../../../types/BubbleGridInterfaces";
import { gsap } from 'gsap';
import { BubblesWithinRangeFinder } from "../../../model/utils/BubblesWithinRangeFinder";

export default class NeighborsBubbleShakingController {
    constructor(getTile: (tileIndex: TileIndex) => Tile, tiles: TileGrid, isStartWithShifted: boolean) {
        this.getTile = getTile;
        this.tiles = tiles;
        this.isStartWithShifted = isStartWithShifted;

        this.bubblesWithinRangeFinder = new BubblesWithinRangeFinder();
    }

    perform(finalGridPosition: TileIndex, finalPositionInPixel: Point, lastVisibleRowIndex: number) {
        const bubbles = this.bubblesWithinRangeFinder.getBubblesWithinRange(finalGridPosition, this.tiles, lastVisibleRowIndex, 1000, 1, this.isStartWithShifted)
        bubbles.bubbles.forEach((bubble) => {
            const tile: Tile = this.getTile(bubble);
            const dist = getDistanceBetweenTwoPoints(finalPositionInPixel, new Point(tile.position.x, tile.position.y));
            let x = finalPositionInPixel.x - tile.position.x;
            let y = finalPositionInPixel.y - tile.position.y;
            x = (x / dist) * 2.5;
            y = (y / dist) * 2.5;

            // Perform the animation using GSAP
            gsap.timeline()
                .to(tile.content.data.ui.node, { duration: 0.05, pixi: { x: `-=${x}`, y: `-=${y}` } })
                .to(tile.content.data.ui.node, { duration: 0.05, pixi: { x: `+=${x}`, y: `+=${y}` } });
        });
    }

    private getTile: (tileIndex: TileIndex) => Tile;
    private tiles: TileGrid;
    private isStartWithShifted: boolean;

    private bubblesWithinRangeFinder: BubblesWithinRangeFinder;
}