import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const ITEMS = [
    {
        q: 'Is ClawRouter free to use?',
        a: 'ClawRouter is premium software with a one-time $20 lifetime license — no subscription, no recurring billing. The documentation is free to read, and the license is activated on your own machine after purchase.',
    },
    {
        q: 'Does my data leave my machine?',
        a: 'No. ClawRouter runs entirely on your hardware. All configuration, keys, quota data and logs are stored locally. The only external requests are the ones you route to your configured AI providers, plus a periodic license check.',
    },
    {
        q: 'Which operating systems are supported?',
        a: 'Linux, macOS and Windows. Installation is a single command per platform, and the dashboard runs in your browser at localhost:3030.',
    },
    {
        q: 'How does activation work?',
        a: 'After purchase, your receipt includes a personal install command. On first launch the dashboard shows an Installation ID — send it with your purchase email to support@clawrouter.qzz.io and your license is activated promptly.',
    },
    {
        q: 'Can any AI client work with any provider?',
        a: 'Yes — that is the core of ClawRouter. It translates between the four major API formats (OpenAI, Anthropic, Gemini and Google AI Studio), so clients like Claude Code, OpenCode, Codex CLI, Cline and Aider can talk to providers they were never designed for.',
    },
    {
        q: 'Where are models configured?',
        a: 'Models are defined in your AI client, not in the dashboard — ClawRouter routes whatever model name arrives. The exception is Model Fallback, where you can map a failing model to a replacement.',
    },
    {
        q: 'What is your refund policy?',
        a: 'All sales are final. Because ClawRouter is a self-hosted digital product delivered instantly, please review the documentation and verify compatibility with your setup before purchasing.',
    },
];

function FaqItem({ item, open, onToggle, index }) {
    return (
        <Reveal className={`faq-item glow-card${open ? ' open' : ''}`} delay={index * 50}>
            <button
                type="button"
                className="faq-q"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
            >
                <span className="faq-q-text">{item.q}</span>
                <span className="faq-icon" aria-hidden="true"><Plus size={16} /></span>
            </button>
            <div
                className="faq-a"
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
            >
                <div className="faq-a-inner">
                    <p>{item.a}</p>
                </div>
            </div>
        </Reveal>
    );
}

export default function Faq() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="section section-tint" aria-label="Frequently asked questions">
            <div className="container">
                <Reveal className="section-head center">
                    <div className="section-eyebrow">FAQ</div>
                    <h2 className="section-title">Questions, <span className="accent">answered</span></h2>
                    <p className="section-desc">
                        Everything people ask before they buy. For deeper topics, the full
                        documentation has you covered.
                    </p>
                </Reveal>

                <div className="faq-list">
                    {ITEMS.map((item, i) => (
                        <FaqItem
                            key={item.q}
                            item={item}
                            index={i}
                            open={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </div>

                <Reveal className="faq-foot" delay={100}>
                    <span>Still curious?</span>
                    <Link to="/docs?tab=faq" className="link-arrow">
                        Browse the full FAQ <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
