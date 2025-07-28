import { Enemy } from './Enemy.js';

export class EnemyFactory {
    constructor() {
        this.enemyTypes = {
            goblin: {
                health: 25,
                damage: 8,
                intent: { type: 'attack', damage: 8 }
            },
            slime: {
                health: 35,
                damage: 6,
                intent: { type: 'attack', damage: 6 }
            },
            skeleton: {
                health: 40,
                damage: 10,
                intent: { type: 'attack', damage: 10 }
            },
            elite_goblin: {
                health: 50,
                damage: 12,
                intent: { type: 'attack', damage: 12 }
            },
            elite_slime: {
                health: 60,
                damage: 8,
                intent: { type: 'attack', damage: 8 }
            },
            boss_dragon: {
                health: 100,
                damage: 15,
                intent: { type: 'attack', damage: 15 }
            }
        };
    }

    createEnemy(type) {
        const enemyData = this.enemyTypes[type];
        if (!enemyData) {
            console.warn(`Unknown enemy type: ${type}`);
            return this.createEnemy('goblin'); // Fallback to goblin
        }

        const enemy = new Enemy(type, enemyData.health, enemyData.damage);
        enemy.setIntent(enemyData.intent);
        
        return enemy;
    }

    createRandomEnemy(floor = 1) {
        const availableTypes = Object.keys(this.enemyTypes).filter(type => {
            if (type.startsWith('elite_') && floor < 3) return false;
            if (type.startsWith('boss_') && floor < 5) return false;
            return true;
        });

        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        return this.createEnemy(randomType);
    }

    createEliteEnemy() {
        const eliteTypes = Object.keys(this.enemyTypes).filter(type => type.startsWith('elite_'));
        const randomType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
        return this.createEnemy(randomType);
    }

    createBossEnemy() {
        const bossTypes = Object.keys(this.enemyTypes).filter(type => type.startsWith('boss_'));
        const randomType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        return this.createEnemy(randomType);
    }

    getEnemyStats(type) {
        return this.enemyTypes[type] || null;
    }

    getAllEnemyTypes() {
        return Object.keys(this.enemyTypes);
    }
} 