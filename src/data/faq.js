// FAQ content — single source of truth for the visible FAQ accordion on the
// landing page (components/Faq.jsx) and the FAQPage JSON-LD structured data
// (seo/seo.js). Google requires FAQPage markup to match visible page content,
// so both consumers must always read from this one list.
//
// Questions are phrased the way users ask AI assistants / search engines —
// this makes them eligible citations for Google AI Overviews, ChatGPT,
// Perplexity and Copilot answers.

export const FAQ_ITEMS = [
    {
        q: 'What is ClawRouter?',
        a: 'ClawRouter is a self-hosted AI routing gateway. It sits between your AI clients and your AI providers as a single local endpoint (localhost:3030), routing, managing and monitoring every request — with automatic API format translation, key rotation, failover and quota tracking.',
    },
    {
        q: 'Which AI providers does ClawRouter support?',
        a: 'Over 50 provider presets out of the box — including OpenRouter, Google Gemini, Groq and Cerebras with free tiers, keyless options like OpenCode Zen and Kilo AI, local models via Ollama, and ElevenLabs for audio. You can also add any custom provider with an OpenAI, Anthropic or Gemini compatible endpoint.',
    },
    {
        q: 'Which AI clients work with ClawRouter?',
        a: 'Claude Code, OpenCode, Codex CLI, OpenClaw, Qwen Code, Cline and Aider all work natively — and any other tool that lets you set a custom API base URL can connect too. You point the client at ClawRouter once and it gains access to every configured provider.',
    },
    {
        q: 'How is ClawRouter different from OpenRouter?',
        a: 'OpenRouter is a hosted service: your requests and API keys pass through their servers and you pay per token. ClawRouter is self-hosted software: it runs on your machine, uses your own provider keys, and your data never touches a third party. You pay $20 once for a lifetime license instead of ongoing per-token fees.',
    },
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
