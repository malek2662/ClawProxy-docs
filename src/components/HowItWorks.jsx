import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Download, Boxes, PlugZap } from 'lucide-react';
import Reveal from './Reveal';

const STEPS = [
    {
        icon: <Download size={17} aria-hidden="true" />,
        title: 'Install',
        body: 'After purchase, your receipt carries a one-line install command for Linux, macOS or Windows. Run it once — ClawRouter is ready.',
        snippet: [
            { c: '# your personal install command arrives', m: true },
            { c: '# with the license receipt', m: true },
            { c: '$ clawrouter start' },
            { c: '✓ running — dashboard at localhost:3030' },
        ],
        link: { to: '/docs/installation', label: 'Installation guide' },
    },
    {
        icon: <Boxes size={17} aria-hidden="true" />,
        title: 'Add a provider',
        body: 'Pick one of 50 built-in presets — or define a custom endpoint — then paste your API keys. Rotation and error tracking are on by default.',
        snippet: [
            { c: 'Dashboard → Providers → Quick Setup', m: true },
            { c: '+ OpenRouter   (free tier)' },
            { c: '+ Gemini       (free tier)' },
            { c: '+ OpenCode Zen (keyless)' },
        ],
        link: { to: '/docs/firstProvider', label: 'Add your first provider' },
    },
    {
        icon: <PlugZap size={17} aria-hidden="true" />,
        title: 'Point your client',
        body: 'Set your AI client’s base URL to your proxy endpoint. Format translation is automatic — any client works with any provider.',
        snippet: [
            { c: '# Claude Code, OpenCode, Codex, Cline…', m: true },
            { c: 'export ANTHROPIC_BASE_URL=\\', m: false },
            { c: '  http://localhost:3030/proxy/anthropic' },
            { c: '# done — requests are routed & translated' , m: true },
        ],
        link: { to: '/docs/aiClientSetup', label: 'Client setup guides' },
    },
];

function CopyRow({ line }) {
    return <span className={`hi-line${line.m ? ' hi-meta' : ''}`}>{line.c}</span>;
}

export default function HowItWorks() {
    return (
        <section className="section section-tint" aria-label="How it works">
            <div className="container">
                <Reveal className="section-head center">
                    <div className="section-eyebrow">How it works</div>
                    <h2 className="section-title">Three steps to <span className="accent">total control</span></h2>
                    <p className="section-desc">
                        No config files, no YAML archaeology. Install, add a provider, point your client —
                        the dashboard handles the rest.
                    </p>
                </Reveal>

                <div className="hi-grid">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.title} className="hi-card glow-card" delay={i * 90}>
                            <div className="hi-card-head">
                                <span className="hi-num" aria-hidden="true">0{i + 1}</span>
                                <span className="hi-icon-tile">{s.icon}</span>
                                <h3 className="hi-title">{s.title}</h3>
                            </div>
                            <p className="hi-body">{s.body}</p>
                            <div className="hi-snippet" role="presentation">
                                {s.snippet.map((line, j) => <CopyRow key={j} line={line} />)}
                            </div>
                            <Link to={s.link.to} className="link-arrow hi-link">
                                {s.link.label} <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="hi-foot" delay={120}>
                    <span className="hi-foot-check"><Check size={14} aria-hidden="true" /></span>
                    <span>Average setup time: under five minutes — activation included.</span>
                </Reveal>
            </div>
        </section>
    );
}
