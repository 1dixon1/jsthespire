import * as PIXI from 'pixi.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { CombatScene } from './scenes/CombatScene.js';
import { MapScene } from './scenes/MapScene.js';
import { RewardScene } from './scenes/RewardScene.js';
import { GameState } from './GameState.js';

export class Game {
    constructor(app) {
        this.app = app;
        this.currentScene = null;
        this.gameState = new GameState();
        
        this.scenes = {
            mainMenu: new MainMenuScene(this),
            combat: new CombatScene(this),
            map: new MapScene(this),
            reward: new RewardScene(this)
        };
        
        this.init();
    }

    init() {
        // Add global UI container
        this.uiContainer = new PIXI.Container();
        this.app.stage.addChild(this.uiContainer);
        
        // Start with main menu
        this.switchScene('mainMenu');
    }

    switchScene(sceneName) {
        if (this.currentScene) {
            this.currentScene.cleanup();
            this.app.stage.removeChild(this.currentScene.container);
        }

        this.currentScene = this.scenes[sceneName];
        this.currentScene.init();
        this.app.stage.addChild(this.currentScene.container);
    }

    update() {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update();
        }
    }

    handleResize() {
        if (this.currentScene && this.currentScene.handleResize) {
            this.currentScene.handleResize();
        }
    }

    getGameState() {
        return this.gameState;
    }

    startNewGame() {
        this.gameState.reset();
        this.switchScene('map');
    }

    continueGame() {
        if (this.gameState.isInCombat) {
            this.switchScene('combat');
        } else {
            this.switchScene('map');
        }
    }
} 