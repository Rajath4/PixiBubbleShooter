import { Application } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class AppInitTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    async execute(): Promise<void> {
        await this.app.init({
            width: 1080,
            height: 1920,
            background: '#1099bb',
            resolution: window.devicePixelRatio,
            autoDensity: true,
            backgroundColor: 0x1099bb,
            resizeTo: window,
        });
        // Then adding the application's canvas to the DOM body.
        document.body.appendChild(this.app.canvas);
        return Promise.resolve();
    }
}