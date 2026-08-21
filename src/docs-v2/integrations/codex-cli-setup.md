# Codex CLI Setup

Codex CLI is OpenAI's terminal coding agent, configured through `~/.codex/config.toml`. This guide registers ClawRouter as a custom model provider so Codex routes through it.

> **Version 1.0.17**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **Codex CLI** tab.
3. Click **Copy** and paste the prompt to your AI agent -- or follow the generated instructions yourself.

The generated prompt contains the exact `config.toml` block below with your saved model IDs and your real proxy API key.

---

## Method 2: Manual Configuration

1. Open `~/.codex/config.toml` (back it up first -- merge the new keys; keep all existing tables untouched).
2. Add the top-level model selection plus a new provider table:

```toml
model = "model-id"
model_provider = "clawrouter-my-provider"
model_reasoning_effort = "high"        # optional: minimal|low|medium|high|xhigh — verify per model
# model_context_window = 200000        # optional: the model's real context window

[model_providers.clawrouter-my-provider]
name = "ClawRouter My Provider"
base_url = "http://localhost:3030/proxy/my-provider-id/v1"
env_key = "CLAWROUTER_API_KEY"
wire_api = "responses"
```

3. Set the environment variable Codex reads the key from:

```bash
export CLAWROUTER_API_KEY="cr_your_proxy_key"
```

(Add the export to your shell profile to make it permanent.)

### Field Reference

| Field | Description |
|-------|-------------|
| `model` | The model ID Codex uses by default. Get model IDs from the provider's **Models** tab > **Fetch Models** |
| `model_provider` | The key of your `[model_providers.*]` table |
| `model_reasoning_effort` | Optional reasoning effort: `minimal` / `low` / `medium` / `high` / `xhigh` -- accepted values are model-dependent; check the provider's model docs. ClawRouter translates the setting into the provider's native dialect |
| `model_context_window` | Optional: the model's real context window in tokens, from the provider's docs |
| `name` | Display name for the provider |
| `base_url` | The provider's ClawRouter Base URL -- **must include the `/v1` suffix** exactly as shown |
| `env_key` | Name of the environment variable Codex reads the API key from (set it to your **proxy API key**) |
| `wire_api` | Always `"responses"` -- the only value current Codex builds support. ClawRouter speaks the Responses API on every provider and translates into the provider's native format automatically |

> **User-level config only:** these keys work in `~/.codex/config.toml`. Project-level `.codex/config.toml` ignores provider definitions. The provider IDs `openai`, `ollama`, and `lmstudio` are reserved.

> **`wire_api = "chat"` was removed:** Codex deprecated `"chat"` in Dec 2025 and removed it in Feb 2026 -- a config containing it now fails at startup. Always use `"responses"`; this works with every ClawRouter provider regardless of its own API format, because ClawRouter translates the Responses API automatically.

---

## Choosing the Provider & Model

- **Which upstream provider answers** is decided by `base_url` -- each ClawRouter provider has its own `/proxy/{provider-id}` endpoint. Add multiple `[model_providers.*]` tables to switch providers.
- **Which model answers** is decided by `model` (or the `--model` flag). ClawRouter forwards the model ID upstream as-is; with Model Fallback enabled, a failing model is automatically substituted.

---

## Verify the Connection

1. Start Codex and send a short prompt.
2. Open the ClawRouter **Logs** page -- the request should appear with a successful response.

You can also verify the endpoint directly with curl:

```bash
curl -X POST http://localhost:3030/proxy/my-provider-id/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cr_your_proxy_key" \
  -d '{ "model": "model-id", "messages": [{"role": "user", "content": "Hello"}] }'
```

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- The `CLAWROUTER_API_KEY` environment variable is unset, wrong, or the proxy key was regenerated. Copy the current key from **Settings** > **Proxy API Key**, re-export the variable, and restart Codex. This 401 comes from ClawRouter itself, before any upstream request.

**Provider ignored / not found**
- The provider table must live in the **user-level** `~/.codex/config.toml` -- project-level config files ignore provider definitions.
- Check that `model_provider` exactly matches the table key `[model_providers.<same-name>]`.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify the port in `base_url` matches your ClawRouter port (default: 3030) and that it ends with `/v1`.

**"Model not found" errors**
- The model ID must exist on the upstream provider. Use **Fetch Models** in the provider's Models tab for the current list.
- Enable **Model Fallback** with backup models so a stale ID fails over automatically.
