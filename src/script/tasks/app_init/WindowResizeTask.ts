import { Application } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class WindowResizeTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    private resizeApp() {
        const gameRatio = 9 / 16;  // The desired aspect ratio (16:9)
        const currentRatio = window.innerWidth / window.innerHeight;

        let newWidth: number, newHeight: number;

        if (currentRatio > gameRatio) {
            // If the window ratio is wider than 16:9 (landscape mode)
            newHeight = window.innerHeight;
            newWidth = newHeight * gameRatio;

            this.app.renderer.canvas.style.width = `${newWidth}px`;
            // app.renderer.canvas.style.height = `${newHeight}px`;

            // Center the canvas horizontally by setting equal margins on left and right
            const horizontalMargin = (window.innerWidth - newWidth) / 2;
            this.app.renderer.canvas.style.marginLeft = `${horizontalMargin}px`;
            this.app.renderer.canvas.style.marginRight = `${horizontalMargin}px`;
            this.app.renderer.canvas.style.marginTop = '0px';

            this.app.renderer.resize(newWidth, newHeight);
        }
    }

    async execute(): Promise<void> {
        window.addEventListener('resize', this.resizeApp);
        this.resizeApp();  // Call immediately to set initial sizes

        return Promise.resolve();
    }
}