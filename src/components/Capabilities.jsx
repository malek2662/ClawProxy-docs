import React, { useEffect, useRef, useState } from 'react';
import { LayoutGrid, KeyRound, ShieldCheck, Network, AudioWaveform } from 'lucide-react';
import Reveal from './Reveal';
import { useCycle } from '../hooks/useCycle';

import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';
import DeepSeekColor from '@lobehub/icons/es/DeepSeek/components/Color';
import GroqMono from '@lobehub/icons/es/Groq/components/Mono';
import OllamaMono from '@lobehub/icons/es/Ollama/components/Mono';
import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';

import clawLogo from '../assets/claw-logo.svg';

/* ============================================================
   1. 50 Provider Presets — a still of the actual Quick Setup
      picker. Static by design: zero CPU, pure information.
   ============================================================ */

const PRESETS = [
    { name: 'OpenRouter', tag: 'free tier', free: true, Icon: OpenRouterColor },
    { name: 'Gemini', tag: 'free tier', free: true, Icon: GeminiColor },
    { name: 'Groq', tag: 'free tier', free: true, Icon: GroqMono },
    { name: 'Ollama', tag: 'local · keyless', free: true, Icon: OllamaMono },
    { name: 'OpenCode Zen', tag: 'keyless', free: true, Icon: OpenCodeMono },
    { name: 'OpenAI', tag: 'api key', Icon: OpenAIMono },
    { name: 'Anthropic', tag: 'api key', Icon: AnthropicMono },
    { name: 'DeepSeek', tag: 'api key', Icon: DeepSeekColor },
];

function PresetGrid() {
    return (
        <div className="preset-panel" aria-hidden="true">
            <div className="preset-head">
                <span className="preset-label">Quick Setup</span>
                <span className="preset-search">Search 50 providers…</span>
            </div>
            <div className="preset-grid">
                {PRESETS.map((p) => (
                    <div key={p.name} className="preset-tile">
                        <span className="preset-ico"><p.Icon size={19} /></span>
                        <span className="preset-name">{p.name}</span>
                        <span className={`preset-tag${p.free ? ' preset-tag-free' : ''}`}>{p.tag}</span>
                    </div>
                ))}
            </div>
            <div className="preset-foot">
                <span className="preset-more">+42 more presets</span>
                <span className="preset-hint">no config files — one click each</span>
            </div>
        </div>
    );
}

/* ============================================================
   2. Smart Key Rotation — active key cycles with glider
   ============================================================ */

const KR_KEYS = [
    { label: 'Key 1', masked: 'cr_····8f2a' },
    { label: 'Key 2', masked: 'cr_····k9xm' },
    { label: 'Key 3', masked: 'cr_····q4p1' },
    { label: 'Key 4', masked: 'cr_····z7d3' },
];

function KeyRotation() {
    const active = useCycle(KR_KEYS.length, 1700);
    return (
        <div className="kr-stage" aria-hidden="true">
            <div className="kr-list">
                <span className="kr-glider" style={{ transform: `translateY(${active * 40}px)` }} />
                {KR_KEYS.map((k, i) => (
                    <div key={k.label} className={`kr-row${i === active ? ' on' : ''}`}>
                        <span className="kr-dot" />
                        <span className="kr-name">{k.label}</span>
                        <span className="kr-masked">{k.masked}</span>
                        <span className="kr-tag">200</span>
                    </div>
                ))}
            </div>
            <div className="kr-foot">
                <span className="cap-badge">Round-Robin</span>
                <span className="kr-foot-hint">next key every request</span>
            </div>
        </div>
    );
}

/* ============================================================
   3. Advanced Failover — chain degrades then recovers
   ============================================================ */

const FO_ROWS = [
    { name: 'OpenAI', model: 'gpt-4o-mini', Icon: OpenAIMono, latency: '0.8s' },
    { name: 'Gemini', model: 'gemini-2.0-flash', Icon: GeminiColor, latency: '1.1s' },
    { name: 'Groq', model: 'llama-3.3-70b', Icon: GroqMono, latency: '0.6s' },
];

function Failover() {
    const stage = useCycle(4, 2500);
    const activeIdx = stage === 0 || stage === 3 ? 0 : stage;
    const recovered = stage === 3;

    return (
        <div className="fo-stage" aria-hidden="true">
            <div className="fo-list">
                <span className="fo-chain" />
                {FO_ROWS.map((r, i) => {
                    const failed = !recovered && i < activeIdx;
                    const on = i === activeIdx;
                    const state = failed ? 'bad' : on ? (recovered ? 'rec' : 'on') : 'idle';
                    return (
                        <div key={r.name} className={`fo-row fo-${state}`}>
                            <span className="fo-dot" />
                            <span className="fo-icon"><r.Icon size={15} /></span>
                            <span className="fo-text">
                                <span className="fo-name">{r.name}{i === 0 && <em className="fo-primary">primary</em>}</span>
                                <span className="fo-model">{r.model}</span>
                            </span>
                            <span className="fo-status">
                                {failed && 'circuit open'}
                                {on && !recovered && `200 · ${r.latency}`}
                                {on && recovered && 'recovered'}
                                {!failed && !on && 'standby'}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="fo-foot">
                <span className="cap-badge">Fallback chain</span>
                <span className="fo-foot-hint">cross-format failover</span>
            </div>
        </div>
    );
}

/* ============================================================
   4. Multi-Provider Routing — one client fans out to endpoints
   ============================================================ */

const RT_PATHS = [
    { id: 'openai', d: 'M 95 100 C 138 100, 156 30, 200 30', end: [200, 30], label: '/proxy/openai', begin: '0s' },
    { id: 'anthropic', d: 'M 95 100 L 200 100', end: [200, 100], label: '/proxy/anthropic', begin: '0.9s' },
    { id: 'gemini', d: 'M 95 100 C 138 100, 156 170, 200 170', end: [200, 170], label: '/proxy/gemini', begin: '1.8s' },
];

function Routing() {
    const svgRef = useRef(null);

    // SMIL animateMotion is not affected by animation-play-state — pause the
    // SVG timeline itself while the card is offscreen.
    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return undefined;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) svg.unpauseAnimations();
            else svg.pauseAnimations();
        }, { rootMargin: '160px 0px' });
        io.observe(svg);
        return () => io.disconnect();
    }, []);

    return (
        <div className="rt-stage" aria-hidden="true">
            <svg ref={svgRef} className="rt-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet">
                {RT_PATHS.map((p) => (
                    <path key={p.id} id={`rt-path-${p.id}`} className="rt-link" d={p.d} />
                ))}
                <circle cx={95} cy={100} r={2.6} className="rt-port" />
                {RT_PATHS.map((p) => (
                    <circle key={`port-${p.id}`} cx={p.end[0]} cy={p.end[1]} r={2.6} className="rt-port" />
                ))}
                {RT_PATHS.map((p) => (
                    <circle key={`pkt-${p.id}`} r={2.4} className="rt-packet" style={{ '--begin': p.begin }}>
                        <animateMotion dur="2.7s" begin={p.begin} repeatCount="indefinite">
                            <mpath href={`#rt-path-${p.id}`} />
                        </animateMotion>
                    </circle>
                ))}
            </svg>
            <span className="rt-chip rt-chip-client">
                <img src={clawLogo} alt="" />
                <span>client</span>
            </span>
            {RT_PATHS.map((p, i) => (
                <span key={p.id} className="rt-chip rt-chip-p" style={{ top: `${[15, 50, 85][i]}%` }}>
                    <span>{p.label}</span>
                </span>
            ))}
        </div>
    );
}

/* ============================================================
   5. Zero-Buffer Streaming — live token typewriter
   ============================================================ */

const STREAM_TEXT = 'Streaming tokens as they arrive — zero buffering, zero added latency.';

function Streaming() {
    const stageRef = useRef(null);
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const [chars, setChars] = useState(reduced ? STREAM_TEXT.length : 0);

    useEffect(() => {
        if (reduced) return undefined;
        let timer = null;
        let i = 0;
        let running = false;

        const stop = () => {
            if (timer !== null) { clearInterval(timer); clearTimeout(timer); timer = null; }
            running = false;
        };
        const start = () => {
            if (running) return;
            running = true;
            const tick = () => {
                timer = setInterval(() => {
                    i += 1;
                    setChars(i);
                    if (i >= STREAM_TEXT.length) {
                        clearInterval(timer);
                        timer = setTimeout(() => { i = 0; setChars(0); tick(); }, 2800);
                    }
                }, 34);
            };
            tick();
        };

        // The typewriter only runs while its card is actually on screen.
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) start();
            else stop();
        }, { rootMargin: '120px 0px' });
        io.observe(stageRef.current);
        return () => { stop(); io.disconnect(); };
    }, [reduced]);

    return (
        <div ref={stageRef} className="sv-stage" aria-hidden="true">
            <div className="sv-term">
                <div className="sv-head">
                    <span className="sv-dots"><i /><i /><i /></span>
                    <span className="sv-tag">stream</span>
                    <span className="sv-count">{Math.floor(chars / 4)} tok</span>
                </div>
                <div className="sv-body">
                    <span className="sv-line"><span className="sv-prompt">❯</span> POST /proxy/openai/v1/chat/completions</span>
                    <span className="sv-stream">
                        {STREAM_TEXT.slice(0, chars)}
                        <span className="sv-cursor" />
                    </span>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   Section
   ============================================================ */

function CapCard({ span2 = false, delay = 0, icon, title, desc, children }) {
    return (
        <Reveal className={`cap-card glow-card${span2 ? ' cap-span-2' : ''}`} delay={delay}>
            <div className="cap-text">
                <div className="cap-head">
                    <span className="cap-icon-tile">{icon}</span>
                    <h3 className="cap-title">{title}</h3>
                </div>
                <p className="cap-desc">{desc}</p>
            </div>
            <div className="cap-visual">{children}</div>
        </Reveal>
    );
}

export default function Capabilities() {
    return (
        <section className="section" data-anim>
            <div className="container">
                <Reveal className="section-head">
                    <div className="section-eyebrow">Reliability engineering</div>
                    <h2 className="section-title">Uninterrupted <span className="accent">continuity</span></h2>
                    <p className="section-desc">Built to handle the chaotic nature of AI APIs safely and securely.</p>
                </Reveal>
                <div className="cap-grid">
                    <CapCard
                        span2
                        delay={0}
                        icon={<LayoutGrid size={19} aria-hidden="true" />}
                        title={<>Every provider, <em className="cap-accent">one click</em> away</>}
                        desc="One-click setup for 50 providers — including free-tier options like OpenRouter, Gemini and Groq, plus keyless presets that need no signup at all."
                    >
                        <PresetGrid />
                    </CapCard>
                    <CapCard
                        delay={80}
                        icon={<KeyRound size={19} aria-hidden="true" />}
                        title={<>Smart <em className="cap-accent">Key Rotation</em></>}
                        desc="Multiple API keys per provider, load-balanced with On-Error Backoff and Round-Robin."
                    >
                        <KeyRotation />
                    </CapCard>
                    <CapCard
                        delay={0}
                        icon={<ShieldCheck size={19} aria-hidden="true" />}
                        title={<>Advanced <em className="cap-accent">Failover</em></>}
                        desc="Model-level fallback and cross-format provider chains keep responses flowing through any outage."
                    >
                        <Failover />
                    </CapCard>
                    <CapCard
                        delay={80}
                        icon={<Network size={19} aria-hidden="true" />}
                        title={<>Multi-Provider <em className="cap-accent">Routing</em></>}
                        desc="Per-provider endpoints — manage OpenAI, Anthropic, Gemini and more from a single interface."
                    >
                        <Routing />
                    </CapCard>
                    <CapCard
                        delay={160}
                        icon={<AudioWaveform size={19} aria-hidden="true" />}
                        title={<>Zero-Buffer <em className="cap-accent">Streaming</em></>}
                        desc="Native streaming pass-through delivers tokens instantly — even across translated formats."
                    >
                        <Streaming />
                    </CapCard>
                </div>
            </div>
        </section>
    );
}
