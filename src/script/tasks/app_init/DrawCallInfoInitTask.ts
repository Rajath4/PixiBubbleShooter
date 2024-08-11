import { Application } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class DrawCallInfoInitTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    async execute(): Promise<void> {
        let drawCount = 0;

        const renderer = this.app.renderer as any;
        const drawElements = renderer.gl.drawElements;
        renderer.gl.drawElements = (...args: any[]) => {
            drawElements.call(renderer.gl, ...args);
            drawCount++;
        }; // rewrite drawElements to count draws
    
        this.app.ticker.add((deltaTime) => {
            console.log(`drawCount: ${drawCount}`);
            drawCount = 0; // clear count per frame
        });
    
        return Promise.resolve();
    }
}