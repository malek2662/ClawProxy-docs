// Central SEO/GEO metadata — the single source of truth shared by the
// build-time prerenderer (scripts/prerender.js via entry-server.jsx) and the
// runtime meta hook (hooks/usePageMeta.js). Keep all titles, descriptions and
// structured-data shapes here so the two never drift apart.

import indexData from '../docs-v2/_index.json';
import { docs, stripMarkdown } from '../data/docs';
import { FAQ_ITEMS } from '../data/faq';

export const SITE_URL = 'https://clawrouter.qzz.io';
export const SITE_NAME = 'ClawRouter';
export const OG_IMAGE_URL = `${SITE_URL}/assets/screenshots/dashboard-overview.png`;
export const APP_VERSION = '1.0.18';
export const CONTACT_EMAIL = 'support@clawrouter.qzz.io';
export const REPO_URL = 'https://github.com/malek2662/ClawProxy-docs';
export const PRICE_USD = '20.00';

export const HOME_META = {
    title: 'ClawRouter — Self-hosted AI Routing Gateway',
    description:
        'Route, manage and monitor AI API requests across 50 providers from a single endpoint. ' +
        'Automatic format translation, failover and quota tracking — one-time $20 lifetime license.',
};

/* ------------------------------------------------------------------ */
/* Docs routing                                                        */
/* ------------------------------------------------------------------ */

// Flattened doc pages in manifest order: { key, title, section, file }
export const DOC_PAGES = indexData.sections.flatMap((section) =>
    section.items.map((item) => ({
        key: item.key,
        title: item.title,
        section: section.title,
        file: item.path,
    }))
);

// Canonical URL path for a doc. The quickstart IS the docs landing page.
export function docPath(key) {
    return key === 'quickstart' ? '/docs' : `/docs/${key}`;
}

// Derive a meta description from the first real paragraph of the markdown.
// Heading lines are removed first so the doc's own title is never picked.
export function deriveDescription(key) {
    const doc = docs[key];
    if (!doc) return HOME_META.description;
    const noHeadings = (doc.content || '').replace(/^\s{0,3}#{1,6}\s+.*$/gm, '');
    const plain = stripMarkdown(noHeadings);
    const paragraph = plain
        .split('\n')
        .map((p) => p.trim())
        .find((p) => p.length >= 40 && !p.toLowerCase().startsWith('table of contents'));
    if (!paragraph) return `${doc.title} — ClawRouter documentation.`;
    if (paragraph.length <= 160) return paragraph;
    // Prefer whole sentences that fit the ~160-char meta budget.
    // A period only ends a sentence when followed by whitespace + uppercase
    // (so "opencode.json", "v1.0.18", "e.g." don't split mid-token).
    // Split with captured delimiters so no text is ever dropped, and use
    // lookahead only (no lookbehind) to stay compatible with older Safari.
    const parts = paragraph.split(/([.!?]+\s+(?=[A-Z]))/);
    const sentences = [];
    for (let i = 0; i < parts.length; i += 2) {
        const s = (parts[i] + (parts[i + 1] || '')).trim();
        if (s) sentences.push(s);
    }
    let out = '';
    for (const s of sentences) {
        const next = `${out} ${s.trim()}`.trim();
        if (next.length > 160) break;
        out = next;
    }
    if (out.length >= 40) return out;
    // Single long sentence: cut at the last clause boundary (comma/colon),
    // falling back to the last word boundary.
    const cut = paragraph.slice(0, 157);
    const clause = Math.max(cut.lastIndexOf(','), cut.lastIndexOf(':'), cut.lastIndexOf(';'));
    const at = clause >= 80 ? clause : cut.lastIndexOf(' ');
    return `${cut.slice(0, at).replace(/[,:;]\s*$/, '')}…`;
}

export function getDocMeta(key) {
    const page = DOC_PAGES.find((p) => p.key === key);
    if (!page) return { title: `Docs — ${SITE_NAME}`, description: HOME_META.description };
    return {
        title: `${page.title} — ClawRouter Docs`,
        description: deriveDescription(key),
    };
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data builders                                    */
/* ------------------------------------------------------------------ */

export function organizationJsonLd() {
    return {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        email: CONTACT_EMAIL,
        logo: `${SITE_URL}/favicon.svg`,
        sameAs: [REPO_URL, 'https://reddit.com/user/Malek262'],
    };
}

export function websiteJsonLd() {
    return {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        publisher: { '@id': `${SITE_URL}/#organization` },
    };
}

export function softwareApplicationJsonLd() {
    return {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        description: HOME_META.description,
        image: OG_IMAGE_URL,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Linux, macOS, Windows',
        softwareVersion: APP_VERSION,
        author: { '@id': `${SITE_URL}/#organization` },
        offers: {
            '@type': 'Offer',
            price: PRICE_USD,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: SITE_URL,
        },
    };
}

// items: [{ q, a }] — MUST mirror FAQ content visible on the page
// (Google guideline: FAQPage markup may only describe visible content).
export function faqPageJsonLd(items) {
    return {
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
}

// trail: [{ name, path }] — path relative to the site root
export function breadcrumbJsonLd(trail) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: trail.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`,
        })),
    };
}

export function techArticleJsonLd({ title, description, path, section, dateModified }) {
    return {
        '@type': 'TechArticle',
        headline: title,
        description,
        url: `${SITE_URL}${path}`,
        image: OG_IMAGE_URL,
        inLanguage: 'en',
        articleSection: section,
        ...(dateModified ? { dateModified } : {}),
        author: { '@id': `${SITE_URL}/#organization` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#app` },
    };
}

// Parse the docs FAQ markdown (### Question? headings) into [{ q, a }].
export function parseFaqMarkdown(md) {
    const items = [];
    let current = null;
    for (const line of (md || '').split('\n')) {
        const h = line.match(/^###\s+(.+)$/);
        if (h) {
            if (current) {
                const a = stripMarkdown(current.body.join('\n')).replace(/\s+/g, ' ').trim();
                if (a) items.push({ q: current.q, a });
            }
            current = { q: h[1].replace(/<\/?[^>]+(>|$)/g, '').trim(), body: [] };
        } else if (current) {
            // Stop at the next h2 — questions live under one section
            if (/^##\s+/.test(line)) break;
            current.body.push(line);
        }
    }
    if (current) {
        const a = stripMarkdown(current.body.join('\n')).replace(/\s+/g, ' ').trim();
        if (a) items.push({ q: current.q, a });
    }
    return items;
}

/* ------------------------------------------------------------------ */
/* Per-route JSON-LD graphs                                            */
/* ------------------------------------------------------------------ */

export function homeJsonLd() {
    return [
        organizationJsonLd(),
        websiteJsonLd(),
        softwareApplicationJsonLd(),
        faqPageJsonLd(FAQ_ITEMS),
    ];
}

export function docJsonLd(page, dateModified) {
    const meta = getDocMeta(page.key);
    const graph = [
        organizationJsonLd(),
        breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Docs', path: '/docs' },
            { name: page.title, path: docPath(page.key) },
        ]),
        techArticleJsonLd({
            title: page.title,
            description: meta.description,
            path: docPath(page.key),
            section: page.section,
            dateModified,
        }),
    ];
    // The /docs/faq page renders faq.md — mark its Q&A up as a FAQPage.
    if (page.key === 'faq') {
        const items = parseFaqMarkdown(docs.faq?.content);
        if (items.length > 0) graph.push(faqPageJsonLd(items));
    }
    return graph;
}
