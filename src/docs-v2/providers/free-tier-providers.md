# Free Tier Providers

These providers offer a genuine free tier or quota. You need a free API key from each provider -- no credit card required. Each preset includes a **Get API Key** link directly in the Add Provider form.

> **Version 1.0.18**

> **Client configuration:** Ready-to-paste setups for every client (OpenClaw, OpenCode, Claude Code, Codex CLI, Qwen Code, DeepSeek Harness, custom) live in the **Client Setup** section -- or open the provider's **Prompt for AI** dialog in the dashboard, which generates the config for you with your real proxy key and current model list included.

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
| `glm-5.2:cloud` | GLM Flagship |
| `glm-5.1:cloud` | GLM Previous Gen |
| `kimi-k2.6:cloud` | Kimi K2.6 |
| `minimax-m3:cloud` | MiniMax M3 |
| `minimax-m2.7:cloud` | MiniMax M2.7 |
| `deepseek-v4-flash:cloud` | DeepSeek V4 Flash |
| `qwen3.5:397b-cloud` | Qwen 3.5 397B MoE |

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [ollama.com/search?c=cloud](https://ollama.com/search?c=cloud&o=newest)

### Dashboard Setup

1. Quick Setup > **Ollama Cloud** > Create Provider.
2. Go to **API Keys** tab > add `sk-not-required` as the key (Ollama Cloud uses header auth; ClawRouter manages the flow).
3. Copy the **Base URL**.

> **Plan-gated models:** Ollama Cloud returns HTTP 403 "this model requires a subscription, upgrade for access" for models outside your plan. ClawRouter classifies this as a **model error** -- your key stays enabled, and Model Fallback / the model circuit handle it automatically. There is no free-vs-paid marker in Ollama's API, so gated models are discovered at runtime: after a couple of failures they show an amber **"Skipped"** badge on the **Models** tab. Remove those models from your list (or upgrade your plan) to avoid fallback hops.

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
| `gemini-3.7-flash` | Newest Flash |
| `gemini-3.6-flash` | Flash |
| `gemini-3.5-flash` | Flash |
| `gemini-3.5-flash-lite` | Flash Lite |
| `gemini-3.1-pro` | Pro |
| `gemini-3-flash` | Previous Gen Flash |
| `gemini-2.5-pro` | 2.5 Pro |
| `gemini-2.5-flash` | 2.5 Flash |
| `gemini-2.5-flash-lite` | 2.5 Flash Lite |

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list (includes per-model token limits and thinking support).* Official catalog: [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)

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
| `openai/gpt-oss-120b` | OpenAI Open-Weight Flagship |
| `openai/gpt-oss-20b` | OpenAI Open-Weight Small |
| `llama-3.3-70b-versatile` | Versatile |
| `llama-3.1-8b-instant` | Fast |
| `qwen/qwen3.6-27b` | Qwen 3.6 |
| `groq/compound` | Groq Compound System |

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [console.groq.com/docs/models](https://console.groq.com/docs/models)

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
| `z-ai/glm-5.2:free` |
| `nvidia/nemotron-3-ultra-550b-a55b:free` |
| `nvidia/nemotron-3-super-120b-a12b:free` |
| `nvidia/nemotron-3.5-lightning:free` |
| `google/gemma-4-31b-it:free` |
| `google/gemma-4-26b-a4b-it:free` |
| `openai/gpt-oss-20b:free` |
| `cohere/north-mini-code:free` |
| `poolside/laguna-s-2.1:free` |
| `liquid/lfm-2.5-2.6b:free` |

> *The `:free` roster rotates constantly -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [openrouter.ai/models](https://openrouter.ai/models)

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

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [build.nvidia.com/models](https://build.nvidia.com/models)

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
| **Upstream URL** | `https://api.cohere.com/compatibility/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

> **Two Cohere APIs:** the preset targets Cohere's **OpenAI-compatibility API** (`/compatibility/v1`), which is fully OpenAI-shaped for both chat and `/models`. The native API (`/v1`) has no `/v1/chat/completions` endpoint and is not supported.

### Models

| Model ID | Notes |
|----------|-------|
| `command-a-03-2025` | Newest |
| `command-r-plus-08-2024` | Flagship |
| `command-r-08-2024` | Standard |
| `command-r7b-12-2024` | Small / Fast |

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [docs.cohere.com/docs/models](https://docs.cohere.com/docs/models)

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

`llama-3.3-70b`, `gpt-oss-120b`, `zai-glm-4.7`, `qwen-3-235b-a22b-instruct-2507`, `qwen-3-32b`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [inference-docs.cerebras.ai](https://inference-docs.cerebras.ai)

---

## Cloudflare Workers AI

Models hosted on Cloudflare's global network. Free tier available.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Cloudflare Workers AI** |
| **Upstream URL** | `https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

> **Important:** After creating the provider, open its **Settings** tab and replace `YOUR_ACCOUNT_ID` in the Upstream URL with your actual Cloudflare account ID.

### Models

`@cf/meta/llama-3.3-70b-instruct-fp8-fast`, `@cf/moonshotai/kimi-k2.6`

> *Model lists change over time -- snapshot from August 2026.* Official catalog: [developers.cloudflare.com/workers-ai/models](https://developers.cloudflare.com/workers-ai/models/)

### Dashboard Setup

1. Quick Setup > **Cloudflare Workers AI** > Create Provider.
2. Edit the Upstream URL in the **Settings** tab to include your account ID.
3. Add your Cloudflare API token in the **API Keys** tab.
4. Copy the **Base URL**.

---

## BytePlus ModelArk

ByteDance coding models (international endpoint). Free tier available during promotion.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **BytePlus ModelArk** |
| **Upstream URL** | `https://ark.ap-southeast.bytepluses.com/api/coding/v3` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

`seed-2-0-pro-260328`, `seed-2-0-code-preview-260328`, `seed-2-0-mini-260215`, `kimi-k2-thinking-251104`, `glm-4-7-251222`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [docs.byteplus.com/en/docs/ModelArk](https://docs.byteplus.com/en/docs/ModelArk)

### Dashboard Setup

1. Quick Setup > **BytePlus ModelArk** > Create Provider.
2. Add your BytePlus API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## API.airforce

Community free-tier gateway.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **API.airforce** |
| **Upstream URL** | `https://api.airforce/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

`anthropic/claude-3.7-sonnet`, `moonshot/kimi-k2.6`, `google/gemini-2.5-flash`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

---

## Bazaarlink

Aggregated free & paid models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Bazaarlink** |
| **Upstream URL** | `https://bazaarlink.ai/api/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

`auto:free`, `claude-sonnet-4.6`, `gpt-5.4`, `kimi-k2.6`, `glm-5`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

---

## Poolside

Coding-focused models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Poolside** |
| **Upstream URL** | `https://inference.poolside.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Models

`poolside/laguna-s-2.1`, `poolside/laguna-xs-2.1`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*
