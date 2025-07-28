import { Enemy } from './Enemy.js';

export class EnemyFactory {
    constructor() {
        this.enemyTypes = {
            // Weak enemies for early floors
            rat: {
                health: 12,
                damage: 4,
                intent: { type: 'attack', damage: 4 },
                minFloor: 1,
                maxFloor: 3
            },
            spider: {
                health: 15,
                damage: 5,
                intent: { type: 'attack', damage: 5 },
                minFloor: 1,
                maxFloor: 4
            },
            bat: {
                health: 18,
                damage: 6,
                intent: { type: 'attack', damage: 6 },
                minFloor: 1,
                maxFloor: 5
            },
            
            // Medium enemies
            goblin: {
                health: 25,
                damage: 8,
                intent: { type: 'attack', damage: 8 },
                minFloor: 2,
                maxFloor: 6
            },
            slime: {
                health: 35,
                damage: 6,
                intent: { type: 'attack', damage: 6 },
                minFloor: 2,
                maxFloor: 6
            },
            skeleton: {
                health: 40,
                damage: 10,
                intent: { type: 'attack', damage: 10 },
                minFloor: 3,
                maxFloor: 7
            },
            
            // Elite enemies
            elite_goblin: {
                health: 50,
                damage: 12,
                intent: { type: 'attack', damage: 12 },
                minFloor: 3,
                maxFloor: 8
            },
            elite_slime: {
                health: 60,
                damage: 8,
                intent: { type: 'attack', damage: 8 },
                minFloor: 4,
                maxFloor: 8
            },
            
            // Boss enemies
            boss_dragon: {
                health: 100,
                damage: 15,
                intent: { type: 'attack', damage: 15 },
                minFloor: 5,
                maxFloor: 9
            }
        };
    }

    createEnemy(type, floor = 1) {
        const enemyData = this.enemyTypes[type];
        if (!enemyData) {
            console.warn(`Unknown enemy type: ${type}`);
            return this.createEnemy('rat', floor); // Fallback to rat
        }

        // Scale enemy stats based on floor
        const healthMultiplier = 1 + (floor - 1) * 0.1; // 10% increase per floor
        const damageMultiplier = 1 + (floor - 1) * 0.05; // 5% increase per floor
        
        const scaledHealth = Math.floor(enemyData.health * healthMultiplier);
        const scaledDamage = Math.floor(enemyData.damage * damageMultiplier);
        
        const enemy = new Enemy(type, scaledHealth, scaledDamage);
        enemy.setIntent({ 
            type: enemyData.intent.type, 
            damage: scaledDamage 
        });
        
        return enemy;
    }

    createRandomEnemy(floor = 1) {
        // Filter enemies by floor requirements
        const availableTypes = Object.keys(this.enemyTypes).filter(type => {
            const enemyData = this.enemyTypes[type];
            return floor >= enemyData.minFloor && floor <= enemyData.maxFloor;
        });

        if (availableTypes.length === 0) {
            console.warn(`No enemies available for floor ${floor}, using rat`);
            return this.createEnemy('rat', floor);
        }

        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        return this.createEnemy(randomType, floor);
    }

    createEliteEnemy(floor = 1) {
        const eliteTypes = Object.keys(this.enemyTypes).filter(type => type.startsWith('elite_'));
        if (eliteTypes.length === 0) {
            console.warn('No elite enemies available, using regular enemy');
            return this.createRandomEnemy(floor);
        }
        const randomType = eliteTypes[Math.floor(Math.random() * eliteTypes.length)];
        return this.createEnemy(randomType, floor);
    }

    createBossEnemy(floor = 1) {
        const bossTypes = Object.keys(this.enemyTypes).filter(type => type.startsWith('boss_'));
        if (bossTypes.length === 0) {
            console.warn('No boss enemies available, using elite enemy');
            return this.createEliteEnemy(floor);
        }
        const randomType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
        return this.createEnemy(randomType, floor);
    }

    getEnemyStats(type) {
        return this.enemyTypes[type] || null;
    }

    getAllEnemyTypes() {
        return Object.keys(this.enemyTypes);
    }
} 