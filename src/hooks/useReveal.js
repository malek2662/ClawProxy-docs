import { useEffect, useRef } from 'react';

let sharedObserver = null;
const pending = new Set();
let scrollRaf = 0;

function revealEl(el) {
    el.classList.add('is-visible');
    pending.delete(el);
    sharedObserver?.unobserve(el);
    if (pending.size === 0) stopScrollWatch();
}

function checkAll() {
    const vh = window.innerHeight;
    for (const el of [...pending]) {
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

export function useReveal() {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            el.classList.add('is-visible');
            return;
        }
        const observer = getObserver();
        const wasEmpty = pending.size === 0;
        pending.add(el);
        if (wasEmpty) startScrollWatch();
        observer.observe(el);
        return () => {
            pending.delete(el);
            observer.unobserve(el);
        };
    }, []);

    return ref;
}
