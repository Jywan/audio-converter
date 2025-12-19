import type { Format } from "../useConverter";

type FormatItem = { value: Format; label: string };

type Props = {
    busy: boolean;

    formats: readonly FormatItem[];
    format: Format;
    onFormatChange: (v: Format) => void;

    advancedOpen: boolean;
    onToggleAdvanced: () => void;

    sampleRate: string;
    onSampleRateChange: (v: string) => void;

    channels: string;
    onChannelsChange: (v: string) => void;

    bitrate: string;
    onBitrateChange: (v: string) => void;

    bitrateDisabled: boolean;
};

export function SettingSection(props: Props) {
    const { busy, formats, format, onFormatChange, advancedOpen, 
        onToggleAdvanced, sampleRate, onSampleRateChange, 
        channels, onChannelsChange, bitrate, onBitrateChange, 
        bitrateDisabled } = props;

    return (
        <section>
            <h2 className="wfCardTitle">설정</h2>
            <div className="wfField">
                <div className="wfLabel">출력 포맷</div>
                <div className="wfFormatGrid" role="radiogroup" aria-label="출력 포맷">
                    {formats.map((f) => {
                        const active = format === f.value;

                        return (
                            <button 
                                key={f.value} 
                                type="button" 
                                className={['wfFormatCard', active ? 'isActive' : ''].join(' ')}
                                onClick={() => onFormatChange(f.value)}
                                disabled={busy}
                                aria-pressed={active}
                                data-active={active ? 'true' : 'false'}
                            >
                                <div className="wfFormatTitle">{f.value}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="wfDivider" />

            <button className="wfBtn" type="button" onClick={onToggleAdvanced} disabled={busy}>
                {advancedOpen ? '고급 옵션 닫기' : '고급 옵션 열기'}
            </button>

            {advancedOpen && (
                <div style={{ marginTop:12 }} className="wfField">
                    <div className="wfRow">
                        <div className="wfField">
                            <div className="wfLabel">샘플레이트</div>
                            <select className="wfSelect" value={sampleRate} onChange={(e) => onSampleRateChange(e.target.value)} disabled={busy}>
                                <option value="">Source</option>
                                <option value="8000">8000</option>
                                <option value="16000">16000</option>
                                <option value="44100">44100</option>
                                <option value="48000">48000</option>
                            </select>
                        </div>

                        <div className="wfField">
                            <div className="wfLabel">채널</div>
                            <select className="wfSelect" value={channels} onChange={(e) => onChannelsChange(e.target.value)} disabled={busy}>
                                <option value="">Source</option>
                                <option value="1">Mono</option>
                                <option value="2">Stereo</option>
                            </select>
                        </div>

                        <div className="wfField">
                            <div className="wfLabel">비트레이트</div>
                            <select className="wfSelect" value={bitrate} onChange={(e) => onBitrateChange(e.target.value)} disabled={busy || bitrateDisabled}>
                                <option value="">Auto</option>
                                <option value="128">128</option>
                                <option value="192">192</option>
                                <option value="320">320</option>
                            </select>
                            {bitrateDisabled ? <span style={{ marginLeft: 8, fontSize: 12, opacity:0.7 }}>(비활성)</span> : null}
                        </div>

                    </div>
                </div>
            )}
        </section>
    );
}