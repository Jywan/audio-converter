import { useEffect, useMemo, useState } from "react";

export type Format = 'mp3' | 'wav' | 'm4a' | 'aac' | 'flac' | 'ogg';

export function useConverter() {
    const [ selectedPath, setSelectedPath ] = useState<string | null>(null);
    const [ format, setFormat ] = useState<Format>('mp3');

    const [ advancedOpen, setAdvancedOpen ] = useState(false);
    const [ sampleRate, setSampleRate ] = useState('');
    const [ channels, setChannels ] = useState('');
    const [ bitrate, setBitrate ] = useState('');

    const [ busy, setBusy ] = useState(false);
    const [ log, setLog ] = useState('');

    const bitrateDisabled = useMemo(() => format === 'wav' || format === 'flac', [format]);

    useEffect(() => {
        if (format === 'wav') setBitrate('');
    }, [format]);

    const append = (m: string) => setLog((p) => (p ? p + '\n': '') + m);

    const pick = async () => {
        const p = await window.api.pickAudioFile();
        if (!p) return;
        setSelectedPath(p);
        setLog('');
        append('파일 선택 완료');
    };

    const convert = async () => {
        if (!selectedPath) return;
        setBusy(true);
        try {
            append(`변환 시작: ${format.toUpperCase()}`)
            const br = bitrateDisabled ? '' : bitrate;
            const res = await window.api.convertAudio(selectedPath, format, sampleRate, channels, br);
            
            if (res.ok) {
                append('변환 성공');
                append(`결과 파일 : ${res.outputPath}`)
            } else {
                append('변환 실패');
                append(res.error);
            }
        } finally {
            setBusy(false);
        }
    };

    return {
        selectedPath, format, setFormat, advancedOpen, setAdvancedOpen, sampleRate, setSampleRate, channels, setChannels, bitrate, setBitrate, bitrateDisabled, busy, log, setLog, pick, convert
    }
}