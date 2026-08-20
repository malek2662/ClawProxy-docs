import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, ScrollText, Bell, Lock } from 'lucide-react';
import Reveal from './Reveal';

const STEPS = [
    {
        id: 'dashboard',
        icon: <Gauge size={16} aria-hidden="true" />,
        eyebrow: 'Command center',
        title: 'Every request, one dashboard',
        body: 'A dark-themed control plane for your entire AI stack. Live request volume, success rates, token usage and estimated cost — across every provider and key — update in real time over WebSockets.',
        points: [
            'Live stats, charts and per-provider health',
            '100% local — your data never leaves your machine',
        ],
        link: { to: '/docs?tab=monitoring', label: 'Explore monitoring' },
        src: 'assets/screenshots/dashboard-overview.png',
        w: 2880,
        h: 1800,
        url: 'localhost:3030',
        alt: 'ClawRouter dashboard overview',
    },
    {
        id: 'logs',
        icon: <ScrollText size={16} aria-hidden="true" />,
        eyebrow: 'Observability',
        title: 'Real-time request logs',
        body: 'Full request and response logs streamed live over WebSockets. Monitor usage as it happens, debug issues instantly, and track token consumption per key without leaving the dashboard.',
        points: [
            'Live streaming logs with provider, status and model filters',
            'Persistent history — stored locally, auto-cleaned on your schedule',
        ],
        link: { to: '/docs?tab=monitoring&anchor=view-and-filter-logs', label: 'Explore request logs' },
        src: 'assets/screenshots/logs.png',
        w: 1661,
        h: 945,
        url: 'localhost:3030/logs',
        alt: 'Real-time request logs',
    },
    {
        id: 'alerts',
        icon: <Bell size={16} aria-hidden="true" />,
        eyebrow: 'Alerting',
        title: 'Notifications that find you',
        body: 'Stop watching logs. ClawRouter pushes instant alerts for key rotations, circuit breaker trips and fallback activations — delivered over WebSocket, straight into the dashboard.',
        points: [
            'Key disabled, circuit open, fallback, recovery — every event covered',
            'Click any alert to jump to the affected provider',
        ],
        link: { to: '/docs?tab=monitoring&anchor=monitor-events-with-notifications', label: 'Learn about notifications' },
        src: 'assets/screenshots/notifications.png',
        w: 1580,
        h: 956,
        url: 'localhost:3030',
        alt: 'Real-time notifications',
    },
];

export default function CommandCenter({ onZoom }) {
    const [active, setActive] = useState(0);
    const stepRefs = useRef([]);

    useEffect(() => {
        let raf = 0;

        // The active step is whichever step's vertical center is closest to the
        // viewport center — so the screenshot switches at the exact moment the
        // step takes over the reading position. One source of truth keeps the
        // image, the step highlight and the progress dots in perfect sync.
        const update = () => {
            raf = 0;
            const mid = window.innerHeight / 2;
            let best = 0;
            let bestDist = Infinity;
            stepRefs.current.forEach((el, i) => {
                if (!el) return;
                const r = el.getBoundingClientRect();
                const dist = Math.abs(r.top + r.height / 2 - mid);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = i;
                }
            });
            setActive(best);
        };

        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <section className="section cc-section" aria-label="Dashboard, logs and notifications">
            <div className="container">
                <Reveal className="section-head">
                    <div className="section-eyebrow">Mission control</div>
                    <h2 className="section-title">See everything. <span className="accent">Miss nothing.</span></h2>
                    <p className="section-desc">
                        One dashboard carries the whole operational picture — live traffic, full request
                        history, and instant alerts. Keep scrolling: the screen follows the story.
                    </p>
                </Reveal>

                <div className="cc-layout">
                    <div className="cc-media-col">
                        <div className="cc-frame">
                            <span className="browser-bar" aria-hidden="true">
                                <span className="browser-dots"><i /><i /><i /></span>
                                <span className="browser-url"><Lock size={10} /> {STEPS[active].url}</span>
                            </span>
                            <div className="cc-shots">
                                {STEPS.map((s, i) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        className={`cc-shot${i === active ? ' on' : ''}`}
                                        onClick={() => onZoom(s.src)}
                                        aria-label={`Enlarge screenshot: ${s.alt}`}
                                        tabIndex={i === active ? 0 : -1}
                                    >
                                        <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading={i === 0 ? 'eager' : 'lazy'} />
                                    </button>
                                ))}
                            </div>
                            <div className="cc-progress" aria-hidden="true">
                                {STEPS.map((s, i) => (
                                    <span key={s.id} className={`cc-progress-dot${i === active ? ' on' : ''}${i < active ? ' done' : ''}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="cc-steps">
                        {STEPS.map((s, i) => (
                            <article
                                key={s.id}
                                data-index={i}
                                ref={(el) => { stepRefs.current[i] = el; }}
                                className={`cc-step${i === active ? ' cc-step-on' : ''}`}
                            >
                                <div className="cc-step-head">
                                    <span className="cc-step-icon">{s.icon}</span>
                                    <span className="cc-step-eyebrow">{s.eyebrow}</span>
                                    <span className="cc-step-num" aria-hidden="true">0{i + 1}</span>
                                </div>
                                <h3 className="cc-step-title">{s.title}</h3>
                                <p className="cc-step-body">{s.body}</p>
                                <ul className="cc-step-points">
                                    {s.points.map((p) => <li key={p}>{p}</li>)}
                                </ul>
                                <Link to={s.link.to} className="link-arrow">
                                    {s.link.label} <ArrowRight size={14} aria-hidden="true" />
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
