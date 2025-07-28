import * as PIXI from 'pixi.js';
import { Card } from '../entities/Card.js';
import { getRewardCards } from '../data/Cards.js';

export class RewardScene {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.gameState = game.getGameState();
        
        this.background = null;
        this.rewardCards = [];
        this.selectedCard = null;
        this.skipButton = null;
    }

    init() {
        // Background
        const bgTexture = this.game.app.loader?.resources?.['bg_reward'];
        this.background = new PIXI.Sprite(bgTexture || this.createBackground());
        this.background.width = 1280;
        this.background.height = 720;
        this.container.addChild(this.background);

        this.createRewardCards();
        this.createUI();
    }

    createRewardCards() {
        // Get reward cards
        const cardIds = getRewardCards();
        this.rewardCards = cardIds.map(cardId => {
            const cardData = {
                id: cardId.id,
                name: cardId.name,
                type: cardId.type,
                cost: cardId.cost,
                damage: cardId.damage,
                block: cardId.block,
                rarity: cardId.rarity,
                description: cardId.description,
                aoe: cardId.aoe,
                exhaust: cardId.exhaust,
                strength: cardId.strength,
                draw: cardId.draw
            };
            return cardData;
        });

        // Create visual cards
        this.rewardCards.forEach((cardData, index) => {
            const card = new Card(cardData);
            card.x = (index - this.rewardCards.length / 2) * 200 + 640;
            card.y = 300;
            
            // Make card interactive
            card.container.eventMode = 'static';
            card.container.cursor = 'pointer';
            
            card.container.on('pointerdown', () => {
                this.selectCard(card, cardData);
            });
            
            card.container.on('pointerover', () => {
                card.container.scale.set(1.1);
            });
            
            card.container.on('pointerout', () => {
                card.container.scale.set(1.0);
            });

            this.container.addChild(card.container);
        });
    }

    selectCard(card, cardData) {
        // Clear previous selection
        this.clearSelection();
        
        this.selectedCard = { card, cardData };
        
        // Highlight selected card
        card.container.scale.set(1.15);
        card.container.tint = 0xffff00;
        
        // Show confirmation button
        this.showConfirmButton();
    }

    clearSelection() {
        this.rewardCards.forEach((cardData, index) => {
            const card = this.container.children.find(child => 
                child instanceof PIXI.Container && child.children.length > 0 && 
                child.children[0] instanceof PIXI.Graphics
            );
            if (card) {
                card.scale.set(1.0);
                card.tint = 0xffffff;
            }
        });
        
        this.selectedCard = null;
        this.hideConfirmButton();
    }

    showConfirmButton() {
        if (this.confirmButton) {
            this.container.removeChild(this.confirmButton);
        }
        
        this.confirmButton = new PIXI.Container();
        this.confirmButton.x = 640;
        this.confirmButton.y = 500;
        
        const bg = new PIXI.Graphics();
        bg.beginFill(0x00ff00);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-80, -25, 160, 50, 10);
        bg.endFill();
        this.confirmButton.addChild(bg);
        
        const text = new PIXI.Text('ADD CARD', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        text.anchor.set(0.5);
        this.confirmButton.addChild(text);
        
        this.confirmButton.eventMode = 'static';
        this.confirmButton.cursor = 'pointer';
        
        this.confirmButton.on('pointerdown', () => {
            this.addSelectedCard();
        });
        
        this.confirmButton.on('pointerover', () => {
            bg.tint = 0x00cc00;
        });
        
        this.confirmButton.on('pointerout', () => {
            bg.tint = 0xffffff;
        });
        
        this.container.addChild(this.confirmButton);
    }

    hideConfirmButton() {
        if (this.confirmButton) {
            this.container.removeChild(this.confirmButton);
            this.confirmButton = null;
        }
    }

    addSelectedCard() {
        // Check if player is dead
        if (this.gameState.isGameOver()) {
            console.log('Cannot add card: player is dead');
            this.game.switchScene('mainMenu');
            return;
        }
        
        if (this.selectedCard) {
            const success = this.gameState.addCard(this.selectedCard.cardData.id);
            if (success) {
                console.log(`Added card: ${this.selectedCard.cardData.name}`);
                this.returnToMap();
            }
        }
    }

    createUI() {
        // Title
        const title = new PIXI.Text('CHOOSE A CARD', {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });
        title.anchor.set(0.5);
        title.x = 640;
        title.y = 100;
        this.container.addChild(title);
        
        // Subtitle
        const subtitle = new PIXI.Text('Choose one card to add to your deck', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 2
        });
        subtitle.anchor.set(0.5);
        subtitle.x = 640;
        subtitle.y = 150;
        this.container.addChild(subtitle);
        
        // Skip button
        this.skipButton = new PIXI.Container();
        this.skipButton.x = 640;
        this.skipButton.y = 600;
        
        const skipBg = new PIXI.Graphics();
        skipBg.beginFill(0x666666);
        skipBg.lineStyle(2, 0xffffff);
        skipBg.drawRoundedRect(-60, -25, 120, 50, 10);
        skipBg.endFill();
        this.skipButton.addChild(skipBg);
        
        const skipText = new PIXI.Text('SKIP', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        skipText.anchor.set(0.5);
        this.skipButton.addChild(skipText);
        
        this.skipButton.eventMode = 'static';
        this.skipButton.cursor = 'pointer';
        
        this.skipButton.on('pointerdown', () => {
            this.returnToMap();
        });
        
        this.skipButton.on('pointerover', () => {
            skipBg.tint = 0x888888;
        });
        
        this.skipButton.on('pointerout', () => {
            skipBg.tint = 0xffffff;
        });
        
        this.container.addChild(this.skipButton);
    }

    returnToMap() {
        // Check if player is dead
        if (this.gameState.isGameOver()) {
            console.log('Cannot return to map: player is dead');
            this.game.switchScene('mainMenu');
            return;
        }
        
        this.game.switchScene('map');
    }

    createBackground() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x2c3e50);
        graphics.drawRect(0, 0, 1280, 720);
        graphics.endFill();
        
        // Add some decorative elements
        for (let i = 0; i < 50; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xffffff, Math.random() * 0.5 + 0.1);
            star.drawCircle(0, 0, Math.random() * 2 + 1);
            star.endFill();
            star.x = Math.random() * 1280;
            star.y = Math.random() * 720;
            graphics.addChild(star);
        }
        
        return this.game.app.renderer.generateTexture(graphics);
    }

    cleanup() {
        // Clean up all children
        while (this.container.children.length > 0) {
            const child = this.container.children[0];
            if (child.cleanup) {
                child.cleanup();
            }
            this.container.removeChild(child);
        }
        
        this.rewardCards = [];
        this.selectedCard = null;
        this.skipButton = null;
        this.confirmButton = null;
    }

    update() {
        // Update logic if needed
    }

    handleResize() {
        // Handle resize if needed
    }
} 