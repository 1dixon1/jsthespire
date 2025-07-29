const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message),
    logError: (error) => ipcRenderer.invoke('log-error', error),
    getLogFilePath: () => ipcRenderer.invoke('get-log-file-path')
});

// Override console methods to also log to file
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

console.log = (...args) => {
    originalConsoleLog(...args);
    ipcRenderer.invoke('log-message', args.join(' '));
};

console.error = (...args) => {
    originalConsoleError(...args);
    ipcRenderer.invoke('log-error', args.join(' '));
};

console.warn = (...args) => {
    originalConsoleWarn(...args);
    ipcRenderer.invoke('log-message', `WARN: ${args.join(' ')}`);
};

console.info = (...args) => {
    originalConsoleInfo(...args);
    ipcRenderer.invoke('log-message', `INFO: ${args.join(' ')}`);
}; 