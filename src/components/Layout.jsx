import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Book, Home, Mail, ArrowUp } from 'lucide-react';
import clawLogo from '../assets/claw-logo.svg';

export default function Layout() {
    const location = useLocation();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
        setScrollProgress(progress);
        setShowScrollTop(scrollTop > 400);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        setScrollProgress(0);
    }, [location.pathname]);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={16} /> },
        { name: 'Documentation', path: '/docs', icon: <Book size={16} /> }
    ];

    return (
        <>
            <nav className="glass-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                        <img src={clawLogo} alt="ClawProxy Logo" style={{ width: '28px', height: '28px' }} />
                        <span className="nav-logo-text" style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                            ClawProxy
                        </span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => window.scrollTo(0, 0)}
                                        className={isActive ? "btn-primary" : "btn-secondary"}
                                        style={{ padding: '6px 14px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        {link.icon}
                                        <span className="nav-btn-label">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <a
                                href="mailto:support@clawproxy.qzz.io"
                                title="Contact via Email"
                                style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href="https://reddit.com/user/Malek262"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via Reddit"
                                style={{ color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-label="Reddit">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.01 10.26a1.6 1.6 0 0 1 .66 1.3c0 .23-.05.46-.14.67.08.2.13.42.13.65 0 2.56-2.98 4.63-6.65 4.63S5.34 15.44 5.34 12.88c0-.23.04-.45.13-.65a1.61 1.61 0 0 1 .53-3.11c.43 0 .82.17 1.11.45 1.11-.74 2.6-1.22 4.25-1.27l.82-3.69 2.64.61a1.22 1.22 0 1 0 .23-.01l-2.34-.54-.73 3.25c1.6.07 3.04.55 4.12 1.28.29-.28.68-.45 1.11-.45.49 0 .93.22 1.24.56zM9 12.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-3.88 2.76c.46.46 1.15.7 1.88.7s1.42-.24 1.88-.7a.38.38 0 0 0-.54-.54c-.35.35-.87.53-1.34.53s-.99-.18-1.34-.53a.38.38 0 0 0-.54.54z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="scroll-progress-track">
                <div
                    className="scroll-progress-bar"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            <main className="page-content">
                <Outlet />
            </main>

            <footer className="site-footer" style={{
                borderTop: '1px solid var(--border-light)',
                padding: '80px 0 40px',
                marginTop: '100px',
                background: 'rgba(10, 10, 10, 0.4)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '60px',
                        marginBottom: '60px'
                    }}>
                        {/* Column 1: Brand */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={clawLogo} alt="ClawProxy Logo" style={{ width: '32px', height: '32px' }} />
                                <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.4rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>
                                    ClawProxy
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                                High-performance, self-hosted AI routing proxy. Designed for reliability, privacy, and seamless API management.
                            </p>
                        </div>

                        {/* Column 2: Project */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600', margin: 0 }}>Project</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Link to="/docs" onClick={() => window.scrollTo(0, 0)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Documentation</Link>
                                <Link to="/docs?tab=quickstart" onClick={() => window.scrollTo(0, 0)} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Quickstart Guide</Link>
                            </div>
                        </div>

                        {/* Column 3: Connect */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600', margin: 0 }}>Connect</h4>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <a href="mailto:support@clawproxy.qzz.io" title="Email" style={{ color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path><rect width="20" height="16" x="2" y="4" rx="2"></rect></svg>
                                </a>
                                <a href="https://reddit.com/user/Malek262" target="_blank" rel="noopener noreferrer" title="Reddit" style={{ color: 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="Reddit">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.01 10.26a1.6 1.6 0 0 1 .66 1.3c0 .23-.05.46-.14.67.08.2.13.42.13.65 0 2.56-2.98 4.63-6.65 4.63S5.34 15.44 5.34 12.88c0-.23.04-.45.13-.65a1.61 1.61 0 0 1 .53-3.11c.43 0 .82.17 1.11.45 1.11-.74 2.6-1.22 4.25-1.27l.82-3.69 2.64.61a1.22 1.22 0 1 0 .23-.01l-2.34-.54-.73 3.25c1.6.07 3.04.55 4.12 1.28.29-.28.68-.45 1.11-.45.49 0 .93.22 1.24.56zM9 12.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-3.88 2.76c.46.46 1.15.7 1.88.7s1.42-.24 1.88-.7a.38.38 0 0 0-.54-.54c-.35.35-.87.53-1.34.53s-.99-.18-1.34-.53a.38.38 0 0 0-.54.54z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        paddingTop: '30px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                                &copy; {new Date().getFullYear()} ClawProxy. All rights reserved.
                            </p>
                            <p style={{ color: 'rgba(255, 255, 255, 0.3)', fontSize: '0.75rem', maxWidth: '400px', margin: 0, lineHeight: '1.4' }}>
                                <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>Terms & Refund Policy:</span> All sales are final. Due to the nature of digital goods and open-source software, no refunds are provided. Please verify compatibility before purchasing.
                            </p>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Developed by Malek-Rsh
                        </div>
                    </div>
                </div>
            </footer>

            <button
                className={`scroll-to-top${showScrollTop ? ' visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
            >
                <ArrowUp size={20} />
            </button>
        </>
    );
}
