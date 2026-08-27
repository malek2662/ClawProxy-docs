# Bypass Providers

Bypass providers access AI models without requiring an API key. ClawRouter handles authentication internally via static default headers -- no keys to add, no signup required.

> **Version 1.0.18**

> **No Setup Tricks Needed:** Keyless presets ship with API Key Mode `None` pre-selected. Just pick the preset and click **Create Provider** -- do **not** add any API keys. The keys table is replaced by an informational card, and the add-key endpoint rejects keys for these providers.

> **Client configuration:** Ready-to-paste setups for every client (OpenClaw, OpenCode, Claude Code, Codex CLI, Qwen Code, DeepSeek Harness, custom) live in the **Client Setup** section -- or open the provider's **Prompt for AI** dialog in the dashboard, which generates the config for you with your real proxy key and current model list included.

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
| `nemotron-3-ultra-free` | NVIDIA Nemotron 3 Ultra (free) | 1M |
| `nemotron-3.5-lightning-free` | NVIDIA Nemotron 3.5 Lightning (free) | 262k |
| `x-preview-f-free` | "Ox Alpha" stealth preview (free, unlimited) | 1M |
| `muse-spark-1.2-contributor-free` | Muse Spark 1.2 (contributor free) | 1M |
| `laguna-s-2.1-free` | Poolside Laguna S 2.1 (free) | 256k |
| `deepseek-v4-flash-free` | DeepSeek V4 Flash (free) | 200k |
| `mimo-v2.5-free` | Xiaomi MiMo V2.5 (free) | 200k |
| `big-pickle` | High-speed stealth model optimized for development | 200k |
| `hy3-free` | Tencent Hy3 (free) | 190k |

> **Free models rotate.** Zen's free set is limited-time and changes frequently -- this is a snapshot (August 2026), and `deepseek-v4-flash-free` / `laguna-s-2.1-free` are already marked deprecated upstream and may fail at generation. The dashboard's **Models tab > Fetch Models** always shows today's free/paid set. Official list: [opencode.ai/docs/zen](https://opencode.ai/docs/zen/).

### Dashboard Setup Steps

1. Go to **Providers** > **Add Provider** > **Quick Setup** > select **OpenCode Zen**.
2. Click **Create Provider** -- API Key Mode is already set to `None`.
3. Do **not** add any API keys.
4. Copy the generated **Base URL** and use it in your AI client.
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
| `kilo-auto/free` | Dynamic router -- auto-routes to available free models | 256k |
| `meituan/longcat-2.0-free` | Meituan LongCat 2.0 | 1M |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | NVIDIA Nemotron 3 Ultra 550B | 1M |
| `nvidia/nemotron-3.5-lightning:free` | NVIDIA Nemotron 3.5 Lightning | 1M |
| `dots-studio/dots-3-note-preview:free` | Dots Studio Dots3-Note Preview | 512k |
| `stepfun/step-3.7-flash:free` | StepFun Step 3.7 Flash | 256k |
| `tencent/hy3:free` | Tencent Hy3 | 256k |
| `poolside/laguna-s-2.1:free` | Poolside Laguna S 2.1 | 256k |
| `poolside/laguna-xs-2.1:free` | Poolside Laguna XS 2.1 | 256k |
| `cohere/north-mini-code:free` | Cohere North Mini Code | 256k |
| `nvidia/nemotron-3-super-120b-a12b:free` | NVIDIA Nemotron 3 Super 120B | 256k |
| `liquid/lfm-2.5-2.6b:free` | LiquidAI LFM2.5-2.6B | 65k |
| `openrouter/free` | Auto-routes to random free models on OpenRouter | 200k |

> **Free models rotate.** This is a snapshot (August 2026) of the gateway's free set. **Models tab > Fetch Models** shows the live list with Free/Paid badges and per-model metadata (context, max output, modalities). Live catalog: [api.kilo.ai/api/gateway/models](https://api.kilo.ai/api/gateway/models).

### Dashboard Setup Steps

1. Go to **Providers** > **Add Provider** > **Quick Setup** > select **Kilo AI (Free)**.
2. Click **Create Provider** -- API Key Mode is already set to `None`.
3. Do **not** add any API keys.
4. Copy the generated **Base URL** and use it in your AI client.
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
