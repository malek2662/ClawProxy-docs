import React, { useEffect, useRef, useState } from 'react';
import { LayoutGrid, KeyRound, ShieldCheck, Network, AudioWaveform, Combine, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import { useCycle } from '../hooks/useCycle';

import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';
import DeepSeekColor from '@lobehub/icons/es/DeepSeek/components/Color';
import KimiColor from '@lobehub/icons/es/Kimi/components/Color';
import ZAIMono from '@lobehub/icons/es/ZAI/components/Mono';
import GroqMono from '@lobehub/icons/es/Groq/components/Mono';
import XAIMono from '@lobehub/icons/es/XAI/components/Mono';
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
    { name: 'OpenAI', model: 'gpt-5.6', Icon: OpenAIMono, latency: '0.8s' },
    { name: 'Gemini', model: 'gemini-3.7-flash', Icon: GeminiColor, latency: '1.1s' },
    { name: 'xAI', model: 'grok-4.5', Icon: XAIMono, latency: '0.6s' },
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
   6. Virtual Providers (Combos) — three provider stacks collapse
      into one combo endpoint. Single 9s CSS timeline.
   ============================================================ */

const VCB_SLOTS = [30, 50, 70];

const VCB_STACKS = [
    { id: 'k', name: 'Kimi', Icon: KimiColor, endpoint: 'api.moonshot.ai/v1', models: ['kimi-k2.5', 'kimi-k3', 'kimi-k2.7-code'] },
    { id: 'o', name: 'OpenAI', Icon: OpenAIMono, endpoint: 'api.openai.com/v1', models: ['gpt-5.5', 'gpt-5.6', 'gpt-5.6-terra'] },
    { id: 'd', name: 'Z.ai', Icon: ZAIMono, endpoint: 'api.z.ai/v1', models: ['glm-5.3', 'glm-5.3-flash', 'glm-5.2'] },
];

const VCB_SEL = [
    { id: 'kimi-k3', pre: 'kimi', alias: 'k3', from: 'k', tt: 30, gd: '6.9s' },
    { id: 'gpt-5.6', pre: 'openai', alias: 'gpt-5.6', from: 'o', tt: 50, gd: '7.3s' },
    { id: 'glm-5.3-flash', pre: 'zai', alias: 'glm-5.3-flash', from: 'd', tt: 70, gd: '7.7s' },
];

const VCB_WIRE_WIN = [
    [0.6, 0.7],
    [0.65, 0.75],
    [0.7, 0.8],
];

function ComboBoard() {
    const stageRef = useRef(null);
    const clientRef = useRef(null);
    const svgRef = useRef(null);
    const [geom, setGeom] = useState(null);

    useEffect(() => {
        const stage = stageRef.current;
        const client = clientRef.current;
        if (!stage || !client) return undefined;

        const measure = () => {
            const sr = stage.getBoundingClientRect();
            const cr = client.getBoundingClientRect();
            const ccPct = parseFloat(getComputedStyle(stage).getPropertyValue('--vcb-cc')) / 100;
            if (sr.width < 10 || !ccPct) return;
            const x0 = Math.round(cr.right - sr.left) + 1;
            const y0 = Math.round(cr.top + cr.height / 2 - sr.top);
            const x1 = Math.round(sr.width * ccPct) - 2;
            const lines = VCB_SLOTS.map((t) => {
                const y = Math.round((sr.height * t) / 100) + 11;
                const dx = Math.max(24, (x1 - x0) * 0.5);
                return { y, d: `M ${x0} ${y0} C ${x0 + dx} ${y0}, ${x1 - dx} ${y}, ${x1} ${y}` };
            });
            setGeom({ x0, y0, x1, lines });
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(stage);
        window.addEventListener('resize', measure);
        return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
    }, []);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return undefined;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) svg.unpauseAnimations();
            else svg.pauseAnimations();
        }, { rootMargin: '160px 0px' });
        io.observe(svg);
        return () => io.disconnect();
    }, [geom]);

    return (
        <div ref={stageRef} className="vcb-stage">
            {VCB_STACKS.map((s) => (
                <React.Fragment key={s.id}>
                    <span className={`vcb-endp vcb-col-${s.id}`}>{s.endpoint}</span>
                    <div className={`vcb-stack vcb-col-${s.id}`}>
                        <span className="vcb-stack-head"><s.Icon size={13} />{s.name}</span>
                    </div>
                    {s.models.map((m, i) => (i === 1 ? null : (
                        <span key={m} className={`vcb-row vcb-col-${s.id}`} style={{ top: `${VCB_SLOTS[i]}%` }}>
                            <span className="vcb-chip">{m}</span>
                        </span>
                    )))}
                </React.Fragment>
            ))}
            <div className="vcb-combo">
                <span className="vcb-combo-top">
                    <span className="vcb-combo-head">coding-stack</span>
                    <span className="vcb-combo-sub">combo · one endpoint</span>
                </span>
            </div>
            <span className="vcb-endp vcb-endp-combo">/proxy/coding-stack/v1</span>
            {VCB_SEL.map((r) => (
                <span
                    key={r.id}
                    className={`vcb-sel vcb-from-${r.from}`}
                    style={{ '--ft': '50%', '--tt': `${r.tt}%`, '--gd': r.gd }}
                >
                    <span className="vcb-chip">
                        <span className="vcb-sel-id">{r.id}</span>
                        <span className="vcb-sel-alias"><span className="vcb-sel-pre">{r.pre}/</span>{r.alias}</span>
                    </span>
                </span>
            ))}
            <span ref={clientRef} className="vcb-client">
                <img src={clawLogo} alt="" />
                <span>client</span>
            </span>
            {geom && (
                <svg ref={svgRef} className="vcb-svg" aria-hidden="true">
                    {geom.lines.map((l, i) => (
                        <path key={i} id={`vcb-line-${i}`} className="vcb-link" d={l.d} pathLength={1} />
                    ))}
                    <circle cx={geom.x0} cy={geom.y0} r={2.6} className="vcb-port" />
                    {geom.lines.map((l, i) => (
                        <circle key={i} cx={geom.x1} cy={l.y} r={2.6} className="vcb-port" />
                    ))}
                    {geom.lines.map((l, i) => {
                        const [a, b] = VCB_WIRE_WIN[i];
                        return (
                            <circle key={i} r={2.4} className="vcb-pkt" opacity={0}>
                                <animateMotion
                                    dur="9s"
                                    repeatCount="indefinite"
                                    calcMode="linear"
                                    keyPoints="0;0;1;1"
                                    keyTimes={`0;${a};${b};1`}
                                >
                                    <mpath href={`#vcb-line-${i}`} />
                                </animateMotion>
                                <animate
                                    attributeName="opacity"
                                    dur="9s"
                                    repeatCount="indefinite"
                                    values="0;0;1;1;0;0"
                                    keyTimes={`0;${a};${a + 0.02};${b - 0.02};${b};1`}
                                />
                            </circle>
                        );
                    })}
                </svg>
            )}
            <div className="vcb-type">
                <div className="vcb-msg vcb-msg-a">
                    <span className="vcb-k">One URL.</span>
                    <span className="vcb-s">Every model you need behind it — Kimi, OpenAI, DeepSeek.</span>
                </div>
                <div className="vcb-msg vcb-msg-b">
                    <span className="vcb-k">Failover, built in.</span>
                    <span className="vcb-s">Priority order at the router, alias by alias — not in your code.</span>
                </div>
                <div className="vcb-msg vcb-msg-c">
                    <span className="vcb-k">Any format.</span>
                    <span className="vcb-s">Chat, Responses, Gemini, Claude — the right format out.</span>
                </div>
                <Link to="/docs?tab=virtualProviders" className="vcb-more link-arrow">
                    Explore the combos <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
}

/* ============================================================
   Section
   ============================================================ */

function CapCard({ span2 = false, span3 = false, delay = 0, icon, title, desc, children }) {
    return (
        <Reveal className={`cap-card glow-card${span2 ? ' cap-span-2' : ''}${span3 ? ' cap-span-3' : ''}`} delay={delay}>
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
                    <CapCard
                        span3
                        delay={0}
                        icon={<Combine size={19} aria-hidden="true" />}
                        title={<>
                            <span className="cap-combo">
                                <span className="cap-combo-c">C</span>
                                <em className="cap-accent">ombos</em>
                            </span>
                            <span className="cap-combo-sep">:</span>
                            One endpoint, <em className="cap-accent">every model</em>
                        </>}
                        desc="Kimi, OpenAI, DeepSeek and more behind one virtual provider — one client entry, every model."
                    >
                        <ComboBoard />
                    </CapCard>
                </div>
            </div>
        </section>
    );
}
