import React from 'react';
import { ArrowRight, Shield, Zap, Layers, RefreshCw, Server, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import clawLogo from '../assets/claw-logo.svg';

export default function LandingPage() {
    const features = [
        {
            title: 'Multi-Provider Routing',
            desc: 'Route requests via per-provider endpoints. Manage OpenAI, Anthropic, Gemini and more from a single interface.',
            icon: <Layers className="feature-icon" />
        },
        {
            title: 'Smart Key Rotation',
            desc: 'Add multiple API keys to a single provider. ClawProxy intelligently load-balances them with On-Error Backoff and Round-Robin.',
            icon: <RefreshCw className="feature-icon" />
        },
        {
            title: 'Provider Fallback',
            desc: 'Auto-failover to backup providers with automatic model rewriting. If your primary provider fails, your AI brain keeps thinking.',
            icon: <Shield className="feature-icon" />
        },
        {
            title: 'Zero-Buffer Streaming',
            desc: 'Native streaming pass-through ensures your AI responses are delivered instantly with zero artificial lag.',
            icon: <Zap className="feature-icon" />
        },
        {
            title: 'Real-time Dashboard',
            desc: 'Professional dark-themed React dashboard for configuration and monitoring. Add keys, check logs, and manage providers easily.',
            icon: <Server className="feature-icon" />
        },
        {
            title: 'ClawProxy Knowledge Base',
            desc: 'Detailed documentation to help you configure, maximize utility, and understand the internal workings of ClawProxy.',
            icon: <Search className="feature-icon" />
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vh', background: 'radial-gradient(circle, rgba(80, 223, 144, 0.08) 0%, rgba(18, 18, 18, 0) 70%)', zIndex: -1, borderRadius: '50%' }}></div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                    <img src={clawLogo} alt="ClawProxy Logo" style={{ width: '64px', height: '64px', flexShrink: 0 }} />
                    <h1 style={{ fontSize: '3.5rem', margin: 0, maxWidth: '1000px', lineHeight: '1.1' }}>
                        Self-hosted <span className="gradient-text">AI Routing Proxy</span>
                    </h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <span style={{ background: 'rgba(80, 223, 144, 0.1)', padding: '6px 16px', borderRadius: '99px', fontSize: '0.95rem', fontWeight: '600', border: '1px solid rgba(80, 223, 144, 0.2)' }}>
                        Onetime Purchase — $20 Lifetime License
                    </span>
                </div>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                    Route, manage, and monitor your AI API requests across multiple providers from a single endpoint. Gain absolute control over your API keys, routing rules, and application stability.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <a href="https://paypal.me/ClawProxy/20USD" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>
                            Get Lifetime Access — $20
                        </a>
                        <Link to="/docs" className="btn-secondary" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>
                            Documentation
                        </Link>
                    </div>
                    <div style={{
                        marginTop: '30px',
                        padding: '16px 32px',
                        background: 'rgba(255, 255, 255, 0.012)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '100px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        maxWidth: '820px',
                        width: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
                    }}>
                        <p style={{
                            fontSize: '0.92rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            lineHeight: '1',
                            fontWeight: '300',
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap'
                        }}>
                            After secure payment, please send me a message with your <span style={{ color: 'var(--primary)', fontWeight: '500' }}>screenshot</span> via:
                        </p>

                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            {/* Email Link */}
                            <a href="mailto:malekqq1@gmail.com"
                                title="Contact via Email"
                                style={{
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.8
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.2)';
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(80, 223, 144, 0.3))';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.opacity = '0.8';
                                    e.currentTarget.style.filter = 'none';
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                            </a>

                            {/* Reddit Link */}
                            <a href="https://reddit.com/user/Malek262"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via Reddit"
                                style={{
                                    color: 'var(--primary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: 0.8
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.2)';
                                    e.currentTarget.style.opacity = '1';
                                    e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(80, 223, 144, 0.3))';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.opacity = '0.8';
                                    e.currentTarget.style.filter = 'none';
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.25a1.25 1.25 0 0 1-2.498.051l-2.497.553.504 2.417c1.589.12 3.026.66 4.095 1.489.345-.308.8-.499 1.301-.499a1.93 1.93 0 0 1 1.93 1.93c0 .736-.41 1.377-1.02 1.701.012.157.017.317.017.477 0 2.383-2.671 4.314-5.966 4.314-3.295 0-5.966-1.931-5.966-4.314 0-.153.006-.306.015-.458a1.86 1.86 0 0 1-1.1-1.701c0-1.066.864-1.93 1.93-1.93.52 0 .991.205 1.343.541 1.082-.816 2.532-1.341 4.128-1.442l-.634-2.885 2.126-.47a1.24 1.24 0 0 1 .195-.015zM8.122 12.14a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28zm7.755 0a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28zm-5.048 3.51c.36.36.945.36 1.305 0a.395.395 0 0 1 .559.559c-.669.669-1.754.669-2.423 0a.395.395 0 0 1 .559-.559z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <img
                        src="/assets/screenshots/dashboard.png"
                        alt="ClawProxy Dashboard"
                        className="img-showcase delay-1 animate-fade-in"
                        style={{ marginTop: '0' }}
                    />
                </div>
            </section>

            {/* Features Section */}
            <section style={{ padding: '60px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container">
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '10px' }}>
                        Uninterrupted <span className="gradient-text">Continuity</span>
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 40px' }}>
                        Built to handle the chaotic nature of AI APIs safely and securely.
                    </p>

                    <div className="feature-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card glass-panel delay-2">
                                {feature.icon}
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Showcase Sections */}

            {/* 1. Providers Management (Moved to Top) */}
            <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Manage Multiple Providers</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Add multiple API providers easily. ClawProxy supports all major API formats out of the box. Add, rotate, and monitor API keys with automatic error tracking and seamless fallback mechanisms.
                        </p>
                        <Link to="/docs?tab=providers" className="btn-secondary" style={{ marginTop: '10px' }}>
                            Read the Documentation
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px' }}>
                        <img
                            src="/assets/screenshots/providers.png"
                            alt="Providers Management"
                            className="img-showcase"
                            style={{ margin: 0 }}
                        />
                    </div>
                </div>
            </section>

            {/* 2. [NEW] AI Prompt Assistant Section */}
            <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>🪄 AI Prompt Assistant</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Configure your AI agents with zero effort. The smart Prompt Assistant generates tailor-made instructions for OpenClaw and other clients, automatically identifying the best model IDs and connection settings for your specific providers.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                                    <Zap size={16} color="var(--primary)" />
                                </div>
                                One-click configuration prompts
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                                    <RefreshCw size={16} color="var(--primary)" />
                                </div>
                                Auto-discovery of upstream model IDs
                            </li>
                        </ul>
                        <Link to="/docs?tab=knowledgeBase&anchor=guide-integrating-with-openclaw" className="btn-secondary">
                            How to use AI Assistant
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <img
                            src="/assets/screenshots/providers-ai2.png"
                            alt="AI Prompt Assistant Feature"
                            className="img-showcase"
                            style={{ margin: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                        />
                        <img
                            src="/assets/screenshots/providers-ai1.png"
                            alt="AI Assistant Prompt Generation"
                            className="img-showcase"
                            style={{ margin: 0, width: '80%', alignSelf: 'center', opacity: 0.8 }}
                        />
                    </div>
                </div>
            </section>

            {/* 3. Logs Showcase Section */}
            <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Real-time Request Logs</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Full request and response logs with live WebSocket streaming. Monitor your AI API usage in real-time, debug issues instantly, and keep track of your active keys and token usage without leaving the dashboard.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                                    <Zap size={16} color="var(--primary)" />
                                </div>
                                Live streaming logs using WebSockets
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', padding: '6px', borderRadius: '50%', border: '1px solid var(--border-light)' }}>
                                    <Shield size={16} color="var(--primary)" />
                                </div>
                                Detailed error tracking and API responses
                            </li>
                        </ul>
                        <Link to="/docs?tab=knowledgeBase" className="btn-secondary" style={{ marginTop: '20px' }}>
                            Explore Knowledge Base
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px' }}>
                        <img
                            src="/assets/screenshots/logs.png"
                            alt="Real-time Request Logs"
                            className="img-showcase"
                            style={{ margin: 0 }}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '800px', background: 'var(--bg-card)', padding: '60px', borderRadius: '16px', border: '1px solid var(--border-focus)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Take Control?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>
                        Set up ClawProxy in minutes and ensure your AI applications never experience downtime due to API limits.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/docs" className="btn-primary">
                            View Quickstart Guide
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
