import { gsap } from "gsap";
import { Point } from "pixi.js";
import { BubbleSprite } from "./BubbleSprite";


class TrajectoryBubbleSprite extends BubbleSprite {
    private currentPosition: Point;
    private nextPosition: Point;
    private scaleFactor: number;

    init(color: string, position: Point, nextBubblePosition: Point): void {
        this.currentPosition = position.clone();  // Cloning to prevent reference issues
        this.nextPosition = nextBubblePosition.clone();

        this.scaleFactor = 0.05;

        // Directly setting scale and position in Pixi.js
        this.setScale(this.scaleFactor);
        this.setWorldPosition(position);

        this.updateBubble();
    }

    private updateBubble(): void {
        const timeRequiredToMove = 0.5;  // Duration in seconds
        const timeRequiredToComeBack = 0;  // Instant return

        // Creating GSAP tweens for moving to the next and back to the current position
        gsap.timeline({ repeat: -1 })  // -1 for infinite repeat
            .to(this, { duration: timeRequiredToMove, pixi: { x: this.nextPosition.x, y: this.nextPosition.y } })
            .to(this, { duration: timeRequiredToComeBack, pixi: { x: this.currentPosition.x, y: this.currentPosition.y } });
    }

    unuse(): void {
        gsap.killTweensOf(this);
        this.reset();
        this.removeFromParent();
    }

    reuse(): void {
    }

    reset(): void {
        this.currentPosition = null;
        this.nextPosition = null;
        this.scaleFactor = null;

        this.setScale(0);
        this.setWorldPosition(new Point(0, 0));
    }
}

export { TrajectoryBubbleSprite };
