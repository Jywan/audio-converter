type Props = { status: string; }

export function HeaderBar({ status }: Props) {
    return (
        <header className="wfHeader">
            <div>
                <h1 className="wfTitle">Audio Convertoer</h1>
                <div className="wfStatus">Status : {status}</div>
            </div>
        </header>
    );
}