import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import ClaudeCodeColor from '@lobehub/icons/es/ClaudeCode/components/Color';
import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';
import CodexColor from '@lobehub/icons/es/Codex/components/Color';
import ClineMono from '@lobehub/icons/es/Cline/components/Mono';
import OpenClawColor from '@lobehub/icons/es/OpenClaw/components/Color';
import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';

import clawLogo from '../assets/claw-logo.svg';

const CLIENTS = [
    { name: 'Claude Code', Icon: ClaudeCodeColor },
    { name: 'OpenCode', Icon: OpenCodeMono },
    { name: 'Codex CLI', Icon: CodexColor },
    { name: 'Cline', Icon: ClineMono },
    { name: 'OpenClaw', Icon: OpenClawColor },
];

const PROVIDERS = [
    { name: 'Anthropic', Icon: AnthropicMono },
    { name: 'OpenAI', Icon: OpenAIMono },
    { name: 'Google Gemini', Icon: GeminiColor },
    { name: 'OpenRouter', Icon: OpenRouterColor },
];

// Horizontal S-curve between two ports
function curve(x1, y1, x2, y2) {
    const t = Math.max(28, Math.abs(x2 - x1) * 0.5);
    return `M ${x1} ${y1} C ${x1 + t} ${y1}, ${x2 - t} ${y2}, ${x2} ${y2}`;
}

export default function ClientProviderDiagram() {
    const rootRef = useRef(null);
    const nodeRef = useRef(null);
    const svgRef = useRef(null);
    const clientRefs = useRef([]);
    const providerRefs = useRef([]);
    const [geom, setGeom] = useState(null);
    const [active, setActive] = useState(false);
    const [inView, setInView] = useState(false);
    const [hover, setHover] = useState(null);
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const measure = useCallback(() => {
        const root = rootRef.current;
        const node = nodeRef.current;
        if (!root || !node) return;
        const r0 = root.getBoundingClientRect();
        const nr = node.getBoundingClientRect();
        const nodeY = nr.top - r0.top + nr.height / 2;
        const nodeL = nr.left - r0.left;
        const nodeR = nr.right - r0.left;

        const port = (el, side) => {
            const r = el.getBoundingClientRect();
            return {
                x: side === 'right' ? r.right - r0.left : r.left - r0.left,
                y: r.top - r0.top + r.height / 2,
            };
        };

        const clients = clientRefs.current.filter(Boolean).map((el) => {
            const p = port(el, 'right');
            // Line starts 1px inside the tile (hidden beneath it) and ends
            // 2px inside the node tile — reads as physically attached.
            return { ...p, d: curve(p.x - 1, p.y, nodeL + 2, nodeY) };
        });
        const providers = providerRefs.current.filter(Boolean).map((el) => {
            const p = port(el, 'left');
            return { ...p, d: curve(nodeR - 2, nodeY, p.x + 1, p.y) };
        });
        setGeom({ clients, providers, w: Math.round(r0.width), h: Math.round(r0.height) });
    }, []);

    useLayoutEffect(() => {
        measure();
        const ro = new ResizeObserver(measure);
        if (rootRef.current) ro.observe(rootRef.current);
        window.addEventListener('resize', measure);
        if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [measure]);

    // Start draw-in / packets only when the diagram scrolls into view, and
    // keep tracking visibility so the SMIL packet timeline can be paused
    // offscreen (animation-play-state cannot reach SMIL).
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            const visible = entries[0].isIntersecting;
            setInView(visible);
            if (visible) setActive(true);
        }, { threshold: 0.1, rootMargin: '120px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg || reduced) return;
        if (inView) svg.unpauseAnimations();
        else svg.pauseAnimations();
    }, [inView, geom, reduced]);

    const bindItem = (id) => ({
        onMouseEnter: () => setHover(id),
        onMouseLeave: () => setHover(null),
        onFocus: () => setHover(id),
        onBlur: () => setHover(null),
    });

    const linkClass = (id) => `cp-link${hover === id ? ' on' : ''}`;

    return (
        <div
            ref={rootRef}
            className={`cp-diagram${active ? ' cp-on' : ''}${hover ? ' cp-has-hover' : ''}`}
            role="group"
            aria-label="Diagram: AI clients connect to ClawRouter, which routes to any AI provider in its native format"
        >
            {geom && (
                <svg
                    ref={svgRef}
                    className="cp-svg"
                    viewBox={`0 0 ${geom.w} ${geom.h}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {geom.clients.map((c, i) => (
                        <path
                            key={`c-${i}`}
                            id={`cp-link-c${i}`}
                            className={linkClass(`c${i}`)}
                            d={c.d}
                            pathLength={1}
                            style={{ '--i': i }}
                        />
                    ))}
                    {geom.providers.map((p, i) => (
                        <path
                            key={`p-${i}`}
                            id={`cp-link-p${i}`}
                            className={linkClass(`p${i}`)}
                            d={p.d}
                            pathLength={1}
                            style={{ '--i': i + CLIENTS.length }}
                        />
                    ))}

                    {/* Connector ports at tile edges */}
                    {geom.clients.map((c, i) => (
                        <circle key={`pc-${i}`} cx={c.x + 2.5} cy={c.y} r={2.5} className={`cp-port${hover === `c${i}` ? ' on' : ''}`} />
                    ))}
                    {geom.providers.map((p, i) => (
                        <circle key={`pp-${i}`} cx={p.x - 2.5} cy={p.y} r={2.5} className={`cp-port${hover === `p${i}` ? ' on' : ''}`} />
                    ))}

                    {/* Request packets flowing client → node → provider */}
                    {!reduced && geom.clients.map((_, i) => (
                        <circle key={`kc-${i}`} r={2.6} className={`cp-packet${hover === `c${i}` ? ' on' : ''}`} style={{ '--begin': `${i * 0.72}s` }}>
                            <animateMotion dur="3.1s" begin={`${i * 0.72}s`} repeatCount="indefinite">
                                <mpath href={`#cp-link-c${i}`} />
                            </animateMotion>
                        </circle>
                    ))}
                    {!reduced && geom.providers.map((_, i) => (
                        <circle key={`kp-${i}`} r={2.6} className={`cp-packet${hover === `p${i}` ? ' on' : ''}`} style={{ '--begin': `${0.36 + i * 0.72}s` }}>
                            <animateMotion dur="3.1s" begin={`${0.36 + i * 0.72}s`} repeatCount="indefinite">
                                <mpath href={`#cp-link-p${i}`} />
                            </animateMotion>
                        </circle>
                    ))}
                </svg>
            )}

            <div className="cp-col">
                <span className="cp-col-label">Your client</span>
                <div className="cp-col-items">
                    {CLIENTS.map((c, i) => (
                        <div key={c.name} className="cp-item" tabIndex={0} {...bindItem(`c${i}`)}>
                            <span className="cp-tile" ref={(el) => { clientRefs.current[i] = el; }}>
                                <c.Icon size={24} title={c.name} />
                            </span>
                            <span className="cp-name">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cp-mid">
                <span className="cp-col-label cp-mid-spacer" aria-hidden="true">&nbsp;</span>
                <div className="cp-mid-center">
                    <div className="cp-node">
                        <span className="cp-node-tile" ref={nodeRef}>
                            <img src={clawLogo} alt="" />
                        </span>
                        <span className="cp-node-name">ClawRouter</span>
                    </div>
                </div>
            </div>

            <div className="cp-col">
                <span className="cp-col-label">Any provider</span>
                <div className="cp-col-items">
                    {PROVIDERS.map((p, i) => (
                        <div key={p.name} className="cp-item" tabIndex={0} {...bindItem(`p${i}`)}>
                            <span className="cp-tile" ref={(el) => { providerRefs.current[i] = el; }}>
                                <p.Icon size={24} title={p.name} />
                            </span>
                            <span className="cp-name">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
