
import { Application } from 'pixi.js';

import { GameScene } from './GameScene';
import { TaskManager } from './generic/components/TaskManager/TaskManager';
import { AppInitTask } from './tasks/app_init/AppInitTask';
import { AssetPreloadTask } from './tasks/app_init/AssetPreloadTask';
import { DebugStatInitTask } from './tasks/app_init/DebugStatInitTask';
import { DrawCallInfoInitTask } from './tasks/app_init/DrawCallInfoInitTask';
import { PluginInitTask } from './tasks/app_init/PluginInitTask';
import { WindowResizeTask } from './tasks/app_init/WindowResizeTask';

// Asynchronous IIFE
(async () => {
    const app = new Application();

    const appInitializer = new TaskManager();
    appInitializer.add(new PluginInitTask(app));
    appInitializer.add(new AppInitTask(app));
    appInitializer.add(new DebugStatInitTask(app));
    // appInitializer.add(new DrawCallInfoInitTask(app));
    appInitializer.add(new WindowResizeTask(app));
    appInitializer.add(new AssetPreloadTask(app));

    await appInitializer.execute();

    const gameScene = new GameScene();
    gameScene.init(app);
    app.stage.addChild(gameScene);
})();