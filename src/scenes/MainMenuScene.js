import * as PIXI from 'pixi.js';

export class MainMenuScene {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.background = null;
        this.title = null;
        this.buttons = [];
    }

    init() {
        // Background
        const bgTexture = this.game.app.loader?.resources?.['bg_menu'];
        this.background = new PIXI.Sprite(bgTexture || this.createBackground());
        this.background.width = 1280;
        this.background.height = 720;
        this.container.addChild(this.background);

        // Title
        this.title = new PIXI.Text('JS THE SPIRE', {
            fontFamily: 'Arial',
            fontSize: 72,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: 0x000000,
            dropShadowBlur: 10,
            dropShadowDistance: 2
        });
        this.title.anchor.set(0.5);
        this.title.x = 640;
        this.title.y = 200;
        this.container.addChild(this.title);

        // Subtitle
        const subtitle = new PIXI.Text('A Card-Based Roguelike Adventure', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 2
        });
        subtitle.anchor.set(0.5);
        subtitle.x = 640;
        subtitle.y = 280;
        this.container.addChild(subtitle);

        // Buttons
        this.createButton('NEW GAME', 640, 400, () => {
            this.game.startNewGame();
        });

        this.createButton('CONTINUE', 640, 480, () => {
            this.game.continueGame();
        });

        this.createButton('SETTINGS', 640, 560, () => {
            // TODO: Implement settings
            console.log('Settings clicked');
        });

        // Version info
        const version = new PIXI.Text('v1.0.0', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0x888888
        });
        version.x = 1200;
        version.y = 680;
        this.container.addChild(version);

        // Animate title
        this.animateTitle();
    }

    createButton(text, x, y, onClick) {
        const button = new PIXI.Container();
        button.x = x;
        button.y = y;

        // Button background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x74b9ff);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-100, -25, 200, 50, 10);
        bg.endFill();
        button.addChild(bg);

        // Button text
        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        buttonText.anchor.set(0.5);
        button.addChild(buttonText);

        // Make interactive
        button.eventMode = 'static';
        button.cursor = 'pointer';

        button.on('pointerdown', () => {
            bg.tint = 0x5f9ea0;
        });

        button.on('pointerup', () => {
            bg.tint = 0xffffff;
            onClick();
        });

        button.on('pointerover', () => {
            bg.tint = 0x87ceeb;
        });

        button.on('pointerout', () => {
            bg.tint = 0xffffff;
        });

        this.buttons.push(button);
        this.container.addChild(button);
    }

    animateTitle() {
        const originalY = this.title.y;
        let direction = 1;
        let offset = 0;

        const animate = () => {
            offset += 0.02 * direction;
            if (offset > 0.5) direction = -1;
            if (offset < -0.5) direction = 1;
            
            this.title.y = originalY + Math.sin(offset) * 10;
            requestAnimationFrame(animate);
        };
        animate();
    }

    createBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 720);
        gradient.addColorStop(0, '#0f3460');
        gradient.addColorStop(1, '#533483');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);

        return canvas;
    }

    cleanup() {
        this.buttons.forEach(button => {
            button.destroy({ children: true });
        });
        this.buttons = [];
    }

    update() {
        // Menu doesn't need continuous updates
    }

    handleResize() {
        // Menu is fixed size
    }
} 