# Claude Code Setup

Claude Code is Anthropic's terminal coding agent. It speaks the Anthropic Messages API -- which ClawRouter exposes on every provider -- so you can route Claude Code through ClawRouter to any configured provider, including non-Anthropic ones.

> **Version 1.0.17**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **Claude Code** tab.
3. Click **Copy** and paste the prompt to your AI agent -- or follow the generated instructions yourself.

The generated prompt contains the exact `env` block below with the correct Base URL, your saved model IDs, and your real proxy API key.

---

## Method 2: Manual Configuration

Claude Code reads its connection settings from environment variables. Add them to the `env` block of `~/.claude/settings.json` (merge with any existing keys -- preserve everything else), then restart Claude Code:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:3030/proxy/my-provider-id",
    "ANTHROPIC_AUTH_TOKEN": "cr_your_proxy_key",
    "ANTHROPIC_MODEL": "model-id",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "model-id"
  }
}
```

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_BASE_URL` | The provider's ClawRouter endpoint **without** a `/v1` suffix -- Claude Code appends `/v1/messages` itself. Do not add it |
| `ANTHROPIC_AUTH_TOKEN` | The proxy API key from **Settings** > **Proxy API Key**. Sent as `Authorization: Bearer ...` -- do not add the "Bearer " prefix yourself |
| `ANTHROPIC_MODEL` | The model ID to use. Get model IDs from the provider's **Models** tab > **Fetch Models** |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | The model used for background/small tasks -- set it to a model that exists on the same provider |

> **Works with every provider:** for non-Anthropic providers (OpenAI, Google Gemini, Groq, ...), ClawRouter translates the Anthropic Messages format automatically and injects the Claude Code identity/system preamble, so the experience matches native Anthropic behavior. The **Kimi for Coding** and **MiniMax Coding** presets speak Anthropic Messages natively -- no translation needed.

---

## Choosing the Provider & Model

- **Which upstream provider answers** is decided by `ANTHROPIC_BASE_URL` -- each ClawRouter provider has its own `/proxy/{provider-id}` endpoint. Point the variable at a different provider ID to switch providers.
- **Which model answers** is decided by `ANTHROPIC_MODEL` (and `ANTHROPIC_DEFAULT_HAIKU_MODEL` for small tasks). ClawRouter forwards the model ID upstream as-is; with Model Fallback enabled, a failing model is automatically substituted.

---

## Verify the Connection

1. Restart Claude Code after editing `settings.json`.
2. Run `/status` -- it should show the ClawRouter base URL.
3. Send a short prompt and check the ClawRouter **Logs** page for the successful request.

You can also verify the endpoint directly with curl (Anthropic Messages style):

```bash
curl -X POST http://localhost:3030/proxy/my-provider-id/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: cr_your_proxy_key" \
  -H "anthropic-version: 2023-06-01" \
  -d '{ "model": "model-id", "max_tokens": 50, "messages": [{"role": "user", "content": "Hello"}] }'
```

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- `ANTHROPIC_AUTH_TOKEN` is missing, wrong, or was regenerated. Copy the current key from **Settings** > **Proxy API Key**. This 401 comes from ClawRouter itself, before any upstream request.
- Make sure you did not add a "Bearer " prefix -- Claude Code adds it automatically.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify `ANTHROPIC_BASE_URL` points at the right host/port (default: 3030) and does **not** end with `/v1` -- Claude Code appends `/v1/messages` itself; a `/v1` in the base URL produces a broken path.

**"Model not found" errors**
- The model ID must exist on the upstream provider. Use **Fetch Models** in the provider's Models tab for the current list.
- Enable **Model Fallback** with backup models so a stale ID fails over automatically.

**Changes not taking effect**
- Claude Code reads `settings.json` at startup -- restart it after every edit.
