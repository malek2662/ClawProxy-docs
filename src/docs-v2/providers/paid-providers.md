# Paid Providers

Configure paid API providers securely in ClawRouter. All keys are stored locally -- never sent externally.

> **Version 1.0.17**

> **Important:** ClawRouter only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.

> **Client configuration:** Ready-to-paste setups for every client (OpenClaw, OpenCode, Claude Code, Codex CLI, Qwen Code, DeepSeek Harness, custom) live in the **Client Setup** section -- or open the provider's **Prompt for AI** dialog in the dashboard, which generates the config for you with your real proxy key and current model list included.

---

## Perplexity

Perplexity offers two separate presets:

### Perplexity (Sonar API)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Perplexity** |
| **Upstream URL** | `https://api.perplexity.ai` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Native search-augmented models: `sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research`

### Perplexity Agent (Responses API)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Perplexity Agent** |
| **Upstream URL** | `https://api.perplexity.ai/v1` |
| **API Format** | `openai-responses` |
| **API Key Mode** | `Managed` |

Third-party frontier models with optional web search via the OpenAI Responses API format: `perplexity/sonar`, `openai/gpt-5.4`, `anthropic/claude-sonnet-4-6`, `google/gemini-3.1-pro-preview`

> **Live Model List:** Perplexity has a real `/v1/models` endpoint -- **Fetch Models** retrieves the current catalog (45+ models, including Agent-API gateway ids like `anthropic/...`, `openai/...`, `perplexity/glm-5.x`, `perplexity/kimi-k2.7-code`) with per-model pricing. The seeded lists above are only the starting set.

> *Model lists change over time -- snapshot from August 2026.* Official catalog: [docs.perplexity.ai/docs/sonar/models](https://docs.perplexity.ai/docs/sonar/models)

---

## OpenAI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenAI** |
| **Upstream URL** | `https://api.openai.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-5.5`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.2`, `gpt-5.1`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [platform.openai.com/docs/models](https://platform.openai.com/docs/models)

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

Seeded models: `claude-fable-5`, `claude-opus-5`, `claude-sonnet-5`, `claude-haiku-4-5-20251001`

> **Note:** Anthropic uses the `anthropic-messages` API format, not `openai-completions`. ClawRouter auto-fills the required `anthropic-version: 2023-06-01` header when your client doesn't send it.

> **Live Model List:** Anthropic has a real `/v1/models` endpoint -- **Fetch Models** retrieves the current catalog (paginated). A hardcoded list is used only as a fallback.

> *Model lists change over time -- snapshot from August 2026.* Official catalog: [platform.claude.com/docs/en/about-claude/models/overview](https://platform.claude.com/docs/en/about-claude/models/overview)

### Dashboard Setup

1. Quick Setup > **Anthropic** > Create Provider.
2. Add your Anthropic API key(s) in the **API Keys** tab.
3. Copy the **Base URL**.

---

## DeepSeek

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **DeepSeek** |
| **Upstream URL** | `https://api.deepseek.com` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `deepseek-v4-pro`, `deepseek-v4-flash`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [api-docs.deepseek.com/quick_start/pricing](https://api-docs.deepseek.com/quick_start/pricing)

---

## xAI (Grok)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **xAI (Grok)** |
| **Upstream URL** | `https://api.x.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `grok-4.6`, `grok-4.5`, `grok-4.3`, `grok-code-fast-1`, `grok-build-0.1`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [docs.x.ai/docs/models](https://docs.x.ai/docs/models)

---

## Mistral

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Mistral** |
| **Upstream URL** | `https://api.mistral.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mistral-large-latest`, `codestral-latest`, `mistral-medium-latest`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [docs.mistral.ai/getting-started/models/models_overview](https://docs.mistral.ai/getting-started/models/models_overview/)

---

## Z.AI

Z.AI offers three separate presets:

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

Seeded models: `glm-5.3`, `glm-5-turbo`, `glm-5v-turbo`, `glm-5.2`, `glm-5.1`, `glm-4.7`

### Z.AI Coding (China)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Z.AI Coding (China)** |
| **Upstream URL** | `https://open.bigmodel.cn/api/coding/paas/v4` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `glm-5.3`, `glm-5-turbo`, `glm-5v-turbo`, `glm-5.2`, `glm-5.1`, `glm-5`, `glm-4.7`

> *Model lists change over time -- snapshot from August 2026. The coding-plan gateway has no public model-list endpoint, so **Fetch Models** uses the curated list above; the general Z.AI API preset fetches live.* Official docs: [docs.z.ai](https://docs.z.ai)

### Business Error Codes

Z.AI returns a numeric-string **business code** in `error.code` that beats the HTTP status -- hard billing, window quotas, model gating, and rate limits all ride on 429. ClawRouter classifies by code:

| Code | Meaning | How ClawRouter Handles It |
|------|---------|---------------------------|
| 1113 | Insufficient balance (hard billing) | AUTH_ERROR -- key **disabled** (recharge required) |
| 1308, 1310, 1316-1321 | Self-resetting 5-hour / 7-day quota windows | QUOTA_EXHAUSTED -- long backoff, **never disabled** |
| 1309, 1314, 1315 | Expired / wrong plan | AUTH_ERROR -- key **disabled** |
| 1311 | Plan doesn't include the model | MODEL_ERROR -- model fallback |
| 1302, 1313 | Rate limit | RATE_LIMIT -- 60s backoff |
| 1305 | Overloaded | OVERLOADED -- retry same key |
| 1211 | Unknown model | MODEL_ERROR -- model fallback |

### Quota Visibility (GLM Coding Plan)

The Z.AI Coding presets have a **Quota tab** (see Provider Management > View Live Quota & Usage) backed by Z.AI's plan endpoints:

- `GET {origin}/api/monitor/usage/quota/limit` -- token windows (5-hour session, weekly -- the weekly window may be percentage-only and renders as %) with epoch-millisecond reset times, plus the monthly web-search count
- `GET {origin}/api/biz/subscription/list` -- plan name (best-effort)

Two traps handled automatically:

- A key with **no GLM Coding Plan** returns a "coding plan" error payload -- the key is **valid** and stays enabled; the Quota tab shows an amber **"key valid, no active plan"** note.
- A **dead key** returns HTTP 200 with `{"code":1000,"msg":"Authentication Failed","success":false}` -- detected as an auth rejection and treated like a real 401 (key auto-disabled).

---

## Kimi for Coding (Anthropic Format)

Moonshot's Kimi models via a Claude-compatible endpoint.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Kimi for Coding** |
| **Upstream URL** | `https://api.kimi.com/coding/v1` |
| **API Format** | `anthropic-messages` |
| **API Key Mode** | `Managed` |

Seeded models: `kimi-for-coding`, `k3`, `k3-256k`

> *Model lists change over time -- snapshot from August 2026.* Official docs: [platform.kimi.ai/docs](https://platform.kimi.ai/docs)

> **Claude Code ready:** Because this provider speaks the Anthropic Messages format, you can point Claude Code at it -- use the **Claude Code** tab in the provider's **Prompt for AI** dialog.

### Quota Windows

Kimi Coding enforces **5-hour, weekly, and monthly quota windows**. When a window is full, the API returns HTTP 403 `access_terminated_error` (not 429). ClawRouter classifies this as **quota exhaustion**, not an auth error:

- The key enters a **timed backoff** and is **never disabled** -- it recovers automatically when the window resets.
- Cooldowns are **per-key and window-accurate**: every successful quota probe saves a snapshot of that key's windows, and on exhaustion the key cools down until **its own exhausted window's reset** (5-hour trip > 5-hour reset; weekly trip > weekly reset -- no shared blanket cooldown).
- **Monthly billing-cycle exhaustion** is detected separately ("Monthly usage cycle exhausted"): the key stays enabled and is retried in ~10-day steps anchored to its last successful use until the cycle renews.
- The provider's **Quota** tab (`?tab=quota`, **Fetch Quota** button) shows one card per enabled key -- sorted usable keys first -- with membership level, region, parallel limit, per-window progress bars (5-hour window, weekly cycle) with remaining quota and reset countdowns, and the booster wallet monthly cap.

---

## MiniMax Coding (Anthropic Format)

MiniMax M-series via Claude-compatible endpoints. Two regional presets:

### MiniMax Coding (Intl)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **MiniMax Coding (Intl)** |
| **Upstream URL** | `https://api.minimax.io/anthropic/v1` |
| **API Format** | `anthropic-messages` |
| **API Key Mode** | `Managed` |

### MiniMax Coding (China)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **MiniMax Coding (China)** |
| **Upstream URL** | `https://api.minimaxi.com/anthropic/v1` |
| **API Format** | `anthropic-messages` |
| **API Key Mode** | `Managed` |

Seeded models: `MiniMax-M3`, `MiniMax-M2.7`, `MiniMax-M2.5`, `MiniMax-M2.1`

> **Live Model List:** MiniMax has a real `/v1/models` endpoint (on both the international and China hosts) -- **Fetch Models** retrieves the current catalog, including the `-highspeed` variants (`MiniMax-M2.7-highspeed`, `MiniMax-M2.5-highspeed`, `MiniMax-M2.1-highspeed`). The seeded list above is used only as a fetch-failure fallback.

> *Model lists change over time -- snapshot from August 2026.* Official docs: [platform.minimax.io/docs](https://platform.minimax.io/docs/api-reference/text-chat-openai)

---

## Alibaba

Four presets covering the coding plans and the general Model Studio API:

### Alibaba Coding Plan (CN)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Coding Plan (CN)** |
| **Upstream URL** | `https://coding.dashscope.aliyuncs.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.7-plus`, `qwen3.6-plus`, `qwen3.5-plus`, `qwen3-max-2026-01-23`, `qwen3-coder-next`, `qwen3-coder-plus`, `glm-5`, `glm-4.7`, `kimi-k2.5`, `MiniMax-M2.5`

### Alibaba Coding Plan (Intl)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Coding Plan (Intl)** |
| **Upstream URL** | `https://coding-intl.dashscope.aliyuncs.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.7-plus`, `qwen3.6-plus`, `qwen3.5-plus`, `qwen3-max-2026-01-23`, `qwen3-coder-next`, `qwen3-coder-plus`, `glm-5`, `glm-4.7`, `kimi-k2.5`, `MiniMax-M2.5`

### Alibaba Model Studio (CN)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Model Studio (CN)** |
| **Upstream URL** | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.5-plus`, `qwen3-coder-plus`, `qwen3-coder-next`, `qwen-plus`, `qwen-turbo`

### Alibaba Model Studio (Intl)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Model Studio (Intl)** |
| **Upstream URL** | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.5-plus`, `qwen3-coder-plus`, `qwen3-coder-next`, `qwen-plus`, `qwen-turbo`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list (all four endpoints answer `/models`).* Official docs: [help.aliyun.com/en/model-studio](https://help.aliyun.com/en/model-studio/qwen-api-via-openai-chat-completions)

> **Coding Plan vs Model Studio keys are NOT interchangeable:** Coding-Plan keys come from a subscription and only work on the `coding{,-intl}` endpoints; Model Studio keys are pay-as-you-go and only work on the `dashscope{,-intl}` endpoints. Mixing them is the usual cause of `invalid_api_key`.

---

## China Providers

### Baidu Qianfan

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Baidu Qianfan** |
| **Upstream URL** | `https://qianfan.baidubce.com/v2` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `deepseek-v4-pro`, `deepseek-v4-flash`, `glm-5.2`, `kimi-k2.6`, `qwen3.5-397b-a17b`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Tencent Hunyuan

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Tencent Hunyuan** |
| **Upstream URL** | `https://api.hunyuan.cloud.tencent.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `hunyuan-turbos-latest`, `hunyuan-t1-latest`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Volcengine Ark

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Volcengine Ark** |
| **Upstream URL** | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `Doubao-Seed-2.0-Code`, `Doubao-Seed-Code`, `DeepSeek-V4-Flash`, `GLM-5.1`, `Kimi-K2.6`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [volcengine.com/docs/82379](https://www.volcengine.com/docs/82379)

### Xiaomi MiMo

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Xiaomi MiMo** |
| **Upstream URL** | `https://api.xiaomimimo.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mimo-v2.5-pro`, `mimo-v2.5`, `mimo-v2-omni`, `mimo-v2-flash`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Xiaomi MiMo Token Plan

For MiMo subscription keys (`tp-` prefix).

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Xiaomi MiMo Token Plan** |
| **Upstream URL** | `https://token-plan-sgp.xiaomimimo.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mimo-v2.5-pro`, `mimo-v2.5`, `mimo-v2-pro`, `mimo-v2-omni`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

---

## Aggregators & Inference Clouds

### SiliconFlow

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **SiliconFlow** |
| **Upstream URL** | `https://api.siliconflow.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `deepseek-ai/DeepSeek-V4-Pro`, `deepseek-ai/DeepSeek-R1`, `Qwen/Qwen3.5-397B-A17B`, `zai-org/GLM-5.1`, `moonshotai/Kimi-K2.6`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [docs.siliconflow.cn](https://docs.siliconflow.cn)

### Together AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Together AI** |
| **Upstream URL** | `https://api.together.xyz/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `meta-llama/Llama-3.3-70B-Instruct-Turbo`, `deepseek-ai/DeepSeek-R1`, `Qwen/Qwen3-235B-A22B`, `meta-llama/Llama-4-Maverick-FP8`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official catalog: [docs.together.ai/docs/serverless-models](https://docs.together.ai/docs/serverless-models)

### Fireworks AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Fireworks AI** |
| **Upstream URL** | `https://api.fireworks.ai/inference/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `accounts/fireworks/models/deepseek-v3p1`, `accounts/fireworks/models/llama-v3p3-70b-instruct`, `accounts/fireworks/models/qwen3-235b-a22b`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [docs.fireworks.ai](https://docs.fireworks.ai)

### Featherless

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Featherless** |
| **Upstream URL** | `https://api.featherless.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `deepseek-ai/DeepSeek-V4-Pro`, `zai-org/GLM-5.2`, `moonshotai/Kimi-K2.7-Code`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Hyperbolic

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Hyperbolic** |
| **Upstream URL** | `https://api.hyperbolic.xyz/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `Qwen/QwQ-32B`, `deepseek-ai/DeepSeek-R1`, `deepseek-ai/DeepSeek-V3`, `meta-llama/Llama-3.3-70B-Instruct`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Chutes AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Chutes AI** |
| **Upstream URL** | `https://llm.chutes.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Nebius AI Studio

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Nebius AI Studio** |
| **Upstream URL** | `https://api.studio.nebius.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `meta-llama/Llama-3.3-70B-Instruct`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Venice AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Venice AI** |
| **Upstream URL** | `https://api.venice.ai/api/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `venice-uncensored-1-2`, `zai-org-glm-5`, `qwen3-235b-a22b-instruct-2507`, `llama-3.3-70b`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Vercel AI Gateway

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Vercel AI Gateway** |
| **Upstream URL** | `https://ai-gateway.vercel.sh/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### LLM7

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **LLM7** |
| **Upstream URL** | `https://api.llm7.io/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `gpt-5.5`, `deepseek-v4-flash`, `kimi-k3`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Blackbox AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Blackbox AI** |
| **Upstream URL** | `https://api.blackbox.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `claude-sonnet-4.6`, `gpt-5.4`, `deepseek-v4-flash`, `grok-4.3`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### Morph

Fast-apply / coding models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Morph** |
| **Upstream URL** | `https://api.morphllm.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `morph-v3-large`, `morph-v3-fast`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.*

### OpenCode Go

OpenCode's paid tier -- same platform as the free OpenCode Zen preset, but with a key.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenCode Go** |
| **Upstream URL** | `https://opencode.ai/zen/go/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `glm-5.2`, `kimi-k2.7-code`, `deepseek-v4-pro`, `minimax-m3`, `qwen3.7-max`

> *Model lists change over time -- snapshot from August 2026. Use **Models tab > Fetch Models** for the live list.* Official docs: [opencode.ai/docs/zen](https://opencode.ai/docs/zen/)
