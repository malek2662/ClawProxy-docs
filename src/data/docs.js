import clawProxyKb from '../docs/ClawProxy-Knowledge-Base.md?raw';
import quickstart from '../docs/QUICKSTART.md?raw';
import providers from '../docs/OPENCLAW_PROVIDERS.md?raw';
import commands from '../docs/COMMANDS.md?raw';
import faq from '../docs/FAQ.md?raw';
import GithubSlugger from 'github-slugger';

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
            const rawText = h2Match[1].replace(/<\/?[^>]+(>|$)/g, '').trim(); // Remove raw HTML tags if any (like emojis or spans)
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

export const docs = {
    quickstart: {
        title: 'Quickstart Guide',
        content: quickstart,
        toc: generateTOC(quickstart)
    },
    knowledgeBase: {
        title: 'Knowledge Base',
        content: clawProxyKb,
        toc: generateTOC(clawProxyKb)
    },
    providers: {
        title: 'Providers Configuration',
        content: providers,
        toc: generateTOC(providers)
    },
    commands: {
        title: 'CLI Commands',
        content: commands,
        toc: generateTOC(commands)
    },
    faq: {
        title: 'FAQ',
        content: faq,
        toc: generateTOC(faq)
    }
};
