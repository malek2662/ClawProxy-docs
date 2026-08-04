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
        { name: 'Home', path: '/', icon: <Home size={15} aria-hidden="true" /> },
        { name: 'Documentation', path: '/docs', icon: <Book size={15} aria-hidden="true" /> }
    ];

    return (
        <>
            <nav className="glass-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link to="/" onClick={() => window.scrollTo(0, 0)} className="nav-logo">
                        <img src={clawLogo} alt="ClawRouter Logo" style={{ width: '28px', height: '28px' }} />
                        <span className="nav-logo-text">ClawRouter</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span className="nav-version"><i aria-hidden="true" />v1.0.14</span>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => window.scrollTo(0, 0)}
                                        className={`nav-link${isActive ? ' active' : ''}`}
                                    >
                                        {link.icon}
                                        <span className="nav-btn-label">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <a
                                href="mailto:support@clawrouter.qzz.io"
                                title="Contact via Email"
                                aria-label="Contact via Email"
                                className="nav-icon-btn"
                            >
                                <Mail size={18} aria-hidden="true" />
                            </a>
                            <a
                                href="https://reddit.com/user/Malek262"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via Reddit"
                                aria-label="Contact via Reddit"
                                className="nav-icon-btn"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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

            <footer className="site-footer">
                <div className="container">
                    <div className="footer-grid">
                        {/* Column 1: Brand */}
                        <div className="footer-brand">
                            <div className="footer-brand-row">
                                <img src={clawLogo} alt="ClawRouter Logo" style={{ width: '30px', height: '30px' }} />
                                <span className="footer-brand-name">ClawRouter</span>
                            </div>
                            <p className="footer-tagline">
                                High-performance, self-hosted AI routing gateway. Designed for reliability, privacy, and seamless API management.
                            </p>
                        </div>

                        {/* Column 2: Project */}
                        <div>
                            <h4 className="footer-heading">Project</h4>
                            <div className="footer-links">
                                <Link to="/docs" onClick={() => window.scrollTo(0, 0)} className="footer-link">Documentation</Link>
                                <Link to="/docs?tab=quickstart" onClick={() => window.scrollTo(0, 0)} className="footer-link">Quickstart Guide</Link>
                            </div>
                        </div>

                        {/* Column 3: Connect */}
                        <div>
                            <h4 className="footer-heading">Connect</h4>
                            <div className="footer-social">
                                <a href="mailto:support@clawrouter.qzz.io" title="Email" aria-label="Contact via Email" className="nav-icon-btn">
                                    <Mail size={20} aria-hidden="true" />
                                </a>
                                <a href="https://reddit.com/user/Malek262" target="_blank" rel="noopener noreferrer" title="Reddit" aria-label="Contact via Reddit" className="nav-icon-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.01 10.26a1.6 1.6 0 0 1 .66 1.3c0 .23-.05.46-.14.67.08.2.13.42.13.65 0 2.56-2.98 4.63-6.65 4.63S5.34 15.44 5.34 12.88c0-.23.04-.45.13-.65a1.61 1.61 0 0 1 .53-3.11c.43 0 .82.17 1.11.45 1.11-.74 2.6-1.22 4.25-1.27l.82-3.69 2.64.61a1.22 1.22 0 1 0 .23-.01l-2.34-.54-.73 3.25c1.6.07 3.04.55 4.12 1.28.29-.28.68-.45 1.11-.45.49 0 .93.22 1.24.56zM9 12.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-3.88 2.76c.46.46 1.15.7 1.88.7s1.42-.24 1.88-.7a.38.38 0 0 0-.54-.54c-.35.35-.87.53-1.34.53s-.99-.18-1.34-.53a.38.38 0 0 0-.54.54z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div>
                            <p className="footer-copy">
                                &copy; {new Date().getFullYear()} ClawRouter. All rights reserved.
                            </p>
                            <p className="footer-legal">
                                <strong>Terms & Refund Policy:</strong> All sales are final. Due to the nature of digital goods and open-source software, no refunds are provided. Please verify compatibility before purchasing.
                            </p>
                        </div>
                        <div className="footer-author">
                            Developed by Malek-Rsh
                        </div>
                    </div>
                </div>
            </footer>

            <button
                type="button"
                className={`scroll-to-top${showScrollTop ? ' visible' : ''}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll to top"
            >
                <ArrowUp size={18} aria-hidden="true" />
            </button>
        </>
    );
}
