type Props = {
    busy: boolean;
    success: boolean;
    failed: boolean;
    resultPath: string;
    log: string;
    showLog: boolean;
    onToggleLog: () => void;
};

export function ResultSection({ busy, success, failed, resultPath, log, showLog, onToggleLog }: Props) {
    const statusText = busy ? '변환 중' : success ? '완료' : failed ? '실패' : '대기';

    return (
        <section>
            <h2 className="wfCardTitle">결과</h2>

            <div className="wfResultLine">상태: {statusText}</div>
            <div className="wfResultLine">결과 파일: {success && resultPath ? resultPath : '-'}</div>

            <button className="wfBtn" type="button" onClick={onToggleLog} disabled={!log}>
                {showLog ? '로그 숨기기' : '로그 보기'}
            </button>

            {showLog && <pre className="wfLog">{log}</pre>}
        </section>
    );
}