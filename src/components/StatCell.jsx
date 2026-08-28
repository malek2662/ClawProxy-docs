import React, { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

export default function StatCell({ num, suffix, label, delay = 0 }) {
    const ref = useRef(null);
    const target = parseInt(num, 10);
    const isReduced = usePrefersReducedMotion();
    const [display, setDisplay] = useState('0');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        // Reduced motion: final value/visibility are derived below, no count-up.
        if (!el || isReduced) return;
        let raf = 0;
        let timer = 0;
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries[0].isIntersecting) return;
                observer.disconnect();
                timer = window.setTimeout(() => {
                    setVisible(true);
                    const start = performance.now();
                    const duration = 1100;
                    const tick = (now) => {
                        const t = Math.min(1, (now - start) / duration);
                        setDisplay(String(Math.round(easeOutCubic(t) * target)));
                        if (t < 1) raf = requestAnimationFrame(tick);
                    };
                    raf = requestAnimationFrame(tick);
                }, delay);
            },
            { threshold: 0.4 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(raf);
            clearTimeout(timer);
        };
    }, [target, delay, isReduced]);

    return (
        <div ref={ref} className={`stat-cell${visible || isReduced ? ' stat-on' : ''}`} style={{ '--reveal-delay': `${delay}ms` }}>
            <div className="stat-num">
                {isReduced ? String(target) : display}
                <span className="stat-suffix">{suffix}</span>
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}
