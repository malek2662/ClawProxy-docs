# Configuring OpenClaw

Step-by-step guides for connecting your OpenClaw AI client to ClawProxy providers.

> **Version 1.0.12**

---

## Configure OpenClaw Using "Prompt for AI"

**Goal:** Automatically configure a provider in OpenClaw using the AI-generated prompt.

1. Open the provider's detail page in ClawProxy dashboard.
2. Click the **"Prompt for AI"** button (magic wand icon).
3. A modal appears with a generated prompt containing:
   - The provider's Base URL
   - Provider name
   - API format
   - Recommended model IDs
   - Full `openclaw.json` configuration template
4. Click **Copy** to copy the entire prompt.
5. Open your OpenClaw AI agent.
6. Paste the prompt and send it.
7. The AI agent will update your `openclaw.json` automatically.

> **Tip:** If the prompt contains outdated model IDs, you can edit them before pasting. Use **Fetch Models** in the Models tab to get the latest list.

---

## Configure OpenClaw Manually

**Goal:** Manually add a ClawProxy provider to your OpenClaw configuration.

1. Open `~/.openclaw/openclaw.json` in a text editor.
2. Find the `models.providers` section.
3. Add a new entry:
   ```json
   "my-provider": {
     "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1",
     "apiKey": "dummy-key",
     "api": "openai-completions",
     "models": [
       { "id": "model-id-1", "name": "Model 1" },
       { "id": "model-id-2", "name": "Model 2" }
     ]
   }
   ```
4. **baseUrl**: Copy from the provider's detail page in ClawProxy (the auto-generated Base URL).
5. **apiKey**: Use any dummy value like `dummy-key`. ClawProxy strips this and injects the real key.
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

Use any dummy value (e.g., `dummy-key`) for the `apiKey` field in OpenClaw. ClawProxy strips the dummy key and injects your real, managed API keys to authenticate with upstream providers.

**Exception:** If your provider's API Key Mode is set to **Pass Through** in ClawProxy, the key you set in OpenClaw will be forwarded as-is to the upstream provider.

### About Models

You do **not** need to add models inside the ClawProxy dashboard for normal routing. Models are defined in your OpenClaw configuration. ClawProxy accepts any model name and forwards it upstream.

However, you can optionally add models to the provider's **Models tab** to enable **Model Fallback** (automatic retry with a different model) and for convenient model ID selection in the **Provider Fallback Chain**.

### Model IDs Change

External AI providers may change Model IDs without notice. If you experience model errors, verify the current valid Model ID with the provider's official documentation, or use **Fetch Models** in ClawProxy to get the latest list.
