import * as PIXI from 'pixi.js';
import { Game } from './Game.js';
import { LoadingManager } from './utils/LoadingManager.js';

class App {
    constructor() {
        this.app = null;
        this.game = null;
        this.loadingManager = new LoadingManager();
        this.init();
    }

    async init() {
        // Initialize PIXI Application
        this.app = new PIXI.Application({
            width: 1280,
            height: 720,
            backgroundColor: 0x1a1a2e,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        });

        // Add canvas to DOM
        const gameContainer = document.getElementById('gameContainer');
        gameContainer.appendChild(this.app.view);

        // Setup loading progress
        this.loadingManager.onProgress = (progress) => {
            const progressBar = document.getElementById('loadingProgress');
            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }
        };

        // Load all game assets
        await this.loadingManager.loadAll();
        
        // Make assets available to the game
        this.app.loader = { 
            resources: Object.fromEntries(this.loadingManager.assets)
        };

        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }

        // Initialize game
        this.game = new Game(this.app);
        
        // Start game loop
        this.app.ticker.add(() => {
            if (this.game) {
                this.game.update();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        this.handleResize();
    }

    handleResize() {
        const gameContainer = document.getElementById('gameContainer');
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        
        const scale = Math.min(
            containerWidth / 1280,
            containerHeight / 720
        );
        
        this.app.renderer.resize(1280 * scale, 720 * scale);
        this.app.stage.scale.set(scale);
        
        if (this.game) {
            this.game.handleResize();
        }
    }
}

// Start the application
new App(); 