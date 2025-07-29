const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let logFile;

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file with timestamp
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
logFile = path.join(logsDir, `game-logs-${timestamp}.txt`);

// Initialize log file
fs.writeFileSync(logFile, `=== Game Logs Started at ${new Date().toISOString()} ===\n\n`);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        title: 'JS The Spire',
        icon: path.join(__dirname, 'assets', 'icon.png'), // You can add an icon later
        resizable: true,
        show: false
    });

    // Load the game
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3001');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // Show window when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Log window events
    mainWindow.webContents.on('did-finish-load', () => {
        log('Game loaded successfully');
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        log(`Failed to load game: ${errorDescription} (${errorCode})`);
    });
}

// Logging function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    console.log(logMessage.trim());
    
    try {
        fs.appendFileSync(logFile, logMessage);
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

// IPC handlers for logging
ipcMain.handle('log-message', (event, message) => {
    log(`[Renderer] ${message}`);
});

ipcMain.handle('log-error', (event, error) => {
    log(`[Renderer] ERROR: ${error}`);
});

ipcMain.handle('get-log-file-path', () => {
    return logFile;
});

// App event handlers
app.whenReady().then(() => {
    log('Electron app started');
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    log('All windows closed, quitting app');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    log('App quitting');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(`Stack: ${error.stack}`);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
}); 