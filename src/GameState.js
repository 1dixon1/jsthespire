import { STARTER_DECK, getCard } from './data/Cards.js';

export class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.player = {
            maxHealth: 70,
            currentHealth: 70,
            maxEnergy: 3,
            currentEnergy: 3,
            gold: 99,
            floor: 1
        };

        // Create starting deck from card database
        this.deck = STARTER_DECK.map(cardId => {
            const cardData = getCard(cardId);
            return {
                id: cardData.id,
                name: cardData.name,
                type: cardData.type,
                cost: cardData.cost,
                damage: cardData.damage,
                block: cardData.block,
                rarity: cardData.rarity,
                description: cardData.description,
                aoe: cardData.aoe,
                exhaust: cardData.exhaust,
                strength: cardData.strength,
                draw: cardData.draw,
                weak: cardData.weak,
                vulnerable: cardData.vulnerable,
                thorns: cardData.thorns,
                energy: cardData.energy
            };
        });

        this.hand = [];
        this.discardPile = [];
        this.drawPile = [...this.deck];

        this.currentEnemies = [];
        this.isInCombat = false;
        this.currentTurn = 0;
        this.block = 0;
        this.currentNodeType = null;
        this.gameOver = false;

        this.relics = [];
        this.potions = [];
    }

    startCombat(enemies) {
        this.currentEnemies = enemies;
        this.isInCombat = true;
        this.currentTurn = 0;
        this.block = 0;
        this.shuffleDeck();
        this.drawCards(5);
    }

    endCombat() {
        this.isInCombat = false;
        this.hand = [];
        this.discardPile = [];
        this.drawPile = [...this.deck];
        this.currentEnemies = [];
        this.block = 0;
        
        // Update player progress
        this.updatePlayerProgress();
    }
    
    updatePlayerProgress() {
        // Update floor based on current node
        // This will be called from MapScene when needed
        console.log('Updating player progress');
    }

    shuffleDeck() {
        this.drawPile = [...this.deck];
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }

    drawCards(count) {
        for (let i = 0; i < count; i++) {
            if (this.drawPile.length === 0) {
                this.reshuffleDiscard();
            }
            if (this.drawPile.length > 0) {
                this.hand.push(this.drawPile.pop());
            }
        }
    }

    reshuffleDiscard() {
        this.drawPile = [...this.discardPile];
        this.discardPile = [];
        for (let i = this.drawPile.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.drawPile[i], this.drawPile[j]] = [this.drawPile[j], this.drawPile[i]];
        }
    }

    playCard(cardIndex, targetIndex = 0) {
        console.log(`GameState.playCard: cardIndex=${cardIndex}, targetIndex=${targetIndex}`);
        console.log(`Hand length: ${this.hand.length}, Energy: ${this.player.currentEnergy}`);
        
        if (cardIndex < 0 || cardIndex >= this.hand.length) {
            console.log('Invalid card index');
            return false;
        }
        
        const card = this.hand[cardIndex];
        console.log(`Card: ${card.name}, Cost: ${card.cost}, Type: ${card.type}`);
        
        if (this.player.currentEnergy < card.cost) {
            console.log('Not enough energy');
            return false;
        }

        // Check if target is valid for attack cards
        if (card.type === 'attack') {
            if (targetIndex < 0 || targetIndex >= this.currentEnemies.length) {
                console.log('Invalid target index');
                return false;
            }
            if (!this.currentEnemies[targetIndex] || !this.currentEnemies[targetIndex].isAlive()) {
                console.log('Target enemy is dead or invalid');
                return false;
            }
        } else if (card.type === 'skill') {
            // Skill cards don't need enemy targeting
            console.log('Skill card - no enemy targeting needed');
        }

        this.player.currentEnergy -= card.cost;
        console.log(`Energy after playing card: ${this.player.currentEnergy}`);
        
        // Apply card effects
        if (card.type === 'attack' && this.currentEnemies[targetIndex] && this.currentEnemies[targetIndex].isAlive()) {
            console.log(`Dealing ${card.damage} damage to enemy ${targetIndex}`);
            this.currentEnemies[targetIndex].takeDamage(card.damage);
        } else if (card.type === 'skill' && card.block) {
            console.log(`Adding ${card.block} block`);
            this.block += card.block;
        }

        // Move card to discard pile
        this.discardPile.push(card);
        this.hand.splice(cardIndex, 1);
        console.log(`Card moved to discard pile. Hand size: ${this.hand.length}`);

        return true;
    }

    endTurn() {
        // Discard remaining cards
        this.discardPile.push(...this.hand);
        this.hand = [];

        // Enemy turn
        this.processEnemyTurns();

        // Start new turn
        this.currentTurn++;
        this.player.currentEnergy = this.player.maxEnergy;
        this.block = 0;
        this.drawCards(5);
    }

    processEnemyTurns() {
        this.currentEnemies.forEach(enemy => {
            if (enemy.isAlive()) {
                enemy.takeTurn(this);
            }
        });
    }

    takeDamage(amount) {
        let actualDamage = amount;
        let blocked = 0;
        
        // Apply block first
        if (this.block > 0) {
            if (this.block >= amount) {
                blocked = amount;
                actualDamage = 0;
                this.block = 0;
            } else {
                blocked = this.block;
                actualDamage = amount - this.block;
                this.block = 0;
            }
        }
        
        // Apply remaining damage
        this.player.currentHealth = Math.max(0, this.player.currentHealth - actualDamage);
        
        console.log(`Player took ${actualDamage} damage. Health: ${this.player.currentHealth}/${this.player.maxHealth}`);
        
        if (this.player.currentHealth <= 0) {
            console.log('Player has died!');
            this.gameOver = true;
        }
        
        return {
            actualDamage: actualDamage,
            blocked: blocked
        };
    }

    heal(amount) {
        this.player.currentHealth = Math.min(this.player.maxHealth, this.player.currentHealth + amount);
    }

    addCard(cardId) {
        console.log(`GameState.addCard called with cardId: ${cardId}`);
        const cardData = getCard(cardId);
        console.log('Card data found:', cardData);
        
        if (cardData) {
            const card = {
                id: cardData.id,
                name: cardData.name,
                type: cardData.type,
                cost: cardData.cost,
                damage: cardData.damage,
                block: cardData.block,
                rarity: cardData.rarity,
                description: cardData.description,
                aoe: cardData.aoe,
                exhaust: cardData.exhaust,
                strength: cardData.strength,
                draw: cardData.draw,
                weak: cardData.weak,
                vulnerable: cardData.vulnerable,
                thorns: cardData.thorns,
                energy: cardData.energy
            };
            this.deck.push(card);
            console.log(`Card ${card.name} added to deck. Deck size: ${this.deck.length}`);
            return true;
        }
        console.log('Card data not found for ID:', cardId);
        return false;
    }

    removeCard(cardIndex) {
        if (cardIndex >= 0 && cardIndex < this.deck.length) {
            this.deck.splice(cardIndex, 1);
        }
    }

    isGameOver() {
        return this.gameOver || this.player.currentHealth <= 0;
    }

    isVictory() {
        return this.currentEnemies.every(enemy => !enemy.isAlive());
    }
} 