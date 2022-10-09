const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    requestToUpdateConnection: (type, args) => {
        ipcRenderer.send('connectionUpdateRequest', [type, ...args]);
    },
    minimizeWindow: () => {
        ipcRenderer.send("minimize", []);
    },
    closeWindow: () => {
        ipcRenderer.send("close", []);
    }
})
