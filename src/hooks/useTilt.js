import { useEffect, useRef } from 'react';

/**
 * Subtle pointer-driven 3D tilt. Attach the returned ref to the element
 * that should tilt. Disabled for touch pointers and reduced motion.
 */
export function useTilt(max = 5) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let raf = 0;
        let pending = null;

        const flush = () => {
            raf = 0;
            if (!pending) return;
            const { px, py } = pending;
            pending = null;
            el.style.transform = `perspective(1100px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
        };

        const onMove = (e) => {
            const r = el.getBoundingClientRect();
            pending = {
                px: (e.clientX - r.left) / r.width - 0.5,
                py: (e.clientY - r.top) / r.height - 0.5,
            };
            if (!raf) raf = requestAnimationFrame(flush);
        };

        const onLeave = () => {
            pending = null;
            if (raf) cancelAnimationFrame(raf);
            raf = 0;
            el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
        };

        el.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave);
        return () => {
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [max]);

    return ref;
}
