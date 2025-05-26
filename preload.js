const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld("api", {
    generateQuestion: (notes) => ipcRenderer.invoke('generate-question', notes)
})