import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import { FAQ_ITEMS } from '../data/faq';

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
                    {FAQ_ITEMS.map((item, i) => (
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
                    <Link to="/docs/faq" className="link-arrow">
                        Browse the full FAQ <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
