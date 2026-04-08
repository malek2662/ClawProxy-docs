import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { docs, DOC_SECTIONS, searchIndex } from '../data/docs';

/* ---------- Scrollable table wrapper with overflow detection ---------- */
function ScrollableTable({ children, ...props }) {
    const wrapperRef = useRef(null);
    const [overflows, setOverflows] = useState(false);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        const check = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [children]);

    return (
        <div>
            <div className="table-scroll-wrapper" ref={wrapperRef}>
                <table {...props}>{children}</table>
            </div>
            {overflows && (
                <div className="table-scroll-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    Swipe to see more
                </div>
            )}
        </div>
    );
}

/* ---------- Copy-to-clipboard code block wrapper ---------- */
function CodeBlock({ language, children }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, '')).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [children]);

    return (
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            {/* Language badge + copy button bar */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(80, 223, 144, 0.06)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                border: '1px solid var(--border-light)',
                borderBottom: 'none',
                padding: '6px 12px',
            }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {language || 'text'}
                </span>
                <button
                    onClick={handleCopy}
                    style={{
                        background: copied ? 'rgba(80, 223, 144, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        border: `1px solid ${copied ? 'rgba(80, 223, 144, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                        color: copied ? 'var(--primary)' : 'var(--text-muted)',
                        borderRadius: '5px',
                        padding: '3px 10px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'Outfit, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => { if (!copied) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.color = 'var(--text-main)'; }}}
                    onMouseOut={(e) => { if (!copied) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'var(--text-muted)'; }}}
                >
                    {copied ? (
                        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                    ) : (
                        <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                    )}
                </button>
            </div>
            <SyntaxHighlighter
                language={language || 'text'}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    border: '1px solid var(--border-light)',
                    borderTop: 'none',
                    fontSize: '0.88em',
                    padding: '1.2rem',
                    background: '#121212',
                }}
                codeTagProps={{ style: { fontFamily: 'JetBrains Mono, monospace' } }}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    );
}


/* ---------- Docs Search component ---------- */
function DocSearch({ onNavigate }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const debounceRef = useRef(null);

    // Perform search with debounce
    const handleSearch = useCallback((q) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (q.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        debounceRef.current = setTimeout(() => {
            const lower = q.toLowerCase();
            const found = [];
            for (const entry of searchIndex) {
                if (found.length >= 30) break;
                const headingMatch = entry.headingTitle && entry.headingTitle.toLowerCase().includes(lower);
                const textMatch = entry.text.toLowerCase().includes(lower);
                if (headingMatch || textMatch) {
                    // Extract snippet around match
                    let snippet = '';
                    const textLower = entry.text.toLowerCase();
                    const matchPos = textLower.indexOf(lower);
                    if (matchPos >= 0) {
                        const start = Math.max(0, matchPos - 40);
                        const end = Math.min(entry.text.length, matchPos + q.length + 80);
                        snippet = (start > 0 ? '...' : '') + entry.text.slice(start, end) + (end < entry.text.length ? '...' : '');
                    } else if (entry.text.length > 0) {
                        snippet = entry.text.slice(0, 120) + (entry.text.length > 120 ? '...' : '');
                    }
                    found.push({ ...entry, snippet, headingMatch });
                }
            }
            // Sort: heading matches first
            found.sort((a, b) => (b.headingMatch ? 1 : 0) - (a.headingMatch ? 1 : 0));
            setResults(found);
            setActiveIdx(0);
            setIsOpen(true);
        }, 150);
    }, []);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        handleSearch(val);
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const navigateToResult = useCallback((result) => {
        onNavigate(result.key, result.headingId);
        setIsOpen(false);
        setQuery('');
        setResults([]);
    }, [onNavigate]);

    // Keyboard handling
    const handleKeyDown = (e) => {
        if (!isOpen || results.length === 0) {
            if (e.key === 'Escape') {
                clearSearch();
                inputRef.current?.blur();
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIdx(prev => Math.min(prev + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIdx(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            navigateToResult(results[activeIdx]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    // Scroll active result into view
    useEffect(() => {
        if (!resultsRef.current) return;
        const active = resultsRef.current.querySelector('.docs-search-result-item.active');
        if (active) active.scrollIntoView({ block: 'nearest' });
    }, [activeIdx]);

    // Global Ctrl+K / Cmd+K shortcut
    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            const wrapper = inputRef.current?.closest('.docs-search-wrapper');
            if (wrapper && !wrapper.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    // Highlight matched text in snippet
    const highlightSnippet = (text, q) => {
        if (!q || q.length < 2) return text;
        const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === q.toLowerCase()
                ? <mark key={i} className="docs-search-highlight">{part}</mark>
                : part
        );
    };

    return (
        <div className="docs-search-wrapper">
            <div className="docs-search-input-box">
                <span className="docs-search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="docs-search-input"
                    placeholder="Search docs..."
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (results.length > 0) setIsOpen(true); }}
                />
                {query ? (
                    <button className="docs-search-clear" onClick={clearSearch} aria-label="Clear search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                ) : (
                    <span className="docs-search-kbd">
                        <kbd>{navigator.platform?.includes('Mac') ? '\u2318' : 'Ctrl'}</kbd>
                        <kbd>K</kbd>
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="docs-search-results" ref={resultsRef}>
                    {results.length > 0 ? (
                        <>
                            <div className="docs-search-results-header">{results.length} result{results.length !== 1 ? 's' : ''}</div>
                            {results.map((r, i) => (
                                <div
                                    key={`${r.key}-${r.headingId}-${i}`}
                                    className={`docs-search-result-item${i === activeIdx ? ' active' : ''}`}
                                    onClick={() => navigateToResult(r)}
                                    onMouseEnter={() => setActiveIdx(i)}
                                >
                                    <span className="docs-search-result-doc">{r.sectionTitle} &rsaquo; {r.docTitle}</span>
                                    {r.headingTitle && (
                                        <span className="docs-search-result-heading">{highlightSnippet(r.headingTitle, query)}</span>
                                    )}
                                    {r.snippet && (
                                        <span className="docs-search-result-snippet">{highlightSnippet(r.snippet, query)}</span>
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="docs-search-empty">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            No results for &ldquo;{query}&rdquo;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function DocsPage() {
    const [activeTab, setActiveTab] = useState('quickstart');
    const [activeHeading, setActiveHeading] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [drawerOpen]);

    // Search result navigation — switch tab and scroll to heading
    const handleSearchNavigate = useCallback((key, headingId) => {
        setActiveTab(key);
        setDrawerOpen(false);
        if (headingId) {
            setTimeout(() => {
                const element = document.getElementById(headingId);
                if (element) {
                    const yOffset = -90;
                    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    setActiveHeading(headingId);
                }
            }, 200);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveHeading('');
        }
    }, []);

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
            const contentArea = document.querySelector('.md-content');
            if (!contentArea) return;
            const headings = Array.from(contentArea.querySelectorAll('h2, h3'));
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
        <>
        {/* Mobile docs menu button — outside animate-fade-in so position:fixed works */}
        <button
            className="docs-mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
        </button>

        {/* Mobile navigation drawer */}
        {drawerOpen && (
            <div className="docs-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
                <aside className="docs-drawer" onClick={(e) => e.stopPropagation()}>
                    <div className="docs-drawer-header">
                        <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>Documentation</span>
                        <button
                            onClick={() => setDrawerOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <DocSearch onNavigate={handleSearchNavigate} />
                    {DOC_SECTIONS.map((section, sectionIdx) => (
                        <div key={sectionIdx} style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {section.label}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {section.keys.map((key) => {
                                    const isActive = activeTab === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setActiveTab(key);
                                                setDrawerOpen(false);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                setActiveHeading('');
                                            }}
                                            style={{
                                                width: '100%',
                                                background: isActive ? 'rgba(80, 223, 144, 0.1)' : 'transparent',
                                                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                                                border: 'none',
                                                padding: '10px 12px',
                                                borderRadius: '6px',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontWeight: isActive ? 500 : 400,
                                                fontFamily: 'Outfit, sans-serif',
                                                fontSize: '0.95rem',
                                                transition: 'background 0.15s'
                                            }}
                                        >
                                            {docs[key].title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </aside>
            </div>
        )}

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
                    <DocSearch onNavigate={handleSearchNavigate} />
                    {DOC_SECTIONS.map((section, sectionIdx) => (
                        <div key={sectionIdx} style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                {section.label}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {section.keys.map((key) => {
                                    const isActive = activeTab === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => {
                                                setActiveTab(key);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                setActiveHeading('');
                                            }}
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
                                                fontSize: '0.93rem'
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
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </aside>

                {/* Center: Markdown Content Area */}
                <main style={{ flex: 1, minWidth: 0, maxWidth: '800px' }}>
                    <div style={{ padding: '0 20px' }}>
                        <div className="md-content">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSlug, rehypeRaw]}
                                components={{
                                    code: ({ node, inline, className, children, ...props }) => {
                                        const match = /language-(\w+)/.exec(className || '');
                                        // Block code (inside <pre>)
                                        if (!inline && match) {
                                            return <CodeBlock language={match[1]}>{children}</CodeBlock>;
                                        }
                                        if (!inline && !match && String(children).includes('\n')) {
                                            return <CodeBlock language="text">{children}</CodeBlock>;
                                        }
                                        // Inline code
                                        return <code className={className} {...props}>{children}</code>;
                                    },
                                    pre: ({ children }) => {
                                        // Let CodeBlock handle the <pre> wrapper
                                        return <>{children}</>;
                                    },
                                    table: ({ children, ...props }) => (
                                        <ScrollableTable {...props}>{children}</ScrollableTable>
                                    ),
                                    a: ({ node, href, children, ...props }) => {
                                        // Handle in-page anchor links (e.g. #guide-1-first-launch)
                                        if (href?.startsWith('#')) {
                                            const anchorId = href.slice(1);
                                            return (
                                                <a
                                                    href={href}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        scrollToHeading(anchorId);
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
                    width: '280px',
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
                                                    padding: '2px 0',
                                                    lineHeight: '1.4'
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
                                                            lineHeight: '1.4'
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
        </>
    );
}
