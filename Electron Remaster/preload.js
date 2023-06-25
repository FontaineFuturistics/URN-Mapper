const {contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("ipc", {
    onLog: (msgFromMain) => ipcRenderer.on('log', msgFromMain),
    onAutoInit: (msgFromMain) => ipcRenderer.on('autoInit', msgFromMain),
    initReady: () => ipcRenderer.invoke('initReady'),
    updateAutoLaunch: (msgToMain) => ipcRenderer.invoke('updateAutoLaunch', msgToMain),
})