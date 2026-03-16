import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Github, Book, Home, Settings, Code } from 'lucide-react';
import clawLogo from '../assets/claw-logo.svg';

export default function Layout() {
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Documentation', path: '/docs', icon: <Book size={18} /> }
    ];

    return (
        <>
            <nav className="glass-nav">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                        <img src={clawLogo} alt="ClawProxy Logo" style={{ width: '28px', height: '28px' }} />
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                            ClawProxy
                        </span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
                                if (link.name === 'Documentation') {
                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={isActive ? "btn-primary" : "btn-secondary"}
                                            style={{ padding: '6px 14px', fontSize: '0.9rem' }}
                                        >
                                            {link.icon}
                                            <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                                                {link.name}
                                            </span>
                                        </Link>
                                    )
                                }
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: isActive ? '500' : '400',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {link.icon}
                                        <span style={{ display: 'none', '@media (min-width: 768px)': { display: 'inline' } }}>
                                            {link.name}
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>

                        <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>

                        <a href="https://github.com/malek262/clawproxy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                            <Github size={20} />
                        </a>
                    </div>
                </div>
            </nav>

            <main className="page-content">
                <Outlet />
            </main>

            <footer style={{
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
                                <Link to="/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Documentation</Link>
                                <a href="https://github.com/malek262/clawproxy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>GitHub Repository</a>
                                <Link to="/docs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'var(--primary)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>Quickstart Guide</Link>
                            </div>
                        </div>

                        {/* Column 3: Connect */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600', margin: 0 }}>Connect</h4>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <a href="mailto:malekqq1@gmail.com" title="Email" style={{ color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path><rect width="20" height="16" x="2" y="4" rx="2"></rect></svg>
                                </a>
                                <a href="https://reddit.com/user/Malek262" target="_blank" rel="noopener noreferrer" title="Reddit" style={{ color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.25a1.25 1.25 0 0 1-2.498.051l-2.497.553.504 2.417c1.589.12 3.026.66 4.095 1.489.345-.308.8-.499 1.301-.499a1.93 1.93 0 0 1 1.93 1.93c0 .736-.41 1.377-1.02 1.701.012.157.017.317.017.477 0 2.383-2.671 4.314-5.966 4.314-3.295 0-5.966-1.931-5.966-4.314 0-.153.006-.306.015-.458a1.86 1.86 0 0 1-1.1-1.701c0-1.066.864-1.93 1.93-1.93.52 0 .991.205 1.343.541 1.082-.816 2.532-1.341 4.128-1.442l-.634-2.885 2.126-.47a1.24 1.24 0 0 1 .195-.015zM8.122 12.14a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28zm7.755 0a1.14 1.14 0 1 0 0 2.28 1.14 1.14 0 0 0 0-2.28zm-5.048 3.51c.36.36.945.36 1.305 0a.395.395 0 0 1 .559.559c-.669.669-1.754.669-2.423 0a.395.395 0 0 1 .559-.559z" /></svg>
                                </a>
                                <a href="https://github.com/malek262" target="_blank" rel="noopener noreferrer" title="GitHub" style={{ color: 'var(--text-muted)', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-3px)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    <Github size={24} />
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
                            Developed by <a href="https://github.com/malek262" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>malek262</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
