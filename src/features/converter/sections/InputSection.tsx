type Props = {
    selectedPath: string | null;
}

export function InputSection({ selectedPath }: Props) {
    return (
        <section>
            <h2 className="wfCardTitle">입력 파일</h2>
            <div className={['wfPath', selectedPath ? '' : 'wfPathMuted'].filter(Boolean).join(' ')}>
                {selectedPath ?? '선택된 파일 없음'}
            </div>
        </section>
    );
}