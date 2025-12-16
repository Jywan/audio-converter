export {};

declare global {
    interface Window {
        api: {
            pickAudioFile: () => Promise<string | null>;
            convertAudio: (
                inputPath: string,
                format: 'mp3' | 'wav' | 'm4a',
                sampleRate: string,
                channels: string,
                bitrate: string,
            ) => Promise<
                | { ok: true; outputPath: string }
                | { ok: false; error: string }
            >;
        };
    }
}