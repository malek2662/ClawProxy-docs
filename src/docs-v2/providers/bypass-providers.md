# Bypass Providers

Bypass providers access AI models without requiring an API key. ClawRouter handles authentication internally via static default headers -- no keys to add, no signup required.

> **Version 1.0.16**

> **No Setup Tricks Needed:** Keyless presets ship with API Key Mode `None` pre-selected. Just pick the preset and click **Create Provider** -- do **not** add any API keys. The keys table is replaced by an informational card, and the add-key endpoint rejects keys for these providers.

> **About `apiKey`:** In the OpenClaw configurations below, `cr_your_proxy_key` stands for the **proxy API key** from the dashboard (**Settings** > **Proxy API Key**). The **"Prompt for AI"** dialog inserts it automatically.

---

## How Keyless Providers Work

Providers with API Key Mode `None` need no keys. Instead, each preset carries **default headers** that ClawRouter merges into every upstream request automatically. For example, OpenCode Zen sends `Authorization: Bearer public` and `x-opencode-client: desktop` on your behalf.

You never see or manage these headers -- they are part of the preset.

---

## OpenCode Zen

Free high-performance coding and reasoning models, no signup.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenCode Zen** |
| **Upstream URL** | `https://opencode.ai/zen/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `None` (automatic) |

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
  "apiKey": "cr_your_proxy_key",
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
2. Click **Create Provider** -- API Key Mode is already set to `None`.
3. Do **not** add any API keys.
4. Copy the generated **Base URL** and use it in your OpenClaw config.
5. *(Optional)* Go to **Models** tab > **Fetch Models** to see all available models with Free/Paid badges.

---

## Kilo AI (Free)

Free models on the Kilo AI gateway, no key needed.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Kilo AI (Free)** |
| **Upstream URL** | `https://api.kilo.ai/api/gateway` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `None` (automatic) |

> **Two Kilo presets:** **Kilo AI (Free)** is keyless and gives access to the free models below. The **Kilo AI** preset uses API Key Mode `Managed` for accounts with a Kilo API key -- it unlocks the full model catalog including paid models.

### Available Free Models

| Model ID | Description | Context |
|----------|-------------|---------|
| `minimax/minimax-m2.5:free` | SOTA model for productivity and coding (SWE-Bench 80.2%) | 204k |
| `stepfun/step-3.5-flash:free` | Speed-efficient MoE reasoning model for long contexts | 256k |
| `kilo-auto/free` | Dynamic router -- auto-routes to available free models | 204k |
| `openrouter/free` | Auto-routes to random free models on OpenRouter | 200k |

### OpenClaw Configuration

```json
"kilocode": {
  "baseUrl": "http://localhost:3030/proxy/kilo-ai-free/v1",
  "apiKey": "cr_your_proxy_key",
  "api": "openai-completions",
  "models": [
    { "id": "minimax/minimax-m2.5:free", "name": "minimax/minimax-m2.5:free" },
    { "id": "stepfun/step-3.5-flash:free", "name": "stepfun/step-3.5-flash:free" },
    { "id": "kilo-auto/free", "name": "kilo-auto/free" },
    { "id": "openrouter/free", "name": "openrouter/free" }
  ]
}
```

### Dashboard Setup Steps

1. Go to **Providers** > **Add Provider** > **Quick Setup** > select **Kilo AI (Free)**.
2. Click **Create Provider** -- API Key Mode is already set to `None`.
3. Do **not** add any API keys.
4. Copy the generated **Base URL** and use it in your OpenClaw config.
5. *(Optional)* Go to **Models** tab > **Fetch Models** to see all available models with Free/Paid badges.

---

## Ollama (Local)

Routes to a locally running Ollama instance -- completely offline, no key.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Ollama (Local)** |
| **Upstream URL** | `http://localhost:11434/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `None` (automatic) |

1. Install and start [Ollama](https://ollama.com/) on the same machine.
2. Quick Setup > **Ollama (Local)** > **Create Provider**.
3. Pull models with `ollama pull <model>`, then use **Fetch Models** in the Models tab to discover them.

---

## Discovering Models

For both hosted bypass providers:

1. Open the provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models**.
4. A list of all available models appears with **Free** and **Paid** badges.
5. Click **+ Add** next to any model to add it to your fallback list, or **Add All Free** to add every free model at once.
6. To use a model in your AI client, copy the **Model ID** shown in the list.

### What Do the Free/Paid Badges Mean?

- **Free**: The model is accessible without a paid subscription.
- **Paid**: The model requires an active subscription or credits on the provider's platform. Using a paid model without a subscription will result in a "PAID_MODEL_AUTH_REQUIRED" error, which ClawRouter classifies as MODEL_ERROR (not AUTH_ERROR).
