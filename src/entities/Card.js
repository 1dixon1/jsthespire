import * as PIXI from 'pixi.js';

export class Card {
    constructor(data) {
        this.data = data;
        this.container = new PIXI.Container();
        this.createVisual();
    }

    createVisual() {
        // Card background
        const bg = new PIXI.Graphics();
        let color;
        switch (this.data.type) {
            case 'attack':
                color = 0xff6b6b;
                break;
            case 'skill':
                color = 0x4ecdc4;
                break;
            case 'power':
                color = 0xfdcb6e;
                break;
            default:
                color = 0x6c5ce7;
        }

        bg.beginFill(color);
        bg.lineStyle(2, 0xffffff);
        bg.drawRoundedRect(-60, -80, 120, 160, 10);
        bg.endFill();
        this.container.addChild(bg);

        // Card name
        const nameText = new PIXI.Text(this.data.name, {
            fontFamily: 'Arial',
            fontSize: 14,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 2,
            wordWrap: true,
            wordWrapWidth: 100
        });
        nameText.anchor.set(0.5);
        nameText.y = -50;
        this.container.addChild(nameText);

        // Card cost
        const costText = new PIXI.Text(this.data.cost.toString(), {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xfdcb6e,
            stroke: 0x000000,
            strokeThickness: 2
        });
        costText.anchor.set(0.5);
        costText.x = -40;
        costText.y = -60;
        this.container.addChild(costText);

        // Card type
        const typeText = new PIXI.Text(this.data.type.toUpperCase(), {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        typeText.anchor.set(0.5);
        typeText.y = -30;
        this.container.addChild(typeText);

        // Card description
        let description = this.data.description || '';
        
        // If no description provided, generate one from card data
        if (!description) {
            if (this.data.damage) {
                description += `Deal ${this.data.damage} damage`;
            }
            if (this.data.block) {
                if (description) description += '\n';
                description += `Gain ${this.data.block} block`;
            }
            if (this.data.strength) {
                if (description) description += '\n';
                if (this.data.strength > 0) {
                    description += `Gain ${this.data.strength} strength`;
                } else {
                    description += `Enemy loses ${Math.abs(this.data.strength)} strength`;
                }
            }
            if (this.data.draw) {
                if (description) description += '\n';
                description += `Draw ${this.data.draw} cards`;
            }
            if (this.data.energy) {
                if (description) description += '\n';
                description += `Gain ${this.data.energy} energy`;
            }
            if (this.data.weak) {
                if (description) description += '\n';
                description += `Apply ${this.data.weak} Weak`;
            }
            if (this.data.vulnerable) {
                if (description) description += '\n';
                description += `Apply ${this.data.vulnerable} Vulnerable`;
            }
            if (this.data.thorns) {
                if (description) description += '\n';
                description += `Deal ${this.data.thorns} damage back`;
            }
            if (this.data.aoe) {
                if (description) description += '\n';
                description += 'To all enemies';
            }
            if (this.data.exhaust) {
                if (description) description += '\n';
                description += 'Exhaust';
            }
        }

        if (description) {
            const descText = new PIXI.Text(description, {
                fontFamily: 'Arial',
                fontSize: 10,
                fill: 0xffffff,
                stroke: 0x000000,
                strokeThickness: 1,
                wordWrap: true,
                wordWrapWidth: 100,
                align: 'center'
            });
            descText.anchor.set(0.5);
            descText.y = 20;
            this.container.addChild(descText);
        }

        // Card rarity indicator
        if (this.data.rarity) {
            const rarityColor = this.getRarityColor(this.data.rarity);
            const rarityIndicator = new PIXI.Graphics();
            rarityIndicator.beginFill(rarityColor);
            rarityIndicator.drawCircle(40, -60, 8);
            rarityIndicator.endFill();
            this.container.addChild(rarityIndicator);
        }
    }

    getRarityColor(rarity) {
        switch (rarity) {
            case 'common':
                return 0xcccccc;
            case 'uncommon':
                return 0x00ff00;
            case 'rare':
                return 0x0088ff;
            case 'legendary':
                return 0xff8800;
            default:
                return 0xffffff;
        }
    }

    updateDisplay() {
        // Update card visual based on current state
        // For example, gray out if not enough energy
    }

    set x(value) {
        this.container.x = value;
    }

    set y(value) {
        this.container.y = value;
    }

    get x() {
        return this.container.x;
    }

    get y() {
        return this.container.y;
    }
} 