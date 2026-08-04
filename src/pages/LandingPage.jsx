import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowLeftRight, Shield, Zap, Layers, RefreshCw, Server, Bell, Settings, Sparkles, X, Lock, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal';
import TerminalWindow from '../components/TerminalWindow';
import ProvidersMarquee from '../components/ProvidersMarquee';
import StatCell from '../components/StatCell';
import ClientProviderDiagram from '../components/ClientProviderDiagram';

const FEATURES = [
    {
        title: '50 Provider Presets',
        desc: 'One-click setup for 50 providers — including free-tier options like OpenRouter, Gemini and Groq, plus keyless presets that need no signup at all.',
        icon: Zap
    },
    {
        title: 'Any Client, Any Provider',
        desc: 'Automatic translation between OpenAI, Responses, Anthropic and Gemini API formats. Any AI client works with any provider — byte-identical passthrough when formats match.',
        icon: ArrowLeftRight
    },
    {
        title: 'Smart Key Rotation',
        desc: 'Add multiple API keys to a single provider. ClawRouter intelligently load-balances them with On-Error Backoff and Round-Robin.',
        icon: RefreshCw
    },
    {
        title: 'Advanced Failover',
        desc: 'Model-level fallback and cross-format provider failover chains keep your AI brain thinking even during outages — any provider can back up any other.',
        icon: Shield
    },
    {
        title: 'Multi-Provider Routing',
        desc: 'Route requests via per-provider endpoints. Manage OpenAI, Anthropic, Gemini and more from a single interface.',
        icon: Layers
    },
    {
        title: 'Zero-Buffer Streaming',
        desc: 'Native streaming pass-through ensures your AI responses are delivered instantly with zero artificial lag — even across translated formats.',
        icon: Zap
    },
    {
        title: 'Real-time Dashboard & Alerts',
        desc: 'Professional dark-themed dashboard with live WebSocket logs and instant alerts for key rotations, circuit breakers, and fallback activations.',
        icon: Bell
    },
    {
        title: 'Global Settings & Security',
        desc: 'Centralized panel for retry policies, circuit breakers, rate limiting — plus built-in security with dashboard password and proxy API key authentication.',
        icon: Settings
    }
];

const STATS = [
    { num: '50', suffix: '', label: 'Provider presets built in' },
    { num: '4', suffix: '', label: 'API formats translated' },
    { num: '7', suffix: '', label: 'AI client setups generated' },
    { num: '100', suffix: '%', label: 'Data stored locally' }
];

function Shot({ src, alt, onZoom, className = '' }) {
    return (
        <button type="button" className={`media-frame${className ? ` ${className}` : ''}`} onClick={() => onZoom(src)} aria-label={`Enlarge screenshot: ${alt}`}>
            <img src={src} alt={alt} loading="lazy" />
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
            <img src={src} alt={alt} loading="lazy" />
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

export default function LandingPage() {
    const [selectedImage, setSelectedImage] = useState(null);

    // Attach Polar checkout overlay to [data-polar-checkout] elements after React render
    useEffect(() => {
        if (window.Polar?.EmbedCheckout) {
            window.Polar.EmbedCheckout.init();
        }
    }, []);

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

    return (
        <div>
            {/* ============ Hero ============ */}
            <section className="hero-section">
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
                            <a href="https://buy.polar.sh/polar_cl_8wTBwKsDWMEVH5yLL4uQo2GMOPhE6V0cOytzu41fw3t" data-polar-checkout data-polar-checkout-theme="dark" className="btn-primary">
                                Get Lifetime Access — $20
                            </a>
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
                        <TerminalWindow />
                    </div>
                </div>
            </section>

            {/* ============ Providers marquee ============ */}
            <ProvidersMarquee />

            {/* ============ Stats ============ */}
            <section className="stats-strip" aria-label="Key numbers">
                <div className="container">
                    <div className="stats-grid">
                        {STATS.map((s, i) => (
                            <StatCell key={s.label} num={s.num} suffix={s.suffix} label={s.label} delay={i * 90} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ Features ============ */}
            <section className="section">
                <div className="container">
                    <Reveal className="section-head">
                        <div className="section-eyebrow">Reliability engineering</div>
                        <h2 className="section-title">Uninterrupted <span className="accent">continuity</span></h2>
                        <p className="section-desc">Built to handle the chaotic nature of AI APIs safely and securely.</p>
                    </Reveal>
                    <div className="feature-grid">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <Reveal key={feature.title} className="feature-card" delay={(index % 4) * 70}>
                                    <span className="feature-icon-tile"><Icon size={18} aria-hidden="true" /></span>
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-desc">{feature.desc}</p>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============ Any Client ↔ Any Provider ============ */}
            <section className="section section-tint">
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

            {/* ============ 1. Dashboard overview ============ */}
            <Showcase
                eyebrow="Command center"
                title={<><Gauge size={26} aria-hidden="true" /> Every request, one dashboard</>}
                tint
                media={<BrowserShot src="assets/screenshots/dashboard-overview.png" url="localhost:3030" alt="ClawRouter Dashboard Overview" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    A professional dark-themed control plane for your entire AI stack. Live request volume, success rates, token usage and estimated cost — across every provider and key — update in real time over WebSockets.
                </p>
                <ul className="showcase-list">
                    <li><span className="list-dot"><Zap size={14} aria-hidden="true" /></span> Live stats, charts and per-provider health</li>
                    <li><span className="list-dot"><Shield size={14} aria-hidden="true" /></span> 100% local — your data never leaves your machine</li>
                </ul>
            </Showcase>

            {/* ============ 2. Providers Management ============ */}
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

            {/* ============ 3. Quick Setup Templates ============ */}
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

            {/* ============ 4. Advanced Failover & Fallback ============ */}
            <Showcase
                eyebrow="Redundancy"
                title="Advanced Failover & Fallback"
                reverse
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

            {/* ============ 6. Quota tracking ============ */}
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

            {/* ============ 7. AI Prompt Assistant ============ */}
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

            {/* ============ 8. Real-time Request Logs ============ */}
            <Showcase
                eyebrow="Observability"
                title="Real-time Request Logs"
                reverse
                media={<Shot src="assets/screenshots/logs.png" alt="Real-time Request Logs" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    Full request and response logs with live WebSocket streaming. Monitor your AI API usage in real-time, debug issues instantly, and keep track of your active keys and token usage without leaving the dashboard.
                </p>
                <ul className="showcase-list">
                    <li><span className="list-dot"><Zap size={14} aria-hidden="true" /></span> Live streaming logs using WebSockets</li>
                    <li><span className="list-dot"><Shield size={14} aria-hidden="true" /></span> Detailed error tracking and API responses</li>
                </ul>
                <Link to="/docs?tab=monitoring&anchor=view-and-filter-logs" className="link-arrow">
                    Explore request logs <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ 9. Real-time Notifications ============ */}
            <Showcase
                eyebrow="Alerting"
                title={<><Bell size={26} aria-hidden="true" /> Real-time Notifications</>}
                tint
                media={<Shot src="assets/screenshots/notifications.png" alt="Real-time Notifications" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    Stay ahead of every event without watching logs. ClawRouter's built-in notification system delivers instant alerts for key rotations, circuit breaker trips, fallback activations, and more — all via WebSocket, directly in the dashboard.
                </p>
                <div className="notif-list">
                    {[
                        { label: 'Key Disabled', color: '#ef4444', desc: 'Instant alert when an API key is permanently disabled' },
                        { label: 'Circuit Open', color: '#ef4444', desc: 'Know the moment a provider trips its circuit breaker' },
                        { label: 'Model / Provider Fallback', color: '#f59e0b', desc: 'See every automatic fallback as it happens' },
                        { label: 'Recovered', color: '#22c55e', desc: 'Confirmed when a provider comes back online' },
                    ].map((item) => (
                        <div key={item.label} className="notif-item">
                            <span className="notif-chip" style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40` }}>
                                {item.label}
                            </span>
                            <span className="notif-desc">{item.desc}</span>
                        </div>
                    ))}
                </div>
                <Link to="/docs?tab=monitoring&anchor=monitor-events-with-notifications" className="link-arrow">
                    Learn about notifications <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ 10. Global Settings ============ */}
            <Showcase
                eyebrow="Control plane"
                title={<><Settings size={26} aria-hidden="true" /> Global Settings</>}
                media={<Shot src="assets/screenshots/settings.png" alt="Global Settings Panel" onZoom={setSelectedImage} />}
            >
                <p className="showcase-body">
                    Fine-tune every aspect of your router from a single settings panel. Configure global behavior including retry policies, circuit breaker thresholds, rate limiting, and security — all without touching config files.
                </p>
                <ul className="showcase-list">
                    <li><span className="list-dot"><RefreshCw size={14} aria-hidden="true" /></span> Retry & circuit breaker configuration</li>
                    <li><span className="list-dot"><Shield size={14} aria-hidden="true" /></span> Proxy API key & dashboard password security</li>
                    <li><span className="list-dot"><Zap size={14} aria-hidden="true" /></span> Rate limit backoff & failover tuning</li>
                    <li><span className="list-dot"><Server size={14} aria-hidden="true" /></span> Logging, notifications & routing behavior</li>
                </ul>
                <Link to="/docs?tab=globalSettings" className="link-arrow">
                    Learn about settings <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </Showcase>

            {/* ============ CTA ============ */}
            <section className="cta-section">
                <div className="container">
                    <Reveal className="cta-box reveal-scale">
                        <h2>Ready to Take Control?</h2>
                        <p>
                            Set up ClawRouter in minutes and ensure your AI applications never experience downtime due to API limits.
                        </p>
                        <Link to="/docs?tab=quickstart" className="btn-primary">
                            View Quickstart Guide <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                    </Reveal>
                </div>
            </section>

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
