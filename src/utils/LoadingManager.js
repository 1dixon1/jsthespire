import * as PIXI from 'pixi.js';

export class LoadingManager {
    constructor() {
        this.onProgress = null;
        this.assets = new Map();
        this.loadedCount = 0;
        this.totalAssets = 0;
    }

    async loadAll() {
        const assetList = [
            // Card textures
            { key: 'card_bg', url: this.createCardTexture('background') },
            { key: 'card_attack', url: this.createCardTexture('attack') },
            { key: 'card_skill', url: this.createCardTexture('skill') },
            { key: 'card_power', url: this.createCardTexture('power') },
            
            // UI textures
            { key: 'button_bg', url: this.createButtonTexture() },
            { key: 'energy_orb', url: this.createEnergyOrbTexture() },
            { key: 'health_bar', url: this.createHealthBarTexture() },
            
            // Enemy textures
            { key: 'enemy_goblin', url: this.createEnemyTexture('goblin') },
            { key: 'enemy_slime', url: this.createEnemyTexture('slime') },
            { key: 'enemy_skeleton', url: this.createEnemyTexture('skeleton') },
            
            // Background textures
            { key: 'bg_combat', url: this.createBackgroundTexture('combat') },
            { key: 'bg_map', url: this.createBackgroundTexture('map') },
            { key: 'bg_menu', url: this.createBackgroundTexture('menu') }
        ];

        this.totalAssets = assetList.length;

        for (const asset of assetList) {
            try {
                const texture = await this.loadTexture(asset.url);
                this.assets.set(asset.key, texture);
                this.loadedCount++;
                
                if (this.onProgress) {
                    this.onProgress(this.loadedCount / this.totalAssets);
                }
            } catch (error) {
                console.error(`Failed to load asset ${asset.key}:`, error);
                // Continue loading other assets even if one fails
                this.loadedCount++;
                if (this.onProgress) {
                    this.onProgress(this.loadedCount / this.totalAssets);
                }
            }
        }
    }

    async loadTexture(url) {
        return new Promise((resolve, reject) => {
            const texture = PIXI.Texture.from(url);
            if (texture.baseTexture.valid) {
                resolve(texture);
            } else {
                texture.baseTexture.once('loaded', () => resolve(texture));
                texture.baseTexture.once('error', reject);
            }
        });
    }

    getTexture(key) {
        return this.assets.get(key) || this.createFallbackTexture();
    }

    createFallbackTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, 1280, 720);
        
        return canvas;
    }

    // Create procedural textures for the game
    createCardTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');

        // Card background
        const gradient = ctx.createLinearGradient(0, 0, 0, 160);
        switch (type) {
            case 'attack':
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#c44569');
                break;
            case 'skill':
                gradient.addColorStop(0, '#4ecdc4');
                gradient.addColorStop(1, '#44a08d');
                break;
            case 'power':
                gradient.addColorStop(0, '#fdcb6e');
                gradient.addColorStop(1, '#e17055');
                break;
            default:
                gradient.addColorStop(0, '#6c5ce7');
                gradient.addColorStop(1, '#a29bfe');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 120, 160);

        // Card border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 118, 158);

        // Card type indicator
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(type.toUpperCase(), 60, 20);

        return canvas;
    }

    createButtonTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createLinearGradient(0, 0, 0, 50);
        gradient.addColorStop(0, '#74b9ff');
        gradient.addColorStop(1, '#0984e3');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 200, 50);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 198, 48);

        return canvas;
    }

    createEnergyOrbTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(20, 20, 0, 20, 20, 20);
        gradient.addColorStop(0, '#fdcb6e');
        gradient.addColorStop(1, '#e17055');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(20, 20, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        return canvas;
    }

    createHealthBarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#2d3436';
        ctx.fillRect(0, 0, 200, 20);

        // Health bar
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, '#00b894');
        gradient.addColorStop(1, '#00cec9');
        ctx.fillStyle = gradient;
        ctx.fillRect(2, 2, 196, 16);

        return canvas;
    }

    createEnemyTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');

        let color;
        switch (type) {
            case 'goblin':
                color = '#00b894';
                break;
            case 'slime':
                color = '#6c5ce7';
                break;
            case 'skeleton':
                color = '#b2bec3';
                break;
            default:
                color = '#e17055';
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(40, 40, 35, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(30, 30, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(50, 30, 5, 0, Math.PI * 2);
        ctx.fill();

        return canvas;
    }

    createBackgroundTexture(type) {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');

        let gradient;
        switch (type) {
            case 'combat':
                gradient = ctx.createLinearGradient(0, 0, 0, 720);
                gradient.addColorStop(0, '#2d3436');
                gradient.addColorStop(1, '#636e72');
                break;
            case 'map':
                gradient = ctx.createLinearGradient(0, 0, 0, 720);
                gradient.addColorStop(0, '#1a1a2e');
                gradient.addColorStop(1, '#16213e');
                break;
            case 'menu':
                gradient = ctx.createLinearGradient(0, 0, 0, 720);
                gradient.addColorStop(0, '#0f3460');
                gradient.addColorStop(1, '#533483');
                break;
            default:
                gradient = ctx.createLinearGradient(0, 0, 0, 720);
                gradient.addColorStop(0, '#2d3436');
                gradient.addColorStop(1, '#636e72');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1280, 720);

        return canvas;
    }
} 