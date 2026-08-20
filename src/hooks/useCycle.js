import { useEffect, useState } from 'react';

/**
 * Cycles an index 0..steps-1 on an interval. Returns 0 and never
 * advances when the user prefers reduced motion.
 */
export function useCycle(steps, ms = 2400) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const id = setInterval(() => setIndex((v) => (v + 1) % steps), ms);
        return () => clearInterval(id);
    }, [steps, ms]);

    return index;
}
