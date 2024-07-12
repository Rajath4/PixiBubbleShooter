import { Point } from "pixi.js";
import { IWeaponBubbleImpactInfo } from "./bubbleLayout/GamePlayEngineModelInterfaces";
import { ColorBubbleData } from "./bubbleLayout/model/Bubble";
import { BubbleType } from "./bubbleLayout/model/LayoutInterface";
import { BubbleContent, IBubbleSprite } from "./bubbleLayout/model/TileGrid";
import { getTimeRequiredToTravelSpecifiedDistance, getDistanceBetweenTwoPoints } from "./utils";
import { gsap } from "gsap";


export default class WeaponBubble {
    getPosition() {
        return this.sprite.getWorldPosition();
    }

    moveWeaponBubble(velocityOfWeaponBubble: number, weaponBubbleImpactInfo: IWeaponBubbleImpactInfo): Promise<void> {
        return new Promise((resolve, reject) => {
            let actionsToPerform = [];
            let bubbleCurrentPosition = this.getPosition();


            // Create a GSAP timeline
            let timeline = gsap.timeline({
                onComplete: () => {
                    resolve();
                }  // This function will be called after all animations are complete
            });

            // Loop through each point in the array
            weaponBubbleImpactInfo.trajectoryInfo.predictedBubbleMovement.forEach(point => {
                //@ts-ignore
                const localPos = this.sprite.sprite.toLocal(point);
                let timeRequiredForMovement = getTimeRequiredToTravelSpecifiedDistance(
                    velocityOfWeaponBubble,
                    getDistanceBetweenTwoPoints(
                        bubbleCurrentPosition,
                        point
                    )
                );
                //@ts-ignore
                timeline.to(this.sprite.sprite, {
                    duration: timeRequiredForMovement,  // Duration of each movement, adjust as necessary
                    pixi: { x: localPos.x, y: localPos.y }
                });
            });

            // for (const element of weaponBubbleImpactInfo.trajectoryInfo.predictedBubbleMovement) {
            //     let timeRequiredForMovement = getTimeRequiredToTravelSpecifiedDistance(
            //         velocityOfWeaponBubble,
            //         getDistanceBetweenTwoPoints(
            //             bubbleCurrentPosition,
            //             element
            //         )
            //     );
            //     timeRequiredForMovement = 2;
            //     //@ts-ignore
            //     const localPos = this.sprite.sprite.toLocal(element);
            //     actionsToPerform.push(
            //         //@ts-ignore
            //         gsap.to(this.sprite.sprite, {
            //             duration: timeRequiredForMovement,
            //             pixi: { x: localPos.x, y: localPos.y }
            //         })
            //     );

            //     bubbleCurrentPosition = new Point(element.x, element.y);
            // }

            // console.log("this.sprite", this.sprite)
            // // let worldPos = new Point(357.14, 453.45);

            // // Convert world coordinates to the local coordinates of the sprite's parent
            // //@ts-ignore
            // // let localPos = this.sprite.sprite.toLocal(worldPos);
            // //@ts-ignore
            // // actionsToPerform.push(gsap.to(this.sprite.sprite, {
            // //     duration: 2,
            // //     pixi: { x: localPos.x, y: localPos.y }
            // // }));

            // // //@ts-ignore
            // // actionsToPerform.push(gsap.to(this.sprite.sprite, {
            // //     duration: 2,
            // //     pixi: { x: 18.86, y: 141.97 }
            // // }));

            // actionsToPerform.push(
            //     //@ts-ignore
            //     gsap.to(this.sprite.sprite, {
            //         onComplete: () => {
            //             // this.sprite.parent.removeChild(this.sprite);
            //             resolve();
            //         }
            //     })
            // );

            // gsap.timeline().add(actionsToPerform);
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

