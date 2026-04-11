# Provider Directory

A complete list of all built-in provider templates in ClawRouter. Each template comes pre-configured with the correct name, API format, upstream URL, and API key mode.

> **Version 1.0.12**

---

## Built-in Templates

| Template | API Format | Upstream URL | Key Mode | Type |
|----------|-----------|-------------|----------|------|
| OpenRouter | openai-completions | `https://openrouter.ai/api/v1` | Managed | Free Tier |
| Google Gemini | google-generative-ai | `https://generativelanguage.googleapis.com/v1beta` | Managed | Free Tier |
| NVIDIA NIM | openai-completions | `https://integrate.api.nvidia.com/v1` | Managed | Free Tier |
| Groq | openai-completions | `https://api.groq.com/openai/v1` | Managed | Free Tier |
| Cerebras | openai-completions | `https://api.cerebras.ai/v1` | Managed | Free Tier |
| Cohere | openai-completions | `https://api.cohere.com/v1` | Managed | Free Tier |
| Ollama Cloud | openai-completions | `https://ollama.com/v1` | Managed | Free Tier |
| Kilo AI | openai-completions | `https://api.kilo.ai/api/gateway` | None* | Bypass |
| OpenCode Zen | openai-completions | `https://opencode.ai/zen/v1` | None* | Bypass |
| OpenAI | openai-completions | `https://api.openai.com/v1` | Managed | Paid |
| Anthropic | anthropic-messages | `https://api.anthropic.com/v1` | Managed | Paid |
| Perplexity | openai-completions | `https://api.perplexity.ai` | Managed | Paid |
| Z.AI API | openai-completions | `https://api.z.ai/api/paas/v4` | Managed | Paid |
| Z.AI Coding | openai-completions | `https://api.z.ai/api/coding/paas/v4` | Managed | Paid |

> **\* Bypass providers:** The template defaults to `Managed`, but you **must change the API Key Mode to `None`** before creating. Do not add API keys to these providers.

---

## Provider Categories

### Bypass Providers (No API Key Required)

**Kilo AI** and **OpenCode Zen** are special bypass providers that access high-performance AI models without requiring an API key. ClawRouter handles the bypass internally.

See the full Bypass Providers guide for setup details, available free models, and configuration.

### Free Tier Providers (API Key Required, No Credit Card)

**Google Gemini**, **Groq**, **OpenRouter**, **NVIDIA NIM**, **Ollama Cloud**, **Cohere**, and **Cerebras** offer genuine free tiers or quotas. You need a free API key from each provider.

See the full Free Tier Providers guide for models, configurations, and setup steps.

### Paid Providers

**OpenAI**, **Anthropic**, **Perplexity**, **Z.AI API**, and **Z.AI Coding** require paid developer API keys.

See the full Paid Providers guide for details.

---

## Adding a Provider

**Quick Setup (Recommended):**
1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Select a template from the grid.
3. All settings are pre-filled. Click **Create Provider**.
4. Add your API key(s) (or change Key Mode to None for bypass providers).
5. Copy the auto-generated **Base URL** from the top of the provider page.

**Custom:**
For providers not in the template list, use the **Custom** option with a blank form.

---

## Important Notes

- ClawRouter only supports standard **Developer API Keys**. It does NOT support web session tokens, OAuth logins, or consumer subscriptions (e.g., ChatGPT Plus or Claude Pro web credentials). You must generate an actual API Key from the provider's developer console.
- **100% Local Privacy:** ClawRouter runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.
