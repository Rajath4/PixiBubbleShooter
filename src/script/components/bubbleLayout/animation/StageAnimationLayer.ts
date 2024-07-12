import { Container, Size } from "pixi.js";
import { BubbleSprite } from "../model/BubbleSprite";
import { IBubbleSprite } from "../model/TileGrid";

const velocityOfFallingBubble = 5000;


export class StageAnimationLayer extends Container {
    private layerSize: Size;

    init(layerSize: Size) {
        this.layerSize = layerSize;
    }

    /**
     * It will initiate bubble falling and bouncing animation to all the list of bubbles.
     * @param {Node[]} bubblesToDrop List of bubble sprite to drop
     * @param {number} radiusOfBubble Radius of the bubble
     * @returns {Promise<void>} Promise that resolves once all bubbles falling and bouncing animation is done.
     */
    async initBubbleDropping(bubblesToDrop: IBubbleSprite[], radiusOfBubble: number): Promise<void> {
        await Promise.all(bubblesToDrop.map((bubble) => this.showBubbleDroppingAndBouncing(bubble, radiusOfBubble)));
    }

    /**
     * It will make the bubble to fall and bounce.
     * @param {Node} bubbleSprite Sprite of the bubble
     * @param {Point} initialPos Initial position of the bubble.
     * @param {number} radiusOfBubble Radius of the bubble
     * @returns {Promise<void>} Promise that resolves once animation is done.
     */
    showBubbleDroppingAndBouncing(bubbleSprite: IBubbleSprite, radiusOfBubble: number): Promise<void> {
        const initialPos = bubbleSprite.getWorldPosition();

        const bubbleNode = bubbleSprite.node;
        bubbleNode.removeFromParent();

        this.addChild(bubbleNode);
        // bubbleNode.setWorldPosition(initialPos);

        const heightOfBubbleFromGround = initialPos.y - radiusOfBubble;
        const timeRequiredToFall = velocityOfFallingBubble / (heightOfBubbleFromGround / 0.5);

        const extraDisPlacementOfBubble = Math.random() * (this.layerSize.width * 0.25);
        let groundHitPosOfFallingBubbleInX = initialPos.x + extraDisPlacementOfBubble;
        if (Math.floor(initialPos.x) % 2) {
            groundHitPosOfFallingBubbleInX = initialPos.x - extraDisPlacementOfBubble;
        }

        // const fallingAction = new Tween(bubbleNode)
        //     .call(async () => {
        //         await delay(Math.random() * 0.5, bubbleSprite);
        //         // GamePlaySFXController.instance.onBubbleFall();
        //     })
        //     .to(timeRequiredToFall, { worldPosition: new Vec3(groundHitPosOfFallingBubbleInX, -radiusOfBubble) }, { easing: 'bounceOut' });

        // const selfRemoveAction = new Tween(bubbleNode)
        //     .call(() => bubbleNode.destroy());

        return new Promise<void>((resolve) => {
            const onComplete = () => resolve();
            // fallingAction.then(selfRemoveAction).call(onComplete).start();
        });
    }
}