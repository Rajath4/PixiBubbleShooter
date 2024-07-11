
import { Application, Assets, Container, Sprite } from 'pixi.js';

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
    await app.init({ background: '#1099bb', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    await preload();

    const gamePlayContainer = new GamePlayContainer(app);
    gamePlayContainer.init();
})();