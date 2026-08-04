import React, { useState } from 'react';

const FAKE_KEY = 'cr_demo_K7x9f2mQ4p';

/* ---------- shared bits ---------- */

const Cursor = () => <span className="aterm-cursor" aria-hidden="true" />;

const Line = ({ children }) => <span className="aterm-line">{children}</span>;

const PromptLine = ({ children }) => (
    <Line>
        <span className="tp">❯</span>{' '}
        <span className="tc">{children}</span>
    </Line>
);

const JKey = ({ children }) => <span className="j-key">{children}</span>;
const JStr = ({ children }) => <span className="j-str">{children}</span>;
const JNum = ({ children }) => <span className="j-num">{children}</span>;

/* ---------- Claude Code ---------- */

const ClaudePane = () => (
    <>
        <Line><span className="aterm-meta"># point Claude Code at ClawRouter — any provider works</span></Line>
        <PromptLine>export ANTHROPIC_BASE_URL=http://localhost:3030/proxy/anthropic</PromptLine>
        <PromptLine>export ANTHROPIC_AUTH_TOKEN={FAKE_KEY}</PromptLine>
        <PromptLine>export ANTHROPIC_MODEL=kimi-for-coding</PromptLine>
        <Line>&nbsp;</Line>
        <PromptLine>claude</PromptLine>
        <Line>&nbsp;</Line>
        <Line><span className="tp">❯</span> <Cursor /></Line>
    </>
);

/* ---------- OpenCode ---------- */

const OpenCodePane = () => (
    <>
        <Line><span className="aterm-meta"># ~/.config/opencode/opencode.json</span></Line>
        <div className="json-block">
            <div>{'{'}</div>
            <div>{'  '}<JKey>"$schema"</JKey>: <JStr>"https://opencode.ai/config.json"</JStr>,</div>
            <div>{'  '}<JKey>"provider"</JKey>: {'{'}</div>
            <div>{'    '}<JKey>"clawrouter"</JKey>: {'{'}</div>
            <div>{'      '}<JKey>"npm"</JKey>: <JStr>"@ai-sdk/openai-compatible"</JStr>,</div>
            <div>{'      '}<JKey>"name"</JKey>: <JStr>"ClawRouter"</JStr>,</div>
            <div>{'      '}<JKey>"options"</JKey>: {'{'}</div>
            <div>{'        '}<JKey>"baseURL"</JKey>: <JStr>"http://localhost:3030/proxy/openrouter/v1"</JStr>,</div>
            <div>{'        '}<JKey>"headers"</JKey>: {'{'}</div>
            <div>{'          '}<JKey>"Authorization"</JKey>: <JStr>"Bearer {FAKE_KEY}"</JStr></div>
            <div>{'        }'}</div>
            <div>{'      },'}</div>
            <div>{'      '}<JKey>"models"</JKey>: {'{'}</div>
            <div>{'        '}<JKey>"openrouter/free"</JKey>: {'{'} <JKey>"name"</JKey>: <JStr>"OpenRouter Free"</JStr> {'}'}</div>
            <div>{'      }'}</div>
            <div>{'    }'}</div>
            <div>{'  }'}</div>
            <div>{'}'}</div>
        </div>
    </>
);

/* ---------- curl ---------- */

const CurlPane = () => (
    <>
        <PromptLine>{'curl -s http://localhost:3030/proxy/openai/v1/chat/completions \\'}</PromptLine>
        <Line>{'    '}<span className="tc">-H "Authorization: Bearer {FAKE_KEY}" \</span></Line>
        <Line>{'    '}<span className="tc">-H "Content-Type: application/json" \</span></Line>
        <Line>{'    '}<span className="tc">{'-d \'{"model":"gpt-4o-mini","messages":[{"role":"user","content":"Hello"}]}\''}</span></Line>
        <Line><span className="aterm-meta"># HTTP 200 · 0.41s · routed via openai</span></Line>
        <div className="json-block">
            <div>{'{'}</div>
            <div>{'  '}<JKey>"id"</JKey>: <JStr>"chatcmpl-Qx2k9fA7Lp"</JStr>,</div>
            <div>{'  '}<JKey>"object"</JKey>: <JStr>"chat.completion"</JStr>,</div>
            <div>{'  '}<JKey>"model"</JKey>: <JStr>"gpt-4o-mini"</JStr>,</div>
            <div>{'  '}<JKey>"choices"</JKey>: [</div>
            <div>{'    {'}</div>
            <div>{'      '}<JKey>"index"</JKey>: <JNum>0</JNum>,</div>
            <div>{'      '}<JKey>"message"</JKey>: {'{'} <JKey>"role"</JKey>: <JStr>"assistant"</JStr>, <JKey>"content"</JKey>: <JStr>"Hello!"</JStr> {'}'},</div>
            <div>{'      '}<JKey>"finish_reason"</JKey>: <JStr>"stop"</JStr></div>
            <div>{'    }'}</div>
            <div>{'  ],'}</div>
            <div>{'  '}<JKey>"usage"</JKey>: {'{'} <JKey>"prompt_tokens"</JKey>: <JNum>18</JNum>, <JKey>"total_tokens"</JKey>: <JNum>20</JNum> {'}'}</div>
            <div>{'}'}</div>
        </div>
        <Line><span className="tp">❯</span> <Cursor /></Line>
    </>
);

/* ---------- Terminal window with tabs ---------- */

const TABS = [
    { id: 'curl', label: 'curl', Pane: CurlPane },
    { id: 'opencode', label: 'OpenCode', Pane: OpenCodePane },
    { id: 'claude', label: 'Claude Code', Pane: ClaudePane },
];

export default function TerminalWindow() {
    const [active, setActive] = useState('curl');
    const activeTab = TABS.find((t) => t.id === active);

    return (
        <div className="aterm">
            <div className="aterm-bar">
                <span className="aterm-dots" aria-hidden="true"><i /><i /><i /></span>
                <div className="aterm-tabs" role="tablist" aria-label="Setup examples">
                    {TABS.map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            role="tab"
                            id={`aterm-tab-${t.id}`}
                            aria-selected={active === t.id}
                            aria-controls={`aterm-pane-${t.id}`}
                            className={`aterm-tab${active === t.id ? ' active' : ''}`}
                            onClick={() => setActive(t.id)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <span className="aterm-bar-right" aria-hidden="true">zsh · 80×24</span>
            </div>
            <div className="aterm-body">
                <div
                    role="tabpanel"
                    id={`aterm-pane-${activeTab.id}`}
                    aria-labelledby={`aterm-tab-${activeTab.id}`}
                    className="aterm-pane"
                >
                    <div className="aterm-pane-inner">
                        <activeTab.Pane />
                    </div>
                </div>
            </div>
        </div>
    );
}
