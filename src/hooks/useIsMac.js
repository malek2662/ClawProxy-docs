import { useSyncExternalStore } from 'react';

// The platform never changes at runtime, so there is nothing to subscribe to.
function subscribe() {
    return () => {};
}

function getSnapshot() {
    return typeof navigator !== 'undefined'
        && Boolean(navigator.platform?.includes('Mac'));
}

// Used for the prerendered (server) HTML AND the first hydration render,
// so the two always match. Mac users flip to `true` immediately after
// hydration — before they ever focus the search box.
function getServerSnapshot() {
    return false;
}

/**
 * SSR/hydration-safe replacement for render-time
 * `navigator.platform?.includes('Mac')` (navigator does not exist in Node,
 * which the prerender step runs in).
 */
export function useIsMac() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
