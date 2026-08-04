import React from 'react';

import ClaudeCodeColor from '@lobehub/icons/es/ClaudeCode/components/Color';
import OpenCodeMono from '@lobehub/icons/es/OpenCode/components/Mono';
import CodexColor from '@lobehub/icons/es/Codex/components/Color';
import ClineMono from '@lobehub/icons/es/Cline/components/Mono';
import OpenClawColor from '@lobehub/icons/es/OpenClaw/components/Color';
import AnthropicMono from '@lobehub/icons/es/Anthropic/components/Mono';
import OpenAIMono from '@lobehub/icons/es/OpenAI/components/Mono';
import GeminiColor from '@lobehub/icons/es/Gemini/components/Color';
import OpenRouterColor from '@lobehub/icons/es/OpenRouter/components/Color';

import clawLogo from '../assets/claw-logo.svg';

const CLIENTS = [
    { name: 'Claude Code', Icon: ClaudeCodeColor },
    { name: 'OpenCode', Icon: OpenCodeMono },
    { name: 'Codex CLI', Icon: CodexColor },
    { name: 'Cline', Icon: ClineMono },
    { name: 'OpenClaw', Icon: OpenClawColor },
];

const PROVIDERS = [
    { name: 'Anthropic', Icon: AnthropicMono },
    { name: 'OpenAI', Icon: OpenAIMono },
    { name: 'Google Gemini', Icon: GeminiColor },
    { name: 'OpenRouter', Icon: OpenRouterColor },
];

// Column geometry — must match CSS: .cp-canvas / .cp-col-items height 400px,
// tiles 44px, item = tile + label ≈ 66px, columns use space-between.
const H = 400;
const NODE_X = 100;
const NODE_Y = H / 2;

// Tile centers (item top + 22px half-tile), 5 clients / 4 providers over 400px
const clientY = [22, 105.5, 189, 272.5, 356];
const providerY = [22, 133.3, 244.7, 356];

function clientPath(y) {
    return `M 0 ${y} C 52 ${y}, 66 ${NODE_Y} ${NODE_X - 34} ${NODE_Y}`;
}

function providerPath(y) {
    return `M ${NODE_X + 34} ${NODE_Y} C 134 ${NODE_Y}, 148 ${y} 200 ${y}`;
}

export default function ClientProviderDiagram() {
    return (
        <div className="cp-diagram">
            <div className="cp-col cp-col-label-group">
                <span className="cp-col-label">Your client</span>
                <div className="cp-col-items">
                    {CLIENTS.map((c) => (
                        <div key={c.name} className="cp-item">
                            <span className="cp-tile"><c.Icon size={24} title={c.name} /></span>
                            <span className="cp-name">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cp-canvas" aria-hidden="true">
                <svg className="cp-lines" viewBox={`0 0 200 ${H}`} preserveAspectRatio="none">
                    {clientY.map((y) => (
                        <path key={`c-${y}`} className="cp-line" d={clientPath(y)} vectorEffect="non-scaling-stroke" />
                    ))}
                    {providerY.map((y) => (
                        <path key={`p-${y}`} className="cp-line" d={providerPath(y)} vectorEffect="non-scaling-stroke" />
                    ))}
                    {clientY.map((y) => (
                        <path key={`cf-${y}`} className="cp-line-flow" d={clientPath(y)} vectorEffect="non-scaling-stroke" />
                    ))}
                    {providerY.map((y) => (
                        <path key={`pf-${y}`} className="cp-line-flow cp-line-flow-out" d={providerPath(y)} vectorEffect="non-scaling-stroke" />
                    ))}
                </svg>
                <div className="cp-node">
                    <span className="cp-node-tile">
                        <img src={clawLogo} alt="" />
                    </span>
                    <span className="cp-node-name">ClawRouter</span>
                </div>
            </div>

            <div className="cp-col cp-col-label-group">
                <span className="cp-col-label">Any provider</span>
                <div className="cp-col-items">
                    {PROVIDERS.map((p) => (
                        <div key={p.name} className="cp-item">
                            <span className="cp-tile"><p.Icon size={24} title={p.name} /></span>
                            <span className="cp-name">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
