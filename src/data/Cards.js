// Card database for the game
export const CARDS = {
    // ATTACKS
    strike: {
        id: 'strike',
        name: 'Strike',
        type: 'attack',
        rarity: 'common',
        cost: 1,
        damage: 6,
        description: 'Deal 6 damage',
        upgrade: {
            damage: 9,
            description: 'Deal 9 damage'
        }
    },
    
    heavyStrike: {
        id: 'heavyStrike',
        name: 'Heavy Strike',
        type: 'attack',
        rarity: 'common',
        cost: 2,
        damage: 12,
        description: 'Deal 12 damage',
        upgrade: {
            damage: 16,
            description: 'Deal 16 damage'
        }
    },
    
    quickStrike: {
        id: 'quickStrike',
        name: 'Quick Strike',
        type: 'attack',
        rarity: 'common',
        cost: 0,
        damage: 3,
        description: 'Deal 3 damage',
        upgrade: {
            damage: 4,
            description: 'Deal 4 damage'
        }
    },
    
    cleave: {
        id: 'cleave',
        name: 'Cleave',
        type: 'attack',
        rarity: 'common',
        cost: 1,
        damage: 8,
        aoe: true,
        description: 'Deal 8 damage to all enemies',
        upgrade: {
            damage: 11,
            description: 'Deal 11 damage to all enemies'
        }
    },
    
    // DEFENSE
    defend: {
        id: 'defend',
        name: 'Defend',
        type: 'skill',
        rarity: 'common',
        cost: 1,
        block: 5,
        description: 'Gain 5 block',
        upgrade: {
            block: 8,
            description: 'Gain 8 block'
        }
    },
    
    ironWave: {
        id: 'ironWave',
        name: 'Iron Wave',
        type: 'attack',
        rarity: 'common',
        cost: 1,
        damage: 5,
        block: 5,
        description: 'Deal 5 damage. Gain 5 block',
        upgrade: {
            damage: 7,
            block: 7,
            description: 'Deal 7 damage. Gain 7 block'
        }
    },
    
    shrugItOff: {
        id: 'shrugItOff',
        name: 'Shrug It Off',
        type: 'skill',
        rarity: 'common',
        cost: 1,
        block: 8,
        draw: 1,
        description: 'Gain 8 block. Draw 1 card',
        upgrade: {
            block: 11,
            description: 'Gain 11 block. Draw 1 card'
        }
    },
    
    // STRENGTH CARDS
    anger: {
        id: 'anger',
        name: 'Anger',
        type: 'attack',
        rarity: 'common',
        cost: 0,
        damage: 6,
        exhaust: true,
        description: 'Deal 6 damage. Exhaust this card',
        upgrade: {
            damage: 8,
            description: 'Deal 8 damage. Exhaust this card'
        }
    },
    
    flex: {
        id: 'flex',
        name: 'Flex',
        type: 'skill',
        rarity: 'common',
        cost: 1,
        strength: 2,
        description: 'Gain 2 strength until end of turn',
        upgrade: {
            strength: 3,
            description: 'Gain 3 strength until end of turn'
        }
    },
    
    // RARE CARDS
    whirlwind: {
        id: 'whirlwind',
        name: 'Whirlwind',
        type: 'attack',
        rarity: 'rare',
        cost: 'X',
        damage: 5,
        aoe: true,
        description: 'Deal 5 damage to all enemies X times',
        upgrade: {
            damage: 7,
            description: 'Deal 7 damage to all enemies X times'
        }
    },
    
    impervious: {
        id: 'impervious',
        name: 'Impervious',
        type: 'skill',
        rarity: 'rare',
        cost: 2,
        block: 30,
        exhaust: true,
        description: 'Gain 30 block. Exhaust this card',
        upgrade: {
            block: 40,
            description: 'Gain 40 block. Exhaust this card'
        }
    },
    
    limitBreak: {
        id: 'limitBreak',
        name: 'Limit Break',
        type: 'skill',
        rarity: 'rare',
        cost: 1,
        strength: 2,
        description: 'Double your strength',
        upgrade: {
            cost: 0,
            description: 'Double your strength'
        }
    },
    
    // ELITE CARDS
    demonForm: {
        id: 'demonForm',
        name: 'Demon Form',
        type: 'power',
        rarity: 'rare',
        cost: 3,
        strength: 2,
        description: 'At the start of your turn, gain 2 strength',
        upgrade: {
            cost: 2,
            description: 'At the start of your turn, gain 2 strength'
        }
    },
    
    barricade: {
        id: 'barricade',
        name: 'Barricade',
        type: 'power',
        rarity: 'rare',
        cost: 3,
        description: 'Block does not expire at end of turn',
        upgrade: {
            cost: 2,
            description: 'Block does not expire at end of turn'
        }
    }
};

// Cards by type
export const CARD_TYPES = {
    attack: ['strike', 'heavyStrike', 'quickStrike', 'cleave', 'ironWave', 'anger', 'whirlwind'],
    skill: ['defend', 'shrugItOff', 'flex', 'impervious', 'limitBreak'],
    power: ['demonForm', 'barricade']
};

// Cards by rarity
export const CARD_RARITY = {
    common: ['strike', 'heavyStrike', 'quickStrike', 'cleave', 'defend', 'ironWave', 'shrugItOff', 'anger', 'flex'],
    rare: ['whirlwind', 'impervious', 'limitBreak', 'demonForm', 'barricade']
};

// Starting deck
export const STARTER_DECK = [
    'strike', 'strike', 'strike', 'strike', 'strike',
    'defend', 'defend', 'defend', 'defend', 'defend'
];

// Function to get card by ID
export function getCard(cardId) {
    return CARDS[cardId] || null;
}

// Function to get random card of specific rarity
export function getRandomCardByRarity(rarity) {
    const cards = CARD_RARITY[rarity] || [];
    if (cards.length === 0) return null;
    
    const randomId = cards[Math.floor(Math.random() * cards.length)];
    return getCard(randomId);
}

// Function to get random card
export function getRandomCard() {
    const allCards = Object.keys(CARDS);
    const randomId = allCards[Math.floor(Math.random() * allCards.length)];
    return getCard(randomId);
}

// Function to get reward cards (usually 3 cards of different rarities)
export function getRewardCards() {
    const rewards = [];
    
    // 70% chance for common card
    if (Math.random() < 0.7) {
        rewards.push(getRandomCardByRarity('common'));
    }
    
    // 25% chance for rare card
    if (Math.random() < 0.25) {
        rewards.push(getRandomCardByRarity('rare'));
    }
    
    // 5% chance for very rare card (not implemented yet)
    
    // If no cards received, give a common one
    if (rewards.length === 0) {
        rewards.push(getRandomCardByRarity('common'));
    }
    
    return rewards.filter(card => card !== null);
}

// Function to check if card is upgraded
export function isUpgraded(card) {
    return card.upgraded || false;
}

// Function to upgrade card
export function upgradeCard(card) {
    if (!card || isUpgraded(card)) return card;
    
    const upgradedCard = { ...card, upgraded: true };
    
    // Apply upgrades
    if (card.upgrade) {
        Object.keys(card.upgrade).forEach(key => {
            upgradedCard[key] = card.upgrade[key];
        });
    }
    
    return upgradedCard;
} 