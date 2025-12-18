type Props = {
    status: string;
    busy: boolean;
    canConvert: boolean;
    onPick: () => void;
    onConvert: () => void;
}

export function HeaderBar({ status, busy, canConvert, onPick, onConvert }: Props) {
    return (
        <header className="wfHeader">
            <div>
                <h1 className="wfTitle">Audio Convertoer</h1>
                <div className="wfStatus">Status : {status}</div>
            </div>

            {/* <div className="wfActions">
                <button className="wfBtn" type="button" onClick={onPick} disabled={busy}>
                    파일 선택
                </button>
                <button className="wfBtn wfBtnPrimary" type="button" onClick={onConvert} disabled={!canConvert}>
                    {busy ? '변환 중...' : '변환'}
                </button>
            </div> */}
        </header>
    );
}