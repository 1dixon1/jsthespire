# 🚀 Quick Start - JS The Spire

## 🎮 How to Start Playing

### Option 1: Web Version (recommended for testing)
```bash
npm run dev
```
Open http://localhost:3001 in your browser

### Option 2: Desktop Version (full version)
1. Run `electron/dist/JS The Spire Setup 1.0.0.exe`
2. Or use the portable version: `electron/dist/win-unpacked/JS The Spire.exe`

## 📋 Game Logs

**Desktop Version:**
- Logs are automatically saved in `electron/logs/`
- Format: `game-logs-YYYY-MM-DDTHH-MM-SS-sssZ.txt`

**Web Version:**
- Logs are displayed in browser console (F12)

## 🎯 Main Commands

```bash
# Web version
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview built version

# Desktop version
npm run desktop      # Run in development mode
npm run desktop:build # Create desktop build
```

## 📁 Project Structure

```
jsthespire/
├── src/                    # Game source code
├── electron/               # Desktop version
├── dist/                   # Built web version
├── scripts/                # Build scripts
└── README.md              # Full documentation
```

## 🎮 Controls

- **Mouse:** Select cards, enemies, map nodes
- **Mouse wheel:** Scroll the map
- **"End Turn" button:** End turn

## 🐛 Debugging

1. Check logs in browser console (F12)
2. For desktop version - check log files
3. Make sure all dependencies are installed: `npm install`

## 🎯 Ready to Play!

The game is fully functional and ready to use! 