import { Application, Color, Container, Point, Sprite, Texture } from "pixi.js";
import StageGamePlayLayerDependencyProvider from "./StageGamePlayLayerDependencyProvider";
import { UIContainer } from "./UIContainer";
import BubbleShooterGamePlayModel from "./components/BubbleShooterGamePlayModel";
import { CannonContainer } from "./components/Cannon";
import { DynamicBubbleLayout } from "./components/bubbleLayout/DynamicBubbleLayout";
import { IWeaponBubbleImpactInfo } from "./components/bubbleLayout/GamePlayEngineModelInterfaces";
import { ObserverHandler } from "./components/bubbleLayout/ObserverHandler";
import { getDummyLayout } from "./components/bubbleLayout/StaticBubbleLayout";
import { BubbleFactoryController } from "./components/bubbleLayout/model/BubbleFactoryController";
import { BubbleType } from "./components/bubbleLayout/model/LayoutInterface";
import TileGridModel from "./components/bubbleLayout/model/TileGridModel";
import { getDiagonalLengthOfRectangle } from "./components/utils";
import { designResolution } from "./config";
import Background from "./components/Background";
import DeadLine from "./components/DeadLine";
import { TextButton } from "./generic/components/TextButton";

export class ResultView extends Container {
    private app: Application;
   

    init(app: Application) {
        this.app = app;

        this.initBG();
        this.initPlayAgainButton();
    }

    private initBG() {
        const background = new Background(this.app);
        background.tint = new Color(0xB6B6B4);
        this.addChild(background);
    }

    private initPlayAgainButton() {
        const playAgainButton = new TextButton(Texture.from('play_again_button'),'Play Again', 64, 0xffffff);
        playAgainButton.onClick(() => {
            console.log('Play again button clicked');
        });
        playAgainButton.setPosition(this.app.screen.width * 0.5, this.app.screen.height * 0.75);
        this.addChild(playAgainButton);
    }

}