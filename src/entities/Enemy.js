import * as PIXI from 'pixi.js';

export class Enemy {
    constructor(type, health, damage) {
        this.type = type;
        this.maxHealth = health;
        this.currentHealth = health;
        this.damage = damage;
        this.container = new PIXI.Container();
        this.intent = null;
        this.createVisual();
    }

    createVisual() {
        // Enemy sprite
        const sprite = new PIXI.Graphics();
        let color;
        switch (this.type) {
            case 'goblin':
                color = 0x00b894;
                break;
            case 'slime':
                color = 0x6c5ce7;
                break;
            case 'skeleton':
                color = 0xb2bec3;
                break;
            default:
                color = 0xe17055;
        }

        sprite.beginFill(color);
        sprite.lineStyle(3, 0xffffff);
        sprite.drawCircle(0, 0, 35);
        sprite.endFill();
        this.container.addChild(sprite);

        // Enemy eyes
        const leftEye = new PIXI.Graphics();
        leftEye.beginFill(0xffffff);
        leftEye.drawCircle(-15, -10, 5);
        leftEye.endFill();
        this.container.addChild(leftEye);

        const rightEye = new PIXI.Graphics();
        rightEye.beginFill(0xffffff);
        rightEye.drawCircle(15, -10, 5);
        rightEye.endFill();
        this.container.addChild(rightEye);

        // Health bar background
        const healthBarBg = new PIXI.Graphics();
        healthBarBg.beginFill(0x2d3436);
        healthBarBg.lineStyle(1, 0xffffff);
        healthBarBg.drawRoundedRect(-30, -60, 60, 8, 2);
        healthBarBg.endFill();
        this.container.addChild(healthBarBg);

        // Health bar fill
        this.healthBarFill = new PIXI.Graphics();
        this.healthBarFill.beginFill(0xff6b6b);
        this.healthBarFill.drawRoundedRect(-29, -59, 58, 6, 1);
        this.healthBarFill.endFill();
        this.container.addChild(this.healthBarFill);

        // Health text
        this.healthText = new PIXI.Text('', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 1
        });
        this.healthText.anchor.set(0.5);
        this.healthText.y = -65;
        this.container.addChild(this.healthText);

        // Intent indicator
        this.intentContainer = new PIXI.Container();
        this.intentContainer.y = 50;
        this.container.addChild(this.intentContainer);

        this.updateDisplay();
    }

    takeDamage(amount) {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
        this.updateDisplay();
        
        // Enhanced visual feedback
        this.container.tint = 0xff0000;
        
        // Add shake effect
        const originalX = this.container.x;
        const originalY = this.container.y;
        const shakeIntensity = 3;
        const shakeDuration = 300;
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
                
                // Check if enemy died
                if (!this.isAlive()) {
                    this.die();
                } else {
                    this.container.tint = 0xffffff;
                }
            }
        };
        
        shake();
    }

    die() {
        console.log(`Enemy ${this.type} died!`);
        
        // Death animation
        this.playDeathAnimation();
        
        // Hide intent when dead
        this.intentContainer.visible = false;
        
        // Change visual state to dead
        this.container.tint = 0x666666;
        this.container.alpha = 0.7;
        
        // Disable interactions
        this.container.eventMode = 'none';
        this.container.cursor = 'default';
        
        // Create death particles
        this.createDeathParticles();
    }

    createDeathParticles() {
        // Create particle explosion effect
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = new PIXI.Graphics();
                particle.beginFill(0xff0000);
                particle.drawCircle(0, 0, 2);
                particle.endFill();
                
                particle.x = this.container.x;
                particle.y = this.container.y;
                
                // Add to parent container
                if (this.container.parent) {
                    this.container.parent.addChild(particle);
                }
                
                // Animate particle
                const startTime = Date.now();
                const duration = 1000;
                const angle = (i / 8) * Math.PI * 2;
                const speed = 3 + Math.random() * 2;
                
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = elapsed / duration;
                    
                    if (progress < 1) {
                        particle.x = this.container.x + Math.cos(angle) * speed * progress * 50;
                        particle.y = this.container.y + Math.sin(angle) * speed * progress * 50;
                        particle.alpha = 1 - progress;
                        requestAnimationFrame(animate);
                    } else {
                        if (particle.parent) {
                            particle.parent.removeChild(particle);
                        }
                    }
                };
                
                animate();
            }, i * 100);
        }
    }

    playDeathAnimation() {
        // Death animation sequence
        const startTime = Date.now();
        const duration = 1000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                // Fade out and scale down
                this.container.alpha = 0.7 * (1 - progress * 0.5);
                this.container.scale.set(1 - progress * 0.3);
                
                // Slight rotation for dramatic effect
                this.container.rotation = progress * Math.PI * 0.1;
                
                requestAnimationFrame(animate);
            } else {
                // Final death state
                this.container.alpha = 0.3;
                this.container.scale.set(0.7);
                this.container.rotation = Math.PI * 0.1;
            }
        };
        
        animate();
    }

    heal(amount) {
        this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
        this.updateDisplay();
    }

    isAlive() {
        return this.currentHealth > 0;
    }

    takeTurn(gameState) {
        if (!this.isAlive()) return;

        // Simple AI: attack player
        const damageDealt = gameState.takeDamage(this.damage);
        
        // Show attack animation
        this.showAttackAnimation();
        
        // Return damage info for visual effects
        return {
            damage: this.damage,
            actualDamage: damageDealt.actualDamage,
            blocked: damageDealt.blocked
        };
    }

    showAttackAnimation() {
        // Move forward slightly
        const originalX = this.container.x;
        this.container.x += 20;
        
        setTimeout(() => {
            this.container.x = originalX;
        }, 200);
    }

    setIntent(intent) {
        this.intent = intent;
        this.updateIntentDisplay();
    }

    updateIntentDisplay() {
        // Clear previous intent
        this.intentContainer.removeChildren();

        if (!this.intent) return;

        const intentBg = new PIXI.Graphics();
        intentBg.beginFill(0x000000, 0.8);
        intentBg.lineStyle(1, 0xffffff);
        intentBg.drawRoundedRect(-25, -15, 50, 30, 5);
        intentBg.endFill();
        this.intentContainer.addChild(intentBg);

        let intentText = '';
        let color = 0xffffff;

        if (this.intent.type === 'attack') {
            intentText = `⚔ ${this.intent.damage}`;
            color = 0xff6b6b;
        } else if (this.intent.type === 'block') {
            intentText = `🛡 ${this.intent.block}`;
            color = 0x4ecdc4;
        } else if (this.intent.type === 'buff') {
            intentText = `⬆ ${this.intent.buff}`;
            color = 0xfdcb6e;
        }

        const text = new PIXI.Text(intentText, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: color,
            stroke: 0x000000,
            strokeThickness: 1
        });
        text.anchor.set(0.5);
        this.intentContainer.addChild(text);
    }

    updateDisplay() {
        // Update health bar
        const healthPercent = this.currentHealth / this.maxHealth;
        this.healthBarFill.width = 58 * healthPercent;
        
        // Change color based on health
        if (healthPercent > 0.6) {
            this.healthBarFill.tint = 0x00ff00;
        } else if (healthPercent > 0.3) {
            this.healthBarFill.tint = 0xffff00;
        } else {
            this.healthBarFill.tint = 0xff0000;
        }

        // Update health text
        this.healthText.text = `${this.currentHealth}/${this.maxHealth}`;

        // Handle dead enemy visual state
        if (!this.isAlive()) {
            // Gray out health bar for dead enemies
            this.healthBarFill.tint = 0x666666;
            this.healthText.text = 'DEAD';
            
            // Hide intent
            this.intentContainer.visible = false;
            
            // Ensure dead visual state
            if (this.container.alpha > 0.3) {
                this.container.tint = 0x666666;
                this.container.alpha = 0.3;
                this.container.scale.set(0.7);
                this.container.rotation = Math.PI * 0.1;
            }
        } else {
            // Show intent for alive enemies
            this.intentContainer.visible = true;
            this.updateIntentDisplay();
        }
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