# OpenClaw Setup

OpenClaw is an AI agent client configured through a JSON file (`openclaw.json`). This guide connects it to ClawRouter so every request benefits from key rotation, fallback chains, and logging.

> **Version 1.0.18**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added (skip keys for keyless presets like OpenCode Zen or Kilo AI (Free)).
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

The ClawRouter dashboard generates a ready-to-paste prompt that lets OpenClaw's own AI agent configure everything safely:

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click the **"Prompt for AI"** button on the **Base URL** banner -- the **OpenClaw** tab is selected by default.
3. Click **Copy** and paste the prompt to your OpenClaw AI agent.
4. The agent updates your `openclaw.json` via the `config.patch` gateway tool: it backs up first, merges only (no existing providers or settings are touched), registers the models for agents, and restarts.

The generated prompt contains the provider's Base URL, name, API format, your saved model IDs, and your real proxy API key. Where a **native OpenClaw provider ID** exists (e.g., `google`, `nvidia`, `zai`, `ollama`, `opencode`, `kilocode`), the prompt uses it so OpenClaw's built-in provider features (model discovery, prompt caching) are preserved. It also includes `X-Title` / `X-Provider` headers so ClawRouter can identify the client in logs.

> **Tip:** If the prompt contains outdated model IDs, edit them before pasting. Use **Fetch Models** in the provider's Models tab to get the latest list.

---

## Method 2: Manual Configuration

1. Open `~/.openclaw/openclaw.json` in a text editor.
2. Find the `models.providers` section and add a new entry:

```json
"my-provider": {
  "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1",
  "apiKey": "cr_your_proxy_key",
  "api": "openai-completions",
  "headers": { "X-Title": "OpenClaw", "X-Provider": "ClawRouter" },
  "models": [
    { "id": "model-id-1", "name": "Model 1" },
    { "id": "model-id-2", "name": "Model 2" }
  ]
}
```

3. Register each model under `agents.defaults.models`, using the exact `"PROVIDER_NAME/MODEL_ID"` key format:

```json
"agents": {
  "defaults": {
    "models": {
      "my-provider/model-id-1": {},
      "my-provider/model-id-2": {}
    }
  }
}
```

These entries register the models for agents (they can later hold `alias` or per-model `params` such as `temperature` or `maxTokens`). OpenClaw's explicit allowlist is `agents.defaults.modelPolicy.allow` -- leave it unset (allow all) unless you want restrictions.

4. Save the file.

### Configuration Fields

| Field | Description |
|-------|-------------|
| `baseUrl` | Copy from the provider's detail page in ClawRouter (the auto-generated Base URL on the banner) |
| `apiKey` | The proxy API key from **Settings** > **Proxy API Key**. ClawRouter validates it, then injects your real managed key upstream |
| `api` | Must match the provider's API format (see table below) |
| `headers` | `X-Title` / `X-Provider` -- lets ClawRouter identify the client in the Logs page |
| `models` | List of models with `id` and `name`. Get model IDs from the provider's **Models** tab > **Fetch Models** |

### Per-Model Parameters

Each entry in the provider's `models` array accepts optional metadata -- fill the values from the provider's official model docs (never guess):

```json
{
  "id": "qwen3.5-plus",
  "name": "qwen3.5-plus",
  "contextWindow": 1000000,
  "maxTokens": 65536,
  "reasoning": true,
  "compat": { "supportedReasoningEfforts": ["low", "medium", "xhigh"] }
}
```

| Field | Description |
|-------|-------------|
| `contextWindow` | The model's native context window -- used for context budgeting |
| `maxTokens` | Per-model output cap (default 8192) |
| `reasoning` | Whether the model supports reasoning/thinking |
| `compat.supportedReasoningEfforts` | The effort levels this model accepts (e.g. `["low","medium","xhigh"]`) -- these differ per model (`low/medium/high` vs `low/medium/xhigh` vs `low/high/max`), so check the provider's docs |

ClawRouter translates reasoning/thinking parameters into the provider's native dialect automatically. OpenClaw docs are machine-readable: <https://docs.openclaw.ai/llms.txt> (every page also serves markdown at `<page>.md`).

### Base URL Format by API Format

| API Format | `api` value | Base URL Pattern |
|-----------|-------------|------------------|
| OpenAI Chat Completions | `openai-completions` | `http://localhost:3030/proxy/{provider-id}/v1` |
| OpenAI Responses | `openai-responses` | `http://localhost:3030/proxy/{provider-id}/v1` |
| Anthropic Messages | `anthropic-messages` | `http://localhost:3030/proxy/{provider-id}/v1` |
| Google Generative AI | `google-generative-ai` | `http://localhost:3030/proxy/{provider-id}/v1beta` |

> **Audio providers:** the `elevenlabs` format (ElevenLabs Speech-to-Text / Text-to-Speech) is a passthrough audio API -- it is not a chat provider and cannot be used from OpenClaw. See Providers > ElevenLabs (Audio).

---

## Choosing the Provider & Model

- **Which upstream provider answers** is decided by the `baseUrl` -- each ClawRouter provider has its own `/proxy/{provider-id}` endpoint. Point OpenClaw at a different Base URL to switch providers.
- **Which model answers** is decided by the model ID OpenClaw requests. ClawRouter forwards it upstream as-is; if the model fails and Model Fallback is enabled, the next model in the provider's Models tab answers instead (shown as `requested > served` in the Logs page).
- You do **not** need to add models inside the ClawRouter dashboard for normal routing -- models are defined in your OpenClaw config. Saved models in the dashboard only power Model Fallback and the Provider Fallback Chain.

> **Model IDs change:** External providers may change model IDs without notice. If you hit model errors, verify the current ID with **Fetch Models** in ClawRouter or the provider's official docs.

---

## Verify the Connection

1. In OpenClaw, run `/model` -- your new provider's models should appear in the list.
2. Select one and send a short test prompt (e.g., "Say hello in one word").
3. Open the ClawRouter **Logs** page -- you should see the request arrive, marked with the OpenClaw client name, and a successful response.

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- The `apiKey` in your OpenClaw config is missing, wrong, or was regenerated. Copy the current key from **Settings** > **Proxy API Key** and update the config. This 401 comes from ClawRouter itself, before any upstream request.

**Connection refused / models not loading**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify the port in `baseUrl` matches your ClawRouter port (default: 3030).
- Check that the models are registered under `agents.defaults.models` (see Method 2, step 3).

**"Model not found" errors**
- The model ID is wrong or outdated. Use **Fetch Models** in the provider's Models tab for the current list and update your OpenClaw config.
- Enable **Model Fallback** in ClawRouter with backup models so a stale ID fails over automatically.

**Pass Through providers**
- If the provider's API Key Mode is **Pass Through**, the key in your OpenClaw config is forwarded upstream as-is -- which conflicts with proxy API key auth. Use **Managed** or **None** mode instead (see Global Settings > Proxy API Key).

---

## Provider Configurations

For ready-to-use OpenClaw configuration snippets per provider, see:

- **Providers > Bypass Providers** -- OpenCode Zen, Kilo AI (Free), and Ollama Local (no API key required)
- **Providers > Free Tier Providers** -- Ollama Cloud, Google Gemini, Groq, OpenRouter, NVIDIA NIM, Cerebras, and more
- **Providers > Paid Providers** -- OpenAI, Anthropic, DeepSeek, xAI, Kimi, MiniMax, Z.AI, and more

> **100% Local Privacy:** ClawRouter runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.
