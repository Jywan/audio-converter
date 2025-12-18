const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 760,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const isDev = !app.isPackaged;
    if (isDev) {
        win.loadURL('http://localhost:5173');    
    } else {
        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
}

ipcMain.handle('pick-audio-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: '오디오 파일 선택',
        properties: ['openFile'],
        filters: [
            { name: 'Audio', extensions: ['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg', 'opus', 'aiff', 'aif', 'caf', 'wma'] },
            { name: 'All Files', extensions: ['*'] },
        ],
    });

    if (canceled || filePaths.length === 0) return null;
    return filePaths[0];
})

ipcMain.handle('convert-audio', async (_evt, payload) => {

    try {
        const inputPath = payload?.inputPath;
        const format = payload?.format;
        const sr = (payload?.sampleRate || '').trim();
        const ch = (payload?.channels || '').trim();
        const br = (payload?.bitrate || '').trim();

        if (!inputPath) return { ok: false, error: 'inputPath is empty' };
        if (!['mp3', 'wav', 'm4a', 'aac', 'flac', 'ogg'].includes(format)) return { ok: false, error: `invalid format: ${format}` };

        const dir = path.dirname(inputPath);
        const base = path.basename(inputPath, path.extname(inputPath));
        
        let outputPath = '';
        let args = [];

        if (format === 'mp3') {
            outputPath = path.join(dir, `${base}.mp3`);
            args = ['-y', '-i', inputPath, '-c:a', 'libmp3lame', outputPath];
        } else if (format === 'wav') {
            outputPath = path.join(dir, `${base}.wav`);
            args = ['-y', '-i', inputPath, '-c:a', 'pcm_s16le', outputPath];
        } else if (format === 'm4a') {
            outputPath = path.join(dir, `${base}.m4a`);
            args = ['-y', '-i', inputPath, '-c:a', 'aac', outputPath];
        } else if (format === 'aac') {
            outputPath = path.join(dir, `${base}.aac`);
            args = ['-y', '-i', inputPath, '-c:a', 'aac', outputPath];
        } else if (format === 'flac') {
            outputPath = path.join(dir, `${base}.flac`);
            args = ['-y', '-i', inputPath, '-c:a', 'flac', outputPath];
        } else if (format === 'ogg') {
            args = ['-y', '-i', inputPath, '-c:a', 'libopus', outputPath];
        }

        if (sr) args.splice(args.length - 1, 0, '-ar', sr);
        if (ch) args.splice(args.length - 1, 0, '-ac', ch);
        if (br && (format === 'mp3' || format === 'm4a' || format === 'aac' || format === 'ogg')) args.splice(args.length - 1, 0, '-b:a', `${br}k`);

        const proc = spawn('ffmpeg', args);
        
        let stderr = '';
        let spwanError = null;

        proc.on('error', (err) => {
            spwanError = err;
        });

        proc.stderr.on('data', (d) => (stderr += d.toString()));

        const code = await new Promise((resolve) => proc.on('close', resolve));

        if (spwanError) return { ok: false, error: `ffmpeg 실행 실패: ${spwanError.message}\n(ffmpeg 설치/경로 확인 필요)`, };
        if (code !== 0) return { ok: false, error: stderr || `ffmpeg failed (code=${code})` };

        return { ok: true, outputPath };

    } catch (e) {
        return { ok: false, error: e?.message || String(e) }
    }
});


ipcMain.handle('probe-audio', async (_evt, payload) => {
    try {
    const inputPath = payload?.inputPath;
    if (!inputPath) return { ok: false, error: 'inputPath is empty' };

    
    const args = ['-hide_banner', '-i', inputPath];

    const proc = spawn('ffmpeg', args);

    let stderr = '';
    let spawnError = null;

    proc.on('error', (err) => { spawnError = err; });
    proc.stderr.on('data', (d) => (stderr += d.toString()));


    await new Promise((resolve) => proc.on('close', resolve));

    if (spawnError) return { ok: false, error: `ffmpeg 실행 실패: ${spawnError.message}` };

    const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):(\d+)\.(\d+)/);
    const audioLine = stderr.split('\n').find(l => l.includes('Audio:')) || '';

    const codecMatch = audioLine.match(/Audio:\s*([^,]+)/);
    const srMatch = audioLine.match(/,\s*(\d+)\s*Hz/);
    const chMatch = audioLine.match(/,\s*(mono|stereo|\d+\s*channels)/i);
    const brMatch = audioLine.match(/,\s*(\d+)\s*kb\/s/i);

    const duration = durMatch
        ? `${durMatch[1]}:${durMatch[2]}:${durMatch[3]}.${durMatch[4]}`
        : null;

    const channels = (() => {
        if (!chMatch) return null;
        
        const v = chMatch[1].toLowerCase();
        if (v === 'mono') return 1;
        if (v === 'stereo') return 2;
        const n = v.match(/(\d+)/);
        return n ? Number(n[1]) : null;
    })();

    return {
        ok: true,
        meta: {
            codec: codecMatch ? codecMatch[1].trim() : null,
            sampleRate: srMatch ? srMatch[1] : null,
            channels,
            bitRate: brMatch ? String(Number(brMatch[1]) * 1000) : null,
            duration,
        },
    };
    } catch (e) {
    return { ok: false, error: e?.message || String(e) };
    }
});


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})