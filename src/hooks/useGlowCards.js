import { useEffect } from 'react';

/**
 * Mouse-tracked glow for any `.glow-card` descendants of `rootRef`.
 * Sets --mx / --my custom properties on the hovered card so CSS can
 * render a cursor-following radial highlight + border sheen.
 */
export function useGlowCards(rootRef) {
    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let raf = 0;
        let pending = null;

        const flush = () => {
            raf = 0;
            if (!pending) return;
            const { card, clientX, clientY } = pending;
            pending = null;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${clientX - r.left}px`);
            card.style.setProperty('--my', `${clientY - r.top}px`);
        };

        const onMove = (e) => {
            const card = e.target.closest?.('.glow-card');
            if (!card || !root.contains(card)) return;
            pending = { card, clientX: e.clientX, clientY: e.clientY };
            if (!raf) raf = requestAnimationFrame(flush);
        };

        root.addEventListener('mousemove', onMove, { passive: true });
        return () => {
            root.removeEventListener('mousemove', onMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [rootRef]);
}
