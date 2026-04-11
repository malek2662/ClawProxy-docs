# Paid Providers

Configure paid API providers securely in ClawRouter. All keys are stored locally -- never sent externally.

> **Version 1.0.12**

> **Important:** ClawRouter only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.

---

## Perplexity

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Perplexity** |
| **Upstream URL** | `https://api.perplexity.ai` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Perplexity provides two APIs under the same base URL:
- **Sonar API** -- Native search-augmented models
- **Agent API** -- Third-party frontier models with optional web search

### Sonar Models

`sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research`

### Agent Models

`perplexity/sonar`, `anthropic/claude-opus-4-6`, `anthropic/claude-sonnet-4-6`, `openai/gpt-5.4`, `openai/gpt-5-mini`, `google/gemini-2.5-pro`, `google/gemini-2.5-flash`, `nvidia/nemotron-3-super-120b-a12b`, `xai/grok-4-1-fast-non-reasoning`

### OpenClaw Configuration

```json
"perplexity": {
  "baseUrl": "http://localhost:3030/proxy/perplexity/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "sonar", "name": "Sonar" },
    { "id": "sonar-pro", "name": "Sonar Pro" },
    { "id": "sonar-reasoning-pro", "name": "Sonar Reasoning Pro" },
    { "id": "sonar-deep-research", "name": "Sonar Deep Research" },
    { "id": "anthropic/claude-sonnet-4-6", "name": "Agent: Claude Sonnet 4.6" },
    { "id": "google/gemini-2.5-flash", "name": "Agent: Gemini 2.5 Flash" }
  ]
}
```

---

## OpenAI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenAI** |
| **Upstream URL** | `https://api.openai.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Dashboard Setup

1. Quick Setup > **OpenAI** > Create Provider.
2. Add your OpenAI API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## Anthropic

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Anthropic** |
| **Upstream URL** | `https://api.anthropic.com/v1` |
| **API Format** | `anthropic-messages` |
| **API Key Mode** | `Managed` |

> **Note:** Anthropic uses the `anthropic-messages` API format, not `openai-completions`.

### Dashboard Setup

1. Quick Setup > **Anthropic** > Create Provider.
2. Add your Anthropic API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## Z.AI

Z.AI offers two separate API endpoints:

### Z.AI API (General)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Z.AI API** |
| **Upstream URL** | `https://api.z.ai/api/paas/v4` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Z.AI Coding

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Z.AI Coding** |
| **Upstream URL** | `https://api.z.ai/api/coding/paas/v4` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |
