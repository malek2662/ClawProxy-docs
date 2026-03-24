import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Shield, Zap, Layers, RefreshCw, Server, Search, X, Bell, CreditCard, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import clawLogo from '../assets/claw-logo.svg';

export default function LandingPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Prevent body scroll when any modal is open
    React.useEffect(() => {
        if (selectedImage || showPaymentModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedImage, showPaymentModal]);

    const features = [
        {
            title: 'Quick Setup Templates',
            desc: 'Get running in seconds with pre-configured templates for all major AI providers. Simply select, add key, and go.',
            icon: <Zap className="feature-icon" />
        },
        {
            title: 'Smart Key Rotation',
            desc: 'Add multiple API keys to a single provider. ClawProxy intelligently load-balances them with On-Error Backoff and Round-Robin.',
            icon: <RefreshCw className="feature-icon" />
        },
        {
            title: 'Advanced Failover',
            desc: 'Model-level fallback and multi-provider failover chains ensure your AI brain keeps thinking even during outages.',
            icon: <Shield className="feature-icon" />
        },
        {
            title: 'Multi-Provider Routing',
            desc: 'Route requests via per-provider endpoints. Manage OpenAI, Anthropic, Gemini and more from a single interface.',
            icon: <Layers className="feature-icon" />
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
            title: 'Smart Notifications',
            desc: 'Instant alerts for key rotations, circuit breaker events, and fallback activations — delivered live via WebSocket directly to your dashboard.',
            icon: <Bell className="feature-icon" />
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section style={{ textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-glow" style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vh', background: 'radial-gradient(circle, rgba(80, 223, 144, 0.08) 0%, rgba(18, 18, 18, 0) 70%)', zIndex: -1, borderRadius: '50%' }}></div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                    <img src={clawLogo} alt="ClawProxy Logo" style={{ width: '64px', height: '64px', flexShrink: 0 }} />
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', margin: 0, maxWidth: '1000px', lineHeight: '1.1' }}>
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
                        <button onClick={() => setShowPaymentModal(true)} className="btn-primary hero-cta-btn" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>
                            Get Lifetime Access — $20
                        </button>
                        <Link to="/docs" className="btn-secondary hero-cta-btn" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>
                            Documentation
                        </Link>
                    </div>
                    <div className="payment-pill" style={{
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
                        <p className="payment-pill-text" style={{
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
                            <a href="mailto:support@clawproxy.qzz.io"
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

                <div className="container" onClick={() => setSelectedImage('assets/screenshots/dashboard.png')} style={{ cursor: 'pointer' }}>
                    <img
                        src="assets/screenshots/dashboard.png"
                        alt="ClawProxy Dashboard"
                        className="img-showcase delay-1 animate-fade-in"
                        style={{ marginTop: '0', transition: 'all 0.3s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

            {/* 1. Providers Management */}
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
                    <div style={{ flex: '1 1 500px', cursor: 'pointer' }} onClick={() => setSelectedImage('assets/screenshots/providers.png')}>
                        <img
                            src="assets/screenshots/providers.png"
                            alt="Providers Management"
                            className="img-showcase"
                            style={{ margin: 0, transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </div>
            </section>

            {/* 2. Quick Setup & Templates (NEW) */}
            <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Quick Setup Templates</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Get up and running in seconds. ClawProxy provides a rich library of pre-configured templates for all popular AI providers. Select a template, add your API key, and you're ready to start routing.
                        </p>
                        <Link to="/docs?tab=knowledgeBase&anchor=feature-1-provider-templates-quick-setup" className="btn-secondary">
                            View Provider Templates
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px', cursor: 'pointer' }} onClick={() => setSelectedImage('assets/screenshots/providers-templat.png')}>
                        <img
                            src="assets/screenshots/providers-templat.png"
                            alt="Quick Setup Templates"
                            className="img-showcase"
                            style={{ margin: 0, transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </div>
            </section>

            {/* 3. Advanced Failover & Fallback (NEW) */}
            <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Advanced Failover & Fallback</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Ensure maximum uptime with multi-layered redundancy. ClawProxy handles both model-level unavailability and total provider outages seamlessly.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Model Fallback
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Silently retry with alternative models within the same provider if the primary model is unavailable.
                                </p>
                                <Link to="/docs?tab=knowledgeBase&anchor=feature-3-model-fallback-within-the-same-provider" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
                                    Learn about Model Fallback →
                                </Link>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} /> Provider Fallback Chain
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Configure prioritized chains of backup providers. If a provider goes down, ClawProxy automatically switches to the next one in line.
                                </p>
                                <Link to="/docs?tab=knowledgeBase&anchor=feature-4-provider-fallback-chain-switch-providers" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
                                    Learn about Fallback Chains →
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                        <img
                            src="assets/screenshots/Model-Fallback.png"
                            alt="Model Fallback Configuration"
                            className="img-showcase"
                            style={{
                                margin: 0,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                zIndex: 2
                            }}
                            onClick={() => setSelectedImage('assets/screenshots/Model-Fallback.png')}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.zIndex = 3; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 2; }}
                        />
                        <img
                            src="assets/screenshots/Provider-Fallback-Chain.png"
                            alt="Provider Fallback Chain Configuration"
                            className="img-showcase"
                            style={{
                                margin: '-40px 0 0 40px',
                                width: '90%',
                                opacity: 0.9,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(80, 223, 144, 0.2)',
                                zIndex: 1
                            }}
                            onClick={() => setSelectedImage('assets/screenshots/Provider-Fallback-Chain.png')}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.opacity = '1'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.9'; }}
                        />
                    </div>
                </div>
            </section>

            {/* 4. AI Prompt Assistant */}
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
                    <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                        <img
                            src="assets/screenshots/providers-ai2.png"
                            alt="AI Prompt Assistant Feature"
                            className="img-showcase"
                            style={{
                                margin: 0,
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                zIndex: 2
                            }}
                            onClick={() => setSelectedImage('assets/screenshots/providers-ai2.png')}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.zIndex = 3; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 2; }}
                        />
                        <img
                            src="assets/screenshots/providers-ai1.png"
                            alt="AI Assistant Prompt Generation"
                            className="img-showcase"
                            style={{
                                margin: '-40px 0 0 40px',
                                width: '90%',
                                opacity: 0.9,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(80, 223, 144, 0.2)',
                                zIndex: 1
                            }}
                            onClick={() => setSelectedImage('assets/screenshots/providers-ai1.png')}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.opacity = '1'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.9'; }}
                        />
                    </div>
                </div>
            </section>

            {/* 5. Logs Showcase Section */}
            <section style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
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
                    <div style={{ flex: '1 1 500px', cursor: 'pointer' }} onClick={() => setSelectedImage('assets/screenshots/logs.png')}>
                        <img
                            src="assets/screenshots/logs.png"
                            alt="Real-time Request Logs"
                            className="img-showcase"
                            style={{ margin: 0, transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                    </div>
                </div>
            </section>

            {/* 6. Real-time Notifications */}
            <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>🔔 Real-time Notifications</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Stay ahead of every event without watching logs. ClawProxy's built-in notification system delivers instant alerts for key rotations, circuit breaker trips, fallback activations, and more — all via WebSocket, directly in the dashboard.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                            {[
                                { label: 'Key Disabled', color: '#ef4444', desc: 'Instant alert when an API key is permanently disabled' },
                                { label: 'Circuit Open', color: '#ef4444', desc: 'Know the moment a provider trips its circuit breaker' },
                                { label: 'Model / Provider Fallback', color: '#f59e0b', desc: 'See every automatic fallback as it happens' },
                                { label: 'Recovered', color: '#22c55e', desc: 'Confirmed when a provider comes back online' },
                            ].map((item) => (
                                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                    <span style={{ background: `${item.color}20`, color: item.color, border: `1px solid ${item.color}40`, borderRadius: '6px', padding: '2px 10px', fontSize: '0.78rem', fontWeight: '600', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                        {item.label}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>{item.desc}</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/docs?tab=knowledgeBase&anchor=feature-6-real-time-notifications" className="btn-secondary">
                            Learn about Notifications →
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px', cursor: 'pointer' }} onClick={() => setSelectedImage('assets/screenshots/notifications.png')}>
                        <img
                            src="assets/screenshots/notifications.png"
                            alt="Real-time Notifications"
                            className="img-showcase"
                            style={{ margin: 0, transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerHTML = `
                                    <div style="background:rgba(255,255,255,0.03);border:2px dashed rgba(255,255,255,0.1);border-radius:12px;padding:60px 40px;text-align:center;color:rgba(255,255,255,0.3);">
                                        <div style="font-size:3rem;margin-bottom:12px;">🔔</div>
                                        <div style="font-size:0.9rem;">Screenshot coming soon</div>
                                        <div style="font-size:0.75rem;margin-top:6px;opacity:0.6;">Add: assets/screenshots/notifications.png</div>
                                    </div>`;
                            }}
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
            {/* Payment Modal via Portal */}
            {showPaymentModal && createPortal(
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0,
                        width: '100vw', height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        zIndex: 9999, padding: '20px',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                    onClick={() => setShowPaymentModal(false)}
                >
                    <div
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '20px',
                            padding: '36px 32px',
                            maxWidth: '520px',
                            width: '100%',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
                            position: 'relative',
                            animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            style={{
                                position: 'absolute', top: '16px', right: '16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-light)',
                                borderRadius: '50%', width: '36px', height: '36px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-main)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                            onClick={() => setShowPaymentModal(false)}
                        >
                            <X size={18} />
                        </button>

                        {/* Header — Payment Temporarily Unavailable */}
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,180,50,0.1)', border: '1px solid rgba(255,180,50,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFB432" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            </div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '10px' }}>
                                Payment Temporarily Unavailable
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                                We're currently experiencing issues with our payment processing system. We apologize for the inconvenience and are working to resolve this as quickly as possible.
                            </p>
                        </div>

                        {/* Info cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Existing customers */}
                            <div
                                style={{
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px', padding: '18px 20px'
                                }}
                            >
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '6px' }}>Already purchased?</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>
                                    If you've already completed a payment, please reach out to us directly and we'll make sure you get access right away.
                                </p>
                            </div>

                            {/* New customers */}
                            <div
                                style={{
                                    background: 'var(--bg-darker)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px', padding: '18px 20px'
                                }}
                            >
                                <div style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '6px' }}>Looking to purchase?</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.55', margin: 0 }}>
                                    Payment processing will be back online shortly. Thank you for your patience — we appreciate your interest in ClawProxy.
                                </p>
                            </div>
                        </div>

                        {/* Contact footer */}
                        <p style={{ marginTop: '20px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.55' }}>
                            Need help? Contact us at{' '}
                            <a href="mailto:support@clawproxy.qzz.io" style={{ color: 'var(--primary)' }}>support@clawproxy.qzz.io</a>
                            {' '}or via{' '}
                            <a href="https://reddit.com/user/Malek262" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Reddit</a>
                        </p>
                    </div>
                </div>,
                document.body
            )}

            {/* Lightbox Modal via Portal */}
            {selectedImage && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                        padding: '20px',
                        cursor: 'zoom-out',
                        animation: 'fadeIn 0.2s ease-out'
                    }}
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            zIndex: 10000,
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Preview"
                        style={{
                            maxWidth: '95vw',
                            maxHeight: '90vh',
                            borderRadius: '12px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                            objectFit: 'contain',
                            cursor: 'default',
                            animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>,
                document.body
            )}
        </div>
    );
}

// Add keyframes for Lightbox
const styles = `
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
`;
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
