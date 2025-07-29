# 🖥️ JS The Spire - Desktop Version

## 📦 Ready Desktop Build

The desktop version of the game has been successfully created!

### 📁 Build Files

Find the ready files in the `electron/dist/` folder:

- **`JS The Spire Setup 1.0.0.exe`** (83.65 MB) - Windows installer
- **`win-unpacked/`** - Folder with unpacked version of the game

### 🚀 Installation and Launch

1. **Installation via installer:**
   - Run `JS The Spire Setup 1.0.0.exe`
   - Follow the installer instructions
   - The game will be installed to the default folder

2. **Portable version:**
   - Open the `win-unpacked/` folder
   - Run `JS The Spire.exe`

### 📋 Game Logs

All game logs are automatically saved to files:

**Log locations:**
- When installed: `%APPDATA%/JS The Spire/logs/`
- Portable version: `win-unpacked/logs/`

**Log file format:**
```
game-logs-YYYY-MM-DDTHH-MM-SS-sssZ.txt
```

**Log contents:**
- All console.log messages
- Errors and warnings
- Electron application events
- Window events
- Unhandled exceptions
- Game loading information

### 🎮 Desktop Version Features

✅ **Full Desktop Application**
- Native Windows window
- Window management (minimize, maximize, close)
- Windows system integration

✅ **Automatic Logging**
- All game actions are recorded in files
- Timestamps for each event
- Separate files for each gaming session

✅ **Stable Operation**
- Independent of browser
- Better performance
- Offline operation

### 🔧 Development

For desktop version development:

```bash
# Run in development mode
npm run desktop

# Create new build
npm run desktop:build

# Full build process
node scripts/build-desktop.js
```

### 📝 Project Structure

```
jsthespire/
├── electron/                 # Desktop version
│   ├── main.js              # Main Electron process
│   ├── preload.js           # Preload script
│   ├── package.json         # Electron configuration
│   ├── assets/              # Icons and resources
│   └── logs/                # Log files
├── scripts/
│   ├── build-desktop.js     # Build script
│   └── generate-icons.js    # Icon generation
└── dist/                    # Built web version
```

### 🐛 Debugging

If problems occur:

1. **Check logs** in the `logs/` folder
2. **Run in development mode** with DevTools:
   ```bash
   NODE_ENV=development npm run desktop
   ```
3. **Check console** for errors

### 📊 File Sizes

- **Installer:** 83.65 MB
- **Unpacked version:** ~150 MB
- **Logs:** ~1-5 KB per session

### 🎯 Ready to Use!

The desktop version is fully ready for distribution and use. All game features work as in the web version, but with additional desktop application capabilities. 