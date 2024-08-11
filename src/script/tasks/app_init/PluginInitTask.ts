import { Application } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

export class PluginInitTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }



    async execute(): Promise<void> {
        // register the plugin
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        return Promise.resolve();
    }
}