# How ClawRouter Works

An overview of ClawRouter's architecture, request flow, and core design principles.

> **Version 1.0.15**

---

## What is ClawRouter?

**ClawRouter** is a self-hosted AI routing proxy that sits between your AI client (OpenClaw or any OpenAI-compatible tool) and upstream AI providers. It manages API key rotation, provider fallback chains, model-level fallback, circuit breaking, real-time notifications, and full request logging.

---

## Core Principles

1. **Freedom of Choice**: Vendor-agnostic. You bring your own providers and configure them as you see fit.
2. **Uninterrupted Continuity**: Smart Key Rotation, Model Fallback, Provider Fallback Chain, and Circuit Breaker ensure your AI session never stops.
3. **Local First**: Everything runs on your machine. Keys, logs, and configs are stored locally and securely. No data is sent externally except to the AI providers you configure and a periodic license check.

---

## Request Flow

```
Client -> http://localhost:3030/proxy/{providerId}/v1/... -> ClawRouter -> upstream provider
```

When a request arrives, ClawRouter:

1. Identifies the target provider from the URL.
2. Detects the client's API format from the request path (`/v1/chat/completions`, `/v1/responses`, `/v1/messages`, `/v1beta/...`). If it matches the provider's format, traffic passes through byte-identical (zero-copy); if it differs, ClawRouter translates the request to the provider's format -- see API Format Translation.
3. Selects an API key based on the rotation strategy (On Error or Round Robin).
4. Forwards the request to the upstream provider's API.
5. If the request fails, applies the retry cascade: model fallback, key rotation, then provider fallback chain.
6. Returns the successful response (or final error) to the client.

---

## Provider Presets

ClawRouter provides **50 built-in provider presets** pre-configured with the correct name, API format, upstream URL, and API key mode. Each preset also carries:

- **Brand icon** -- real provider brand icons shown on provider cards across the dashboard (color or mono, switchable in Settings > Appearance)
- **Category** -- `free` or `apikey`, used for grouping in the Add Provider panel
- **Get API Key / signup links** -- direct links to the provider's key page
- **Default headers** -- static headers merged into every upstream request (keyless presets)
- **Seeded model list** -- recommended models saved to the Models tab automatically at creation

Popular presets include OpenRouter, Google Gemini, Groq, Cerebras, NVIDIA NIM, OpenAI, Anthropic, DeepSeek, xAI, Mistral, Perplexity, Kimi for Coding, MiniMax Coding, Z.AI, Alibaba, SiliconFlow, Together AI -- plus keyless presets like OpenCode Zen, Kilo AI (Free), and Ollama (Local). See the Provider Directory for the full list.

**Two setup methods:**
- **Quick Setup**: Searchable preset grid grouped into **Free & Free-Tier** and **API Key Providers** categories. All fields auto-filled -- including the correct API Key Mode. Customize if needed, then create.
- **Custom**: Blank form for any provider not in the preset list.

---

## Supported API Formats

| Format | Description | Proxy URL Pattern |
|--------|-------------|-------------------|
| `openai-completions` | OpenAI Chat Completions (most providers) | `/proxy/{id}/v1` |
| `openai-responses` | OpenAI Responses API | `/proxy/{id}/v1` |
| `anthropic-messages` | Anthropic Claude Messages | `/proxy/{id}/v1` |
| `google-generative-ai` | Google Gemini API | `/proxy/{id}/v1beta` |

Each provider has its own format. ClawRouter translates requests into the correct format for each upstream -- any client format works with any provider format (any-to-any). When formats match, traffic passes through byte-identical with zero overhead. See API Format Translation for details.

---

## API Key Modes

| Mode | Behavior |
|------|----------|
| **Managed** (default) | ClawRouter stores and manages multiple API keys, handling rotation and fallback automatically. The client's key is stripped and replaced with the managed key. |
| **None** | No API key is sent to upstream. Used for keyless providers (OpenCode Zen, Kilo AI (Free), Ollama Local). The provider's **default headers** (e.g., OpenCode's `Authorization: Bearer public`) are merged into every request instead. |
| **Pass Through** | The client's API key is forwarded directly to the upstream provider without modification. No key rotation or management. **Caveat:** with proxy API key auth enabled (default), the forwarded credential is the proxy key -- passthrough mode and proxy auth are incompatible. Prefer Managed or None. |

---

## Dashboard Navigation

### Sidebar
- **Dashboard**: Global stats and charts
- **Providers**: Provider list, add/manage providers
- **Fallback**: Global view of every provider's fallback chain, with the full chain editor
- **Logs**: Request log viewer with real-time updates
- **Usage**: Token usage and estimated cost breakdown per provider/model
- **Settings**: Global configuration for key retry, rate limit/quota backoff, circuit breaker, log management, proxy API key, dashboard password, and appearance (provider icon style)
- **Bell icon**: Notification panel
- **Update badge**: Shows when a new version is available

### Provider Detail Page (Tabs)

Tabs are URL-synced -- you can deep-link to a specific tab with `?tab=overview|keys|models|fallback|quota|settings`.

| Tab | Contents |
|-----|----------|
| **Overview** | Stats cards, request volume chart, configuration summary, quick stats |
| **API Keys** | Add/bulk add keys, key table with status/test results/stats, connection testing, priority reorder |
| **Models** | Fallback models list, Fetch Models from upstream (5-min cache), Free/Paid badges for bypass providers |
| **Fallback** | Provider Fallback Chain: visual chain diagram, add/edit/reorder/delete entries |
| **Quota** | *(Kimi for Coding and Z.AI GLM Coding providers only)* Per-key quota windows, sorted usable keys first -- see Provider Management > View Live Quota & Usage |
| **Settings** | Circuit breaker status, provider config form |

---

## "Prompt for AI" Integration

Every provider page has a **"Prompt for AI"** button (on the Base URL banner) that opens a tabbed dialog with ready-to-paste setup instructions for 7 AI clients:

| Tab | Target Client |
|-----|---------------|
| **OpenClaw** (default) | `openclaw.json` via `config.patch`, using native provider IDs where available |
| **OpenCode** | `opencode.json` custom provider (`@ai-sdk/openai-compatible` or `@ai-sdk/anthropic`) |
| **Claude Code** | `~/.claude/settings.json` env block |
| **Codex CLI** | `~/.codex/config.toml` model provider |
| **Cline** | OpenAI Compatible settings fields |
| **Aider** | Environment variables + `openai/` model prefix |
| **Custom / Other** | Generic endpoint reference + curl example |

Templates are generated dynamically from the provider's actual saved models (preset models as fallback), with the correct Base URL format per client, and embed your real proxy API key automatically. All 7 tabs work with every provider -- when the client's native format differs from the provider's, the tab shows an amber note that ClawRouter translates automatically. See the **Client Setup** section for per-client guides.
