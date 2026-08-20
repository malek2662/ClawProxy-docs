import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import AlibabaCloudColor from '@lobehub/icons/es/AlibabaCloud/components/Color';
import CerebrasColor from '@lobehub/icons/es/Cerebras/components/Color';
import CloudflareColor from '@lobehub/icons/es/Cloudflare/components/Color';
import CohereColor from '@lobehub/icons/es/Cohere/components/Color';
import DeepSeekColor from '@lobehub/icons/es/DeepSeek/components/Color';
import FireworksColor from '@lobehub/icons/es/Fireworks/components/Color';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import GroqMono from '@lobehub/icons/es/Groq/components/Mono';
import HunyuanColor from '@lobehub/icons/es/Hunyuan/components/Color';
import KiloCodeMono from '@lobehub/icons/es/KiloCode/components/Mono';
import KimiColor from '@lobehub/icons/es/Kimi/components/Color';
import MinimaxColor from '@lobehub/icons/es/Minimax/components/Color';
import MistralColor from '@lobehub/icons/es/Mistral/components/Color';
import MorphColor from '@lobehub/icons/es/Morph/components/Color';
import NvidiaColor from '@lobehub/icons/es/Nvidia/components/Color';
import OllamaMono from '@lobehub/icons/es/Ollama/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';
import PerplexityColor from '@lobehub/icons/es/Perplexity/components/Color';
import SiliconCloudColor from '@lobehub/icons/es/SiliconCloud/components/Color';
import TogetherColor from '@lobehub/icons/es/Together/components/Color';
import VeniceColor from '@lobehub/icons/es/Venice/components/Color';
import VercelMono from '@lobehub/icons/es/Vercel/components/Mono';
import VolcengineColor from '@lobehub/icons/es/Volcengine/components/Color';
import XAIMono from '@lobehub/icons/es/XAI/components/Mono';
import ZAIMono from '@lobehub/icons/es/ZAI/components/Mono';

// Brand glyphs resolved exactly like the app's ProviderIcon: Color variant
// where the brand ships one, the mono glyph (currentColor) otherwise.
const PROVIDERS = [
    { name: 'OpenAI', Icon: OpenAIMono },
    { name: 'Anthropic', Icon: AnthropicMono },
    { name: 'Google Gemini', Icon: GeminiColor },
    { name: 'OpenRouter', Icon: OpenRouterColor },
    { name: 'DeepSeek', Icon: DeepSeekColor },
    { name: 'xAI (Grok)', Icon: XAIMono },
    { name: 'Mistral', Icon: MistralColor },
    { name: 'Groq', Icon: GroqMono },
    { name: 'Cerebras', Icon: CerebrasColor },
    { name: 'Perplexity', Icon: PerplexityColor },
    { name: 'Cohere', Icon: CohereColor },
    { name: 'NVIDIA NIM', Icon: NvidiaColor },
    { name: 'Together AI', Icon: TogetherColor },
    { name: 'Fireworks AI', Icon: FireworksColor },
    { name: 'SiliconFlow', Icon: SiliconCloudColor },
    { name: 'Ollama', Icon: OllamaMono },
    { name: 'Kimi for Coding', Icon: KimiColor },
    { name: 'Z.AI', Icon: ZAIMono },
    { name: 'MiniMax', Icon: MinimaxColor },
    { name: 'Venice AI', Icon: VeniceColor },
    { name: 'Vercel AI Gateway', Icon: VercelMono },
    { name: 'OpenCode Zen', Icon: OpenCodeMono },
    { name: 'Kilo AI', Icon: KiloCodeMono },
    { name: 'Cloudflare Workers AI', Icon: CloudflareColor },
    { name: 'Alibaba Coding Plan', Icon: AlibabaCloudColor },
    { name: 'Tencent Hunyuan', Icon: HunyuanColor },
    { name: 'Volcengine Ark', Icon: VolcengineColor },
    { name: 'Morph', Icon: MorphColor },
];

function Monogram({ name }) {
    const letters = name
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('') || '?';
    return <span className="provider-chip">{letters}</span>;
}

// Matches the old CSS loop speed (one 28-provider copy per 44s).
const SPEED = 107;
// The strip scrolls slowly, so repainting it at full refresh rate is wasted
// work. Apply the transform at ~30fps — visually identical, half the cost.
const MIN_APPLY_MS = 1000 / 30;

// Recycled marquee: instead of scrolling one 9000px+ track (wider than GPU
// texture limits, forcing repaints), we render just enough items to cover the
// viewport and move the exiting item to the tail. The layer stays ~2 viewports
// wide, so the scroll is a cheap composited transform.
export default function ProvidersMarquee() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const offsetRef = useRef(0);
    const headWidthRef = useRef(0);

    const initialCount = Math.min(
        PROVIDERS.length,
        Math.max(
            10,
            Math.ceil(((typeof window !== 'undefined' ? window.innerWidth : 1440) + 500) / 160)
        )
    );

    const pointerRef = useRef(initialCount % PROVIDERS.length);
    const uidRef = useRef(initialCount);
    const hoverRef = useRef(false);
    const visibleRef = useRef(false);
    const runningRef = useRef(false);
    const rafRef = useRef(0);
    const lastRef = useRef(0);

    const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nextItem = useCallback(() => {
        const p = PROVIDERS[pointerRef.current];
        pointerRef.current = (pointerRef.current + 1) % PROVIDERS.length;
        return { ...p, uid: uidRef.current++ };
    }, []);

    const [queue, setQueue] = useState(() =>
        PROVIDERS.slice(0, initialCount).map((p, i) => ({ ...p, uid: i }))
    );

    const stop = useCallback(() => {
        runningRef.current = false;
        cancelAnimationFrame(rafRef.current);
    }, []);

    const start = useCallback(() => {
        if (runningRef.current || reduced) return;
        runningRef.current = true;
        lastRef.current = performance.now();
        let lastApply = 0;
        const loop = (now) => {
            if (!runningRef.current) return;
            const dt = Math.min((now - lastRef.current) / 1000, 0.05);
            lastRef.current = now;
            offsetRef.current -= SPEED * dt;

            if (now - lastApply >= MIN_APPLY_MS) {
                lastApply = now;
                const track = trackRef.current;
                if (track && headWidthRef.current && offsetRef.current <= -headWidthRef.current) {
                    const first = track.firstElementChild;
                    if (first) {
                        offsetRef.current += headWidthRef.current;
                        // Move the node synchronously so there is no one-frame gap,
                        // then sync React's model of the list.
                        track.appendChild(first);
                        setQueue((q) => [...q.slice(1), nextItem()]);
                    }
                }
                if (track) {
                    track.style.transform = `translateX(${offsetRef.current}px)`;
                }
            }
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
    }, [nextItem, reduced]);

    const updateRunState = useCallback(() => {
        if (visibleRef.current && !hoverRef.current && !document.hidden) {
            start();
        } else {
            stop();
        }
    }, [start, stop]);

    // Keep the queue wide enough to cover the viewport plus slack.
    useEffect(() => {
        const ensure = () => {
            const section = sectionRef.current;
            const track = trackRef.current;
            if (!section || !track || track.children.length === 0) return;
            const need = section.clientWidth + 400;
            const width = track.scrollWidth;
            if (width >= need || track.children.length >= PROVIDERS.length * 3) return;
            const avg = width / track.children.length;
            const addCount = Math.max(1, Math.ceil((need - width) / avg) + 1);
            setQueue((q) => [...q, ...Array.from({ length: addCount }, nextItem)]);
        };
        ensure();
        window.addEventListener('resize', ensure);
        return () => window.removeEventListener('resize', ensure);
    }, [nextItem]);

    // Track the head item width for seamless recycling.
    useEffect(() => {
        const first = trackRef.current && trackRef.current.firstElementChild;
        if (first) headWidthRef.current = first.offsetWidth;
    }, [queue]);

    // Run only while visible, unhovered, and the tab is focused.
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                visibleRef.current = entries[0].isIntersecting;
                updateRunState();
            },
            { rootMargin: '120px 0px' }
        );
        if (sectionRef.current) io.observe(sectionRef.current);
        const onVisibility = () => updateRunState();
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            io.disconnect();
            document.removeEventListener('visibilitychange', onVisibility);
            stop();
        };
    }, [updateRunState, stop]);

    return (
        <section ref={sectionRef} className="providers-strip" data-anim aria-label="Supported AI providers">
            <div className="container providers-strip-head">
                <span className="providers-strip-label">Works with 50 built-in provider presets</span>
                <Link to="/docs?tab=providerDirectory" className="link-arrow">
                    Browse the provider directory <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </div>
            <div
                className="providers-marquee"
                onMouseEnter={() => { hoverRef.current = true; updateRunState(); }}
                onMouseLeave={() => { hoverRef.current = false; updateRunState(); }}
            >
                <ul ref={trackRef} className="providers-marquee-track">
                    {queue.map((p) => (
                        <li key={p.uid} className="providers-marquee-item">
                            <span className="provider-icon">
                                {p.Icon ? <p.Icon size={20} title={p.name} /> : <Monogram name={p.name} />}
                            </span>
                            {p.name}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
