const { contextBridge, ipcRenderer } = require('electron');
//수정중
contextBridge.exposeInMainWorld('api', {
    pickAudioFile: () => ipcRenderer.invoke('pick-audio-file'),
    convertAudio: (inputPath, format)
})