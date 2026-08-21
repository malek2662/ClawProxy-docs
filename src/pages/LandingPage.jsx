import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowLeftRight, Shield, Zap, RefreshCw, Server, Settings, Sparkles, X, Lock, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TerminalWindow from '../components/TerminalWindow';
import ProvidersMarquee from '../components/ProvidersMarquee';
import StatCell from '../components/StatCell';
import ClientProviderDiagram from '../components/ClientProviderDiagram';
import Capabilities from '../components/Capabilities';
import CommandCenter from '../components/CommandCenter';
import HowItWorks from '../components/HowItWorks';
import Pricing from '../components/Pricing';
import Faq from '../components/Faq';
import { useGlowCards } from '../hooks/useGlowCards';
import { useTilt } from '../hooks/useTilt';

const STATS = [
    { num: '50', suffix: '', label: 'Provider presets built in' },
    { num: '4', suffix: '', label: 'API formats translated' },
    { num: '7', suffix: '', label: 'AI client setups generated' },
    { num: '100', suffix: '%', label: 'Data stored locally' }
];

// Intrinsic sizes of every screenshot below. Passed to <img> so the browser
// reserves the exact box before lazy images decode — no layout shift while
// scrolling (which would also throw off scrollIntoView targets).
const SHOT_DIMS = {
    'assets/screenshots/providers-list.png': [2880, 1800],
    'assets/screenshots/provider-keys.png': [2880, 1800],
    'assets/screenshots/providers-presets.png': [2880, 1800],
    'assets/screenshots/provider-fallback.png': [2880, 1800],
    'assets/screenshots/provider-models.png': [2880, 1800],
    'assets/screenshots/provider-quota.png': [2880, 1800],
    'assets/screenshots/providers-ai1.png': [1863, 958],
    'assets/screenshots/providers-ai2.png': [1863, 958],
    'assets/screenshots/settings.png': [1699, 952]
};

function shotDims(src) {
    const d = SHOT_DIMS[src];
    return d ? { width: d[0], height: d[1] } : {};
}

function Shot({ src, alt, onZoom, className = '' }) {
    return (
        <button type="button" className={`media-frame${className ? ` ${className}` : ''}`} onClick={() => onZoom(src)} aria-label={`Enlarge screenshot: ${alt}`}>
            <img src={src} alt={alt} loading="lazy" {...shotDims(src)} />
        </button>
    );
}

function BrowserShot({ src, alt, url, onZoom, className = '' }) {
    return (
        <button type="button" className={`media-frame browser-frame${className ? ` ${className}` : ''}`} onClick={() => onZoom(src)} aria-label={`Enlarge screenshot: ${alt}`}>
            <span className="browser-bar" aria-hidden="true">
                <span className="browser-dots"><i /><i /><i /></span>
                <span className="browser-url"><Lock size={10} aria-hidden="true" /> {url}</span>
            </span>
            <img src={src} alt={alt} loading="lazy" {...shotDims(src)} />
        </button>
    );
}

function Showcase({ eyebrow, title, children, media, reverse = false, tint = false }) {
    return (
        <section className={`section${tint ? ' section-tint' : ''}`}>
            <div className={`container showcase-grid${reverse ? ' showcase-reverse' : ''}`}>
                <Reveal className="showcase-text">
                    <div className="section-eyebrow">{eyebrow}</div>
                    <h2 className="showcase-title">{title}</h2>
                    {children}
                </Reveal>
                <Reveal className="showcase-media reveal-scale" delay={120}>
                    {media}
                </Reveal>
            </div>
        </section>
    );
}

function ShowcaseWide({ eyebrow, title, desc, list, link, media, tint = false }) {
    return (
        <section className={`section${tint ? ' section-tint' : ''}`}>
            <div className="container showcase-wide">
                <Reveal className="section-head center">
                    <div className="section-eyebrow">{eyebrow}</div>
                    <h2 className="section-title">{title}</h2>
                    <p className="section-desc">{desc}</p>
                    <ul className="showcase-list showcase-list-center">
                        {list.map((item) => (
                            <li key={item.text}>
                                <span className="list-dot">{item.icon}</span> {item.text}
                            </li>
                        ))}
                    </ul>
                    {link && (
                        <Link to={link.to} className="link-arrow">
                            {link.label} <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    )}
                </Reveal>
                <Reveal className="showcase-wide-media reveal-scale" delay={120}>
                    {media}
                </Reveal>
            </div>
        </section>
    );
}

export default function LandingPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const rootRef = useRef(null);
    const tiltRef = useTilt(4);
    useGlowCards(rootRef);

    // Prevent body scroll when image lightbox is open
    useEffect(() => {
        document.body.style.overflow = selectedImage ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedImage]);

    // Close lightbox on Escape
    useEffect(() => {
        if (!selectedImage) return;
        const handler = (e) => { if (e.key === 'Escape') setSelectedImage(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedImage]);

    // Pause every CSS animation inside sections that are offscreen. The page
    // keeps its full motion design where you look, and drops to near-zero
    // idle CPU everywhere else. Targets carry static classNames, so toggling
    // the marker class never fights React.
    useEffect(() => {
        const targets = rootRef.current ? rootRef.current.querySelectorAll('[data-anim]') : [];
        if (!targets.length) return undefined;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) e.target.classList.toggle('anim-offscreen', !e.isIntersecting);
            },
            { rootMargin: '160px 0px' }
        );
        targets.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div ref={rootRef}>
            {/* ============ Hero ============ */}
            <section className="hero-section" data-anim>
                <span className="hero-glow hero-glow-a" aria-hidden="true" />
                <span className="hero-glow hero-glow-b" aria-hidden="true" />
                <div className="hero-grid">
                    <div className="hero-copy">
                        <span className="hero-eyebrow hero-a1"><i aria-hidden="true" /> One-time purchase — $20 lifetime license</span>
                        <h1 className="hero-title hero-a2">
                            Self-hosted <span className="accent">AI Routing Gateway</span>
                        </h1>
                        <p className="hero-lead hero-a3">
                            Route, manage, and monitor your AI API requests across multiple providers from a single endpoint. Automatic format translation means <strong>any AI client works with any provider</strong> — with absolute control over your API keys, routing rules, and application stability.
                        </p>
                        <div className="hero-cta-row hero-a4">
                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({
                                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                                    block: 'start'
                                })}
                            >
                                Get Lifetime Access — $20
                            </button>
                            <Link to="/docs" className="btn-secondary">
                                Documentation <ArrowRight size={15} aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="hero-meta hero-a5">
                            <span><Shield size={13} aria-hidden="true" /> Secure checkout powered by Polar</span>
                            <span><Server size={13} aria-hidden="true" /> Linux · macOS · Windows</span>
                            <span><Zap size={13} aria-hidden="true" /> Dashboard at localhost:3030</span>
                        </div>
                    </div>
                    <div className="hero-term hero-a6">
                        <div className="tilt-wrap" ref={tiltRef}>
                            <TerminalWindow />
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ Providers marquee ============ */}
            <ProvidersMarquee />

            {/* ============ Any Client ↔ Any Provider ============ */}
            <section className="section section-tint" data-anim>
                <div className="container diagram-grid">
                    <Reveal className="diagram-copy">
                        <div className="section-eyebrow">Format translation</div>
                        <h2 className="section-title">Any client <span className="accent">↔</span> any provider</h2>
                        <p className="showcase-body">
                            Stop worrying about API formats. Claude Code, OpenCode, Codex, Cline, OpenClaw — every AI client connects to ClawRouter the same way, and ClawRouter speaks to every provider in its native format. Requests and responses are translated automatically, streaming included, in both directions.
                        </p>
                        <ul className="showcase-list">
                            <li><span className="list-dot"><ArrowLeftRight size={14} aria-hidden="true" /></span> Full fidelity: tools, reasoning, usage & images</li>
                            <li><span className="list-dot"><Zap size={14} aria-hidden="true" /></span> Zero-copy passthrough when formats match</li>
                        </ul>
                        <Link to="/docs?tab=formatTranslation" className="link-arrow">
                            How format translation works <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </Reveal>
                    <Reveal className="diagram-visual reveal-scale" delay={120}>
                        <ClientProviderDiagram />
                    </Reveal>
                </div>
            </section>

            {/* ============ Stats ============ */}
            <section className="stats-strip" data-anim aria-label="Key numbers">
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((s, i) => (
                            <StatCell key={s.label} num={s.num} suffix={s.suffix} label={s.label} delay={i * 90} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ Capabilities (animated bento) ============ */}
            <Capabilities />

            {/* ============ Providers Management ============ */}
            <Showcase
                eyebrow="Providers"
                title="Manage Multiple Providers"
                reverse
                media={
                    <div className="media-stack">
                        <BrowserShot src="assets/screenshots/providers-list.png" url="localhost:3030/providers" alt="Providers Management" onZoom={setSelectedImage} />
                        <Shot src="assets/screenshots/provider-keys.png" alt="Provider API Keys with rotation status" onZoom={setSelectedImage} className="media-frame-secondary" />
                    </div>
                }
            >
                <p className="showcase-body">
                    Add multiple API providers easily. ClawRouter speaks all four major API formats — OpenAI Completions, OpenAI Responses, Anthropic Messages, and Google Gemini — and translates between them automatically. Add, rotate, and monitor API keys with automatic error tracking and seamless fallback mechanisms.
                </p>
                <Link to="/docs?tab=providerDirectory" className="link-arrow">
                    Read the documentation <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ Quick Setup Templates ============ */}
            <Showcase
                eyebrow="Onboarding"
                title="Quick Setup Templates"
                tint
                media={<BrowserShot src="assets/screenshots/providers-presets.png" url="localhost:3030/providers" alt="Quick Setup Templates" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    Get up and running in seconds with <strong>50 built-in provider presets</strong> — including free-tier providers like OpenRouter, Google Gemini, Groq and Cerebras, plus keyless options like OpenCode Zen and Kilo AI that need no signup at all. Select a preset, add your API key if required, and you're ready to start routing.
                </p>
                <Link to="/docs?tab=firstProvider&anchor=add-a-provider-via-quick-setup" className="link-arrow">
                    View provider templates <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ Command center (sticky scroll) ============ */}
            <CommandCenter onZoom={setSelectedImage} />

            {/* ============ Advanced Failover & Fallback ============ */}
            <Showcase
                eyebrow="Redundancy"
                title="Advanced Failover & Fallback"
                reverse
                tint
                media={
                    <div className="media-stack">
                        <BrowserShot src="assets/screenshots/provider-fallback.png" url="localhost:3030/providers" alt="Provider Fallback Chain Configuration" onZoom={setSelectedImage} />
                        <Shot src="assets/screenshots/provider-models.png" alt="Model Fallback Configuration" onZoom={setSelectedImage} className="media-frame-secondary" />
                    </div>
                }
            >
                <p className="showcase-body">
                    Ensure maximum uptime with multi-layered redundancy. ClawRouter handles both model-level unavailability and total provider outages seamlessly.
                </p>
                <div className="notif-list">
                    <div className="notif-item">
                        <span className="list-dot"><RefreshCw size={14} aria-hidden="true" /></span>
                        <div>
                            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Model Fallback</strong>
                            <span className="notif-desc">Silently retry with alternative models within the same provider if the primary model is unavailable.{' '}
                                <Link to="/docs?tab=modelFallback" className="link-arrow" style={{ fontSize: '0.88rem' }}>Learn more <ArrowRight size={12} aria-hidden="true" /></Link>
                            </span>
                        </div>
                    </div>
                    <div className="notif-item">
                        <span className="list-dot"><Shield size={14} aria-hidden="true" /></span>
                        <div>
                            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Provider Fallback Chain</strong>
                            <span className="notif-desc">Configure prioritized chains of backup providers. Any provider can back up any other — even with a different API format — because ClawRouter translates between formats automatically.{' '}
                                <Link to="/docs?tab=providerFallback" className="link-arrow" style={{ fontSize: '0.88rem' }}>Learn more <ArrowRight size={12} aria-hidden="true" /></Link>
                            </span>
                        </div>
                    </div>
                </div>
            </Showcase>

            {/* ============ Quota tracking ============ */}
            <Showcase
                eyebrow="Quota tracking"
                title="Know your limits before you hit them"
                reverse
                media={<BrowserShot src="assets/screenshots/provider-quota.png" url="localhost:3030/providers" alt="Per-key quota windows for a subscription provider" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    Subscription providers like Kimi for Coding and Z.AI GLM Coding report live quota windows — 5-hour, weekly and monthly cycles. ClawRouter probes every key and shows exactly how much headroom each one has left, and when it resets.
                </p>
                <ul className="showcase-list">
                    <li><span className="list-dot"><Gauge size={14} aria-hidden="true" /></span> Per-key quota cards with reset countdowns</li>
                    <li><span className="list-dot"><RefreshCw size={14} aria-hidden="true" /></span> Exhausted keys back off until their window resets — then recover automatically</li>
                </ul>
            </Showcase>

            {/* ============ AI Prompt Assistant ============ */}
            <Showcase
                eyebrow="Automation"
                title={<><Sparkles size={26} aria-hidden="true" /> AI Prompt Assistant</>}
                tint
                media={
                    <div className="media-stack">
                        <Shot src="assets/screenshots/providers-ai2.png" alt="AI Prompt Assistant Feature" onZoom={setSelectedImage} />
                        <Shot src="assets/screenshots/providers-ai1.png" alt="AI Assistant Prompt Generation" onZoom={setSelectedImage} className="media-frame-secondary" />
                    </div>
                }
            >
                <p className="showcase-body">
                    Configure your AI agents with zero effort. The smart Prompt Assistant generates tailor-made setup instructions for <strong>7 clients — OpenClaw, OpenCode, Claude Code, Codex CLI, Cline, Aider, and custom tools — for every provider you add</strong>, with the correct model IDs, connection settings, and your proxy API key embedded automatically.
                </p>
                <ul className="showcase-list">
                    <li><span className="list-dot"><Zap size={14} aria-hidden="true" /></span> One-click configuration prompts for every provider</li>
                    <li><span className="list-dot"><RefreshCw size={14} aria-hidden="true" /></span> Auto-discovery of upstream model IDs</li>
                    <li><span className="list-dot"><Shield size={14} aria-hidden="true" /></span> Proxy API key embedded automatically</li>
                </ul>
                <Link to="/docs?tab=aiClientSetup" className="link-arrow">
                    How to use the AI Assistant <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ Global Settings (wide) ============ */}
            <ShowcaseWide
                eyebrow="Control plane"
                title={<><Settings size={26} aria-hidden="true" /> Global Settings</>}
                desc="Fine-tune every aspect of your router from a single settings panel. Configure global behavior including retry policies, circuit breaker thresholds, rate limiting, and security — all without touching config files."
                list={[
                    { icon: <RefreshCw size={14} aria-hidden="true" />, text: 'Retry & circuit breaker configuration' },
                    { icon: <Shield size={14} aria-hidden="true" />, text: 'Proxy API key & dashboard password security' },
                    { icon: <Zap size={14} aria-hidden="true" />, text: 'Rate limit backoff & failover tuning' },
                    { icon: <Server size={14} aria-hidden="true" />, text: 'Logging, notifications & routing behavior' }
                ]}
                link={{ to: '/docs?tab=globalSettings', label: 'Learn about settings' }}
                media={<Shot src="assets/screenshots/settings.png" alt="Global Settings Panel" onZoom={setSelectedImage} />}
            />

            {/* ============ How it works ============ */}
            <HowItWorks />

            {/* ============ Pricing ============ */}
            <Pricing />

            {/* ============ FAQ ============ */}
            <Faq />

            {/* ============ Lightbox ============ */}
            {selectedImage && createPortal(
                <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                        aria-label="Close preview"
                    >
                        <X size={22} aria-hidden="true" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Screenshot preview"
                        className="lightbox-img"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </div>
    );
}
