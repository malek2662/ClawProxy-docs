# How ClawRouter Works

An overview of ClawRouter's architecture, request flow, and core design principles.

> **Version 1.0.12**

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
2. Selects an API key based on the rotation strategy (On Error or Round Robin).
3. Forwards the request to the upstream provider's API.
4. If the request fails, applies the retry cascade: model fallback, key rotation, then provider fallback chain.
5. Returns the successful response (or final error) to the client.

---

## Provider Templates

ClawRouter provides **13 built-in provider templates** pre-configured with the correct name, API format, upstream URL, and API key mode.

| Template | API Format | Upstream URL | Key Mode |
|----------|-----------|-------------|----------|
| OpenRouter | openai-completions | `https://openrouter.ai/api/v1` | Managed |
| Google Gemini | google-generative-ai | `https://generativelanguage.googleapis.com/v1beta` | Managed |
| NVIDIA NIM | openai-completions | `https://integrate.api.nvidia.com/v1` | Managed |
| Groq | openai-completions | `https://api.groq.com/openai/v1` | Managed |
| OpenAI | openai-completions | `https://api.openai.com/v1` | Managed |
| Anthropic | anthropic-messages | `https://api.anthropic.com/v1` | Managed |
| Ollama Cloud | openai-completions | `https://ollama.com/v1` | Managed |
| Kilo AI | openai-completions | `https://api.kilo.ai/api/gateway` | Managed* |
| OpenCode Zen | openai-completions | `https://opencode.ai/zen/v1` | Managed* |
| Perplexity | openai-completions | `https://api.perplexity.ai` | Managed |
| Cerebras | openai-completions | `https://api.cerebras.ai/v1` | Managed |
| Cohere | openai-completions | `https://api.cohere.com/v1` | Managed |
| Z.AI API | openai-completions | `https://api.z.ai/api/paas/v4` | Managed |
| Z.AI Coding | openai-completions | `https://api.z.ai/api/coding/paas/v4` | Managed |

> **\* Kilo AI and OpenCode Zen:** These are bypass providers. The template defaults to `Managed`, but users **must change the API Key Mode to `None`** before creating. No API keys should be added.

**Two setup methods:**
- **Quick Setup**: Select a template. All fields auto-filled. Customize if needed, then create.
- **Custom**: Blank form for any provider not in the template list.

---

## Supported API Formats

| Format | Description | Proxy URL Pattern |
|--------|-------------|-------------------|
| `openai-completions` | OpenAI Chat Completions (most providers) | `/proxy/{id}/v1` |
| `openai-responses` | OpenAI Responses API | `/proxy/{id}/v1` |
| `anthropic-messages` | Anthropic Claude Messages | `/proxy/{id}/v1` |
| `google-generative-ai` | Google Gemini API | `/proxy/{id}/v1beta` |

Each provider has its own format. ClawRouter translates requests into the correct format for each upstream.

---

## API Key Modes

| Mode | Behavior |
|------|----------|
| **Managed** (default) | ClawRouter stores and manages multiple API keys, handling rotation and fallback automatically. The client's key is stripped and replaced with the managed key. |
| **None** | No API key is sent to upstream. Used for bypass providers (Kilo AI, OpenCode Zen). |
| **Pass Through** | The client's API key is forwarded directly to the upstream provider without modification. No key rotation or management. |

---

## Dashboard Navigation

### Sidebar
- **Dashboard**: Global stats and charts
- **Providers**: Provider list, add/manage providers
- **Logs**: Request log viewer with real-time updates
- **Settings**: Global configuration for key retry, rate limit backoff, circuit breaker, and log management
- **Bell icon**: Notification panel
- **Update badge**: Shows when a new version is available

### Provider Detail Page (4 Tabs)

| Tab | Contents |
|-----|----------|
| **Overview** | Stats cards, request volume chart, configuration summary, quick stats |
| **API Keys** | Add/bulk add keys, key table with status/stats, drag-and-drop priority reorder |
| **Models** | Fallback models list, Fetch Models from upstream, Free/Paid badges for bypass providers |
| **Settings** | Circuit breaker status, provider config form, Provider Fallback Chain |

---

## "Prompt for AI" Integration

Every provider page has a **"Prompt for AI"** button that generates a ready-to-use prompt for your AI agent (OpenClaw).

**What It Generates:**
- Provider Base URL
- Provider Name
- API format
- Curated list of recommended Model IDs
- Full `openclaw.json` configuration template

**How to Use:**
1. Click **"Prompt for AI"** on the provider's detail page.
2. Copy the generated prompt.
3. Paste it to your OpenClaw AI agent.
4. The agent will safely update your `openclaw.json`.
