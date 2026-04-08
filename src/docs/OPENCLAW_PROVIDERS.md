# OpenClaw Integration Guide

This document contains a complete registry of providers and models supported by **ClawProxy**, with ready-to-use configurations for **OpenClaw**.

> **Version 1.0.12**

---

## How to Add Providers to OpenClaw

There are three methods. All require the provider to be created first in the ClawProxy dashboard.

> **About `apiKey`:** Use any dummy value (e.g., `dummy-key`) for the `apiKey` field in OpenClaw. ClawProxy strips the dummy key and injects your real, managed API keys to authenticate with upstream providers.

> **100% Local Privacy:** ClawProxy runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.

> **About Models in ClawProxy Dashboard:** You do **not** need to add models inside the ClawProxy dashboard for normal routing. Models are defined in your OpenClaw configuration. ClawProxy accepts any model name and forwards it upstream. However, you can optionally add models to the provider's **Models tab** to enable **Model Fallback** (automatic retry with a different model) and for convenient model ID selection in the **Provider Fallback Chain**.

> **Model IDs Change:** External AI providers may change Model IDs without notice. If you experience model errors, verify the current valid Model ID with the provider's official documentation, or use **Fetch Models** in ClawProxy to get the latest list.

---

## Method 1: Quick Setup (Recommended)

1. Go to **Providers** → **Add Provider** → **Quick Setup**.
2. Select your provider from the template grid.
3. All settings are pre-filled. Click **Create Provider**.
4. Go to the **API Keys** tab and add your key(s).
5. Copy the auto-generated **Base URL** from the top of the provider page.

**Available Templates:** OpenRouter, Google Gemini, NVIDIA NIM, Groq, OpenAI, Anthropic, Ollama Cloud, Kilo AI, OpenCode Zen, Perplexity, Cerebras, Cohere, Z.AI API, Z.AI Coding.

---

## Method 2: The "Prompt for AI"

1. Create your provider in the ClawProxy Dashboard (Quick Setup or Custom).
2. Click **"Prompt for AI"** on the provider's detail page.
3. Copy the generated prompt and paste it to your OpenClaw AI agent — it will safely configure the provider and models in your `openclaw.json`.

---

## Method 3: Manual Configuration

Add the provider to your `~/.openclaw/openclaw.json` under `models.providers`:

```json
"PROVIDER_NAME": {
  "baseUrl": "AUTO_GENERATED_CLAWPROXY_URL",
  "apiKey": "dummy-key",
  "api": "API_FORMAT",
  "models": [
    { "id": "MODEL_ID", "name": "FRIENDLY_NAME" }
  ]
}
```

**Base URL format by API format:**
- `openai-completions` / `openai-responses` / `anthropic-messages` → `http://localhost:3030/proxy/{provider-id}/v1`
- `google-generative-ai` → `http://localhost:3030/proxy/{provider-id}/v1beta`

---

## Special Bonus: Bypass Providers (No API Key Required)

These providers use internal methods to access high-performance models typically locked behind specific CLIs. **No API key is needed** — ClawProxy handles the bypass directly.

> **Important Setup Step:** When adding these providers via Quick Setup, you **must change the API Key Mode from `Managed` to `None`** before clicking Create Provider. Do **not** add any API keys to these providers.

### 1. Kilo AI (Bypass)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Kilo AI** |
| **Upstream URL** | `https://api.kilo.ai/api/gateway` |
| **API Format** | `openai-completions` |
| **API Key Mode** | Change to **None** |

**Available Free Models:**

| Model ID | Description | Context |
|----------|-------------|---------|
| `minimax/minimax-m2.5:free` | SOTA model for productivity and coding (SWE-Bench 80.2%) | 204k |
| `giga-potato-thinking` | Stealth model optimized for agentic programming with reasoning | 256k |
| `giga-potato` | Standard version optimized for agentic tasks | 256k |
| `stepfun/step-3.5-flash:free` | Speed-efficient MoE reasoning model for long contexts | 256k |
| `kilo-auto/free` | Dynamic router — auto-routes to available free models | 204k |
| `openrouter/free` | Auto-routes to random free models on OpenRouter | 200k |

**OpenClaw Configuration:**
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

**Dashboard Setup Steps:**
1. Go to **Providers** → **Add Provider** → **Quick Setup** → select **Kilo AI**.
2. **Change API Key Mode to `None`**.
3. Click **Create Provider**.
4. Do **not** add any API keys.
5. Copy the generated **Base URL** and use it in your OpenClaw config.
6. *(Optional)* Go to **Models** tab → **Fetch Models** to see all available models with Free/Paid badges.

---

### 2. OpenCode Zen (Bypass)

This provider offers high-performance coding and reasoning models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **OpenCode Zen** |
| **Upstream URL** | `https://opencode.ai/zen/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | Change to **None** |

**Available Free Models:**

| Model ID | Description | Context |
|----------|-------------|---------|
| `gpt-5-nano` | Ultra-fast preview variant of OpenAI's reasoning models | 400k |
| `minimax-m2.5-free` | SOTA model for productivity and coding (SWE-Bench 80.2%) | 204k |
| `big-pickle` | High-speed stealth model based on GLM, optimized for development | 200k |
| `trinity-large-preview-free` | Arcee AI's 400B MoE model, excels at complex prompts | 128k |

**OpenClaw Configuration:**
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

**Dashboard Setup Steps:**
1. Go to **Providers** → **Add Provider** → **Quick Setup** → select **OpenCode Zen**.
2. **Change API Key Mode to `None`**.
3. Click **Create Provider**.
4. Do **not** add any API keys.
5. Copy the generated **Base URL** and use it in your OpenClaw config.
6. *(Optional)* Go to **Models** tab → **Fetch Models** to see all available models with Free/Paid badges.

---

## Free Tier API Directory (No Credit Card Required)

These providers offer a genuine free tier or quota.

### 1. Ollama Cloud

Access frontier open-weight models hosted on Ollama's cloud. No local hardware or credit card required.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Ollama Cloud** |
| **Upstream URL** | `https://ollama.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Models:**

| Model ID | Notes |
|----------|-------|
| `glm-5:cloud` | Strongest / Reasoning |
| `minimax-m2.5:cloud` | Productivity / Coding |
| `qwen3.5:397b-cloud` | Newest Multimodal |
| `glm-4.7:cloud` | High Performance |
| `gemini-3-flash-preview:cloud` | Frontier Speed |
| `deepseek-v3.2:cloud` | Efficiency / Reasoning |
| `kimi-k2.5:cloud` | Newest Multimodal |

Check for more: https://ollama.com/search?c=cloud&o=newest

**OpenClaw Configuration:**
```json
"ollama": {
  "baseUrl": "http://localhost:3030/proxy/ollama-cloud/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "glm-5:cloud", "name": "glm-5:cloud" },
    { "id": "minimax-m2.5:cloud", "name": "minimax-m2.5:cloud" },
    { "id": "qwen3.5:397b-cloud", "name": "qwen3.5:397b-cloud" },
    { "id": "glm-4.7:cloud", "name": "glm-4.7:cloud" },
    { "id": "gemini-3-flash-preview:cloud", "name": "gemini-3-flash-preview:cloud" },
    { "id": "deepseek-v3.2:cloud", "name": "deepseek-v3.2:cloud" },
    { "id": "kimi-k2.5:cloud", "name": "kimi-k2.5:cloud" }
  ]
}
```

**Dashboard Setup:**
1. Quick Setup → **Ollama Cloud** → Create Provider.
2. Go to **API Keys** tab → add `sk-not-required` as the key (Ollama Cloud uses header auth; ClawProxy manages the flow).
3. Copy the **Base URL**.

---

### 2. Google AI Studio (Gemini)

The most generous free tier with high rate limits. Requires a free API key from [Google AI Studio](https://aistudio.google.com/).

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Google Gemini** |
| **Upstream URL** | `https://generativelanguage.googleapis.com/v1beta` |
| **API Format** | `google-generative-ai` |
| **API Key Mode** | `Managed` |

**Models:**

| Model ID | Notes |
|----------|-------|
| `gemini-3.1-pro-preview` | Flagship |
| `gemini-3.1-flash-lite-preview` | Newest Lite |
| `gemini-3-flash-preview` | High Speed |
| `gemini-2.5-pro` | Previous gen Pro |
| `gemini-2.5-flash` | Previous gen Flash |
| `gemini-2.5-flash-lite` | Previous gen Lite |

**OpenClaw Configuration:**
```json
"google": {
  "baseUrl": "http://localhost:3030/proxy/google-gemini/v1beta",
  "apiKey": "dummy-key",
  "api": "google-generative-ai",
  "models": [
    { "id": "gemini-3.1-pro-preview", "name": "gemini-3.1-pro-preview" },
    { "id": "gemini-3.1-flash-lite-preview", "name": "gemini-3.1-flash-lite-preview" },
    { "id": "gemini-3-flash-preview", "name": "gemini-3-flash-preview" },
    { "id": "gemini-2.5-pro", "name": "gemini-2.5-pro" },
    { "id": "gemini-2.5-flash", "name": "gemini-2.5-flash" },
    { "id": "gemini-2.5-flash-lite", "name": "gemini-2.5-flash-lite" }
  ]
}
```

> **Note:** Google Gemini uses `v1beta` in the Base URL, not `v1`.

**Dashboard Setup:**
1. Quick Setup → **Google Gemini** → Create Provider.
2. Add your Google AI Studio API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

### 3. Groq (LPU Inference)

Extreme speed inference for open models. Free tier is rate-limited but completely free.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Groq** |
| **Upstream URL** | `https://api.groq.com/openai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Models:**

| Model ID | Notes |
|----------|-------|
| `openai/gpt-oss-120b` | New Flagship |
| `llama-3.3-70b-versatile` | Versatile |
| `llama-3.1-8b-instant` | Ultra-fast |
| `mixtral-8x7b-32768` | Large context MoE |

**OpenClaw Configuration:**
```json
"groq": {
  "baseUrl": "http://localhost:3030/proxy/groq/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "openai/gpt-oss-120b", "name": "openai/gpt-oss-120b" },
    { "id": "llama-3.3-70b-versatile", "name": "llama-3.3-70b-versatile" },
    { "id": "llama-3.1-8b-instant", "name": "llama-3.1-8b-instant" },
    { "id": "mixtral-8x7b-32768", "name": "mixtral-8x7b-32768" }
  ]
}
```

**Dashboard Setup:**
1. Quick Setup → **Groq** → Create Provider.
2. Add your Groq API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

### 4. OpenRouter (Free Tier)

Aggregator with many free models. Requires a free OpenRouter API key.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **OpenRouter** |
| **Upstream URL** | `https://openrouter.ai/api/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Free Models:**

| Model ID |
|----------|
| `stepfun/step-3.5-flash:free` |
| `arcee-ai/trinity-large-preview:free` |
| `z-ai/glm-4.5-air:free` |
| `qwen/qwen3-coder:free` |
| `openai/gpt-oss-120b:free` |
| `google/gemma-3-27b-it:free` |
| `meta-llama/llama-3.3-70b-instruct:free` |
| `mistralai/mistral-small-3.1-24b-instruct:free` |
| `nousresearch/hermes-3-llama-3.1-405b:free` |

Check for more: https://openrouter.ai/models

**OpenClaw Configuration:**
```json
"openrouter": {
  "baseUrl": "http://localhost:3030/proxy/openrouter/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "stepfun/step-3.5-flash:free", "name": "stepfun/step-3.5-flash:free" },
    { "id": "arcee-ai/trinity-large-preview:free", "name": "arcee-ai/trinity-large-preview:free" },
    { "id": "z-ai/glm-4.5-air:free", "name": "z-ai/glm-4.5-air:free" },
    { "id": "qwen/qwen3-coder:free", "name": "qwen/qwen3-coder:free" },
    { "id": "openai/gpt-oss-120b:free", "name": "openai/gpt-oss-120b:free" },
    { "id": "google/gemma-3-27b-it:free", "name": "google/gemma-3-27b-it:free" },
    { "id": "meta-llama/llama-3.3-70b-instruct:free", "name": "meta-llama/llama-3.3-70b-instruct:free" },
    { "id": "mistralai/mistral-small-3.1-24b-instruct:free", "name": "mistralai/mistral-small-3.1-24b-instruct:free" },
    { "id": "nousresearch/hermes-3-llama-3.1-405b:free", "name": "nousresearch/hermes-3-llama-3.1-405b:free" }
  ]
}
```

**Dashboard Setup:**
1. Quick Setup → **OpenRouter** → Create Provider.
2. Add your OpenRouter API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

### 5. NVIDIA NIM

High-performance hosted models. Free tier available via developer program.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **NVIDIA NIM** |
| **Upstream URL** | `https://integrate.api.nvidia.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Models:**

| Model ID | Notes |
|----------|-------|
| `z-ai/glm5` | Flagship |
| `z-ai/glm4.7` | High Performance |
| `moonshotai/kimi-k2.5` | Newest Multimodal |
| `moonshotai/kimi-k2-thinking` | Reasoning |
| `minimaxai/minimax-m2.5` | Productivity |
| `qwen/qwen3.5-397b-a17b` | Large MoE |
| `deepseek-ai/deepseek-v3.2` | Efficient |
| `deepseek-ai/deepseek-r1` | Reasoning |

Check for more: https://build.nvidia.com/models

**OpenClaw Configuration:**
```json
"nvidia": {
  "baseUrl": "http://localhost:3030/proxy/nvidia-nim/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "z-ai/glm5", "name": "z-ai/glm5" },
    { "id": "z-ai/glm4.7", "name": "z-ai/glm4.7" },
    { "id": "moonshotai/kimi-k2.5", "name": "moonshotai/kimi-k2.5" },
    { "id": "moonshotai/kimi-k2-thinking", "name": "moonshotai/kimi-k2-thinking" },
    { "id": "minimaxai/minimax-m2.5", "name": "minimaxai/minimax-m2.5" },
    { "id": "qwen/qwen3.5-397b-a17b", "name": "qwen/qwen3.5-397b-a17b" },
    { "id": "deepseek-ai/deepseek-v3.2", "name": "deepseek-ai/deepseek-v3.2" },
    { "id": "deepseek-ai/deepseek-r1", "name": "deepseek-ai/deepseek-r1" }
  ]
}
```

**Dashboard Setup:**
1. Quick Setup → **NVIDIA NIM** → Create Provider.
2. Add your NVIDIA API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

### 6. Cohere

Excellent for RAG and multilingual tasks. Free for development/research.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Cohere** |
| **Upstream URL** | `https://api.cohere.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Models:**

| Model ID | Notes |
|----------|-------|
| `command-r-plus-08-2024` | Flagship |
| `command-r-08-2024` | Standard |
| `c4ai-aya-expanse-32b` | Multilingual |

**OpenClaw Configuration:**
```json
"cohere": {
  "baseUrl": "http://localhost:3030/proxy/cohere/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "command-r-plus-08-2024", "name": "command-r-plus-08-2024" },
    { "id": "command-r-08-2024", "name": "command-r-08-2024" },
    { "id": "c4ai-aya-expanse-32b", "name": "c4ai-aya-expanse-32b" }
  ]
}
```

---

### 7. Cerebras

Ultra-fast inference on open models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Cerebras** |
| **Upstream URL** | `https://api.cerebras.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

**Models:** `llama-3.3-70b`, `llama-3.1-8b`

**OpenClaw Configuration:**
```json
"cerebras": {
  "baseUrl": "http://localhost:3030/proxy/cerebras/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "llama-3.3-70b", "name": "llama-3.3-70b" },
    { "id": "llama-3.1-8b", "name": "llama-3.1-8b" }
  ]
}
```

---

## Paid & Subscription API Providers

If you have paid API accounts, configure them securely in ClawProxy. All keys are stored locally — never sent externally.

> **Important:** ClawProxy only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.

### Perplexity (Paid API)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup → **Perplexity** |
| **Upstream URL** | `https://api.perplexity.ai` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Perplexity provides two APIs under the same base URL:
- **Sonar API** — Native search-augmented models
- **Agent API** — Third-party frontier models with optional web search

**Sonar Models:** `sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research`

**Agent Models:** `perplexity/sonar`, `anthropic/claude-opus-4-6`, `anthropic/claude-sonnet-4-6`, `openai/gpt-5.4`, `openai/gpt-5-mini`, `google/gemini-2.5-pro`, `google/gemini-2.5-flash`, `nvidia/nemotron-3-super-120b-a12b`, `xai/grok-4-1-fast-non-reasoning`

**OpenClaw Configuration:**
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

### Other Paid Providers

You can apply the same setup to any paid developer account:
- **OpenAI** — Template: Quick Setup → **OpenAI**
- **Anthropic** — Template: Quick Setup → **Anthropic** (uses `anthropic-messages` format)
- **Z.AI** — Templates: **Z.AI API** or **Z.AI Coding**

---

## Support & Developer Info

**ClawProxy** is developed and maintained by **Malek-Rsh**.

- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
