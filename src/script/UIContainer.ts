import { Application, Container } from "pixi.js";

export class UIContainer extends Container {
    private app: Application;

    init(app: Application) {
        this.app = app;

    }
}