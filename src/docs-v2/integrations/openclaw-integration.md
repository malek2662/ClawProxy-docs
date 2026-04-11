# OpenClaw Integration

This guide explains how to connect your OpenClaw AI client to providers configured in ClawRouter.

> **Version 1.0.12**

---

## How to Add Providers to OpenClaw

There are three methods. All require the provider to be created first in the ClawRouter dashboard.

> **About `apiKey`:** Use any dummy value (e.g., `dummy-key`) for the `apiKey` field in OpenClaw. ClawRouter strips the dummy key and injects your real, managed API keys to authenticate with upstream providers.

> **100% Local Privacy:** ClawRouter runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.

> **About Models in ClawRouter Dashboard:** You do **not** need to add models inside the ClawRouter dashboard for normal routing. Models are defined in your OpenClaw configuration. ClawRouter accepts any model name and forwards it upstream. However, you can optionally add models to the provider's **Models tab** to enable **Model Fallback** (automatic retry with a different model) and for convenient model ID selection in the **Provider Fallback Chain**.

> **Model IDs Change:** External AI providers may change Model IDs without notice. If you experience model errors, verify the current valid Model ID with the provider's official documentation, or use **Fetch Models** in ClawRouter to get the latest list.

---

## Method 1: Quick Setup (Recommended)

1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Select your provider from the template grid.
3. All settings are pre-filled. Click **Create Provider**.
4. Go to the **API Keys** tab and add your key(s).
5. Copy the auto-generated **Base URL** from the top of the provider page.

**Available Templates:** OpenRouter, Google Gemini, NVIDIA NIM, Groq, OpenAI, Anthropic, Ollama Cloud, Kilo AI, OpenCode Zen, Perplexity, Cerebras, Cohere, Z.AI API, Z.AI Coding.

---

## Method 2: The "Prompt for AI"

1. Create your provider in the ClawRouter Dashboard (Quick Setup or Custom).
2. Click **"Prompt for AI"** on the provider's detail page.
3. Copy the generated prompt and paste it to your OpenClaw AI agent -- it will safely configure the provider and models in your `openclaw.json`.

---

## Method 3: Manual Configuration

Add the provider to your `~/.openclaw/openclaw.json` under `models.providers`:

```json
"PROVIDER_NAME": {
  "baseUrl": "AUTO_GENERATED_CLAWROUTER_URL",
  "apiKey": "dummy-key",
  "api": "API_FORMAT",
  "models": [
    { "id": "MODEL_ID", "name": "FRIENDLY_NAME" }
  ]
}
```

### Base URL Format by API Format

| API Format | Base URL Pattern |
|-----------|-----------------|
| `openai-completions` | `http://localhost:3030/proxy/{provider-id}/v1` |
| `openai-responses` | `http://localhost:3030/proxy/{provider-id}/v1` |
| `anthropic-messages` | `http://localhost:3030/proxy/{provider-id}/v1` |
| `google-generative-ai` | `http://localhost:3030/proxy/{provider-id}/v1beta` |

---

## Configuration Fields

| Field | Description |
|-------|-------------|
| `baseUrl` | Copy from the provider's detail page in ClawRouter (the auto-generated Base URL) |
| `apiKey` | Use any dummy value like `dummy-key`. ClawRouter strips this and injects the real key. |
| `api` | Must match the provider's API format (`openai-completions`, `openai-responses`, `anthropic-messages`, or `google-generative-ai`) |
| `models` | List of models with `id` and `name`. Get model IDs from the provider's **Models** tab > **Fetch Models**. |

---

## Provider Configurations

For ready-to-use OpenClaw configuration snippets for each provider, see:

- **Bypass Providers** -- Kilo AI and OpenCode Zen (no API key required)
- **Free Tier Providers** -- Ollama Cloud, Google Gemini, Groq, OpenRouter, NVIDIA NIM, Cohere, Cerebras
- **Paid Providers** -- Perplexity, OpenAI, Anthropic, Z.AI
