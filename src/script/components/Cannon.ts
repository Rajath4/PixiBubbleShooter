import { Application, Container, Sprite, Point } from 'pixi.js';

export class CannonContainer {
    private app: Application;
    private container: Container;

    constructor(app: Application, parent: Container) {
        this.app = app;
        this.container = new Container();
        parent.addChild(this.container);

        this.init();
    }

    private init() {
        this.initCannon();
    }

    private initCannon() {
        const cannon = Sprite.from('cannon');
        cannon.anchor.set(0.5);
        cannon.scale.set(1);
        cannon.position = new Point(this.app.screen.width / 2, this.app.screen.height - cannon.height / 2);
        this.container.addChild(cannon);
    }
}