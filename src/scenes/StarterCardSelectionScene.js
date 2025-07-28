import * as PIXI from 'pixi.js';
import { Card } from '../entities/Card.js';
import { getRandomCardByRarity } from '../data/Cards.js';

export class StarterCardSelectionScene {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.gameState = game.getGameState();
        
        this.background = null;
        this.starterCards = [];
        this.selectedCards = [];
        this.maxSelections = 2;
        this.confirmButton = null;
    }

    init() {
        // Background
        const bgTexture = this.game.app.loader?.resources?.['bg_starter'];
        this.background = new PIXI.Sprite(bgTexture || this.createBackground());
        this.background.width = 1280;
        this.background.height = 720;
        this.container.addChild(this.background);

        this.createStarterCards();
        this.createUI();
    }

    createStarterCards() {
        // Generate 6 random cards for selection
        this.starterCards = [];
        
        // 2 common cards
        for (let i = 0; i < 2; i++) {
            const card = getRandomCardByRarity('common');
            if (card) {
                this.starterCards.push({
                    id: card.id,
                    name: card.name,
                    type: card.type,
                    cost: card.cost,
                    damage: card.damage,
                    block: card.block,
                    rarity: card.rarity,
                    description: card.description,
                    aoe: card.aoe,
                    exhaust: card.exhaust,
                    strength: card.strength,
                    draw: card.draw,
                    weak: card.weak,
                    vulnerable: card.vulnerable,
                    thorns: card.thorns,
                    energy: card.energy
                });
            }
        }
        
        // 2 uncommon cards
        for (let i = 0; i < 2; i++) {
            const card = getRandomCardByRarity('uncommon');
            if (card) {
                this.starterCards.push({
                    id: card.id,
                    name: card.name,
                    type: card.type,
                    cost: card.cost,
                    damage: card.damage,
                    block: card.block,
                    rarity: card.rarity,
                    description: card.description,
                    aoe: card.aoe,
                    exhaust: card.exhaust,
                    strength: card.strength,
                    draw: card.draw,
                    weak: card.weak,
                    vulnerable: card.vulnerable,
                    thorns: card.thorns,
                    energy: card.energy
                });
            }
        }
        
        // 2 rare cards
        for (let i = 0; i < 2; i++) {
            const card = getRandomCardByRarity('rare');
            if (card) {
                this.starterCards.push({
                    id: card.id,
                    name: card.name,
                    type: card.type,
                    cost: card.cost,
                    damage: card.damage,
                    block: card.block,
                    rarity: card.rarity,
                    description: card.description,
                    aoe: card.aoe,
                    exhaust: card.exhaust,
                    strength: card.strength,
                    draw: card.draw,
                    weak: card.weak,
                    vulnerable: card.vulnerable,
                    thorns: card.thorns,
                    energy: card.energy
                });
            }
        }

        // Create visual cards in a 3x2 grid
        this.starterCards.forEach((cardData, index) => {
            const card = new Card(cardData);
            const row = Math.floor(index / 3);
            const col = index % 3;
            
            card.x = (col - 1) * 250 + 640;
            card.y = (row - 0.5) * 200 + 300;
            
            // Make card interactive
            card.container.eventMode = 'static';
            card.container.cursor = 'pointer';
            
            card.container.on('pointerdown', () => {
                this.selectCard(card, cardData, index);
            });
            
            card.container.on('pointerover', () => {
                if (!this.isCardSelected(index)) {
                    card.container.scale.set(1.1);
                }
            });
            
            card.container.on('pointerout', () => {
                if (!this.isCardSelected(index)) {
                    card.container.scale.set(1.0);
                }
            });

            this.container.addChild(card.container);
        });
    }

    selectCard(card, cardData, index) {
        if (this.isCardSelected(index)) {
            // Deselect card
            this.selectedCards = this.selectedCards.filter(selected => selected.index !== index);
            card.container.scale.set(1.0);
            card.container.tint = 0xffffff;
        } else if (this.selectedCards.length < this.maxSelections) {
            // Select card
            this.selectedCards.push({ card, cardData, index });
            card.container.scale.set(1.15);
            card.container.tint = 0xffff00;
        }
        
        this.updateConfirmButton();
    }

    isCardSelected(index) {
        return this.selectedCards.some(selected => selected.index === index);
    }

    updateConfirmButton() {
        if (this.confirmButton) {
            this.container.removeChild(this.confirmButton);
        }
        
        if (this.selectedCards.length === this.maxSelections) {
            this.showConfirmButton();
        }
    }

    showConfirmButton() {
        this.confirmButton = new PIXI.Container();
        this.confirmButton.x = 640;
        this.confirmButton.y = 600;
        
        const bg = new PIXI.Graphics();
        bg.beginFill(0x00ff00);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-100, -25, 200, 50, 10);
        bg.endFill();
        this.confirmButton.addChild(bg);
        
        const text = new PIXI.Text('START ADVENTURE', {
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
            this.addSelectedCards();
        });
        
        this.confirmButton.on('pointerover', () => {
            bg.tint = 0x00cc00;
        });
        
        this.confirmButton.on('pointerout', () => {
            bg.tint = 0xffffff;
        });
        
        this.container.addChild(this.confirmButton);
    }

    addSelectedCards() {
        console.log('Adding selected cards to deck...');
        console.log('Selected cards:', this.selectedCards);
        console.log('Deck before adding:', this.gameState.deck.length);
        
        this.selectedCards.forEach(selected => {
            console.log(`Adding card: ${selected.cardData.name} (${selected.cardData.id})`);
            const success = this.gameState.addCard(selected.cardData.id);
            console.log(`Card added successfully: ${success}`);
        });
        
        console.log(`Added ${this.selectedCards.length} starter cards to deck`);
        console.log('Deck after adding:', this.gameState.deck.length);
        console.log('Final deck:', this.gameState.deck.map(card => card.name));
        this.startGame();
    }

    startGame() {
        // Check if player is dead (shouldn't happen here, but just in case)
        if (this.gameState.isGameOver()) {
            console.log('Cannot start game: player is dead');
            this.game.switchScene('mainMenu');
            return;
        }
        
        this.game.switchScene('map');
    }

    createUI() {
        // Title
        const title = new PIXI.Text('CHOOSE YOUR STARTER CARDS', {
            fontFamily: 'Arial',
            fontSize: 32,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 4
        });
        title.anchor.set(0.5);
        title.x = 640;
        title.y = 80;
        this.container.addChild(title);
        
        // Subtitle
        const subtitle = new PIXI.Text('Select 2 cards to add to your starting deck', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xcccccc,
            stroke: 0x000000,
            strokeThickness: 2
        });
        subtitle.anchor.set(0.5);
        subtitle.x = 640;
        subtitle.y = 130;
        this.container.addChild(subtitle);
        
        // Selection counter
        this.selectionText = new PIXI.Text('Selected: 0/2', {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xffff00,
            stroke: 0x000000,
            strokeThickness: 2
        });
        this.selectionText.anchor.set(0.5);
        this.selectionText.x = 640;
        this.selectionText.y = 170;
        this.container.addChild(this.selectionText);
        
        // Skip button
        this.skipButton = new PIXI.Container();
        this.skipButton.x = 640;
        this.skipButton.y = 650;
        
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
            this.startGame();
        });
        
        this.skipButton.on('pointerover', () => {
            skipBg.tint = 0x888888;
        });
        
        this.skipButton.on('pointerout', () => {
            skipBg.tint = 0xffffff;
        });
        
        this.container.addChild(this.skipButton);
    }

    updateSelectionText() {
        if (this.selectionText) {
            this.selectionText.text = `Selected: ${this.selectedCards.length}/${this.maxSelections}`;
        }
    }

    createBackground() {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x1a1a2e);
        graphics.drawRect(0, 0, 1280, 720);
        graphics.endFill();
        
        // Add some decorative elements
        for (let i = 0; i < 30; i++) {
            const star = new PIXI.Graphics();
            star.beginFill(0xffffff, Math.random() * 0.3 + 0.1);
            star.drawCircle(0, 0, Math.random() * 1.5 + 0.5);
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
        
        this.starterCards = [];
        this.selectedCards = [];
        this.confirmButton = null;
        this.skipButton = null;
        this.selectionText = null;
    }

    update() {
        this.updateSelectionText();
    }

    handleResize() {
        // Handle resize if needed
    }
} 