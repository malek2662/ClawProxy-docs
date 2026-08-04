import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import AlibabaCloudColor from '@lobehub/icons/es/AlibabaCloud/components/Color';
import CerebrasColor from '@lobehub/icons/es/Cerebras/components/Color';
import CloudflareColor from '@lobehub/icons/es/Cloudflare/components/Color';
import CohereColor from '@lobehub/icons/es/Cohere/components/Color';
import DeepSeekColor from '@lobehub/icons/es/DeepSeek/components/Color';
import FireworksColor from '@lobehub/icons/es/Fireworks/components/Color';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import GroqMono from '@lobehub/icons/es/Groq/components/Mono';
import HunyuanColor from '@lobehub/icons/es/Hunyuan/components/Color';
import KiloCodeMono from '@lobehub/icons/es/KiloCode/components/Mono';
import KimiColor from '@lobehub/icons/es/Kimi/components/Color';
import MinimaxColor from '@lobehub/icons/es/Minimax/components/Color';
import MistralColor from '@lobehub/icons/es/Mistral/components/Color';
import MorphColor from '@lobehub/icons/es/Morph/components/Color';
import NvidiaColor from '@lobehub/icons/es/Nvidia/components/Color';
import OllamaMono from '@lobehub/icons/es/Ollama/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';
import PerplexityColor from '@lobehub/icons/es/Perplexity/components/Color';
import SiliconCloudColor from '@lobehub/icons/es/SiliconCloud/components/Color';
import TogetherColor from '@lobehub/icons/es/Together/components/Color';
import VeniceColor from '@lobehub/icons/es/Venice/components/Color';
import VercelMono from '@lobehub/icons/es/Vercel/components/Mono';
import VolcengineColor from '@lobehub/icons/es/Volcengine/components/Color';
import XAIMono from '@lobehub/icons/es/XAI/components/Mono';
import ZAIMono from '@lobehub/icons/es/ZAI/components/Mono';

// Brand glyphs resolved exactly like the app's ProviderIcon: Color variant
// where the brand ships one, the mono glyph (currentColor) otherwise.
const PROVIDERS = [
    { name: 'OpenAI', Icon: OpenAIMono },
    { name: 'Anthropic', Icon: AnthropicMono },
    { name: 'Google Gemini', Icon: GeminiColor },
    { name: 'OpenRouter', Icon: OpenRouterColor },
    { name: 'DeepSeek', Icon: DeepSeekColor },
    { name: 'xAI (Grok)', Icon: XAIMono },
    { name: 'Mistral', Icon: MistralColor },
    { name: 'Groq', Icon: GroqMono },
    { name: 'Cerebras', Icon: CerebrasColor },
    { name: 'Perplexity', Icon: PerplexityColor },
    { name: 'Cohere', Icon: CohereColor },
    { name: 'NVIDIA NIM', Icon: NvidiaColor },
    { name: 'Together AI', Icon: TogetherColor },
    { name: 'Fireworks AI', Icon: FireworksColor },
    { name: 'SiliconFlow', Icon: SiliconCloudColor },
    { name: 'Ollama', Icon: OllamaMono },
    { name: 'Kimi for Coding', Icon: KimiColor },
    { name: 'Z.AI', Icon: ZAIMono },
    { name: 'MiniMax', Icon: MinimaxColor },
    { name: 'Venice AI', Icon: VeniceColor },
    { name: 'Vercel AI Gateway', Icon: VercelMono },
    { name: 'OpenCode Zen', Icon: OpenCodeMono },
    { name: 'Kilo AI', Icon: KiloCodeMono },
    { name: 'Cloudflare Workers AI', Icon: CloudflareColor },
    { name: 'Alibaba Coding Plan', Icon: AlibabaCloudColor },
    { name: 'Tencent Hunyuan', Icon: HunyuanColor },
    { name: 'Volcengine Ark', Icon: VolcengineColor },
    { name: 'Morph', Icon: MorphColor },
];

function Monogram({ name }) {
    const letters = name
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('') || '?';
    return <span className="provider-chip">{letters}</span>;
}

function MarqueeList({ ariaHidden = false }) {
    return (
        <ul className="providers-marquee-list" aria-hidden={ariaHidden || undefined}>
            {PROVIDERS.map((p) => (
                <li key={`${p.name}-${ariaHidden ? 'b' : 'a'}`} className="providers-marquee-item">
                    <span className="provider-icon">
                        {p.Icon ? <p.Icon size={20} title={p.name} /> : <Monogram name={p.name} />}
                    </span>
                    {p.name}
                </li>
            ))}
        </ul>
    );
}

export default function ProvidersMarquee() {
    return (
        <section className="providers-strip" aria-label="Supported AI providers">
            <div className="container providers-strip-head">
                <span className="providers-strip-label">Works with 50 built-in provider presets</span>
                <Link to="/docs?tab=providerDirectory" className="link-arrow">
                    Browse the provider directory <ArrowRight size={14} aria-hidden="true" />
                </Link>
            </div>
            <div className="providers-marquee">
                <div className="providers-marquee-track">
                    <MarqueeList />
                    <MarqueeList ariaHidden />
                </div>
            </div>
        </section>
    );
}
