import './ToglleGroup.css';

export type ToglleGroup<T extends string> = { value: T; title: string; desc?: string };

export function ToglleGroup<T extends string>(props: {
    value: T;
    items: ToglleGroup<T>[];
    onChange: (v: T) => void;
    disabled?: boolean;
}) {
    const { value, items, onChange, disabled } = props;

    return (
        <div className="tg" aria-disabled={disabled ? 'true' : 'false'}>
            {items.map((it) => {
            const isActive = it.value === value;
            return (
                <button key={it.value} type="button" className={['card', isActive ? 'active' : ''].filter(Boolean).join(' ')}
                    onClick={() => !disabled && onChange(it.value)} disabled={disabled} aria-pressed={isActive}>
                    <div className="title">{it.title}</div>
                    {it.desc ? <div className="desc">{it.desc}</div> : null}
                </button>
            );
            })}
        </div>
        );
}