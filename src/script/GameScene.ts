import { Application, Container, Sprite } from "pixi.js"
import { GamePlayView } from "./views/GamePlayView"
import { ResultView } from "./views/ResultView";


export class GameScene extends Container {
    private app: Application;
    private gamePlayView: GamePlayView;
    private resultView: ResultView;

    init(app: Application) {
        this.app = app;
        this.resultView = new ResultView();

        this.addChild(this.resultView);

        // this.gamePlayView.zIndex = 0;
        this.resultView.zIndex = 1;

        this.initGamePlayView();
    }

    initGamePlayView() {
        // this.resultView.visible = false;
        this.gamePlayView = new GamePlayView();
        this.gamePlayView.init({ width: this.app.screen.width, height: this.app.screen.height });
        this.gamePlayView.on('gameOver', this.onGameOver);
        this.addChild(this.gamePlayView);
    }

    private initResultView(isWon: boolean, sessionScore: number) {
        this.resultView.visible = true;
        this.resultView.init({ width: this.app.screen.width, height: this.app.screen.height }, isWon, sessionScore, () => {
            // this.initGamePlayView();
        });
    }

    private destroyView(view: Container) {
        view.children.forEach(child => {
            if (child instanceof Sprite) {
                child.texture.destroy(true);
            }
            child.destroy({ children: true, texture: true });
        });
        view.destroy({ children: true, texture: true });
    }

    private onGameOver = (isWon: boolean, sessionScore: number) => {
        this.gamePlayView.off('gameOver', this.onGameOver);
        this.gamePlayView.destroy({ children: true, texture: true });
        this.gamePlayView.removeFromParent();
        delete this.gamePlayView;
        // this.gamePlayView = null;
        console.error('Game Over', this.gamePlayView);

        this.initGamePlayView();
    }
}