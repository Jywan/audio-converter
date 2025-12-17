import './Converter.css'
import { Button } from '../../components/Button/Button'
import { ToggleGroup } from '../../components/ToggleGroup/ToggleGroup'
import { useConverter, type Format } from './useConverter'

export function Converter() {
    const c = useConverter();

    const formatItems = [
        { value: 'mp3' as Format, title: 'MP3', desc: '범용' },
        { value: 'wav' as Format, title: 'WAV', desc: '무손실(PCM)'},
        { value: 'm4a' as Format, title: 'M4A', desc: 'AAC' },
    ];

    const rateItems = [
        { value: '', title: '원본', desc: ''},
        { value: '8000', title: '8000', desc: 'Hz' },
        { value: '16000', title: '16000', desc: 'Hz' },
        { value: '44100', title: '44100', desc: 'Hz' },
        { value: '48000', title: '48000', desc: 'Hz' },
    ];

    const chItems = [
        { value: '', title: '원본', desc: '' },
        { value: '1', title: '모노', desc: '1ch' },
        { value: '2', title: '스테레오', desc: '2ch' },
    ];

    const brItems = [
        { value: '', title: '자동', desc: 'VBR' },
        { value: '128', title: '128', desc: 'kbps' },
        { value: '192', title: '192', desc: 'kbps' },
        { value: '320', title: '320', desc: 'kbps' },
    ];

    return (
        <div className='wrap'>
            <div className='top'>
                <div>
                    <h1 className='h1'>Audio Converter</h1>
                    <p className='sub'>카드 선택 UI + 고급 옵션 애니메이션 + 로컬 변환</p>
                </div>
                <div className='row'>
                    <Button variant='primary' onClick={c.pick} disabled={c.busy}>파일 선택</Button>
                    <Button onClick={c.convert} disabled={!c.selectedPath || c.busy}>변환</Button>
                    <Button onClick={() => c.setAdvancedOpen(!c.advancedOpen)} disabled={c.busy}>고급 옵션 {c.advancedOpen ? '닫기' : '열기'}</Button>
                </div>
            </div>

            <div className='panel'>
                <div className='panelHead'>
                    <div className='pill'>상태: {c.busy ? 'Converting' : 'Ready'}</div>
                </div>

                <div className='panelBody animFadeUp'>
                    <div className='row'>
                        <div style={{ width: '100%' }}>
                            <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8 }}>출력 포맷</div>
                            <ToggleGroup value={c.format} items={formatItems} onChange={c.setFormat} disabled={c.busy} />
                        </div>
                    </div>

                    <div className='box' style={{ marginTop: 12 }}>
                        <div className='boxKey'>선택된 파일</div>
                        <div>{c.selectedPath ?? '없음'}</div>
                    </div>

                    {c.advancedOpen && (
                        <div className='adv anumSlideDown'>
                            <div className='kv'>
                                <div style={{ width: '100%' }}>
                                    <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8 }}>샘플레이트(Hz)</div>
                                    <ToggleGroup value={c.sampleRate} items={rateItems} onChange={c.setSampleRate} disabled={c.busy} />
                                </div>

                                <div style={{ width: '100%' }}>
                                    <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8 }}>채널</div>
                                    <ToggleGroup value={c.channels} items={chItems} onChange={c.setChannels} disabled={c.busy} />
                                </div>

                                <div style={{ width: '100%' }}>
                                    <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8 }}>비트레이트(kpbs) {c.bitrateDisabled ? '(WAV) 비활성' : ''}</div>
                                    <ToggleGroup value={c.bitrateDisabled ? '' : c.bitrate} items={brItems} onChange={c.setBitrate} disabled={c.busy || c.bitrateDisabled} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='log'>{c.log}</div>
                </div>
            </div>
        </div>
    );
}

