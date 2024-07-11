
import { Application,Renderer, Assets, Container, Sprite } from 'pixi.js';

import { GamePlayContainer } from './GamePlayContainer';

async function preload() {
    // Create an array of asset data to load.
    const assets = [
        { alias: 'background', src: 'assets/img/textures/bg/bottom.png' },
        { alias: 'cannon', src: 'assets/img/textures/Cannon.png' },
        { alias: 'bubble', src: 'assets/img/textures/bobble_base.png' },
        { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
        { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
        { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
        { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
        { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
    ];

    // Load the assets defined above.
    await Assets.load(assets);
}



// Asynchronous IIFE
(async () => {
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    // await app.init({ background: '#1099bb', resizeTo: window });

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
    const stats = new Stats();
    document.body.appendChild(stats.dom);

    // Setup the PIXI ticker to update Stats.js
    app.ticker.add(() => {
        stats.begin();
        // Any rendering or updating code goes here
        stats.end();
    });



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

    await preload();

    const gamePlayContainer = new GamePlayContainer(app);
    gamePlayContainer.init();

    window.addEventListener('resize', resizeApp);
    resizeApp();  // Call immediately to set initial sizes

    function resizeApp() {
        const ratio = 1080 / 1920;
        const currentRatio = window.innerWidth / window.innerHeight;

        if (currentRatio > ratio) {
            // If the window ratio is wider than the game ratio (landscape mode)
            app.view.style.width = `${window.innerHeight * ratio}px`;
            app.view.style.height = `${window.innerHeight}px`;
        } else {
            // Portrait or square
            app.view.style.width = `${window.innerWidth}px`;
            app.view.style.height = `${window.innerWidth / ratio}px`;
        }
    }


})();