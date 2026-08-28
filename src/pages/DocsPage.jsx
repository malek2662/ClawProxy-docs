import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Search, X, Menu, ListTree } from 'lucide-react';
import { docs, DOC_SECTIONS, searchIndex } from '../data/docs';
import { docPath } from '../seo/seo';
import { useIsMac } from '../hooks/useIsMac';

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
        }).catch(() => {});
    }, [children]);

    return (
        <div className="code-block">
            <div className="code-block-bar">
                <span className="code-lang"><i className="code-lang-dot" aria-hidden="true" />{language || 'text'}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className={`code-copy${copied ? ' copied' : ''}`}
                    aria-label="Copy code block"
                >
                    {copied ? <><Check size={13} aria-hidden="true" /> Copied</> : <><Copy size={13} aria-hidden="true" /> Copy</>}
                </button>
            </div>
            <SyntaxHighlighter
                language={language || 'text'}
                style={oneDark}
                customStyle={{
                    margin: 0,
                    border: 'none',
                    borderRadius: 0,
                    fontSize: '0.85rem',
                    padding: '16px 18px',
                    background: 'transparent',
                    lineHeight: 1.7,
                }}
                codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
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
    const isMac = useIsMac();

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
                    <Search size={15} aria-hidden="true" />
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
                        <X size={14} aria-hidden="true" />
                    </button>
                ) : (
                    <span className="docs-search-kbd">
                        <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
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
                            <Search size={24} aria-hidden="true" />
                            No results for &ldquo;{query}&rdquo;
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ---------- Sidebar navigation (shared by desktop rail and mobile drawer) ---------- */
function DocsNav({ activeTab, onSelect }) {
    const navRef = useRef(null);
    const [glider, setGlider] = useState(null);

    // Sliding highlight pill that tracks the active nav item
    useLayoutEffect(() => {
        const update = () => {
            const nav = navRef.current;
            if (!nav) return;
            const active = nav.querySelector('.docs-nav-item.active');
            if (active) {
                setGlider({ top: active.offsetTop, height: active.offsetHeight, visible: true });
            } else {
                setGlider((g) => (g ? { ...g, visible: false } : null));
            }
        };
        update();
        window.addEventListener('resize', update);
        if (document.fonts?.ready) document.fonts.ready.then(update).catch(() => {});
        return () => window.removeEventListener('resize', update);
    }, [activeTab]);

    return (
        <div className="docs-nav" ref={navRef}>
            {glider && (
                <span
                    className="docs-nav-glider"
                    style={{
                        transform: `translateY(${glider.top}px)`,
                        height: `${glider.height}px`,
                        opacity: glider.visible ? 1 : 0,
                    }}
                    aria-hidden="true"
                />
            )}
            {DOC_SECTIONS.map((section) => (
                <div key={section.label} className="docs-nav-section">
                    <h3 className="docs-nav-label">{section.label}</h3>
                    <div className="docs-nav-items">
                        {section.keys.map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onSelect(key)}
                                className={`docs-nav-item${activeTab === key ? ' active' : ''}`}
                            >
                                {docs[key].title}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function DocsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { key: routeKey } = useParams();
    // The active doc is derived from the URL — /docs renders the quickstart,
    // /docs/<key> renders that doc. No tab state: the router is the source
    // of truth, so every doc is a real, deep-linkable, crawlable URL.
    const activeTab = routeKey && docs[routeKey] ? routeKey : 'quickstart';
    const [activeHeading, setActiveHeading] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Lock body scroll when drawer is open
    useEffect(() => {
        document.body.style.overflow = drawerOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [drawerOpen]);

    // Unknown doc keys (/docs/nonexistent) → canonical docs home
    useEffect(() => {
        if (routeKey && !docs[routeKey]) navigate(docPath('quickstart'), { replace: true });
    }, [routeKey, navigate]);

    // Legacy /docs?tab=X&anchor=Y links → canonical /docs/X#Y
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (!tab) return;
        const anchor = params.get('anchor');
        navigate(
            docs[tab] ? `${docPath(tab)}${anchor ? `#${anchor}` : ''}` : docPath('quickstart'),
            { replace: true }
        );
    }, [location.search, navigate]);

    // Utility to scroll directly to the heading by ID
    const scrollToHeading = useCallback((id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90; // Offset for fixed navbar
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveHeading(id);
        }
    }, []);

    // Search result navigation — go to the doc's URL and scroll to the heading
    const handleSearchNavigate = useCallback((key, headingId) => {
        setDrawerOpen(false);
        const target = docPath(key) + (headingId ? `#${headingId}` : '');
        if (location.pathname + location.hash === target) {
            // Already on the exact target — the router won't re-render, so scroll manually
            if (headingId) scrollToHeading(headingId);
            else { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveHeading(''); }
            return;
        }
        navigate(target);
    }, [location.pathname, location.hash, navigate, scrollToHeading]);

    const handleNavSelect = useCallback((key) => {
        setDrawerOpen(false);
        const target = docPath(key);
        if (location.pathname === target) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveHeading('');
            return;
        }
        navigate(target);
    }, [location.pathname, navigate]);

    // After navigation: scroll to the hash anchor (deep links like
    // /docs/monitoring#view-and-filter-logs) or back to the top.
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.slice(1);
            // Wait for the content to render before scrolling to the heading
            const timer = setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const y = element.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                    setActiveHeading(id);
                }
            }, 200);
            return () => clearTimeout(timer);
        }
        window.scrollTo(0, 0);
        // Defer the highlight reset out of the effect body (sync setState in
        // effects causes cascading renders) — one frame is enough.
        const raf = requestAnimationFrame(() => setActiveHeading(''));
        return () => cancelAnimationFrame(raf);
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
                type="button"
                className="docs-mobile-menu-btn"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
            >
                <Menu size={18} aria-hidden="true" />
            </button>

            {/* Mobile navigation drawer */}
            {drawerOpen && (
                <div className="docs-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
                    <aside className="docs-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="docs-drawer-header">
                            <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1rem' }}>Documentation</span>
                            <button
                                type="button"
                                onClick={() => setDrawerOpen(false)}
                                aria-label="Close navigation"
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'flex' }}
                            >
                                <X size={20} aria-hidden="true" />
                            </button>
                        </div>
                        <DocSearch onNavigate={handleSearchNavigate} />
                        <DocsNav activeTab={activeTab} onSelect={handleNavSelect} />
                    </aside>
                </div>
            )}

            <div className="animate-fade-in docs-layout">
                <div className="docs-layout-inner">

                    {/* Left Sidebar: Document Selection */}
                    <aside className="docs-side-left">
                        <DocSearch onNavigate={handleSearchNavigate} />
                        <DocsNav activeTab={activeTab} onSelect={handleNavSelect} />
                    </aside>

                    {/* Center: Markdown Content Area */}
                    <main className="docs-main">
                        <div className="md-content md-tab-anim" key={activeTab}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSlug, rehypeRaw]}
                                components={{
                                    code: ({ inline, className, children, ...props }) => {
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
                                    a: ({ href, children, ...props }) => {
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
                    </main>

                    {/* Right Sidebar: Table of Contents (On this page) */}
                    <aside className="docs-side-right">
                        {docs[activeTab].toc && docs[activeTab].toc.length > 0 && (
                            <div className="toc-wrap">
                                <div className="toc-label">
                                    <ListTree size={14} aria-hidden="true" />
                                    On this page
                                </div>

                                <div className="toc-items">
                                    {docs[activeTab].toc.map((h2) => (
                                        <React.Fragment key={h2.id}>
                                            <button
                                                type="button"
                                                onClick={() => scrollToHeading(h2.id)}
                                                className={`toc-link${activeHeading === h2.id ? ' active' : ''}`}
                                            >
                                                {h2.title}
                                            </button>

                                            {/* Render h3 sub-items if present */}
                                            {h2.items && h2.items.length > 0 && h2.items.map((h3) => (
                                                <button
                                                    type="button"
                                                    key={h3.id}
                                                    onClick={() => scrollToHeading(h3.id)}
                                                    className={`toc-link toc-link-sub${activeHeading === h3.id ? ' active' : ''}`}
                                                >
                                                    {h3.title}
                                                </button>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                </div>
            </div>
        </>
    );
}
