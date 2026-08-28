// SSR entry — used ONLY by the build-time prerenderer (scripts/prerender.js),
// never shipped to the browser. Vite builds this with `vite build --ssr`.
/* eslint-disable react-refresh/only-export-components -- build entry, not a component module */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App.jsx';
import {
    SITE_URL,
    HOME_META,
    DOC_PAGES,
    docPath,
    getDocMeta,
    homeJsonLd,
    docJsonLd,
} from './seo/seo.js';

export function render(url) {
    return renderToString(
        <StaticRouter location={url}>
            <App />
        </StaticRouter>
    );
}

// Every route that gets its own prerendered HTML file.
// mtimes: { docKey: 'YYYY-MM-DD' } from the markdown files' last-modified dates.
export function getRoutes(mtimes = {}) {
    const routes = [
        {
            path: '/',
            title: HOME_META.title,
            description: HOME_META.description,
            jsonLd: homeJsonLd(),
            lastmod: null,
        },
    ];
    for (const page of DOC_PAGES) {
        const meta = getDocMeta(page.key);
        routes.push({
            path: docPath(page.key),
            title: meta.title,
            description: meta.description,
            jsonLd: docJsonLd(page, mtimes[page.key]),
            lastmod: mtimes[page.key] || null,
        });
    }
    return routes;
}

export { SITE_URL };
