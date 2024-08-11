
import { Application, Renderer, Assets, Container, Sprite } from 'pixi.js';

import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { GameScene } from './GameScene';


async function preload() {
    // Create an array of asset data to load.
    const assets = [
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
    await Assets.load(assets);
}



// Asynchronous IIFE
(async () => {
    // register the plugin
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);

    const app = new Application();

    await app.init({
        width: 1080,
        height: 1920,
        background: '#1099bb',
        resolution: window.devicePixelRatio,
        autoDensity: true,
        backgroundColor: 0x1099bb,
        resizeTo: window,
    });



    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    //@ts-ignore
    // const stats = new Stats();
    // document.body.appendChild(stats.dom);

    // // Setup the PIXI ticker to update Stats.js
    // app.ticker.add(() => {
    //     stats.begin();
    //     // Any rendering or updating code goes here
    //     stats.end();
    // });



    // let drawCount = 0;

    // const renderer = app.renderer as any;
    // const drawElements = renderer.gl.drawElements;
    // renderer.gl.drawElements = (...args: any[]) => {
    //   drawElements.call(renderer.gl, ...args);
    //   drawCount++;
    // }; // rewrite drawElements to count draws

    // app.ticker.add((deltaTime) => {
    //   console.log(`drawCount: ${drawCount}`);
    //   drawCount = 0; // clear count per frame
    // });


    window.addEventListener('resize', resizeApp);
    resizeApp();  // Call immediately to set initial sizes

    await preload();

    const gameScene = new GameScene();
    gameScene.init(app);
    app.stage.addChild(gameScene);


    function resizeApp() {
        const gameRatio = 9 / 16;  // The desired aspect ratio (16:9)
        const currentRatio = window.innerWidth / window.innerHeight;

        let newWidth: number, newHeight: number;

        if (currentRatio > gameRatio) {
            // If the window ratio is wider than 16:9 (landscape mode)
            newHeight = window.innerHeight;
            newWidth = newHeight * gameRatio;

            app.renderer.canvas.style.width = `${newWidth}px`;
            // app.renderer.canvas.style.height = `${newHeight}px`;

            // Center the canvas horizontally (add borders on the left and right)
            app.renderer.canvas.style.marginLeft = `${(window.innerWidth - newWidth) / 2}px`;
            app.renderer.canvas.style.marginTop = '0px';
            app.renderer.resize(newWidth, newHeight);
        }
    }
})();