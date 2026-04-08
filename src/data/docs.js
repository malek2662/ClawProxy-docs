import indexData from '../docs-v2/_index.json';
import GithubSlugger from 'github-slugger';

// Import all docs-v2 markdown files as raw strings
const markdownModules = import.meta.glob('../docs-v2/**/*.md', { eager: true, query: '?raw', import: 'default' });

// Utility to remove emojis for clean strings
const stripEmojis = (str) => str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{E0020}-\u{E007F}\u{FE0F}\u{200D}\u{1F400}-\u{1F4FF}]/gu, '').trim();

// Utility to parse markdown headers (## and ###) into a nested Table of Contents array
function generateTOC(markdown) {
    const slugger = new GithubSlugger();
    const lines = markdown.split('\n');
    const toc = [];
    let currentH2 = null;

    lines.forEach(line => {
        // Match ## Header
        const h2Match = line.match(/^##\s+(.+)$/);
        if (h2Match) {
            const rawText = h2Match[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
            // Skip manual "Table of Contents" headings — the right sidebar already serves as TOC
            if (rawText.toLowerCase() === 'table of contents') return;
            const id = slugger.slug(rawText);
            const titleText = stripEmojis(rawText);
            currentH2 = { id, title: titleText, items: [] };
            toc.push(currentH2);
        }
        // Match ### Header
        else {
            const h3Match = line.match(/^###\s+(.+)$/);
            if (h3Match && currentH2) {
                const rawText = h3Match[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
                const id = slugger.slug(rawText);
                const titleText = stripEmojis(rawText);
                currentH2.items.push({ id, title: titleText });
            }
        }
    });

    return toc;
}

// Resolve a relative path from _index.json to its glob key
function resolveContent(path) {
    const key = `../docs-v2/${path}`;
    const content = markdownModules[key];
    if (!content) {
        console.warn(`[docs] Missing markdown file for path: ${path}`);
        return '';
    }
    return content;
}

// Strip markdown syntax to get plain text for search
function stripMarkdown(md) {
    return md
        .replace(/```[\s\S]*?```/g, '')       // fenced code blocks
        .replace(/`[^`]+`/g, '')               // inline code
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links & images
        .replace(/^\s{0,3}#{1,6}\s+/gm, '')   // heading markers
        .replace(/[*_~]{1,3}/g, '')            // bold/italic/strikethrough
        .replace(/^\s*[-*+]\s+/gm, '')         // unordered list markers
        .replace(/^\s*\d+\.\s+/gm, '')         // ordered list markers
        .replace(/^\s*>\s?/gm, '')             // blockquotes
        .replace(/\|/g, ' ')                   // table pipes
        .replace(/<\/?[^>]+(>|$)/g, '')        // HTML tags
        .replace(/\n{2,}/g, '\n')              // collapse blank lines
        .trim();
}

// Build the docs object from _index.json
export const docs = {};

// Build the sections array for sidebar navigation
export const DOC_SECTIONS = indexData.sections.map(section => ({
    label: section.title,
    keys: section.items.map(item => {
        const content = resolveContent(item.path);
        docs[item.key] = {
            title: item.title,
            content,
            toc: generateTOC(content)
        };
        return item.key;
    })
}));

// Build a heading-level search index across all docs
export const searchIndex = (() => {
    const entries = [];
    const slugger = new GithubSlugger();

    for (const section of indexData.sections) {
        for (const item of section.items) {
            const doc = docs[item.key];
            if (!doc || !doc.content) continue;

            slugger.reset();
            const lines = doc.content.split('\n');
            let currentHeading = null;
            let currentId = null;
            let buffer = [];

            const flush = () => {
                if (buffer.length === 0) return;
                const rawText = buffer.join('\n');
                const plainText = stripMarkdown(rawText);
                if (plainText.length < 3) return;
                entries.push({
                    key: item.key,
                    docTitle: item.title,
                    sectionTitle: section.title,
                    headingId: currentId,
                    headingTitle: currentHeading,
                    text: plainText
                });
            };

            for (const line of lines) {
                const h2Match = line.match(/^##\s+(.+)$/);
                const h3Match = !h2Match && line.match(/^###\s+(.+)$/);
                if (h2Match || h3Match) {
                    flush();
                    buffer = [];
                    const rawText = (h2Match || h3Match)[1].replace(/<\/?[^>]+(>|$)/g, '').trim();
                    currentHeading = stripEmojis(rawText);
                    currentId = slugger.slug(rawText);
                } else {
                    buffer.push(line);
                }
            }
            flush(); // last section
        }
    }

    return entries;
})();
