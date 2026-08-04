# OpenCode Setup

OpenCode is a terminal AI coding agent configured through an `opencode.json` file. This guide points it at ClawRouter so it benefits from key rotation, fallback chains, circuit breaking, and centralized logging.

> **Version 1.0.15**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added (skip keys for keyless presets).
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **OpenCode** tab.
3. Click **Copy** and paste the prompt to your AI agent -- or follow the generated instructions yourself.

The dialog generates a complete, provider-specific `opencode.json` block with the correct SDK package, Base URL, your saved model IDs, and your real proxy API key.

---

## Method 2: Manual Configuration

OpenCode uses the [Vercel AI SDK](https://sdk.vercel.ai/) under the hood. You point an SDK provider package at ClawRouter by overriding its `baseURL`.

1. Open your `opencode.json` -- in the **project root** (project-level) or `~/.config/opencode/opencode.json` (user-level). Create it if it doesn't exist.
2. Merge this provider block into the existing `"provider"` object (do not delete existing providers or settings):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "clawrouter-my-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "ClawRouter My Provider",
      "options": {
        "baseURL": "http://localhost:3030/proxy/my-provider-id/v1",
        "apiKey": "cr_your_proxy_key"
      },
      "models": {
        "model-id-1": { "name": "model-id-1" },
        "model-id-2": { "name": "model-id-2" }
      }
    }
  }
}
```

3. Save the file and restart OpenCode.
4. Select a model with the `/models` command -- models appear as `clawrouter-my-provider/<model-id>`.

### Field Reference

| Field | Description |
|-------|-------------|
| `npm` | SDK package: `@ai-sdk/openai-compatible` for most providers; `@ai-sdk/anthropic` for `anthropic-messages` providers (Anthropic, Kimi for Coding, MiniMax Coding) |
| `name` | Display name shown in the OpenCode model picker |
| `options.baseURL` | The provider's ClawRouter Base URL -- **must end at `/v1` exactly**; OpenCode appends the endpoint path itself |
| `options.apiKey` | The proxy API key from **Settings** > **Proxy API Key**. ClawRouter validates it, then injects your real managed key upstream |
| `models` | Dictionary of available models. Get model IDs from the provider's **Models** tab > **Fetch Models** |

> **Google Gemini providers:** their Base URL ends with `/v1beta` instead of `/v1` -- copy the exact Base URL from the provider's banner in the dashboard.

> **Kilo CLI:** Kilo CLI shares OpenCode's configuration format -- the same provider block applies.

---

## Choosing the Provider & Model

- **Which upstream provider answers** is decided by the `baseURL` -- each ClawRouter provider has its own `/proxy/{provider-id}` endpoint. Add multiple provider blocks (one per ClawRouter provider) to switch between them in the model picker.
- **Which model answers** is decided by the model you select in OpenCode. ClawRouter forwards the model ID upstream as-is; with Model Fallback enabled, a failing model is automatically substituted with the next one from the provider's Models tab.
- **Works with every provider:** when OpenCode's request format differs from the provider's API format, ClawRouter translates automatically -- you can route an Anthropic-format provider through the `@ai-sdk/openai-compatible` package, for example.

---

## Verify the Connection

1. In OpenCode, run `/models` and select a model from your new provider.
2. Send a short prompt (e.g., "Say hello in one word").
3. Open the ClawRouter **Logs** page -- the request should appear with a successful response.

You can also verify the endpoint directly with curl:

```bash
curl -X POST http://localhost:3030/proxy/my-provider-id/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cr_your_proxy_key" \
  -d '{ "model": "model-id-1", "messages": [{"role": "user", "content": "Hello"}] }'
```

---

## Troubleshooting

**Provider not appearing in OpenCode?**
- Validate the JSON (no trailing commas, correct brackets).
- Restart OpenCode after editing the config file.

**HTTP 401 "Invalid or missing API key"**
- The `options.apiKey` is missing, wrong, or was regenerated. Copy the current key from **Settings** > **Proxy API Key**. This 401 comes from ClawRouter itself, before any upstream request.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify the port in `baseURL` matches your ClawRouter port (default: 3030), and that it ends at `/v1` (or `/v1beta` for Google providers).

**"Model not found" errors**
- The model ID must match exactly what the upstream provider expects. Use **Fetch Models** in the ClawRouter dashboard for the current list -- providers change model IDs without notice.
- Enable **Model Fallback** with backup models so a stale ID fails over automatically.

**Streaming issues**
- ClawRouter supports SSE streaming with zero buffering. Check the ClawRouter **Logs** page for error details.

> **Note on built-in free models:** OpenCode already ships its own free models out of the box. ClawRouter adds value on top: key rotation, provider fallback chains, circuit breaking, and centralized logging across all your providers -- including third-party free-tier APIs that require their own keys (Google Gemini, Groq, OpenRouter, NVIDIA, etc.).
