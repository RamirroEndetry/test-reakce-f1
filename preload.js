// Most mezi stránkou a hlavním procesem: žebříček se ukládá do souboru na disku
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('boardStore', {
  loadSettings: () => ipcRenderer.sendSync('settings:load'),
  saveSettings: value => ipcRenderer.sendSync('settings:save', value),
  load: () => ipcRenderer.sendSync('board:load'),
  save: (board) => ipcRenderer.sendSync('board:save', board),
  exportPdf: (html) => ipcRenderer.invoke('contacts:pdf', html),
});
