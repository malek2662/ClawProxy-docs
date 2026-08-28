import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck, ArrowRight, BadgePercent } from 'lucide-react';
import Reveal from './Reveal';

const POLAR_URL = 'https://buy.polar.sh/polar_cl_8wTBwKsDWMEVH5yLL4uQo2GMOPhE6V0cOytzu41fw3t';

const INCLUDED = [
    'Lifetime license — one payment, no subscription',
    'Unlimited providers, API keys and fallback chains',
    'All 50 provider presets and 7 client setup guides',
    'Dashboard, live logs, quota tracking and notifications',
    'Runs on your hardware — Linux, macOS and Windows',
    'Email support from the developer',
];

export default function Pricing() {
    return (
        <section className="section" id="pricing" aria-label="Pricing">
            <div className="container">
                <Reveal className="section-head center">
                    <div className="section-eyebrow">Licensing</div>
                    <h2 className="section-title">One price. <span className="accent">Yours forever.</span></h2>
                    <p className="section-desc">
                        ClawRouter is premium, self-hosted software. Pay once, own it — no seats,
                        no monthly billing, no feature gates.
                    </p>
                </Reveal>

                <Reveal className="price-card glow-card reveal-scale" delay={80}>
                    <div className="price-glow" aria-hidden="true" />
                    <div className="price-main">
                        <div className="price-top">
                            <span className="price-badge"><BadgePercent size={13} aria-hidden="true" /> Lifetime license</span>
                            <div className="price-figure">
                                <span className="price-currency">$</span>
                                <span className="price-amount">20</span>
                                <span className="price-term">one-time</span>
                            </div>
                        </div>
                        <ul className="price-includes">
                            {INCLUDED.map((item) => (
                                <li key={item}>
                                    <span className="price-check"><Check size={13} aria-hidden="true" /></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="price-side">
                        <a
                            href={POLAR_URL}
                            data-polar-checkout
                            data-polar-checkout-theme="dark"
                            className="btn-primary price-cta"
                        >
                            Get Lifetime Access — $20
                        </a>
                        <p className="price-note">
                            <ShieldCheck size={13} aria-hidden="true" />
                            Secure checkout powered by Polar. Installation &amp; activation
                            instructions arrive automatically with your receipt.
                        </p>
                        <div className="price-divider" aria-hidden="true" />
                        <p className="price-alt">
                            Prefer to read first? The full documentation is free.
                        </p>
                        <Link to="/docs" className="btn-secondary price-docs">
                            Read the Quickstart <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                        <p className="price-legal">
                            All sales are final — please verify compatibility before purchasing.
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
