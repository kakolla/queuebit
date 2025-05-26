const { contextBridge, ipcRenderer } = require('electron')


// Bridges the main entry file to the preloaded parts (more API capabilities)
contextBridge.exposeInMainWorld("api", {
    myFunc: () => ipcRenderer.send("do-smt"),
    getCurrentLoad: () => {
        console.log("welcome")
    }

})