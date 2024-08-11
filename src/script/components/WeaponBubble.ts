import { gsap } from "gsap";
import { IWeaponBubbleImpactInfo } from "./bubbleLayout/GamePlayEngineModelInterfaces";
import { ColorBubbleData } from "./bubbleLayout/model/Bubble";
import { BubbleType } from "./bubbleLayout/model/LayoutInterface";
import { BubbleContent, IBubbleSprite } from "../types/BubbleGridInterfaces";
import { getDistanceBetweenTwoPoints, getTimeRequiredToTravelSpecifiedDistance } from "../utils/utils";


export default class WeaponBubble {
    getPosition() {
        return this.sprite.getWorldPosition();
    }

    moveWeaponBubble(velocityOfWeaponBubble: number, weaponBubbleImpactInfo: IWeaponBubbleImpactInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            let bubbleCurrentPosition = this.getPosition();
            let timeline = gsap.timeline({
                onComplete: () => {
                    resolve();
                }  
            });

            // Loop through each point in the array
            weaponBubbleImpactInfo.trajectoryInfo.predictedBubbleMovement.forEach(point => {
                let timeRequiredForMovement = getTimeRequiredToTravelSpecifiedDistance(
                    velocityOfWeaponBubble,
                    getDistanceBetweenTwoPoints(
                        bubbleCurrentPosition,
                        point
                    )
                );

                timeline.to(this.sprite, {
                    duration: timeRequiredForMovement, 
                    pixi: { x: point.x, y: point.y }
                });
            });
        });
    }

    setContent(content: BubbleContent) {
        this._content = content;
        this.isUsed = false;
    }

    get bubbleColor(): string {
        return (this.content.model.data as ColorBubbleData).color;
    }

    get sprite(): IBubbleSprite {
        return this.content.ui;
    }

    get type(): BubbleType {
        return BubbleType.ColorBubble;
    }

    get isUsed() {
        return this._isUsed;
    }

    set isUsed(value) {
        this._isUsed = value;
    }

    get content(): BubbleContent {
        return this._content;
    }

    private _isUsed = false;
    private _content: BubbleContent;
}

