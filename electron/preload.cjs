const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    pickAudioFile: () => ipcRenderer.invoke('pick-audio-file'),
    convertAudio: (inputPath, format, sampleRate, channels, bitrate) =>
        ipcRenderer.invoke('convert-audio', {
        inputPath,
        format,
        sampleRate,
        channels,
        bitrate,
        }),
});