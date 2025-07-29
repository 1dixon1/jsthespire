# JS The Spire - Desktop Version

Desktop version of the JS The Spire card game built with Electron.

## Features

- **Full Desktop App**: Native desktop application with window management
- **Automatic Logging**: All console logs are automatically saved to timestamped files
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Development Mode**: Hot reload during development
- **Production Builds**: Optimized builds for distribution

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
# In the root directory
npm run dev

# In another terminal, start the desktop app
npm run desktop
```

### Building

1. Build the web version:
```bash
npm run build
```

2. Build the desktop app:
```bash
npm run desktop:build
```

The built application will be in `electron/dist/`.

## Logging

All console logs are automatically saved to timestamped files in `electron/logs/`. Each session creates a new log file with the format:

```
game-logs-YYYY-MM-DDTHH-MM-SS-sssZ.txt
```

### Log File Contents

- Console.log messages
- Console.error messages
- Console.warn messages
- Console.info messages
- Electron app events
- Window events
- Uncaught exceptions
- Unhandled promise rejections

### Accessing Logs

You can access the log file path programmatically:

```javascript
// In the renderer process
const logPath = await window.electronAPI.getLogFilePath();
console.log('Log file location:', logPath);
```

## File Structure

```
electron/
├── main.js              # Main Electron process
├── preload.js           # Preload script for security
├── package.json         # Electron package configuration
├── assets/
│   └── icon.svg         # App icon
└── logs/                # Generated log files
    └── game-logs-*.txt
```

## Scripts

- `npm run desktop` - Start desktop app in development mode
- `npm run desktop:build` - Build desktop app for production
- `npm run desktop:dist` - Create distributable packages

## Distribution

The app can be built for different platforms:

- **Windows**: NSIS installer (.exe)
- **macOS**: DMG package
- **Linux**: AppImage

Build artifacts will be in `electron/dist/`.

## Troubleshooting

### Common Issues

1. **App won't start**: Check the log files in `electron/logs/`
2. **Build fails**: Ensure all dependencies are installed
3. **Logs not appearing**: Check file permissions in the logs directory

### Debug Mode

To enable debug mode, set the environment variable:

```bash
NODE_ENV=development npm run desktop
```

This will open DevTools automatically. 