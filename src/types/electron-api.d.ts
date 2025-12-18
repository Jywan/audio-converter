export {};

declare global {
    interface Window {
        api: {
            pickAudioFile: () => Promise<string | null>;
            convertAudio: (
                inputPath: string,
                format: 'mp3' | 'wav' | 'm4a' | 'aac' | 'flac' | 'ogg',
                sampleRate: string,
                channels: string,
                bitrate: string,
            ) => Promise<
                | { ok: true; outputPath: string }
                | { ok: false; error: string }
            >;
            probeAudio: (inputPath: string) => Promise<
                | { ok: true; meta: { codec: string | null; sampleRate: string | null; channels: number | null; bitRate: string | null; duration: string | null } }
                | { ok: false; error: string }
            >;
        };
    }
}