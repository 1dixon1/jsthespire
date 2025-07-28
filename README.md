# JS The Spire

A Slay the Spire-inspired card-based roguelike game built with Pixi.js and modern web technologies.

## 🎮 Game Features

### Core Gameplay
- **Turn-based Combat**: Strategic card-based battles with energy management
- **Deck Building**: Collect and upgrade cards throughout your journey
- **Roguelike Progression**: Multiple floors with increasing difficulty
- **Enemy Variety**: Different enemy types with unique behaviors and stats

### Game Mechanics
- **Energy System**: Manage your energy to play cards strategically
- **Health & Block**: Defend against enemy attacks with block mechanics
- **Card Types**: Attack, Skill, and Power cards with different effects
- **Enemy Intent**: See what enemies will do next turn

### Game Modes
- **Combat Encounters**: Fight various enemies to progress
- **Elite Battles**: Challenging encounters with stronger enemies
- **Shop Visits**: Spend gold on healing, potions, and card packs
- **Rest Sites**: Heal and recover between battles
- **Boss Fights**: Epic battles at the end of each floor

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 How to Play

### Controls
- **Mouse**: Click to interact with cards, enemies, and UI elements
- **Hover**: Hover over cards and enemies to see details

### Game Flow
1. **Main Menu**: Start a new game or continue an existing one
2. **Map Navigation**: Choose your path through different encounter types
3. **Combat**: Play cards strategically to defeat enemies
4. **Progression**: Collect rewards and upgrade your deck

### Card Types
- **Attack Cards**: Deal damage to enemies
- **Skill Cards**: Provide block and utility effects
- **Power Cards**: Provide ongoing effects

### Strategy Tips
- Manage your energy efficiently
- Use block to prevent damage
- Build synergies between cards
- Plan your route on the map carefully

## 🛠️ Technical Details

### Built With
- **Pixi.js**: 2D WebGL renderer for fast graphics
- **Vite**: Modern build tool and development server
- **ES6 Modules**: Modern JavaScript module system

### Project Structure
```
jsthespire/
├── src/
│   ├── main.js              # Application entry point
│   ├── Game.js              # Main game controller
│   ├── GameState.js         # Game state management
│   ├── scenes/              # Game scenes
│   │   ├── MainMenuScene.js
│   │   ├── CombatScene.js
│   │   └── MapScene.js
│   ├── entities/            # Game entities
│   │   ├── Card.js
│   │   ├── Enemy.js
│   │   └── EnemyFactory.js
│   └── utils/               # Utility classes
│       └── LoadingManager.js
├── index.html               # Main HTML file
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md               # This file
```

### Key Components

#### Game State Management
The `GameState` class manages all game data including:
- Player stats (health, energy, gold)
- Deck, hand, and discard pile
- Current enemies and combat state
- Game progression and floor number

#### Scene System
The game uses a scene-based architecture:
- **MainMenuScene**: Game start and options
- **CombatScene**: Turn-based card battles
- **MapScene**: Navigation between encounters

#### Entity System
- **Card**: Visual representation and data for individual cards
- **Enemy**: Enemy AI, stats, and visual representation
- **EnemyFactory**: Creates different enemy types with varying difficulty

## 🎨 Visual Design

The game features:
- **Procedural Graphics**: All textures are generated programmatically
- **Modern UI**: Clean, intuitive interface design
- **Color-coded Elements**: Different colors for different card types and enemy types
- **Smooth Animations**: Card interactions and combat feedback

## 🔧 Development

### Adding New Features

#### New Card Types
1. Add card data to `GameState.js`
2. Update card visual creation in `Card.js`
3. Implement card effects in `GameState.playCard()`

#### New Enemy Types
1. Add enemy data to `EnemyFactory.js`
2. Update enemy visual creation in `Enemy.js`
3. Implement enemy AI behavior in `Enemy.takeTurn()`

#### New Scenes
1. Create new scene class extending the scene pattern
2. Add scene to `Game.js` scenes object
3. Implement scene transitions

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Keep functions focused and modular

## 🐛 Known Issues

- Some visual glitches on high DPI displays
- Performance may vary on older devices
- Mobile support is limited (desktop recommended)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Slay the Spire by MegaCrit
- Built with Pixi.js graphics library
- Uses modern web development practices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
- Check the known issues section
- Review the code comments
- Open an issue on GitHub

---

**Enjoy playing JS The Spire!** 🎮✨ 