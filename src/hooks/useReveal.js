import { useEffect, useRef, useState } from 'react';

let sharedObserver = null;
const pending = new Map(); // element -> setVisible
let scrollRaf = 0;

function revealEl(el) {
    const setVisible = pending.get(el);
    pending.delete(el);
    sharedObserver?.unobserve(el);
    if (setVisible) setVisible(true);
    if (pending.size === 0) stopScrollWatch();
}

function checkAll() {
    const vh = window.innerHeight;
    for (const el of [...pending.keys()]) {
        // Reveal when in/entering the viewport, or already scrolled past it
        // (instant jumps: End key, find-in-page, deep anchors) — those never
        // produce an IntersectionObserver threshold crossing.
        if (el.getBoundingClientRect().top < vh - 48) revealEl(el);
    }
}

function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        checkAll();
    });
}

function startScrollWatch() {
    window.addEventListener('scroll', onScroll, { passive: true });
}

function stopScrollWatch() {
    window.removeEventListener('scroll', onScroll);
    if (scrollRaf) {
        cancelAnimationFrame(scrollRaf);
        scrollRaf = 0;
    }
}

function getObserver() {
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(checkAll, {
            threshold: 0.12,
            rootMargin: '0px 0px -48px 0px',
        });
    }
    return sharedObserver;
}

// Returns [ref, visible]. Visibility is React state (not an imperative class),
// so re-renders that rewrite className can never strip the revealed state.
export function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const observer = getObserver();
        const wasEmpty = pending.size === 0;
        pending.set(el, setVisible);
        if (wasEmpty) startScrollWatch();
        observer.observe(el);
        return () => {
            pending.delete(el);
            observer.unobserve(el);
        };
    }, []);

    return [ref, visible];
}
