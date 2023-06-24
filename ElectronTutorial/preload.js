const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),
    onOrders: (msgFromMain) => ipcRenderer.on('orders', msgFromMain),
    bugMain: () => ipcRenderer.invoke('bugMain'),
    // We can also expose variables, not just functions
})