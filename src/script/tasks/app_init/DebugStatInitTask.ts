import { Application } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class DebugStatInitTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    async execute(): Promise<void> {
        //@ts-ignore
        const stats = new Stats();
        document.body.appendChild(stats.dom);

        // Setup the PIXI ticker to update Stats.js
        this.app.ticker.add(() => {
            stats.begin();
            // Any rendering or updating code goes here
            stats.end();
        });
        return Promise.resolve();
    }
}