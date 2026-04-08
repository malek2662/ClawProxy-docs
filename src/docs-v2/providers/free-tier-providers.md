# Free Tier Providers

These providers offer a genuine free tier or quota. You need a free API key from each provider -- no credit card required.

> **Version 1.0.12**

---

## Ollama Cloud

Access frontier open-weight models hosted on Ollama's cloud. No local hardware or credit card required.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Ollama Cloud** |
| **Upstream URL** | `https://ollama.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

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

### OpenClaw Configuration

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

### Dashboard Setup

1. Quick Setup > **Ollama Cloud** > Create Provider.
2. Go to **API Keys** tab > add `sk-not-required` as the key (Ollama Cloud uses header auth; ClawProxy manages the flow).
3. Copy the **Base URL**.

---

## Google AI Studio (Gemini)

The most generous free tier with high rate limits. Requires a free API key from [Google AI Studio](https://aistudio.google.com/).

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Google Gemini** |
| **Upstream URL** | `https://generativelanguage.googleapis.com/v1beta` |
| **API Format** | `google-generative-ai` |
| **API Key Mode** | `Managed` |

### Models

| Model ID | Notes |
|----------|-------|
| `gemini-3.1-pro-preview` | Flagship |
| `gemini-3.1-flash-lite-preview` | Newest Lite |
| `gemini-3-flash-preview` | High Speed |
| `gemini-2.5-pro` | Previous gen Pro |
| `gemini-2.5-flash` | Previous gen Flash |
| `gemini-2.5-flash-lite` | Previous gen Lite |

### OpenClaw Configuration

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

### Dashboard Setup

1. Quick Setup > **Google Gemini** > Create Provider.
2. Add your Google AI Studio API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## Groq (LPU Inference)

Extreme speed inference for open models. Free tier is rate-limited but completely free.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Groq** |
| **Upstream URL** | `https://api.groq.com/openai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

| Model ID | Notes |
|----------|-------|
| `openai/gpt-oss-120b` | New Flagship |
| `llama-3.3-70b-versatile` | Versatile |
| `llama-3.1-8b-instant` | Ultra-fast |
| `mixtral-8x7b-32768` | Large context MoE |

### OpenClaw Configuration

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

### Dashboard Setup

1. Quick Setup > **Groq** > Create Provider.
2. Add your Groq API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## OpenRouter (Free Tier)

Aggregator with many free models. Requires a free OpenRouter API key.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenRouter** |
| **Upstream URL** | `https://openrouter.ai/api/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Free Models

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

### OpenClaw Configuration

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

### Dashboard Setup

1. Quick Setup > **OpenRouter** > Create Provider.
2. Add your OpenRouter API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## NVIDIA NIM

High-performance hosted models. Free tier available via developer program.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **NVIDIA NIM** |
| **Upstream URL** | `https://integrate.api.nvidia.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

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

### OpenClaw Configuration

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

### Dashboard Setup

1. Quick Setup > **NVIDIA NIM** > Create Provider.
2. Add your NVIDIA API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## Cohere

Excellent for RAG and multilingual tasks. Free for development/research.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Cohere** |
| **Upstream URL** | `https://api.cohere.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

| Model ID | Notes |
|----------|-------|
| `command-r-plus-08-2024` | Flagship |
| `command-r-08-2024` | Standard |
| `c4ai-aya-expanse-32b` | Multilingual |

### OpenClaw Configuration

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

## Cerebras

Ultra-fast inference on open models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Cerebras** |
| **Upstream URL** | `https://api.cerebras.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

`llama-3.3-70b`, `llama-3.1-8b`

### OpenClaw Configuration

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
