// Build-time prerenderer — runs after `vite build` and
// `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.
//
// For every route (landing + one per docs page) it renders the React app to
// static HTML and writes dist/<route>/index.html with the correct title,
// meta description, canonical/OG tags and JSON-LD structured data. It also
// emits sitemap.xml and llms.txt. GitHub Pages then serves real,
// crawlable HTML for every URL — no JavaScript required.

import { readFileSync, writeFileSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, getRoutes, SITE_URL } = await import(
    pathToFileURL(join(ssrDir, 'entry-server.js')).href
);

/* ---------- Last-modified dates for sitemap + TechArticle schema ---------- */

const indexData = JSON.parse(
    readFileSync(join(root, 'src/docs-v2/_index.json'), 'utf8')
);
const mtimes = {};
for (const section of indexData.sections) {
    for (const item of section.items) {
        try {
            const stat = statSync(join(root, 'src/docs-v2', item.path));
            mtimes[item.key] = stat.mtime.toISOString().slice(0, 10);
        } catch {
            mtimes[item.key] = null;
        }
    }
}

/* ---------- HTML templating helpers ---------- */

const escapeAttr = (s) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeText = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const replaceMeta = (html, name, value) => {
    const re = new RegExp(`(<meta (?:name|property)="${name}" content=")[^"]*(")`, '');
    if (!re.test(html)) throw new Error(`prerender: meta tag "${name}" not found in template`);
    return html.replace(re, `$1${escapeAttr(value)}$2`);
};

function applyRoute(template, route, appHtml) {
    const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
    let html = template;

    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeText(route.title)}</title>`);
    html = replaceMeta(html, 'description', route.description);
    html = html.replace(
        /(<link rel="canonical" href=")[^"]*(")/,
        `$1${escapeAttr(canonical)}$2`
    );
    html = replaceMeta(html, 'og:url', canonical);
    html = replaceMeta(html, 'og:title', route.title);
    html = replaceMeta(html, 'og:description', route.description);
    html = replaceMeta(html, 'twitter:title', route.title);
    html = replaceMeta(html, 'twitter:description', route.description);

    // JSON-LD: escape "<" so a stray "</script>" in content can't break out
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': route.jsonLd })
        .replace(/</g, '\\u003c');
    html = html.replace(
        '</head>',
        `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`
    );

    if (!html.includes('<div id="root"></div>')) {
        throw new Error('prerender: <div id="root"></div> not found in template');
    }
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    return html;
}

/* ---------- Render all routes ---------- */

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
const routes = getRoutes(mtimes);
const written = [];

for (const route of routes) {
    const appHtml = render(route.path);
    const html = applyRoute(template, route, appHtml);
    const outFile =
        route.path === '/'
            ? join(distDir, 'index.html')
            : join(distDir, route.path.slice(1), 'index.html');
    mkdirSync(dirname(outFile), { recursive: true });
    writeFileSync(outFile, html);
    written.push(route.path);
}

/* ---------- sitemap.xml ---------- */

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
    .map(
        (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod || today}</lastmod>${route.path === '/' ? '\n    <priority>1.0</priority>' : ''}
  </url>`
    )
    .join('\n')}
</urlset>
`;
writeFileSync(join(distDir, 'sitemap.xml'), sitemap);

/* ---------- llms.txt ---------- */

const docsBySection = new Map();
for (const section of indexData.sections) {
    for (const item of section.items) {
        if (!docsBySection.has(section.title)) docsBySection.set(section.title, []);
        docsBySection.get(section.title).push(item);
    }
}
const docPathOf = (key) => (key === 'quickstart' ? '/docs' : `/docs/${key}`);

const llmsTxt = `# ClawRouter

> ClawRouter is a self-hosted AI routing gateway: a single local endpoint
> (localhost:3030) that routes, manages and monitors AI API requests across
> 50+ providers, with automatic API format translation (OpenAI, Anthropic,
> Gemini, Google AI Studio), key rotation, model/provider failover and quota
> tracking. One-time $20 lifetime license — no subscription. All data, keys
> and logs stay on the user's machine. Works with Claude Code, OpenCode,
> Codex CLI, OpenClaw, Qwen Code, Cline, Aider and any client that accepts a
> custom API base URL. Runs on Linux, macOS and Windows.

## Site

- [Home](${SITE_URL}/): product overview, pricing ($20 lifetime) and FAQ
- [Documentation](${SITE_URL}/docs): full documentation index (quickstart)

## Docs

${[...docsBySection.entries()]
    .map(
        ([section, items]) => `### ${section}

${items.map((item) => `- [${item.title}](${SITE_URL}${docPathOf(item.key)})`).join('\n')}`
    )
    .join('\n\n')}

## Optional

- [Source repository](https://github.com/malek2662/ClawProxy-docs)
- [Sitemap](${SITE_URL}/sitemap.xml)
- Contact: support@clawrouter.qzz.io
`;
writeFileSync(join(distDir, 'llms.txt'), llmsTxt);

/* ---------- Cleanup ---------- */

rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: wrote ${written.length} pages + sitemap.xml + llms.txt`);
