import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Shield, Zap, Layers, RefreshCw, Server, Search, X, Bell, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import clawLogo from '../assets/claw-logo.svg';

export default function LandingPage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselRef = useRef(null);

    // Mobile detection
    useEffect(() => {
        const mq = window.matchMedia('(max-width: 768px)');
        setIsMobile(mq.matches);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Carousel scroll tracking
    const handleCarouselScroll = useCallback(() => {
        const el = carouselRef.current;
        if (!el || !el.children.length) return;
        const cardWidth = el.children[0].offsetWidth + 12; // card + gap
        const idx = Math.round(el.scrollLeft / (cardWidth * 2));
        setCarouselIndex(Math.max(0, Math.min(idx, 3)));
    }, []);

    const scrollToCard = useCallback((pageIdx) => {
        const el = carouselRef.current;
        if (!el || !el.children.length) return;
        const cardWidth = el.children[0].offsetWidth + 12;
        el.scrollTo({ left: pageIdx * cardWidth * 2, behavior: 'smooth' });
        setCarouselIndex(pageIdx);
    }, []);

    // Attach Polar checkout overlay to [data-polar-checkout] elements after React render
    useEffect(() => {
        if (window.Polar?.EmbedCheckout) {
            window.Polar.EmbedCheckout.init();
        }
    }, []);

    // Prevent body scroll when image lightbox is open
    React.useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedImage]);

    const features = [
        {
            title: 'Quick Setup Templates',
            desc: 'Get running in seconds with pre-configured templates for all major AI providers. Simply select, add key, and go.',
            icon: <Zap className="feature-icon" />
        },
        {
            title: 'Smart Key Rotation',
            desc: 'Add multiple API keys to a single provider. ClawRouter intelligently load-balances them with On-Error Backoff and Round-Robin.',
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
        },
        {
            title: 'Global Settings',
            desc: 'Centralized configuration panel for retry policies, circuit breakers, rate limiting, streaming defaults, and all routing behavior.',
            icon: <Settings className="feature-icon" />
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="hero-section" style={{ textAlign: 'center', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
                <div className="hero-glow" style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '80vh', background: 'radial-gradient(circle, rgba(80, 223, 144, 0.08) 0%, rgba(18, 18, 18, 0) 70%)', zIndex: -1, borderRadius: '50%' }}></div>

                <div className="hero-heading-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '1.5rem' }}>
                    <img src={clawLogo} alt="ClawRouter Logo" className="hero-logo" style={{ width: '64px', height: '64px', flexShrink: 0 }} />
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', margin: 0, maxWidth: '1000px', lineHeight: '1.1' }}>
                        Self-hosted <span className="gradient-text">AI Routing Gateway</span>
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

                <div className="hero-cta-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '60px' }}>
                    <div className="hero-cta-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <a href="https://buy.polar.sh/polar_cl_8wTBwKsDWMEVH5yLL4uQo2GMOPhE6V0cOytzu41fw3t" data-polar-checkout data-polar-checkout-theme="dark" className="btn-primary hero-cta-btn" style={{ padding: '10px 24px', fontSize: '1.05rem', textDecoration: 'none' }}>
                            Get Lifetime Access — $20
                        </a>
                        <Link to="/docs" className="btn-secondary hero-cta-btn" style={{ padding: '10px 24px', fontSize: '1.05rem' }}>
                            Documentation
                        </Link>
                    </div>
                    <div style={{
                        marginTop: '30px',
                        padding: '12px 28px',
                        background: 'rgba(255, 255, 255, 0.012)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '100px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
                    }}>
                        <Shield size={16} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                        <p style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            lineHeight: '1',
                            fontWeight: '300',
                            letterSpacing: '0.01em'
                        }}>
                            Secure checkout powered by <span style={{ color: 'var(--primary)', fontWeight: '500' }}>Polar</span> — $20 one-time purchase
                        </p>
                    </div>
                </div>

                <div className="container" onClick={() => setSelectedImage('assets/screenshots/dashboard.png')} style={{ cursor: 'pointer' }}>
                    <img
                        src="assets/screenshots/dashboard.png"
                        alt="ClawRouter Dashboard"
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

                    {isMobile ? (
                        <div className="feature-carousel-wrapper">
                            <div className="feature-carousel" ref={carouselRef} onScroll={handleCarouselScroll}>
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-card glass-panel carousel-card">
                                        {feature.icon}
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-desc">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="carousel-dots">
                                {[0, 1, 2, 3].map(i => (
                                    <button
                                        key={i}
                                        className={`carousel-dot${carouselIndex === i ? ' active' : ''}`}
                                        onClick={() => scrollToCard(i)}
                                        aria-label={`Cards ${i * 2 + 1}-${i * 2 + 2}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="feature-grid">
                            {features.map((feature, index) => (
                                <div key={index} className="feature-card glass-panel delay-2">
                                    {feature.icon}
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-desc">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Showcase Sections */}

            {/* 1. Providers Management */}
            <section className="showcase-section" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Manage Multiple Providers</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Add multiple API providers easily. ClawRouter supports all major API formats out of the box. Add, rotate, and monitor API keys with automatic error tracking and seamless fallback mechanisms.
                        </p>
                        <Link to="/docs?tab=providerDirectory" className="btn-secondary" style={{ marginTop: '10px' }}>
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
            <section className="showcase-section" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Quick Setup Templates</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Get up and running in seconds. ClawRouter provides a rich library of pre-configured templates for all popular AI providers. Select a template, add your API key, and you're ready to start routing.
                        </p>
                        <Link to="/docs?tab=firstProvider&anchor=add-a-provider-via-quick-setup" className="btn-secondary">
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
            <section className="showcase-section" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Advanced Failover & Fallback</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Ensure maximum uptime with multi-layered redundancy. ClawRouter handles both model-level unavailability and total provider outages seamlessly.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <RefreshCw size={18} /> Model Fallback
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Silently retry with alternative models within the same provider if the primary model is unavailable.
                                </p>
                                <Link to="/docs?tab=modelFallback" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
                                    Learn about Model Fallback →
                                </Link>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Shield size={18} /> Provider Fallback Chain
                                </h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                                    Configure prioritized chains of backup providers. If a provider goes down, ClawRouter automatically switches to the next one in line.
                                </p>
                                <Link to="/docs?tab=providerFallback" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginTop: '8px' }}>
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
                            className="img-showcase stacked-image-secondary"
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
            <section className="showcase-section" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>🪄 AI Prompt Assistant</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Configure your AI agents with zero effort. The smart Prompt Assistant generates tailor-made instructions for OpenClaw and other clients, automatically identifying the best model IDs and connection settings for your specific providers.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Zap size={16} color="var(--primary)" />
                                </div>
                                One-click configuration prompts
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <RefreshCw size={16} color="var(--primary)" />
                                </div>
                                Auto-discovery of upstream model IDs
                            </li>
                        </ul>
                        <Link to="/docs?tab=openclawIntegration&anchor=method-2-the-prompt-for-ai" className="btn-secondary">
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
                            className="img-showcase stacked-image-secondary"
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
            <section className="showcase-section" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>Real-time Request Logs</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Full request and response logs with live WebSocket streaming. Monitor your AI API usage in real-time, debug issues instantly, and keep track of your active keys and token usage without leaving the dashboard.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Zap size={16} color="var(--primary)" />
                                </div>
                                Live streaming logs using WebSockets
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                <div style={{ background: 'var(--bg-card)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Shield size={16} color="var(--primary)" />
                                </div>
                                Detailed error tracking and API responses
                            </li>
                        </ul>
                        <Link to="/docs?tab=monitoring&anchor=view-and-filter-logs" className="btn-secondary" style={{ marginTop: '20px' }}>
                            Explore Request Logs
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
            <section className="showcase-section" style={{ padding: '80px 0', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px' }}>🔔 Real-time Notifications</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Stay ahead of every event without watching logs. ClawRouter's built-in notification system delivers instant alerts for key rotations, circuit breaker trips, fallback activations, and more — all via WebSocket, directly in the dashboard.
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
                        <Link to="/docs?tab=monitoring&anchor=monitor-events-with-notifications" className="btn-secondary">
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

            {/* 7. Global Settings */}
            <section className="showcase-section" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 400px' }}>
                        <h2 style={{ fontSize: '2.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Settings size={32} style={{ color: 'var(--primary)' }} /> Global Settings
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.8' }}>
                            Fine-tune every aspect of your router from a single settings panel. Configure global behavior including retry policies, circuit breaker thresholds, rate limiting, streaming defaults, and more — all without touching config files.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                            {[
                                { icon: <RefreshCw size={16} color="var(--primary)" />, text: 'Retry & circuit breaker configuration' },
                                { icon: <Shield size={16} color="var(--primary)" />, text: 'Rate limiting & security options' },
                                { icon: <Zap size={16} color="var(--primary)" />, text: 'Streaming & timeout defaults' },
                                { icon: <Server size={16} color="var(--primary)" />, text: 'Logging, notifications & routing behavior' },
                            ].map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-main)' }}>
                                    <div style={{ background: 'var(--bg-darker)', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <Link to="/docs?tab=globalSettings" className="btn-secondary">
                            Learn about Settings →
                        </Link>
                    </div>
                    <div style={{ flex: '1 1 500px', cursor: 'pointer' }} onClick={() => setSelectedImage('assets/screenshots/settings.png')}>
                        <img
                            src="assets/screenshots/settings.png"
                            alt="Global Settings Panel"
                            className="img-showcase"
                            style={{ margin: 0, transition: 'all 0.3s ease' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerHTML = `
                                    <div style="background:rgba(255,255,255,0.03);border:2px dashed rgba(255,255,255,0.1);border-radius:12px;padding:60px 40px;text-align:center;color:rgba(255,255,255,0.3);">
                                        <div style="font-size:3rem;margin-bottom:12px;">&#9881;</div>
                                        <div style="font-size:0.9rem;">Screenshot coming soon</div>
                                        <div style="font-size:0.75rem;margin-top:6px;opacity:0.6;">Add: assets/screenshots/settings.png</div>
                                    </div>`;
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="showcase-section cta-section" style={{ padding: '100px 0', textAlign: 'center' }}>
                <div className="container cta-box" style={{ maxWidth: '800px', background: 'var(--bg-card)', padding: '60px', borderRadius: '16px', border: '1px solid var(--border-focus)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Ready to Take Control?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '30px' }}>
                        Set up ClawRouter in minutes and ensure your AI applications never experience downtime due to API limits.
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <Link to="/docs" className="btn-primary">
                            View Quickstart Guide
                        </Link>
                    </div>
                </div>
            </section>

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
