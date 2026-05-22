const { contextBridge, ipcRenderer } = require('electron')

// Expose a clean API to the renderer (index.html)
contextBridge.exposeInMainWorld('FT', {
  isElectron : true,
  scroll     : delta => ipcRenderer.send('sys-scroll', delta),
  setTopmost : val   => ipcRenderer.send('set-topmost', val),
})
