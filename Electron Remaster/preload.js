const {contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("ipc", {
    onLog: (msgFromMain) => ipcRenderer.on('log', msgFromMain)
})