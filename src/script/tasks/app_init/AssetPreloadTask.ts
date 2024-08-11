import { Application, Assets } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class AssetPreloadTask extends Task {
    private app: Application;

    constructor(app: Application) {
        super();
        this.app = app;
    }

    private async preload() {
        // Create an array of asset data to load.
        const assetsToPreload = [
            { alias: 'background', src: 'assets/img/textures/bg/bottom.png' },
            { alias: 'cannon', src: 'assets/img/textures/Cannon.png' },
            { alias: 'bubble', src: 'assets/img/textures/bobble_base.png' },
            { alias: 'bubble_shine', src: 'assets/img/textures/bubble_shine.png' },
            { alias: 'dead_line', src: 'assets/img/textures/dead_line.png' },
            { alias: 'bottom_base', src: 'assets/img/textures/Bottom Panel Base.png' },
            { alias: 'top_header', src: 'assets/img/textures/ui/Top Panel.png' },
            { alias: "score_panel", src: "assets/img/textures/ui/score panel.png" },
            { alias: "play_again_button", src: "assets/img/textures/ui/play_again_btn.png" },
        ];

        // Load the assets defined above.
        await Assets.load(assetsToPreload);
    }


    async execute(): Promise<void> {
        await this.preload();
    }
}