import * as PIXI from 'pixi.js';
import { Card } from '../entities/Card.js';
import { Enemy } from '../entities/Enemy.js';
import { EnemyFactory } from '../entities/EnemyFactory.js';

export class CombatScene {
    constructor(game) {
        this.game = game;
        this.container = new PIXI.Container();
        this.gameState = game.getGameState();
        
        this.background = null;
        this.playerArea = null;
        this.enemyArea = null;
        this.handArea = null;
        this.energyDisplay = null;
        this.healthDisplay = null;
        this.endTurnButton = null;
        this.endTurnButtonBg = null;
        this.endTurnButtonText = null;
        this.combatEnded = false;
        
        this.cards = [];
        this.enemies = [];
        this.selectedCard = null;
        this.hoveredEnemy = null;
        this.targetArrow = null;
        this.damageNumbers = [];
        this.cardAnimations = [];
        this.particles = [];
    }

    init() {
        // Background
        const bgTexture = this.game.app.loader?.resources?.['bg_combat'];
        this.background = new PIXI.Sprite(bgTexture || this.createBackground());
        this.background.width = 1280;
        this.background.height = 720;
        this.container.addChild(this.background);

        // Create UI areas
        this.createPlayerArea();
        this.createEnemyArea();
        this.createHandArea();
        this.createEnergyDisplay();
        this.createHealthDisplay();
        this.createBlockDisplay();
        this.createEndTurnButton();

        // Start combat if not already in combat
        if (!this.gameState.isInCombat) {
            this.startCombat();
        } else {
            this.updateDisplay();
        }
    }

    createPlayerArea() {
        this.playerArea = new PIXI.Container();
        this.playerArea.x = 100;
        this.playerArea.y = 500;
        this.container.addChild(this.playerArea);

        // Player character placeholder
        const playerSprite = new PIXI.Graphics();
        playerSprite.beginFill(0x4ecdc4);
        playerSprite.lineStyle(3, 0xffffff);
        playerSprite.drawCircle(0, 0, 40);
        playerSprite.endFill();
        this.playerArea.addChild(playerSprite);
    }

    createEnemyArea() {
        this.enemyArea = new PIXI.Container();
        this.enemyArea.x = 800;
        this.enemyArea.y = 200;
        this.container.addChild(this.enemyArea);
    }

    createHandArea() {
        this.handArea = new PIXI.Container();
        this.handArea.x = 640;
        this.handArea.y = 600;
        this.container.addChild(this.handArea);
    }

    createEnergyDisplay() {
        this.energyDisplay = new PIXI.Container();
        this.energyDisplay.x = 50;
        this.energyDisplay.y = 50;
        this.container.addChild(this.energyDisplay);

        // Energy orbs
        this.energyOrbs = [];
        for (let i = 0; i < 3; i++) {
            const orb = new PIXI.Graphics();
            orb.beginFill(0xfdcb6e);
            orb.lineStyle(2, 0xffffff);
            orb.drawCircle(0, 0, 15);
            orb.endFill();
            orb.x = i * 35;
            
            // Add pulsing animation to energy orbs
            let scale = 1.0;
            const pulse = () => {
                scale = 1.0 + Math.sin(Date.now() * 0.005 + i) * 0.1;
                orb.scale.set(scale);
                requestAnimationFrame(pulse);
            };
            pulse();
            
            this.energyOrbs.push(orb);
            this.energyDisplay.addChild(orb);
        }

        // Energy text
        this.energyText = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        this.energyText.x = 120;
        this.energyText.y = -10;
        this.energyDisplay.addChild(this.energyText);
    }

    createHealthDisplay() {
        this.healthDisplay = new PIXI.Container();
        this.healthDisplay.x = 50;
        this.healthDisplay.y = 100;
        this.container.addChild(this.healthDisplay);

        // Health bar background
        const healthBarBg = new PIXI.Graphics();
        healthBarBg.beginFill(0x2d3436);
        healthBarBg.lineStyle(2, 0xffffff);
        healthBarBg.drawRoundedRect(0, 0, 200, 20, 5);
        healthBarBg.endFill();
        this.healthDisplay.addChild(healthBarBg);

        // Health bar fill
        this.healthBarFill = new PIXI.Graphics();
        this.healthBarFill.beginFill(0x00b894);
        this.healthBarFill.drawRoundedRect(2, 2, 196, 16, 3);
        this.healthBarFill.endFill();
        this.healthDisplay.addChild(this.healthBarFill);

        // Health text
        this.healthText = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        this.healthText.x = 210;
        this.healthText.y = 2;
        this.healthDisplay.addChild(this.healthText);
    }

    createBlockDisplay() {
        this.blockDisplay = new PIXI.Container();
        this.blockDisplay.x = 50;
        this.blockDisplay.y = 140;
        this.container.addChild(this.blockDisplay);

        // Block icon
        const blockIcon = new PIXI.Graphics();
        blockIcon.beginFill(0x4ecdc4);
        blockIcon.lineStyle(2, 0xffffff);
        blockIcon.drawRoundedRect(0, 0, 30, 30, 5);
        blockIcon.endFill();
        this.blockDisplay.addChild(blockIcon);

        // Shield symbol
        const shieldSymbol = new PIXI.Text('🛡', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        shieldSymbol.anchor.set(0.5);
        shieldSymbol.x = 15;
        shieldSymbol.y = 15;
        this.blockDisplay.addChild(shieldSymbol);

        // Block text
        this.blockText = new PIXI.Text('0', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x4ecdc4,
            stroke: 0x000000,
            strokeThickness: 2
        });
        this.blockText.x = 40;
        this.blockText.y = 5;
        this.blockDisplay.addChild(this.blockText);

        // Block label
        const blockLabel = new PIXI.Text('BLOCK', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        blockLabel.x = 40;
        blockLabel.y = 25;
        this.blockDisplay.addChild(blockLabel);
    }

    updateBlockDisplay() {
        if (this.blockText) {
            this.blockText.text = this.gameState.block.toString();
            
            // Change color based on block amount
            if (this.gameState.block > 0) {
                this.blockText.fill = 0x4ecdc4;
                this.blockDisplay.alpha = 1.0;
            } else {
                this.blockText.fill = 0x666666;
                this.blockDisplay.alpha = 0.5;
            }
        }
    }

    createEndTurnButton() {
        this.endTurnButton = new PIXI.Container();
        this.endTurnButton.x = 1100;
        this.endTurnButton.y = 600;

        this.endTurnButtonBg = new PIXI.Graphics();
        this.endTurnButtonBg.beginFill(0xff6b6b);
        this.endTurnButtonBg.lineStyle(2, 0xffffff);
        this.endTurnButtonBg.drawRoundedRect(-60, -25, 120, 50, 10);
        this.endTurnButtonBg.endFill();
        this.endTurnButton.addChild(this.endTurnButtonBg);

        this.endTurnButtonText = new PIXI.Text('END TURN', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2
        });
        this.endTurnButtonText.anchor.set(0.5);
        this.endTurnButton.addChild(this.endTurnButtonText);

        // Make interactive
        this.endTurnButton.eventMode = 'static';
        this.endTurnButton.cursor = 'pointer';

        this.endTurnButton.on('pointerdown', () => {
            if (!this.combatEnded) {
                this.endTurnButtonBg.tint = 0xcc5555;
            }
        });

        this.endTurnButton.on('pointerup', () => {
            if (!this.combatEnded) {
                this.endTurnButtonBg.tint = 0xffffff;
                this.endTurn();
            }
        });

        this.endTurnButton.on('pointerover', () => {
            if (!this.combatEnded) {
                this.endTurnButtonBg.tint = 0xff8888;
            }
        });

        this.endTurnButton.on('pointerout', () => {
            if (!this.combatEnded) {
                this.endTurnButtonBg.tint = 0xffffff;
            }
        });

        this.container.addChild(this.endTurnButton);
    }

    disableEndTurnButton() {
        this.combatEnded = true;
        this.endTurnButton.eventMode = 'none';
        this.endTurnButton.cursor = 'default';
        this.endTurnButtonBg.tint = 0x666666;
        this.endTurnButtonText.tint = 0x999999;
    }

    enableEndTurnButton() {
        this.combatEnded = false;
        this.endTurnButton.eventMode = 'static';
        this.endTurnButton.cursor = 'pointer';
        this.endTurnButtonBg.tint = 0xffffff;
        this.endTurnButtonText.tint = 0xffffff;
    }

    startCombat() {
        // Create enemies
        const enemyFactory = new EnemyFactory();
        const enemyTypes = ['goblin', 'slime', 'skeleton'];
        const numEnemies = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numEnemies; i++) {
            const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const enemy = enemyFactory.createEnemy(enemyType);
            enemy.x = i * 120;
            enemy.y = 0;
            this.enemies.push(enemy);
            this.enemyArea.addChild(enemy.container);
        }

        // Start combat in game state
        this.gameState.startCombat(this.enemies);
        
        // Create cards in hand
        this.createCardsInHand();
        this.updateDisplay();
        
        // Enable end turn button for new combat
        this.enableEndTurnButton();
    }

    createCardsInHand() {
        // Clear existing cards
        this.cards.forEach(card => {
            this.handArea.removeChild(card.container);
        });
        this.cards = [];

        // Create new cards
        this.gameState.hand.forEach((cardData, index) => {
            const card = new Card(cardData);
            card.x = (index - this.gameState.hand.length / 2) * 130;
            card.y = 0;
            
            // Make card interactive
            card.container.eventMode = 'static';
            card.container.cursor = 'pointer';
            
            card.container.on('pointerdown', () => {
                this.selectCard(card, index);
            });
            
            card.container.on('pointerover', () => {
                card.container.scale.set(1.1);
            });
            
            card.container.on('pointerout', () => {
                card.container.scale.set(1.0);
            });

            this.cards.push(card);
            this.handArea.addChild(card.container);
        });
    }

    selectCard(card, cardIndex) {
        console.log(`Selecting card ${cardIndex}: ${card.data.name}`);
        console.log(`Energy: ${this.gameState.player.currentEnergy}, Cost: ${card.data.cost}`);
        
        if (this.gameState.player.currentEnergy < card.data.cost) {
            console.log('Not enough energy to play this card');
            return; // Not enough energy
        }

        // Check if there are any valid targets for attack cards
        const aliveEnemies = this.enemies.filter(enemy => enemy.isAlive());
        if (card.data.type === 'attack' && aliveEnemies.length === 0) {
            console.log('No alive enemies to target with attack card');
            return;
        }

        // Clear previous selection
        this.clearCardSelection();

        this.selectedCard = { card, originalIndex: cardIndex };
        
        // Highlight card with glow effect
        this.cards.forEach(c => {
            c.container.tint = 0x666666;
            c.container.scale.set(1.0);
        });
        card.container.tint = 0xffffff;
        card.container.scale.set(1.05);
        
        // Add glow effect to selected card
        this.addCardGlow(card);
        
        // Handle different card types
        if (card.data.type === 'attack') {
            // Attack cards need enemy targeting
            if (aliveEnemies.length === 0) {
                console.log('No alive enemies to target');
                return; // No enemies to target
            }
            
            console.log(`Enabling targeting for ${aliveEnemies.length} alive enemies`);
            
            // Enable enemy targeting with arrow
            this.enemies.forEach((enemy, enemyIndex) => {
                if (!enemy.isAlive()) {
                    console.log(`Enemy ${enemyIndex} is dead, skipping`);
                    // Ensure dead enemies are not interactive
                    enemy.container.eventMode = 'none';
                    enemy.container.cursor = 'default';
                    return; // Skip dead enemies
                }
                
                console.log(`Setting up targeting for enemy ${enemyIndex}`);
                
                enemy.container.eventMode = 'static';
                enemy.container.cursor = 'pointer';
                
                // Remove any existing event listeners
                enemy.container.off('pointerdown');
                enemy.container.off('pointerover');
                enemy.container.off('pointerout');
                
                enemy.container.on('pointerdown', () => {
                    console.log(`Enemy ${enemyIndex} clicked`);
                    if (enemy.isAlive() && this.selectedCard) {
                        // Find the current index of the selected card
                        const currentCardIndex = this.cards.findIndex(c => c === this.selectedCard.card);
                        console.log(`Current card index: ${currentCardIndex}, Original index: ${this.selectedCard.originalIndex}`);
                        if (currentCardIndex !== -1) {
                            this.playCard(currentCardIndex, enemyIndex);
                        } else {
                            console.log('Selected card not found in hand');
                        }
                    }
                });
                
                enemy.container.on('pointerover', () => {
                    if (enemy.isAlive()) {
                        enemy.container.scale.set(1.1);
                        this.showTargetArrow(enemy);
                    }
                });
                
                enemy.container.on('pointerout', () => {
                    if (enemy.isAlive()) {
                        enemy.container.scale.set(1.0);
                        this.hideTargetArrow();
                    }
                });
            });
        } else if (card.data.type === 'skill') {
            // Skill cards (like Defend) can be played directly
            console.log('Skill card selected - can be played directly');
            
            // Add click handler to the card itself for direct play
            card.container.off('pointerdown');
            card.container.on('pointerdown', () => {
                console.log('Skill card clicked - playing directly');
                if (this.selectedCard) {
                    const currentCardIndex = this.cards.findIndex(c => c === this.selectedCard.card);
                    if (currentCardIndex !== -1) {
                        this.playCard(currentCardIndex, 0); // No target needed for skills
                    }
                }
            });
        }
    }

    playCard(cardIndex, enemyIndex) {
        console.log(`Attempting to play card ${cardIndex} on enemy ${enemyIndex}`);
        console.log(`Current energy: ${this.gameState.player.currentEnergy}`);
        console.log(`Cards in hand: ${this.cards.length}`);
        console.log(`Card at index ${cardIndex}:`, this.cards[cardIndex]);
        console.log(`Card cost: ${this.cards[cardIndex]?.data.cost}`);
        console.log(`Card type: ${this.cards[cardIndex]?.data.type}`);
        
        // Safety check
        if (cardIndex < 0 || cardIndex >= this.cards.length) {
            console.log(`Invalid card index: ${cardIndex}, hand size: ${this.cards.length}`);
            return;
        }
        
        const card = this.cards[cardIndex];
        
        // Check if enemy targeting is needed
        if (card.data.type === 'attack') {
            console.log(`Enemy alive: ${this.enemies[enemyIndex]?.isAlive()}`);
        }
        
        if (this.gameState.playCard(cardIndex, enemyIndex)) {
            console.log('Card played successfully');
            const enemy = this.enemies[enemyIndex];
            
            // Immediately clear selection to prevent double-clicks
            this.clearCardSelection();
            
            // Animate card being played
            if (card.data.type === 'attack' && enemy) {
                this.animateCardPlay(card, enemy);
            } else {
                // For skill cards, animate to player
                this.animateSkillCardPlay(card);
            }
            
            // Remove card from hand after animation
            setTimeout(() => {
                if (this.handArea.children.includes(card.container)) {
                    this.handArea.removeChild(card.container);
                }
                this.cards.splice(cardIndex, 1);
                
                // Update remaining cards positions with animation
                this.animateCardReposition();
                
                // Clear selection since card indices have changed
                this.clearCardSelection();
                
                this.updateDisplay();
                
                // Check if any enemies died and remove them
                this.removeDeadEnemies();
                
                // Check for victory
                if (this.gameState.isVictory()) {
                    this.endCombat();
                }
            }, 500);
        } else {
            console.log('Failed to play card');
        }
    }

    endTurn() {
        // Clear any existing card selection
        this.clearCardSelection();
        
        this.gameState.endTurn();
        
        // Process enemy turns with visual effects
        this.processEnemyTurns();
        
        this.createCardsInHand();
        this.updateDisplay();
        
        // Check for game over
        if (this.gameState.isGameOver()) {
            this.gameOver();
        }
    }

    processEnemyTurns() {
        // Process each enemy turn with delay for visual effect
        this.gameState.currentEnemies.forEach((enemy, index) => {
            if (enemy.isAlive()) {
                setTimeout(() => {
                    const damageResult = enemy.takeTurn(this.gameState);
                    if (damageResult) {
                        this.showPlayerDamageEffect(damageResult.actualDamage, damageResult.blocked);
                    }
                    this.updateDisplay();
                }, index * 1000); // 1 second delay between each enemy
            }
        });
    }

    removeDeadEnemies() {
        // Remove dead enemies after a delay to allow death animation
        setTimeout(() => {
            this.enemies.forEach((enemy, index) => {
                if (!enemy.isAlive() && enemy.container.parent) {
                    console.log(`Removing dead enemy ${index} from display`);
                    this.enemyArea.removeChild(enemy.container);
                }
            });
        }, 2000); // 2 second delay to allow death animation to complete
    }

    endCombat() {
        // Disable end turn button
        this.disableEndTurnButton();
        
        // Create victory particles
        this.createVictoryParticles();
        
        // Show victory message with animation
        const victoryText = new PIXI.Text('VICTORY!', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0x00ff00,
            stroke: 0x000000,
            strokeThickness: 4
        });
        victoryText.anchor.set(0.5);
        victoryText.x = 640;
        victoryText.y = 360;
        victoryText.scale.set(0);
        this.container.addChild(victoryText);
        
        // Animate victory text
        const startTime = Date.now();
        const duration = 1000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Bounce effect
                const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
                victoryText.scale.set(scale);
                requestAnimationFrame(animate);
            } else {
                victoryText.scale.set(1);
            }
        };
        
        animate();
        
        setTimeout(() => {
            this.gameState.endCombat();
            this.game.switchScene('map');
        }, 3000);
    }

    createVictoryParticles() {
        // Create celebration particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const particle = new PIXI.Graphics();
                const colors = [0x00ff00, 0xffff00, 0xff00ff, 0x00ffff];
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.beginFill(color);
                particle.drawCircle(0, 0, 3);
                particle.endFill();
                
                particle.x = Math.random() * 1280;
                particle.y = 720;
                
                this.container.addChild(particle);
                
                const particleData = {
                    graphics: particle,
                    container: this.container,
                    x: particle.x,
                    y: particle.y,
                    vx: (Math.random() - 0.5) * 5,
                    vy: -10 - Math.random() * 10,
                    life: 60 + Math.random() * 30,
                    maxLife: 60 + Math.random() * 30
                };
                
                this.particles.push(particleData);
            }, i * 50);
        }
    }

    gameOver() {
        // Disable end turn button
        this.disableEndTurnButton();
        
        const gameOverText = new PIXI.Text('GAME OVER', {
            fontFamily: 'Arial',
            fontSize: 48,
            fill: 0xff0000,
            stroke: 0x000000,
            strokeThickness: 4
        });
        gameOverText.anchor.set(0.5);
        gameOverText.x = 640;
        gameOverText.y = 360;
        this.container.addChild(gameOverText);
        
        setTimeout(() => {
            this.game.switchScene('mainMenu');
        }, 2000);
    }

    updateDisplay() {
        // Update energy display
        this.energyOrbs.forEach((orb, i) => {
            orb.tint = i < this.gameState.player.currentEnergy ? 0xffffff : 0x666666;
        });
        this.energyText.text = `${this.gameState.player.currentEnergy}/${this.gameState.player.maxEnergy}`;

        // Update health display
        const healthPercent = this.gameState.player.currentHealth / this.gameState.player.maxHealth;
        this.healthBarFill.width = 196 * healthPercent;
        this.healthText.text = `${this.gameState.player.currentHealth}/${this.gameState.player.maxHealth}`;

        // Update block display
        this.updateBlockDisplay();

        // Update enemy displays
        this.enemies.forEach(enemy => {
            enemy.updateDisplay();
        });
        
        // Validate game state
        this.validateGameState();
    }

    showPlayerDamageEffect(damage, blocked) {
        // Create damage text at player position
        const damageText = new PIXI.Text(damage.toString(), {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0xff0000,
            stroke: 0xffffff,
            strokeThickness: 2
        });
        damageText.anchor.set(0.5);
        damageText.x = 100;
        damageText.y = 450;
        
        this.container.addChild(damageText);
        
        // Show block effect if damage was blocked
        if (blocked > 0) {
            const blockText = new PIXI.Text(`-${blocked}`, {
                fontFamily: 'Arial',
                fontSize: 16,
                fill: 0x4ecdc4,
                stroke: 0xffffff,
                strokeThickness: 2
            });
            blockText.anchor.set(0.5);
            blockText.x = 100;
            blockText.y = 470;
            
            this.container.addChild(blockText);
            
            // Animate block text
            const startTime = Date.now();
            const duration = 1000;
            
            const animateBlock = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    blockText.y = 470 - progress * 30;
                    blockText.alpha = 1 - progress;
                    requestAnimationFrame(animateBlock);
                } else {
                    this.container.removeChild(blockText);
                }
            };
            
            animateBlock();
        }
        
        // Animate damage text
        const startTime = Date.now();
        const duration = 1000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                damageText.y = 450 - progress * 30;
                damageText.alpha = 1 - progress;
                requestAnimationFrame(animate);
            } else {
                this.container.removeChild(damageText);
            }
        };
        
        animate();
    }

    validateGameState() {
        console.log('=== Game State Validation ===');
        console.log(`Hand size: ${this.cards.length}, GameState hand size: ${this.gameState.hand.length}`);
        console.log(`Energy: ${this.gameState.player.currentEnergy}/${this.gameState.player.maxEnergy}`);
        console.log(`Alive enemies: ${this.enemies.filter(e => e.isAlive()).length}`);
        console.log(`Selected card: ${this.selectedCard ? this.selectedCard.card.data.name : 'None'}`);
        console.log('===========================');
    }

    createBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 720);
        gradient.addColorStop(0, '#2d3436');
        gradient.addColorStop(1, '#636e72');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);

        return canvas;
    }

    cleanup() {
        // Clear card selection
        this.clearCardSelection();
        
        // Clean up cards
        this.cards.forEach(card => {
            if (card.container && card.container.parent) {
                card.container.parent.removeChild(card.container);
            }
            card.container.destroy({ children: true });
        });
        
        // Clean up enemies
        this.enemies.forEach(enemy => {
            if (enemy.container && enemy.container.parent) {
                enemy.container.parent.removeChild(enemy.container);
            }
            enemy.container.destroy({ children: true });
        });
        
        // Clean up particles
        this.particles.forEach(particle => {
            if (particle.graphics && particle.graphics.parent) {
                particle.graphics.parent.removeChild(particle.graphics);
            }
            particle.graphics.destroy({ children: true });
        });
        
        // Clean up target arrow
        if (this.targetArrow && this.targetArrow.parent) {
            this.targetArrow.parent.removeChild(this.targetArrow);
            this.targetArrow.destroy({ children: true });
        }
        
        // Clean up card glow
        if (this.cardGlow && this.cardGlow.parent) {
            this.cardGlow.parent.removeChild(this.cardGlow);
            this.cardGlow.destroy({ children: true });
        }
        
        this.cards = [];
        this.enemies = [];
        this.particles = [];
        this.targetArrow = null;
        this.cardGlow = null;
    }

    update() {
        // Update particles
        this.updateParticles();
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= 1;
            
            if (particle.life <= 0) {
                // Remove from appropriate container
                if (particle.container) {
                    particle.container.removeChild(particle.graphics);
                } else {
                    this.enemyArea.removeChild(particle.graphics);
                }
                this.particles.splice(i, 1);
            } else {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // Gravity
                particle.graphics.x = particle.x;
                particle.graphics.y = particle.y;
                particle.graphics.alpha = particle.life / particle.maxLife;
            }
        }
    }

    handleResize() {
        // Combat scene is fixed size
    }

    // Animation and Effect Methods
    clearCardSelection() {
        // Clear selection
        this.selectedCard = null;
        
        // Reset all cards
        this.cards.forEach(c => {
            c.container.tint = 0xffffff;
            c.container.scale.set(1.0);
        });
        
        // Remove glow effect
        this.removeCardGlow();
        
        // Disable enemy targeting
        this.enemies.forEach(enemy => {
            enemy.container.eventMode = 'none';
            enemy.container.off('pointerdown');
            enemy.container.off('pointerover');
            enemy.container.off('pointerout');
        });
        
        // Hide target arrow
        this.hideTargetArrow();
    }

    addCardGlow(card) {
        // Remove existing glow
        this.removeCardGlow();
        
        // Create glow effect
        const glow = new PIXI.Graphics();
        glow.lineStyle(4, 0xffff00, 0.8);
        glow.drawRoundedRect(-65, -85, 130, 170, 15);
        glow.endFill();
        
        // Add pulsing animation
        let scale = 1.0;
        const pulse = () => {
            scale = 1.0 + Math.sin(Date.now() * 0.01) * 0.05;
            glow.scale.set(scale);
            requestAnimationFrame(pulse);
        };
        pulse();
        
        card.container.addChild(glow);
        this.cardGlow = glow;
    }

    removeCardGlow() {
        if (this.cardGlow) {
            this.cardGlow.parent.removeChild(this.cardGlow);
            this.cardGlow = null;
        }
    }

    showTargetArrow(enemy) {
        this.hideTargetArrow();
        
        // Create arrow pointing to enemy
        const arrow = new PIXI.Graphics();
        arrow.beginFill(0xff0000);
        arrow.moveTo(-10, -15);
        arrow.lineTo(0, 0);
        arrow.lineTo(10, -15);
        arrow.endFill();
        
        arrow.x = enemy.x;
        arrow.y = enemy.y - 80;
        
        // Add pulsing animation
        let scale = 1.0;
        const pulse = () => {
            scale = 1.0 + Math.sin(Date.now() * 0.015) * 0.2;
            arrow.scale.set(scale);
            requestAnimationFrame(pulse);
        };
        pulse();
        
        this.enemyArea.addChild(arrow);
        this.targetArrow = arrow;
    }

    hideTargetArrow() {
        if (this.targetArrow) {
            this.enemyArea.removeChild(this.targetArrow);
            this.targetArrow = null;
        }
    }

    animateCardPlay(card, enemy) {
        // Store original position
        const originalX = card.x;
        const originalY = card.y;
        
        // Animate card flying to enemy
        const startTime = Date.now();
        const duration = 500;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Parabolic arc
                const t = progress;
                const arcHeight = 100;
                
                card.x = originalX + (enemy.x - originalX) * t;
                card.y = originalY + (enemy.y - originalY) * t - arcHeight * Math.sin(Math.PI * t);
                card.container.scale.set(1.0 + t * 0.2);
                card.container.rotation = t * Math.PI * 0.5;
                
                requestAnimationFrame(animate);
            } else {
                // Show damage effect
                this.showDamageEffect(enemy, card.data.damage || 0);
                
                // Reset card position
                card.x = originalX;
                card.y = originalY;
                card.container.scale.set(1.0);
                card.container.rotation = 0;
            }
        };
        
        animate();
    }

    animateSkillCardPlay(card) {
        // Store original position
        const originalX = card.x;
        const originalY = card.y;
        
        // Animate card flying to player area
        const startTime = Date.now();
        const duration = 500;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Fly to player area (left side of screen)
                const targetX = 100;
                const targetY = 500;
                
                card.x = originalX + (targetX - originalX) * progress;
                card.y = originalY + (targetY - originalY) * progress;
                card.container.scale.set(1.0 + progress * 0.2);
                card.container.rotation = progress * Math.PI * 0.25;
                
                requestAnimationFrame(animate);
            } else {
                // Show block effect
                this.showBlockEffect();
                
                // Reset card position
                card.x = originalX;
                card.y = originalY;
                card.container.scale.set(1.0);
                card.container.rotation = 0;
            }
        };
        
        animate();
    }

    showBlockEffect() {
        // Create block effect at player position
        const blockEffect = new PIXI.Graphics();
        blockEffect.beginFill(0x4ecdc4, 0.8);
        blockEffect.lineStyle(3, 0xffffff);
        blockEffect.drawCircle(100, 500, 60);
        blockEffect.endFill();
        
        this.container.addChild(blockEffect);
        
        // Animate block effect
        const startTime = Date.now();
        const duration = 800;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                blockEffect.scale.set(1 + progress);
                blockEffect.alpha = 0.8 * (1 - progress);
                requestAnimationFrame(animate);
            } else {
                this.container.removeChild(blockEffect);
            }
        };
        
        animate();
    }

    animateCardReposition() {
        this.cards.forEach((card, i) => {
            const targetX = (i - this.cards.length / 2) * 130;
            const currentX = card.x;
            const distance = targetX - currentX;
            
            // Animate to new position
            const startTime = Date.now();
            const duration = 300;
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    // Ease out animation
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    card.x = currentX + distance * easeProgress;
                    requestAnimationFrame(animate);
                } else {
                    card.x = targetX;
                }
            };
            
            animate();
        });
    }

    showDamageEffect(enemy, damage) {
        // Create damage number
        const damageText = new PIXI.Text(damage.toString(), {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xff0000,
            stroke: 0xffffff,
            strokeThickness: 3
        });
        damageText.anchor.set(0.5);
        damageText.x = enemy.x;
        damageText.y = enemy.y - 50;
        
        this.enemyArea.addChild(damageText);
        
        // Animate damage number
        const startTime = Date.now();
        const duration = 1000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                damageText.y = enemy.y - 50 - progress * 50;
                damageText.alpha = 1 - progress;
                damageText.scale.set(1 + progress * 0.5);
                requestAnimationFrame(animate);
            } else {
                this.enemyArea.removeChild(damageText);
            }
        };
        
        animate();
        
        // Add screen shake effect
        this.addScreenShake();
        
        // Add hit effect on enemy
        this.addHitEffect(enemy);
    }

    addScreenShake() {
        const originalX = this.container.x;
        const originalY = this.container.y;
        const shakeIntensity = 5;
        const shakeDuration = 200;
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / shakeDuration;
            
            if (progress < 1) {
                const intensity = shakeIntensity * (1 - progress);
                this.container.x = originalX + (Math.random() - 0.5) * intensity;
                this.container.y = originalY + (Math.random() - 0.5) * intensity;
                requestAnimationFrame(shake);
            } else {
                this.container.x = originalX;
                this.container.y = originalY;
            }
        };
        
        shake();
    }

    addHitEffect(enemy) {
        // Create hit flash effect
        const flash = new PIXI.Graphics();
        flash.beginFill(0xffffff, 0.8);
        flash.drawCircle(enemy.x, enemy.y, 50);
        flash.endFill();
        
        this.enemyArea.addChild(flash);
        
        // Animate flash
        const startTime = Date.now();
        const duration = 200;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                flash.alpha = 0.8 * (1 - progress);
                flash.scale.set(1 + progress);
                requestAnimationFrame(animate);
            } else {
                this.enemyArea.removeChild(flash);
            }
        };
        
        animate();
        
        // Add particle explosion
        this.createParticleExplosion(enemy.x, enemy.y);
    }

    createParticleExplosion(x, y) {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new PIXI.Graphics();
            particle.beginFill(0xffff00);
            particle.drawCircle(0, 0, 2);
            particle.endFill();
            
            particle.x = x;
            particle.y = y;
            
            this.enemyArea.addChild(particle);
            
            const particleData = {
                graphics: particle,
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30 + Math.random() * 20,
                maxLife: 30 + Math.random() * 20
            };
            
            this.particles.push(particleData);
        }
    }

    createCardsInHand() {
        console.log('Creating cards in hand...');
        console.log(`GameState hand: ${this.gameState.hand.length} cards`);
        
        // Clear existing cards
        this.cards.forEach(card => {
            if (card.container && card.container.parent) {
                card.container.parent.removeChild(card.container);
            }
        });
        this.cards = [];

        // Create new cards with entrance animation
        this.gameState.hand.forEach((cardData, index) => {
            const card = new Card(cardData);
            card.x = (index - this.gameState.hand.length / 2) * 130;
            card.y = 100; // Start below final position
            
            // Make card interactive
            card.container.eventMode = 'static';
            card.container.cursor = 'pointer';
            
            card.container.on('pointerdown', () => {
                this.selectCard(card, index);
            });
            
            card.container.on('pointerover', () => {
                if (!this.selectedCard || this.selectedCard.card !== card) {
                    card.container.scale.set(1.05);
                }
            });
            
            card.container.on('pointerout', () => {
                if (!this.selectedCard || this.selectedCard.card !== card) {
                    card.container.scale.set(1.0);
                }
            });

            this.cards.push(card);
            this.handArea.addChild(card.container);
            
            // Animate card entrance
            this.animateCardEntrance(card, index);
        });
        
        console.log(`Created ${this.cards.length} visual cards`);
    }

    animateCardEntrance(card, index) {
        const targetY = 0;
        const startTime = Date.now();
        const duration = 300;
        const delay = index * 100; // Stagger animation
        
        setTimeout(() => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    // Bounce effect
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    card.y = 100 + (targetY - 100) * easeProgress;
                    requestAnimationFrame(animate);
                } else {
                    card.y = targetY;
                }
            };
            
            animate();
        }, delay);
    }
} 