import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';
import ClaudeCodeColor from '@lobehub/icons/es/ClaudeCode/components/Color';
import CodexColor from '@lobehub/icons/es/Codex/components/Color';
import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';

import clawLogo from '../assets/claw-logo.svg';

const CLIENTS = [
    { name: 'OpenCode', Icon: OpenCodeMono },
    { name: 'Claude Code', Icon: ClaudeCodeColor },
    { name: 'Codex CLI', Icon: CodexColor },
];

// One scene per rule tier + mode. The gateway acts on the system prompt only —
// messages and tools always pass through untouched.
const SCENES = [
    {
        mode: 'append',
        tier: 'client rule',
        caption: 'your house rules steer this client — on any provider',
    },
    {
        mode: 'patch',
        tier: 'combo rule',
        caption: 'one line rewritten — the other 19,999 tokens pass untouched',
    },
    {
        mode: 'replace',
        tier: 'provider rule',
        caption: 'your battle-tested prompt installed for this provider',
    },
];

const SCENE_MS = 5400;

const REP_OLD = '“You are ClawCode, a coding agent…”';
const REP_NEW = '“Your full prompt — tone, rules & discipline.”';

function ReplaceScene({ live }) {
    const [st, setSt] = useState(() => (live ? { phase: 'del', n: 0 } : { phase: 'done', n: REP_NEW.length }));

    useEffect(() => {
        if (!live) return undefined;
        const start = performance.now();
        const DEL_START = 2100;
        const DEL_DUR = 900;
        const TYPE_START = 3150;
        const TYPE_DUR = 1200;
        const id = setInterval(() => {
            const t = performance.now() - start;
            if (t < TYPE_START) {
                const gone = t <= DEL_START
                    ? 0
                    : Math.min(REP_OLD.length, Math.round(((t - DEL_START) / DEL_DUR) * REP_OLD.length));
                setSt({ phase: 'del', n: gone });
            } else {
                const n = Math.min(REP_NEW.length, Math.round(((t - TYPE_START) / TYPE_DUR) * REP_NEW.length));
                setSt({ phase: n >= REP_NEW.length ? 'done' : 'type', n });
                if (n >= REP_NEW.length) clearInterval(id);
            }
        }, 40);
        return () => clearInterval(id);
    }, [live]);

    if (!live) return <span className="pc-sys-new">{REP_NEW}</span>;

    if (st.phase === 'del') {
        return (
            <span className="pc-sys-old">
                {REP_OLD.slice(0, REP_OLD.length - st.n)}
                <span className="pc-caret" />
            </span>
        );
    }
    if (st.phase === 'type') {
        return (
            <span className="pc-sys-new">
                {REP_NEW.slice(0, st.n)}
                <span className="pc-caret" />
            </span>
        );
    }
    return <span className="pc-sys-new">{REP_NEW}</span>;
}

function SystemScene({ mode, live }) {
    if (mode === 'append') {
        return (
            <div className="pc-sys-scene pc-sys-append">
                <span className="pc-sys-base">“You are ClawCode, a coding agent…</span>
                <span className="pc-sys-add">+ Plan before coding. Follow project conventions.”</span>
            </div>
        );
    }
    if (mode === 'patch') {
        return (
            <div className="pc-sys-scene pc-sys-patch">
                <span className="pc-sys-base">You are ClawCode, a coding agent that…</span>
                <span className="pc-sys-bad">✕ <span className="pc-sys-strike">never explain your reasoning</span></span>
                <span className="pc-sys-fix">✓ always explain your reasoning briefly</span>
            </div>
        );
    }
    return (
        <div className="pc-sys-scene pc-sys-replace">
            <ReplaceScene key={live ? 'live' : 'static'} live={live} />
        </div>
    );
}

const r1 = (n) => Math.round(n * 10) / 10;

// Horizontal S-curve between two ports — same wire language as the hero diagram
function curve(x1, y1, x2, y2) {
    const t = Math.max(28, Math.abs(x2 - x1) * 0.5);
    return `M ${r1(x1)} ${r1(y1)} C ${r1(x1 + t)} ${r1(y1)}, ${r1(x2 - t)} ${r1(y2)}, ${r1(x2)} ${r1(y2)}`;
}

export default function PromptControlDiagram() {
    const rootRef = useRef(null);
    const nodeRef = useRef(null);
    const gwRef = useRef(null);
    const provRef = useRef(null);
    const clientRefs = useRef([]);
    const [geom, setGeom] = useState(null);
    const [scene, setScene] = useState(0);
    const [active, setActive] = useState(false);
    const [inView, setInView] = useState(false);
    const [hover, setHover] = useState(null);
    const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    const measure = useCallback(() => {
        const root = rootRef.current;
        const node = nodeRef.current;
        const gw = gwRef.current;
        if (!root || !node || !gw) return;
        const r0 = root.getBoundingClientRect();
        const nr = node.getBoundingClientRect();
        const gr = gw.getBoundingClientRect();
        const nodeY = r1(nr.top - r0.top + nr.height / 2);
        const nodeL = r1(nr.left - r0.left);
        const nodeR = r1(nr.right - r0.left);
        const nodeCX = r1(nodeL + nr.width / 2);
        const nodeB = r1(nr.bottom - r0.top);
        const gwTop = r1(gr.top - r0.top);

        // Line starts 1px inside the tile and ends 2px inside the node tile —
        // reads as physically attached, same as the hero diagram.
        const clients = clientRefs.current.filter(Boolean).map((el) => {
            const r = el.getBoundingClientRect();
            const x = r1(r.right - r0.left);
            const y = r1(r.top - r0.top + r.height / 2);
            return { x, y, d: curve(x - 1, y, nodeL + 2, nodeY) };
        });
        let prov = null;
        let outPath = null;
        if (provRef.current) {
            const pr = provRef.current.getBoundingClientRect();
            prov = { x: r1(pr.left - r0.left), y: r1(pr.top - r0.top + pr.height / 2) };
            outPath = curve(nodeR - 2, nodeY, prov.x + 1, prov.y);
        }
        const downPath = `M ${nodeCX} ${r1(nodeB - 2)} L ${nodeCX} ${r1(gwTop + 2)}`;

        setGeom({
            w: Math.round(r0.width),
            h: Math.round(r0.height),
            clients,
            prov,
            outPath,
            downPath,
            nodeCX,
            nodeB,
            nodeT: r1(nr.top - r0.top),
            nodeL,
            nodeW: r1(nr.width),
            nodeH: r1(nr.height),
            gwTop,
        });
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

    // Start the draw-in only when the diagram scrolls into view; keep tracking
    // visibility so the SMIL packet timeline can be paused offscreen.
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return undefined;
        const io = new IntersectionObserver(([e]) => {
            setInView(e.isIntersecting);
            if (e.isIntersecting) setActive(true);
        }, { threshold: 0.2, rootMargin: '120px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!inView || reduced) return undefined;
        const id = setInterval(() => setScene((s) => (s + 1) % SCENES.length), SCENE_MS);
        return () => clearInterval(id);
    }, [inView, reduced]);

    const { mode, tier, caption } = SCENES[scene];

    const bindItem = (id) => ({
        onMouseEnter: () => setHover(id),
        onMouseLeave: () => setHover(null),
    });

    const linkClass = (id) => `pc-link${hover === id ? ' on' : ''}`;

    return (
        <div
            ref={rootRef}
            className={`pc-diagram${active ? ' pc-on' : ''}${hover ? ' pc-has-hover' : ''}`}
            role="group"
            aria-label="Diagram: a request travels from any client to ClawRouter, which surgically edits only the system prompt according to your rules, then forwards it to the provider — messages and tools untouched"
        >
            {geom && geom.prov && geom.clients.length === CLIENTS.length && (
                <svg
                    className="pc-svg"
                    viewBox={`0 0 ${geom.w} ${geom.h}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {geom.clients.map((c, i) => (
                        <path
                            key={`c-${i}`}
                            id={`pc-link-c${i}`}
                            className={linkClass(`c${i}`)}
                            d={c.d}
                            pathLength={1}
                            style={{ '--i': i }}
                        />
                    ))}
                    <path id="pc-link-out" className={linkClass('p')} d={geom.outPath} pathLength={1} style={{ '--i': 3 }} />
                    <path id="pc-link-down" className="pc-link" d={geom.downPath} pathLength={1} style={{ '--i': 4 }} />

                    {/* Connector ports at tile edges */}
                    {geom.clients.map((c, i) => (
                        <circle key={`pt-${i}`} cx={r1(c.x + 2.5)} cy={c.y} r={2.5} className={`pc-port${hover === `c${i}` ? ' on' : ''}`} />
                    ))}
                    <circle cx={r1(geom.prov.x - 2.5)} cy={geom.prov.y} r={2.5} className={`pc-port${hover === 'p' ? ' on' : ''}`} />
                </svg>
            )}

            {/* One request per scene. The keyed container remounts per scene so
                the SMIL timeline restarts in sync; it lives alone inside a stable
                wrapper so React reconciliation never confuses it with the
                conditionally-rendered wire <svg> sibling above.
                Each dot rides the ACTUAL drawn wire via animateMotion + mpath —
                the same principle as the hero diagram — so it stays glued to the
                line 100% at any size. The drop glow and node flash render in this
                svg's own coordinate space from the same measured geometry.
                fill="freeze" keeps each dot at its path end while it fades, so
                a visible dot never snaps back to the svg origin.
                in (0.21–1.41s) → node flash → down into the inspector
                (2.0–2.58s) → hold while the edit happens → back up
                (3.66–4.38s) → out to the provider (4.49–5.24s) */}
            <div className="pc-pkts-wrap" aria-hidden="true">
                <div key={scene} className="pc-pkts">
                    {inView && !reduced && geom && geom.prov && geom.clients.length === CLIENTS.length && (
                        <svg
                            className="pc-svg pc-svg-fx"
                            viewBox={`0 0 ${geom.w} ${geom.h}`}
                            preserveAspectRatio="none"
                        >
                            <path className="pc-drop-glow" d={geom.downPath} />
                            <rect
                                className="pc-flash"
                                x={geom.nodeL}
                                y={geom.nodeT}
                                width={geom.nodeW}
                                height={geom.nodeH}
                                rx={15}
                            />
                            <circle className="pc-pkt" r={3.5} opacity={0}>
                                <set attributeName="opacity" to={0.95} begin="0.21s" />
                                <set attributeName="opacity" to={0} begin="1.83s" />
                                <animateMotion dur="1.2s" begin="0.21s" fill="freeze">
                                    <mpath href={`#pc-link-c${scene % CLIENTS.length}`} />
                                </animateMotion>
                            </circle>
                            <circle className="pc-pkt" r={3.5} opacity={0}>
                                <set attributeName="opacity" to={0.95} begin="2s" />
                                <set attributeName="opacity" to={0} begin="4.44s" />
                                <animateMotion
                                    dur="2.4s"
                                    begin="2s"
                                    calcMode="linear"
                                    keyPoints="0;1;1;0"
                                    keyTimes="0;0.24;0.7;1"
                                    fill="freeze"
                                >
                                    <mpath href="#pc-link-down" />
                                </animateMotion>
                            </circle>
                            <circle className="pc-pkt" r={3.5} opacity={0}>
                                <set attributeName="opacity" to={0.95} begin="4.49s" />
                                <set attributeName="opacity" to={0} begin="5.34s" />
                                <animateMotion dur="0.75s" begin="4.49s" fill="freeze">
                                    <mpath href="#pc-link-out" />
                                </animateMotion>
                            </circle>
                        </svg>
                    )}
                </div>
            </div>

            <div className="pc-flow" aria-hidden="true">
                <span className="pc-side-label pc-lbl-a">Any client</span>
                <span className="pc-node-name">ClawRouter</span>
                <span className="pc-side-label pc-lbl-b">The provider</span>

                <div className="pc-clients">
                    {CLIENTS.map((c, i) => (
                        <span
                            key={c.name}
                            className="pc-tile"
                            ref={(el) => { clientRefs.current[i] = el; }}
                            title={c.name}
                            {...bindItem(`c${i}`)}
                        >
                            <c.Icon size={19} title={c.name} />
                        </span>
                    ))}
                </div>

                <span className="pc-node-tile" ref={nodeRef}>
                    <img src={clawLogo} alt="" />
                </span>

                <span className="pc-tile pc-tile-p" ref={provRef} title="Anthropic" {...bindItem('p')}>
                    <AnthropicMono size={22} title="Anthropic" />
                </span>
            </div>

            {/* Keyed by scene: the glow frame replays in sync with the packet */}
            <div className="pc-gateway" ref={gwRef} key={scene}>
                <div className="pc-gw-head" aria-hidden="true">
                    <span className="pc-gw-title">Inside the gateway · request body</span>
                    <div className="pc-tiers">
                        {SCENES.map((s, i) => (
                            <React.Fragment key={s.tier}>
                                {i > 0 && <span className="pc-tier-arrow">→</span>}
                                <span className={`pc-tier${i === scene ? ' pc-tier-on' : ''}`}>{s.tier}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="pc-env" aria-hidden="true">
                    <div className="pc-env-head">
                        <span>POST · chat/completions</span>
                        <span className="pc-env-badge">any of 4 formats</span>
                    </div>

                    <div className={`pc-row pc-row-system pc-sys-${mode}`}>
                        <span className="pc-row-key">system</span>
                        <div className="pc-sys-body">
                            {/* Keyed by scene so per-scene animations restart cleanly */}
                            <SystemScene key={scene} mode={mode} live={active && !reduced} />
                            <span className="pc-sys-more">⋯ 19,980 more tokens</span>
                        </div>
                    </div>

                    <div className="pc-row pc-row-lock">
                        <Lock size={11} aria-hidden="true" />
                        <span className="pc-row-key">messages</span>
                        <span className="pc-row-val">24 turns</span>
                        <span className="pc-untouched">untouched</span>
                    </div>
                    <div className="pc-row pc-row-lock">
                        <Lock size={11} aria-hidden="true" />
                        <span className="pc-row-key">tools[]</span>
                        <span className="pc-row-val">13 defs</span>
                        <span className="pc-untouched">untouched</span>
                    </div>
                </div>

                <div className="pc-gw-foot" aria-hidden="true">
                    <div className="pc-modes">
                        {SCENES.map((s, i) => (
                            <span key={s.mode} className={`pc-mode${i === scene ? ' pc-mode-on' : ''}`}>{s.mode}</span>
                        ))}
                    </div>
                    <span key={scene} className="pc-caption">{tier} · {caption}</span>
                </div>
            </div>
        </div>
    );
}
