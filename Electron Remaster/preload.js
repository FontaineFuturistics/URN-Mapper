const {contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("ipc", {
    onLog: (msgFromMain) => ipcRenderer.on('log', msgFromMain),
    onAutoInit: (msgFromMain) => ipcRenderer.on('autoInit', msgFromMain),
    initReady: () => ipcRenderer.invoke('initReady'),
    updateAutoLaunch: (msgToMain) => ipcRenderer.invoke('updateAutoLaunch', msgToMain),
    logMsg: (msgToMain) => ipcRenderer.invoke('logMsg', msgToMain),
    selMapFile: () => ipcRenderer.invoke('selMapFile'),
    launchNewMapping: () => ipcRenderer.invoke('launchNewMapping'),
    addMapping: (msgToMain) => ipcRenderer.invoke('addMapping', msgToMain),
    cancelMapping: () => ipcRenderer.invoke('cancelMapping'),
    errorClose: () => ipcRenderer.invoke("errorClose"),
    hideMain: () => ipcRenderer.invoke('hideMain'),
})