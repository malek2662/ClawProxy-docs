import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { docs } from '../data/docs';

export default function DocsPage() {
    const [activeTab, setActiveTab] = useState('quickstart');
    const [activeHeading, setActiveHeading] = useState('');
    const location = useLocation();

    // Utility to scroll directly to the heading by ID
    const scrollToHeading = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90; // Offset for fixed navbar
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveHeading(id);
        }
    };

    // URL parameter handling for deep linking
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const anchor = params.get('anchor');

        if (tab && docs[tab]) {
            setActiveTab(tab);

            // If there's an anchor, we need to wait for the content to render
            if (anchor) {
                setTimeout(() => {
                    const element = document.getElementById(anchor);
                    if (element) {
                        const yOffset = -90;
                        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        setActiveHeading(anchor);
                    }
                }, 200); // Increased timeout slightly for reliable render
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            window.scrollTo(0, 0);
            setActiveHeading('');
        }
    }, [location]);

    // ScrollSpy logic to highlight active heading in TOC
    useEffect(() => {
        const handleScroll = () => {
            const headings = Array.from(document.querySelectorAll('h2, h3'));
            if (headings.length === 0) return;

            // Find the heading that is most recently scrolled past the top offset
            const yOffset = 120; // A bit below the navbar for active trigger
            let currentActiveId = '';

            for (const heading of headings) {
                if (heading.getBoundingClientRect().top <= yOffset) {
                    currentActiveId = heading.id;
                } else {
                    break; // Stop once we hit a heading that's below the trigger line
                }
            }

            if (currentActiveId) {
                setActiveHeading(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeTab]);

    return (
        <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 20px 60px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', width: '100%', maxWidth: '1400px', gap: '40px' }}>

                {/* Left Sidebar: Document Selection */}
                <aside className="left-sidebar" style={{
                    width: '260px',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 'calc(var(--nav-height) + 40px)',
                    height: 'calc(100vh - var(--nav-height) - 80px)',
                    overflowY: 'auto',
                    borderRight: '1px solid var(--border-light)',
                    paddingRight: '20px'
                }}>
                    <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', color: 'var(--text-muted)', fontWeight: '600' }}>
                        First steps
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Object.keys(docs).map((key) => {
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    style={{
                                        width: '100%',
                                        background: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                        color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                        border: 'none',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontWeight: isActive ? '500' : '400',
                                        transition: 'all 0.15s ease',
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '0.95rem'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                        }
                                    }}
                                >
                                    {docs[key].title}
                                </button>
                            )
                        })}
                    </div>
                </aside>

                {/* Center: Markdown Content Area */}
                <main style={{ flex: 1, minWidth: 0, maxWidth: '800px' }}>
                    <div style={{ padding: '0 20px' }}>
                        <div className="md-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSlug, rehypeRaw]}
                                components={{
                                    a: ({ node, href, children, ...props }) => {
                                        // Intercept internal doc links
                                        const docKeys = {
                                            'COMMANDS.md': 'commands',
                                            'FAQ.md': 'faq',
                                            'QUICKSTART.md': 'quickstart',
                                            'ClawProxy-Knowledge-Base.md': 'knowledgeBase',
                                            'OPENCLAW_PROVIDERS.md': 'providers'
                                        };

                                        // Check if href is one of our doc files
                                        const fileName = href?.split('/').pop();
                                        if (docKeys[fileName]) {
                                            return (
                                                <a
                                                    href={`#${docKeys[fileName]}`}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setActiveTab(docKeys[fileName]);
                                                    }}
                                                    {...props}
                                                >
                                                    {children}
                                                </a>
                                            );
                                        }

                                        // Default behavior for other links
                                        return <a href={href} target={href?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" {...props}>{children}</a>;
                                    }
                                }}
                            >
                                {docs[activeTab].content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </main>

                {/* Right Sidebar: Table of Contents (On this page) */}
                <aside className="right-sidebar" style={{
                    width: '240px',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 'calc(var(--nav-height) + 40px)',
                    height: 'calc(100vh - var(--nav-height) - 80px)',
                    overflowY: 'auto'
                }}>
                    {docs[activeTab].toc && docs[activeTab].toc.length > 0 && (
                        <div className="animate-fade-in" style={{ paddingLeft: '16px', borderLeft: '1px solid var(--border-light)' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                                On this page
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {docs[activeTab].toc.map((h2, idx) => {
                                    const isH2Active = activeHeading === h2.id;
                                    return (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <button
                                                onClick={() => scrollToHeading(h2.id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: isH2Active ? 'var(--primary)' : 'var(--text-muted)',
                                                    textAlign: 'left',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    fontFamily: 'Outfit, sans-serif',
                                                    transition: 'color 0.2s',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    padding: '2px 0'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                                                onMouseOut={(e) => e.currentTarget.style.color = isH2Active ? 'var(--primary)' : 'var(--text-muted)'}
                                            >
                                                {h2.title}
                                            </button>

                                            {/* Render h3 sub-items if present */}
                                            {h2.items && h2.items.length > 0 && h2.items.map((h3, subIdx) => {
                                                const isH3Active = activeHeading === h3.id;
                                                return (
                                                    <button
                                                        key={`sub-${subIdx}`}
                                                        onClick={() => scrollToHeading(h3.id)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: isH3Active ? 'var(--primary)' : 'rgba(161, 161, 170, 0.6)',
                                                            textAlign: 'left',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            fontFamily: 'Outfit, sans-serif',
                                                            marginLeft: '12px',
                                                            padding: '2px 0',
                                                            transition: 'all 0.2s',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                                                        onMouseOut={(e) => e.currentTarget.style.color = isH3Active ? 'var(--primary)' : 'rgba(161, 161, 170, 0.6)'}
                                                    >
                                                        {h3.title}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
}
