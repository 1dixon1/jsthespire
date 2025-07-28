# JS The Spire

A Slay the Spire-like roguelike card game built with Pixi.js and modern JavaScript.

## 🎮 Game Overview

JS The Spire is a turn-based card game where you navigate through a procedurally generated map, fight enemies, collect cards, and build your deck. The goal is to reach the end of the map while surviving increasingly difficult encounters.

## ✨ Features

### Core Gameplay
- **Turn-based Combat**: Strategic card-based battles with energy management
- **Deck Building**: Collect and upgrade cards to create powerful combinations
- **Roguelike Progression**: Navigate through a branching map with different node types
- **Procedural Generation**: Each run offers a unique experience

### Card System
- **Multiple Card Types**: Attack, Skill, and Power cards
- **Rarity System**: Common, Rare, and Legendary cards
- **Card Effects**: Damage, Block, Strength, Draw, Area of Effect, and more
- **Upgrade System**: Improve cards to make them more powerful

### Map System
- **Node Types**: Combat, Elite, Shop, Rest, and Boss encounters
- **Strategic Pathing**: Choose your route through the map
- **Progressive Difficulty**: Enemies get stronger as you advance

### Visual Effects
- **Smooth Animations**: Card movements, damage effects, and particle systems
- **Interactive UI**: Hover effects, targeting arrows, and visual feedback
- **Modern Design**: Clean, intuitive interface with smooth transitions

## 🚀 Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Setup
1. Clone the repository:
```bash
git clone https://github.com/yourusername/jsthespire.git
cd jsthespire
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🎯 How to Play

### Starting the Game
1. Click "New Game" on the main menu
2. You'll start with a basic deck of Strike and Defend cards
3. Navigate the map by clicking on connected nodes

### Combat
- **Energy**: Each turn you have 3 energy to play cards
- **Cards**: Click on cards in your hand to play them
- **Targeting**: Attack cards require you to select an enemy target
- **Block**: Defend cards give you block, which reduces incoming damage
- **End Turn**: Click "End Turn" when you're done playing cards

### Map Navigation
- **Combat Nodes**: Fight enemies to progress
- **Elite Nodes**: Stronger enemies with better rewards
- **Shop Nodes**: Spend gold to buy cards, potions, or remove cards
- **Rest Nodes**: Heal or upgrade a card
- **Boss Nodes**: Final challenge of each act

### Card Collection
- After winning combat, you'll be offered card rewards
- Choose one card to add to your deck or skip
- Build synergies between cards for powerful combinations

## 🛠️ Development

### Project Structure
```
jsthespire/
├── src/
│   ├── main.js              # Application entry point
│   ├── Game.js              # Main game controller
│   ├── GameState.js         # Game state management
│   ├── data/
│   │   └── Cards.js         # Card database and utilities
│   ├── entities/
│   │   ├── Card.js          # Card entity class
│   │   ├── Enemy.js         # Enemy entity class
│   │   └── EnemyFactory.js  # Enemy creation factory
│   ├── scenes/
│   │   ├── MainMenuScene.js # Main menu scene
│   │   ├── CombatScene.js   # Combat scene
│   │   ├── MapScene.js      # Map navigation scene
│   │   └── RewardScene.js   # Card reward scene
│   └── utils/
│       └── LoadingManager.js # Asset loading and texture generation
├── index.html               # Main HTML file
├── package.json             # Project dependencies
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

### Technologies Used
- **Pixi.js**: 2D WebGL rendering engine
- **Vite**: Modern build tool and development server
- **GSAP**: Animation library for smooth transitions
- **ES6 Modules**: Modern JavaScript module system

### Building for Production
```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎨 Customization

### Adding New Cards
1. Open `src/data/Cards.js`
2. Add a new card object to the `CARDS` object
3. Include required properties: `id`, `name`, `type`, `cost`, `rarity`, `description`
4. Add optional properties: `damage`, `block`, `strength`, `draw`, `aoe`, `exhaust`
5. Add upgrade data if the card can be upgraded

### Adding New Enemies
1. Open `src/entities/EnemyFactory.js`
2. Add a new enemy type to the factory
3. Define enemy stats and behavior
4. Add visual representation in the `createVisual` method

### Modifying Game Balance
- Adjust card costs and effects in `src/data/Cards.js`
- Modify enemy stats in `src/entities/EnemyFactory.js`
- Change player starting stats in `src/GameState.js`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Slay the Spire by MegaCrit
- Built with Pixi.js for smooth 2D graphics
- Uses modern web technologies for cross-platform compatibility

## 🐛 Known Issues

- Map scrolling may be sensitive on some devices
- Some card effects may need balance adjustments
- Performance may vary on older devices

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/jsthespire/issues) page
2. Create a new issue with detailed information
3. Include browser version and device information

---

**Enjoy playing JS The Spire!** 🎮✨ 