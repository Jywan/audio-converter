import { useMemo, useState } from "react";
import { useConverter, type Format } from "./useConverter";

import { HeaderBar } from "./sections/HeaderBar";
import { InputSection } from "./sections/InputSection";
import { SettingSection } from "./sections/SettingSection";
import { ResultSection } from "./sections/ResultSection";

export function Converter() {
    const c = useConverter();
    const [showLog, setShowLog] = useState(false);

    const canConvert = !!c.selectedPath && !c.busy;
    const status = c.busy ? 'Converting' : (c.selectedPath ? 'Ready' : 'Waiting');

    const formats = useMemo(() => ([
        { value: 'mp3' as Format, label: 'MP3' },
        { value: 'wav' as Format, label: 'WAV' },
        { value: 'm4a' as Format, label: 'M4A' },
        { value: 'flac' as Format, label: 'FLAC' },
        { value: 'ogg' as Format, label: 'OGG' },
        { value: 'aac' as Format, label: 'AAC' },
    ]), []);

    const resultLine = c.log.split('\n').reverse().find(l => l.startsWith('결과 파일:')) ?? '';
    const resultPath = resultLine ? resultLine.replace('결과 파일:', '').trim() : '';
    const failed = c.log.includes('변환 실패');
    const success = c.log.includes('변환 성공');

    return (
        <div className="wfPage">
            <div className="wfShell">
                <HeaderBar status={status} />

                <div className="wfBody">
                    <div className="wfCard">
                        <InputSection selectedPath={c.selectedPath} />

                        <div className="wfDivider" />

                        <SettingSection busy={c.busy} formats={formats} format={c.format} onFormatChange={c.setFormat} 
                            advancedOpen={c.advancedOpen} onToggleAdvanced={() => c.setAdvancedOpen(!c.advancedOpen)} 
                            sampleRate={c.sampleRate} onSampleRateChange={c.setSampleRate} channels={c.channels} 
                            onChannelsChange={c.setChannels} bitrate={c.bitrate} onBitrateChange={c.setBitrate} 
                            bitrateDisabled={c.bitrateDisabled} />

                        <div className="wfDivider" />
                        <ResultSection busy={c.busy} success={success} failed={failed} resultPath={resultPath} log={c.log}
                            showLog={showLog} onToggleLog={() => setShowLog(v => !v)} />

                        <div className="wfDivider" />

                        <div className="wfActionBar">
                            <div className="wfActionHint">
                                {c.busy
                                ? '변환 중입니다...'
                                : c.selectedPath
                                    ? '설정이 완료되었습니다. 변환을 실행하십시오.'
                                    : '먼저 파일을 선택하십시오.'}
                            </div>

                            <div className="wfActions">
                                <button className="wfBtn" type="button" onClick={c.pick} disabled={c.busy}>
                                파일 선택
                                </button>
                                <button className="wfBtn wfBtnPrimary" type="button" onClick={c.convert} disabled={!canConvert}>
                                {c.busy ? '변환 중...' : '변환'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="wfCard">
                        <h2 className="wfCardTitle">보조 영역</h2>

                        <div className="wfResultLine">파일 정보</div>
                        <div className="wfPath">
                            {c.meta
                            ? [
                                `codec: ${c.meta.codec ?? '-'}`,
                                `sr: ${c.meta.sampleRate ?? '-'}`,
                                `ch: ${c.meta.channels ?? '-'}`,
                                `br: ${c.meta.bitRate ?? '-'}`,
                                `dur: ${c.meta.duration ?? '-'}`,
                                ].join('\n')
                            : '파일을 선택하면 메타데이터가 표시됩니다.'}
                        </div>

                        <div className="wfDivider" />

                        <div className="wfResultLine">현재 변환 설정</div>
                        <div className="wfPath">
                            {[
                            `format: ${c.format}`,
                            `sampleRate: ${c.sampleRate || 'Source'}`,
                            `channels: ${c.channels || 'Source'}`,
                            `bitrate: ${c.bitrateDisabled ? 'N/A' : (c.bitrate || 'Auto')}`,
                            ].join('\n')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}