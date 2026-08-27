import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Book, Home, Mail, ArrowUp } from 'lucide-react';
import clawLogo from '../assets/claw-logo.svg';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const barRef = useRef(null);
    const scrollRaf = useRef(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [navScrolled, setNavScrolled] = useState(false);

    // One rAF-throttled handler per frame; the progress bar is written
    // straight to the DOM as a transform — no React render, no layout pass.
    const handleScroll = useCallback(() => {
        scrollRaf.current = 0;
        const scrollTop = window.scrollY;
        if (barRef.current) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
            barRef.current.style.transform = `scaleX(${progress})`;
        }
        setShowScrollTop(scrollTop > 400);
        setNavScrolled(scrollTop > 8);
    }, []);

    const scheduleScroll = useCallback(() => {
        if (!scrollRaf.current) scrollRaf.current = requestAnimationFrame(handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        window.addEventListener('scroll', scheduleScroll, { passive: true });
        scheduleScroll();
        return () => {
            window.removeEventListener('scroll', scheduleScroll);
            if (scrollRaf.current) cancelAnimationFrame(scrollRaf.current);
            // Must reset the gate: in dev, StrictMode unmounts and remounts
            // this effect — a cancelled-but-unreset id would block every
            // future scheduleScroll call (dead progress bar + back-to-top).
            scrollRaf.current = 0;
        };
    }, [scheduleScroll]);

    // Bind Polar embedded-checkout overlays to [data-polar-checkout] elements
    useEffect(() => {
        window.Polar?.EmbedCheckout?.init();
    }, [location.pathname]);

    const pricingScrollRef = useRef(false);

    const scrollBehavior = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    // On every route change: jump to the top instantly (behavior 'instant'
    // overrides the global smooth scroll-behavior — a smooth scroll here would
    // animate the OLD page while the new one loads). useLayoutEffect so the
    // reset lands before the browser paints the new route.
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (barRef.current) barRef.current.style.transform = 'scaleX(0)';
        scheduleScroll();
        if (pricingScrollRef.current) {
            pricingScrollRef.current = false;
            setTimeout(() => {
                document.getElementById('pricing')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
            }, 120);
        }
    }, [location.pathname, scheduleScroll]);

    const goToPricing = useCallback(() => {
        if (location.pathname !== '/') {
            pricingScrollRef.current = true;
            navigate('/');
        } else {
            document.getElementById('pricing')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        }
    }, [location.pathname, navigate]);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={15} aria-hidden="true" /> },
        { name: 'Documentation', path: '/docs', icon: <Book size={15} aria-hidden="true" /> }
    ];

    return (
        <>
            <nav className={`glass-nav${navScrolled ? ' scrolled' : ''}`}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Link to="/" className="nav-logo">
                        <img src={clawLogo} alt="ClawRouter Logo" style={{ width: '28px', height: '28px' }} />
                        <span className="nav-logo-text">ClawRouter</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <span className="nav-version"><i aria-hidden="true" />v1.0.18</span>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
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
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.01 10.26a1.6 1.6 0 0 1 .66 1.3c0 .23-.05.46-.14.67.08.2.13.42.13.65 0 2.56-2.98 4.63-6.65 4.63S5.34 15.44 5.34 12.88c0-.23.04-.45.13-.65a1.61 1.61 0 0 1 .53-3.11c.43 0 .82.17 1.11.45 1.11-.74 2.6-1.22 4.25-1.27l.82-3.69 2.64.61a1.22 1.22 0 1 0 .23-.01l-2.34-.54-.73 3.25c1.6.07 3.04.55 4.12 1.28.29-.28.68-.45 1.11-.45.49 0 .93.22 1.24.56zM9 12.5a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm5 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm-3.88 2.76c.46.46 1.1.7 1.88.7s1.42-.24 1.88-.7a.38.38 0 0 0-.54-.54c-.35.35-.87.53-1.34.53s-.99-.18-1.34-.53a.38.38 0 0 0-.54.54z" />
                                </svg>
                            </a>
                            <span
                                title="X — coming soon"
                                aria-label="X profile (coming soon)"
                                className="nav-icon-btn nav-icon-placeholder"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </span>
                            <span
                                title="YouTube — coming soon"
                                aria-label="YouTube channel (coming soon)"
                                className="nav-icon-btn nav-icon-placeholder"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </span>
                        </div>

                        <button type="button" onClick={goToPricing} className="nav-cta">
                            Get ClawRouter — $20
                        </button>
                    </div>
                </div>
            </nav>

            <div className="scroll-progress-track">
                <div ref={barRef} className="scroll-progress-bar" />
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
                                <Link to="/docs" className="footer-link">Documentation</Link>
                                <Link to="/docs?tab=quickstart" className="footer-link">Quickstart Guide</Link>
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
                                <span title="X — coming soon" aria-label="X profile (coming soon)" className="nav-icon-btn nav-icon-placeholder">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </span>
                                <span title="YouTube — coming soon" aria-label="YouTube channel (coming soon)" className="nav-icon-btn nav-icon-placeholder">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </span>
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
