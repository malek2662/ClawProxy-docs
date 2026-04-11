# Bypass Providers

Bypass providers (Kilo AI and OpenCode Zen) access high-performance AI models without requiring an API key. ClawRouter handles the bypass internally.

> **Version 1.0.12**

> **Important Setup Step:** When adding these providers via Quick Setup, you **must change the API Key Mode from `Managed` to `None`** before clicking Create Provider. Do **not** add any API keys to these providers.

---

## Kilo AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Kilo AI** |
| **Upstream URL** | `https://api.kilo.ai/api/gateway` |
| **API Format** | `openai-completions` |
| **API Key Mode** | Change to **None** |

### Available Free Models

| Model ID | Description | Context |
|----------|-------------|---------|
| `minimax/minimax-m2.5:free` | SOTA model for productivity and coding (SWE-Bench 80.2%) | 204k |
| `giga-potato-thinking` | Stealth model optimized for agentic programming with reasoning | 256k |
| `giga-potato` | Standard version optimized for agentic tasks | 256k |
| `stepfun/step-3.5-flash:free` | Speed-efficient MoE reasoning model for long contexts | 256k |
| `kilo-auto/free` | Dynamic router -- auto-routes to available free models | 204k |
| `openrouter/free` | Auto-routes to random free models on OpenRouter | 200k |

### OpenClaw Configuration

```json
"kilocode": {
  "baseUrl": "http://localhost:3030/proxy/kilo-ai/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "minimax/minimax-m2.5:free", "name": "minimax/minimax-m2.5:free" },
    { "id": "giga-potato-thinking", "name": "giga-potato-thinking" },
    { "id": "giga-potato", "name": "giga-potato" },
    { "id": "stepfun/step-3.5-flash:free", "name": "stepfun/step-3.5-flash:free" },
    { "id": "kilo-auto/free", "name": "kilo-auto/free" },
    { "id": "openrouter/free", "name": "openrouter/free" }
  ]
}
```

### Dashboard Setup Steps

1. Go to **Providers** > **Add Provider** > **Quick Setup** > select **Kilo AI**.
2. **Change API Key Mode to `None`**.
3. Click **Create Provider**.
4. Do **not** add any API keys.
5. Copy the generated **Base URL** and use it in your OpenClaw config.
6. *(Optional)* Go to **Models** tab > **Fetch Models** to see all available models with Free/Paid badges.

---

## OpenCode Zen

This provider offers high-performance coding and reasoning models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenCode Zen** |
| **Upstream URL** | `https://opencode.ai/zen/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | Change to **None** |

### Available Free Models

| Model ID | Description | Context |
|----------|-------------|---------|
| `gpt-5-nano` | Ultra-fast preview variant of OpenAI's reasoning models | 400k |
| `minimax-m2.5-free` | SOTA model for productivity and coding (SWE-Bench 80.2%) | 204k |
| `big-pickle` | High-speed stealth model based on GLM, optimized for development | 200k |
| `trinity-large-preview-free` | Arcee AI's 400B MoE model, excels at complex prompts | 128k |

### OpenClaw Configuration

```json
"opencode": {
  "baseUrl": "http://localhost:3030/proxy/opencode-zen/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "gpt-5-nano", "name": "gpt-5-nano" },
    { "id": "minimax-m2.5-free", "name": "minimax-m2.5-free" },
    { "id": "big-pickle", "name": "big-pickle" },
    { "id": "trinity-large-preview-free", "name": "trinity-large-preview-free" }
  ]
}
```

### Dashboard Setup Steps

1. Go to **Providers** > **Add Provider** > **Quick Setup** > select **OpenCode Zen**.
2. **Change API Key Mode to `None`**.
3. Click **Create Provider**.
4. Do **not** add any API keys.
5. Copy the generated **Base URL** and use it in your OpenClaw config.
6. *(Optional)* Go to **Models** tab > **Fetch Models** to see all available models with Free/Paid badges.

---

## Discovering Models

For both bypass providers:

1. Open the provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models**.
4. A list of all available models appears with **Free** and **Paid** badges.
5. Click **+ Add** next to any model to add it to your fallback list.
6. To use a model in your AI client, copy the **Model ID** shown in the list.

### What Do the Free/Paid Badges Mean?

- **Free**: The model is accessible without a paid subscription.
- **Paid**: The model requires an active subscription or credits on the provider's platform. Using a paid model without a subscription will result in a "PAID_MODEL_AUTH_REQUIRED" error, which ClawRouter classifies as MODEL_ERROR (not AUTH_ERROR).
