import { gsap } from 'gsap';
import { Container, Size } from "pixi.js";
import { IBubbleSprite } from "../../../types/BubbleGridInterfaces";
import { BubbleSprite } from '../model/BubbleSprite';

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
    async initBubbleDropping(bubblesToDrop: BubbleSprite[], radiusOfBubble: number): Promise<void> {
        await Promise.all(bubblesToDrop.map((bubble) => this.showBubbleDroppingAndBouncing(bubble, radiusOfBubble)));
    }

    /**
     * It will make the bubble to fall and bounce.
     * @param {Node} bubbleSprite Sprite of the bubble
     * @param {Point} initialPos Initial position of the bubble.
     * @param {number} radiusOfBubble Radius of the bubble
     * @returns {Promise<void>} Promise that resolves once animation is done.
     */
    showBubbleDroppingAndBouncing(bubbleSprite: BubbleSprite, radiusOfBubble: number): Promise<void> {
        const initialPos = bubbleSprite.getWorldPosition();
        const bubbleNode = bubbleSprite.node;
       
        // Remove from its current parent and add to this container
        bubbleNode.removeFromParent();
        this.addChild(bubbleNode);

        // Position adjustment if needed
        bubbleNode.position.set(initialPos.x, initialPos.y);

        const heightOfBubbleFromGround = initialPos.y - radiusOfBubble;
        const timeRequiredToFall = 2; // Adjust this based on your game's physics or desired speed

        const extraDisPlacementOfBubble = Math.random() * (this.layerSize.width * 0.25);
        let groundHitPosOfFallingBubbleInX = initialPos.x + extraDisPlacementOfBubble;
        if (Math.floor(initialPos.x) % 2) {
            groundHitPosOfFallingBubbleInX = initialPos.x - extraDisPlacementOfBubble;
        }

        return new Promise<void>((resolve) => {
            gsap.timeline()
                .delay(Math.random() * 0.5)
                .to(bubbleNode, {
                    duration: timeRequiredToFall,
                    pixi: { x: groundHitPosOfFallingBubbleInX, y: this.layerSize.height },
                    ease: "bounce.out",
                    onComplete: () => {
                        bubbleNode.destroy();
                        resolve();
                    }
                });
        });
    }
}