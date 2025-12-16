import './Button.css';
import type { ButtonHTMLAttributes } from 'react';

export function Button(
    props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'primary' }
) {
    const { variant = 'default', className = '', ...rest } = props;
    return (
        <button {...rest} className={ ['btn', variant === 'primary' ? 'btnPrimary' : '', className,].filter(Boolean).join(' ') }/>
    );
}