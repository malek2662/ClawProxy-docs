import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener('change', callback);
    return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}

// Used for the prerendered (server) HTML AND the first hydration render,
// so the two always match. Reduced-motion users flip to `true` immediately
// after hydration — before any animation effect has a chance to start.
function getServerSnapshot() {
    return false;
}

/**
 * SSR/hydration-safe replacement for
 * `useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)`.
 * Also reacts to live changes of the media query.
 */
export function usePrefersReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
