import { useEffect, useMemo, useState, useCallback } from "react";

export type Format = 'mp3' | 'wav' | 'm4a' | 'aac' | 'flac' | 'ogg';

export function useConverter() {

    type ProbeMeta = {
        codec: string | null;
        sampleRate: string | null;
        channels: number | null;
        bitRate: string | null;
        duration: string | null;
    }

    const [ selectedPath, setSelectedPath ] = useState<string | null>(null);
    const [ format, setFormat ] = useState<Format>('mp3');

    const [ advancedOpen, setAdvancedOpen ] = useState(false);
    const [ sampleRate, setSampleRate ] = useState('');
    const [ channels, setChannels ] = useState('');
    const [ bitrate, setBitrate ] = useState('');

    const [ busy, setBusy ] = useState(false);
    const [ log, setLog ] = useState('');

    const [meta, setMeta] = useState<ProbeMeta | null>(null);

    const bitrateDisabled = useMemo(() => format === 'wav' || format === 'flac', [format]);

    useEffect(() => {
        if (format === 'wav') setBitrate('');
    }, [format]);

    const append = (m: string) => setLog((p) => (p ? p + '\n': '') + m);

    const pick = useCallback(async () => {
        // 1) API 진단은 호출 전에
        console.log('[api keys]', Object.keys((window as any).api ?? {}));
        console.log('[probe exists]', typeof (window as any).api?.probeAudio);
    
        const p = await window.api.pickAudioFile();
        console.log('[pick] path', p);
        if (!p) return;
    
        setSelectedPath(p);
        setMeta(null);
    
        // 2) probe 실패를 log로 남겨서 원인 확인 가능하게
        try {
        if (typeof (window.api as any).probeAudio !== 'function') {
            append('[probe] probeAudio가 preload에 노출되지 않았습니다.');
            return;
        }
    
        const r = await window.api.probeAudio(p);
        console.log('[probe] result', r);
    
        if (r.ok) setMeta(r.meta);
        else {
            setMeta(null);
            append(`[probe error] ${r.error}`);
        }
        } catch (e: any) {
            setMeta(null);
            append(`[probe exception] ${e?.message ?? String(e)}`);
        }
    }, []);

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
        selectedPath, format, setFormat, advancedOpen, setAdvancedOpen, sampleRate, setSampleRate, 
        channels, setChannels, bitrate, setBitrate, bitrateDisabled, busy, log, setLog, pick, convert, meta,
    }
}