import { Assets } from "pixi.js";
import { Task } from "../../generic/components/TaskManager/Task";

export class AssetPreloadTask extends Task {

    constructor() {
        super();
    }

    async execute(): Promise<void> {
        await Assets.load(this.assetsToPreload);
    }

    private assetsToPreload = [
        { alias: 'background', src: 'assets/img/bg.png' },
        { alias: 'cannon', src: 'assets/img/Cannon.png' },
        { alias: 'bubble', src: 'assets/img/bobble_base.png' },
        { alias: 'bubble_shine', src: 'assets/img/bubble_shine.png' },
        { alias: 'dead_line', src: 'assets/img/dead_line.png' },
        { alias: 'bottom_base', src: 'assets/img/Bottom Panel Base.png' },
        { alias: 'top_header', src: 'assets/img/Top Panel.png' },
        { alias: "score_panel", src: "assets/img/score panel.png" },
        { alias: "play_again_button", src: "assets/img/play_again_btn.png" },
    ];
}