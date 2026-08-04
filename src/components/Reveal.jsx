import React from 'react';
import { useReveal } from '../hooks/useReveal';

export default function Reveal({ delay = 0, className = '', style, children, ...rest }) {
    const ref = useReveal();
    return (
        <div
            ref={ref}
            className={`reveal${className ? ` ${className}` : ''}`}
            style={{ '--reveal-delay': `${delay}ms`, ...style }}
            {...rest}
        >
            {children}
        </div>
    );
}
