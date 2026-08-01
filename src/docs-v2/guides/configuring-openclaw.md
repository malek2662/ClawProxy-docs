# Configuring OpenClaw

Step-by-step guides for connecting your OpenClaw AI client to ClawRouter providers.

> **Version 1.0.14**

---

## Configure OpenClaw Using "Prompt for AI"

**Goal:** Automatically configure a provider in OpenClaw using the AI-generated prompt.

1. Open the provider's detail page in ClawRouter dashboard.
2. Click the **"Prompt for AI"** button on the **Base URL** banner.
3. A tabbed modal opens -- the **OpenClaw** tab is selected by default. The generated prompt contains:
   - The provider's Base URL
   - Provider name (using the native OpenClaw provider ID where one exists)
   - API format
   - Model IDs taken from your saved models
   - Step-by-step `config.patch` instructions for the agent
4. Click **Copy** to copy the entire prompt.
5. Open your OpenClaw AI agent.
6. Paste the prompt and send it.
7. The AI agent will safely update your `openclaw.json` (backup first, merge only -- no existing providers are touched).

> **Other clients?** The same dialog has tabs for OpenCode, Claude Code, Codex CLI, Cline, Aider, and a generic Custom tab. See the AI Client Setup guide.

> **Tip:** If the prompt contains outdated model IDs, you can edit them before pasting. Use **Fetch Models** in the Models tab to get the latest list.

---

## Configure OpenClaw Manually

**Goal:** Manually add a ClawRouter provider to your OpenClaw configuration.

1. Open `~/.openclaw/openclaw.json` in a text editor.
2. Find the `models.providers` section.
3. Add a new entry:
   ```json
   "my-provider": {
     "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1",
     "apiKey": "cr_your_proxy_key",
     "api": "openai-completions",
     "models": [
       { "id": "model-id-1", "name": "Model 1" },
       { "id": "model-id-2", "name": "Model 2" }
     ]
   }
   ```
4. **baseUrl**: Copy from the provider's detail page in ClawRouter (the auto-generated Base URL).
5. **apiKey**: Use the proxy API key from **Settings** > **Proxy API Key** (the "Prompt for AI" dialog inserts it automatically). ClawRouter strips this and injects the real managed key.
6. **api**: Must match the provider's API format:
   - `openai-completions` for OpenAI Chat Completions format
   - `openai-responses` for OpenAI Responses format
   - `anthropic-messages` for Anthropic format
   - `google-generative-ai` for Google Gemini format
7. **models**: List the models you want available. Get model IDs from the provider's **Models** tab > **Fetch Models**.
8. Save the file.

> **Base URL format:**
> - For `openai-completions` / `openai-responses` / `anthropic-messages`: ends with `/v1`
> - For `google-generative-ai`: ends with `/v1beta`

---

## Important Notes

### About the API Key Field

Use the **proxy API key** from the dashboard (**Settings** > **Proxy API Key**) for the `apiKey` field in OpenClaw. The **"Prompt for AI"** dialog inserts it automatically. ClawRouter validates it, then injects your real, managed API keys to authenticate with upstream providers.

**Exception:** If your provider's API Key Mode is set to **Pass Through** in ClawRouter, the key you set in OpenClaw will be forwarded as-is to the upstream provider. Pass Through mode is incompatible with proxy API key auth -- use Managed or None mode instead (see Global Settings > Proxy API Key).

### About Models

You do **not** need to add models inside the ClawRouter dashboard for normal routing. Models are defined in your OpenClaw configuration. ClawRouter accepts any model name and forwards it upstream.

However, you can optionally add models to the provider's **Models tab** to enable **Model Fallback** (automatic retry with a different model) and for convenient model selection in the **Provider Fallback Chain**. Quick Setup presets seed their recommended models automatically at creation.

### Model IDs Change

External AI providers may change Model IDs without notice. If you experience model errors, verify the current valid Model ID with the provider's official documentation, or use **Fetch Models** in ClawRouter to get the latest list.
