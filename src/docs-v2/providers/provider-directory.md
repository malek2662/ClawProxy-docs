# Provider Directory

A complete list of all built-in provider presets in ClawRouter. Each preset comes pre-configured with the correct name, API format, upstream URL, and API key mode -- plus an icon, brand color, "Get API Key" link, and a seeded model list.

> **Version 1.0.17**

---

## Built-in Presets

ClawRouter ships **52 built-in provider presets**. Selecting a preset auto-fills every field -- including the correct API Key Mode -- and seeds the preset's recommended models into the provider's Models tab at creation.

### Keyless Presets (No API Key Required)

These presets use API Key Mode `None`. No keys are needed -- ClawRouter sends the required static headers automatically. The keys table is replaced by an informational card, and adding keys is rejected.

| Preset | API Format | Upstream URL |
|--------|-----------|-------------|
| OpenCode Zen | openai-completions | `https://opencode.ai/zen/v1` |
| Kilo AI (Free) | openai-completions | `https://api.kilo.ai/api/gateway` |
| Ollama (Local) | openai-completions | `http://localhost:11434/v1` |

### Free & Free-Tier Presets (API Key Required)

Genuine free tiers or quotas. You need a free API key from each provider -- the preset's **Get API Key** link takes you straight to the right page.

| Preset | API Format | Upstream URL |
|--------|-----------|-------------|
| OpenRouter | openai-completions | `https://openrouter.ai/api/v1` |
| Google Gemini | google-generative-ai | `https://generativelanguage.googleapis.com/v1beta` |
| Groq | openai-completions | `https://api.groq.com/openai/v1` |
| Cerebras | openai-completions | `https://api.cerebras.ai/v1` |
| NVIDIA NIM | openai-completions | `https://integrate.api.nvidia.com/v1` |
| Kilo AI | openai-completions | `https://api.kilo.ai/api/gateway` |
| Cloudflare Workers AI | openai-completions | `https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/v1` |
| BytePlus ModelArk | openai-completions | `https://ark.ap-southeast.bytepluses.com/api/coding/v3` |
| API.airforce | openai-completions | `https://api.airforce/v1` |
| Bazaarlink | openai-completions | `https://bazaarlink.ai/api/v1` |
| Poolside | openai-completions | `https://inference.poolside.ai/v1` |

> **Note:** Cloudflare Workers AI contains `YOUR_ACCOUNT_ID` in the upstream URL -- replace it with your actual Cloudflare account ID after creating the provider (Settings tab > Upstream URL).

### API Key Presets (Paid)

| Preset | API Format | Upstream URL |
|--------|-----------|-------------|
| OpenAI | openai-completions | `https://api.openai.com/v1` |
| Anthropic | anthropic-messages | `https://api.anthropic.com/v1` |
| DeepSeek | openai-completions | `https://api.deepseek.com` |
| xAI (Grok) | openai-completions | `https://api.x.ai/v1` |
| Mistral | openai-completions | `https://api.mistral.ai/v1` |
| Cohere | openai-completions | `https://api.cohere.com/compatibility/v1` |
| Perplexity | openai-completions | `https://api.perplexity.ai` |
| Perplexity Agent | openai-responses | `https://api.perplexity.ai/v1` |
| Kimi for Coding | anthropic-messages | `https://api.kimi.com/coding/v1` |
| MiniMax Coding (Intl) | anthropic-messages | `https://api.minimax.io/anthropic/v1` |
| MiniMax Coding (China) | anthropic-messages | `https://api.minimaxi.com/anthropic/v1` |
| Z.AI API | openai-completions | `https://api.z.ai/api/paas/v4` |
| Z.AI Coding | openai-completions | `https://api.z.ai/api/coding/paas/v4` |
| Z.AI Coding (China) | openai-completions | `https://open.bigmodel.cn/api/coding/paas/v4` |
| Alibaba Coding Plan (CN) | openai-completions | `https://coding.dashscope.aliyuncs.com/v1` |
| Alibaba Coding Plan (Intl) | openai-completions | `https://coding-intl.dashscope.aliyuncs.com/v1` |
| Alibaba Model Studio (CN) | openai-completions | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| Alibaba Model Studio (Intl) | openai-completions | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` |
| Baidu Qianfan | openai-completions | `https://qianfan.baidubce.com/v2` |
| Tencent Hunyuan | openai-completions | `https://api.hunyuan.cloud.tencent.com/v1` |
| Volcengine Ark | openai-completions | `https://ark.cn-beijing.volces.com/api/coding/v3` |
| Xiaomi MiMo | openai-completions | `https://api.xiaomimimo.com/v1` |
| Xiaomi MiMo Token Plan | openai-completions | `https://token-plan-sgp.xiaomimimo.com/v1` |
| SiliconFlow | openai-completions | `https://api.siliconflow.com/v1` |
| Together AI | openai-completions | `https://api.together.xyz/v1` |
| Fireworks AI | openai-completions | `https://api.fireworks.ai/inference/v1` |
| Featherless | openai-completions | `https://api.featherless.ai/v1` |
| Hyperbolic | openai-completions | `https://api.hyperbolic.xyz/v1` |
| Chutes AI | openai-completions | `https://llm.chutes.ai/v1` |
| Nebius AI Studio | openai-completions | `https://api.studio.nebius.ai/v1` |
| Venice AI | openai-completions | `https://api.venice.ai/api/v1` |
| Vercel AI Gateway | openai-completions | `https://ai-gateway.vercel.sh/v1` |
| LLM7 | openai-completions | `https://api.llm7.io/v1` |
| Blackbox AI | openai-completions | `https://api.blackbox.ai/v1` |
| Morph | openai-completions | `https://api.morphllm.com/v1` |
| OpenCode Go | openai-completions | `https://opencode.ai/zen/go/v1` |
| Ollama Cloud | openai-completions | `https://ollama.com/v1` |
| ElevenLabs | elevenlabs | `https://api.elevenlabs.io/v1` |

> **Audio provider:** ElevenLabs is a passthrough audio API (Speech-to-Text + Text-to-Speech), not a chat provider -- it uses the dedicated `elevenlabs` API format with `xi-api-key` authentication, handled automatically in Managed key mode. See **ElevenLabs (Audio)** for usage and curl examples.

---

## What Each Preset Includes

| Field | Purpose |
|-------|---------|
| **Name / API Format / Upstream URL** | Core connection settings, auto-filled |
| **API Key Mode** | `Managed`, `None`, or `Pass Through` -- pre-set correctly per preset |
| **Brand Icon** | Real brand icons shown on provider cards throughout the dashboard -- rendered in color by default, switchable to mono in **Settings > Appearance** (per browser). Unmapped/custom providers get a 2-letter brand-color tile |
| **Category** | `free` or `apikey` -- controls grouping in the Add Provider panel |
| **Get API Key link** | Direct link to the provider's API key page |
| **Signup link** | Direct link to create an account (where available) |
| **Default Headers** | Static headers merged into every upstream request (keyless presets) |
| **Seeded Models** | Recommended model list, saved to the Models tab automatically at creation |

---

## The Providers Page

The Providers list groups your configured providers into four sections: **Favorites** (starred providers, shown first), **Free-Friendly**, **API Key Providers**, and **Custom**. Each card shows:

- The provider's icon, name, and API format
- A **health badge**: `No keys` (managed provider with no keys yet), `N errors today` (errors in the last 24h), or `Healthy`
- A **quick-test button** (lightning icon) that runs a connection probe against the provider
- A **star button** that adds/removes the provider from Favorites
- Power (enable/disable) and delete buttons on hover

---

## Adding a Provider

**Quick Setup (Recommended):**
1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Use the **search box** to filter the 52 presets, or browse the two category groups: **Free & Free-Tier** and **API Key Providers**.
3. Select a preset -- all settings are pre-filled, including the correct API Key Mode.
4. Click **Create Provider**. The preset's recommended models are seeded into the Models tab automatically.
5. Add your API key(s) -- skip this step entirely for keyless presets.
6. Copy the auto-generated **Base URL** from the top of the provider page.

**Custom:**
For providers not in the preset list, use the **Custom** option with a blank form.

---

## Important Notes

- ClawRouter only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.
- **100% Local Privacy:** ClawRouter runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.
