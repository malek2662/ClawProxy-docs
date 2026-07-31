# Paid Providers

Configure paid API providers securely in ClawRouter. All keys are stored locally -- never sent externally.

> **Version 1.0.13**

> **Important:** ClawRouter only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.

> **About `apiKey`:** In the OpenClaw configuration below, `cr_your_proxy_key` stands for the **proxy API key** from the dashboard (**Settings** > **Proxy API Key**). The **"Prompt for AI"** dialog inserts it automatically.

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

### OpenClaw Configuration

```json
"perplexity": {
  "baseUrl": "http://localhost:3030/proxy/perplexity/v1",
  "apiKey": "cr_your_proxy_key",
  "api": "openai-completions",
  "models": [
    { "id": "sonar", "name": "Sonar" },
    { "id": "sonar-pro", "name": "Sonar Pro" },
    { "id": "sonar-reasoning-pro", "name": "Sonar Reasoning Pro" },
    { "id": "sonar-deep-research", "name": "Sonar Deep Research" }
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

Seeded models: `gpt-5.2`, `gpt-5.1`, `gpt-5`, `gpt-5-mini`, `gpt-4o`, `gpt-4o-mini`, `o4-mini`, `o3`

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

> **Note:** Anthropic uses the `anthropic-messages` API format, not `openai-completions`. ClawRouter auto-fills the required `anthropic-version: 2023-06-01` header when your client doesn't send it.

> **Live Model List:** Anthropic has a real `/v1/models` endpoint -- **Fetch Models** retrieves the current catalog (paginated). A hardcoded list is used only as a fallback.

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

Seeded models: `deepseek-chat`, `deepseek-reasoner`, `deepseek-v4-pro`, `deepseek-v4-flash`

---

## xAI (Grok)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **xAI (Grok)** |
| **Upstream URL** | `https://api.x.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `grok-4`, `grok-4-fast-reasoning`, `grok-code-fast-1`, `grok-3`

---

## Mistral

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Mistral** |
| **Upstream URL** | `https://api.mistral.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mistral-large-latest`, `codestral-latest`, `mistral-medium-latest`

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

Seeded models: `glm-5.2`, `glm-5.1`, `glm-5`, `glm-4.7`

### Z.AI Coding (China)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Z.AI Coding (China)** |
| **Upstream URL** | `https://open.bigmodel.cn/api/coding/paas/v4` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `glm-5.2`, `glm-5.1`, `glm-5`, `glm-4.7`, `glm-4.6`, `glm-4.5-air`

---

## Kimi for Coding (Anthropic Format)

Moonshot's Kimi models via a Claude-compatible endpoint.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Kimi for Coding** |
| **Upstream URL** | `https://api.kimi.com/coding/v1` |
| **API Format** | `anthropic-messages` |
| **API Key Mode** | `Managed` |

Seeded models: `kimi-for-coding`, `kimi-k2.7-code`, `kimi-k2.6`, `kimi-k2.5`, `kimi-latest`

> **Claude Code ready:** Because this provider speaks the Anthropic Messages format, you can point Claude Code at it -- use the **Claude Code** tab in the provider's **Prompt for AI** dialog.

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

---

## Alibaba

Three presets covering the coding plans and the general Model Studio API:

### Alibaba Coding Plan (CN)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Coding Plan (CN)** |
| **Upstream URL** | `https://coding.dashscope.aliyuncs.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.5-plus`, `qwen3-coder-next`, `qwen3-coder-plus`, `kimi-k2.5`, `glm-5`, `MiniMax-M2.5`

### Alibaba Coding Plan (Intl)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Coding Plan (Intl)** |
| **Upstream URL** | `https://coding-intl.dashscope.aliyuncs.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.5-plus`, `qwen3-coder-next`, `kimi-k2.5`, `glm-5`, `MiniMax-M2.5`

### Alibaba Model Studio (Intl)

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Alibaba Model Studio (Intl)** |
| **Upstream URL** | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `qwen3.5-plus`, `qwen3-coder-next`, `kimi-k2.5`, `glm-5`

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

### Tencent Hunyuan

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Tencent Hunyuan** |
| **Upstream URL** | `https://api.hunyuan.cloud.tencent.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `hunyuan-turbos-latest`, `hunyuan-t1-latest`

### Volcengine Ark

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Volcengine Ark** |
| **Upstream URL** | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `Doubao-Seed-2.0-Code`, `Doubao-Seed-Code`, `DeepSeek-V4-Flash`, `GLM-5.1`, `Kimi-K2.6`

### Xiaomi MiMo

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Xiaomi MiMo** |
| **Upstream URL** | `https://api.xiaomimimo.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mimo-v2.5-pro`, `mimo-v2.5`, `mimo-v2-omni`, `mimo-v2-flash`

### Xiaomi MiMo Token Plan

For MiMo subscription keys (`tp-` prefix).

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Xiaomi MiMo Token Plan** |
| **Upstream URL** | `https://token-plan-sgp.xiaomimimo.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `mimo-v2.5-pro`, `mimo-v2.5`, `mimo-v2-pro`, `mimo-v2-omni`

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

### Together AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Together AI** |
| **Upstream URL** | `https://api.together.xyz/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Fireworks AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Fireworks AI** |
| **Upstream URL** | `https://api.fireworks.ai/inference/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Featherless

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Featherless** |
| **Upstream URL** | `https://api.featherless.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Hyperbolic

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Hyperbolic** |
| **Upstream URL** | `https://api.hyperbolic.xyz/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

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

### Venice AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Venice AI** |
| **Upstream URL** | `https://api.venice.ai/api/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

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

### Blackbox AI

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Blackbox AI** |
| **Upstream URL** | `https://api.blackbox.ai/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

### Morph

Fast-apply / coding models.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **Morph** |
| **Upstream URL** | `https://api.morphllm.com/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `morph-v3-large`, `morph-v3-fast`

### OpenCode Go

OpenCode's paid tier -- same platform as the free OpenCode Zen preset, but with a key.

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **OpenCode Go** |
| **Upstream URL** | `https://opencode.ai/zen/go/v1` |
| **API Format** | `openai-completions` |
| **API Key Mode** | `Managed` |

Seeded models: `glm-5.2`, `kimi-k2.7-code`, `deepseek-v4-pro`, `minimax-m3`, `qwen3.7-max`
