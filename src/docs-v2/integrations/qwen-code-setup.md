# Qwen Code Setup

Qwen Code is Alibaba's terminal coding agent (a Gemini CLI fork). It speaks OpenAI-compatible, Anthropic, Gemini, and Qwen protocols -- point its OpenAI-compatible mode at ClawRouter so every request benefits from key rotation, fallback chains, and logging.

> **Version 1.0.17**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **Qwen Code** tab.
3. Click **Copy** and paste the prompt to your AI agent -- or follow the generated instructions yourself.

The generated prompt contains the env-var block and the `settings.json` block below, pre-filled with the correct Base URL, your saved model IDs, and your real proxy API key.

---

## Method 2: Manual Configuration

### Option A -- Environment variables (simplest)

```bash
export OPENAI_API_KEY="cr_your_proxy_key"
export OPENAI_BASE_URL="http://localhost:3030/proxy/my-provider-id/v1"
export OPENAI_MODEL="model-id"
```

(Add the exports to your shell profile to make them permanent.)

### Option B -- Settings file `~/.qwen/settings.json`

Merge these keys (preserve everything else):

```json
{
  "modelProviders": {
    "openai": [
      { "id": "model-id", "name": "model-id", "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1", "envKey": "CLAWROUTER_API_KEY" }
    ]
  },
  "env": { "CLAWROUTER_API_KEY": "cr_your_proxy_key" },
  "security": { "auth": { "selectedType": "openai" } },
  "model": { "name": "model-id" }
}
```

| Field | Description |
|-------|-------------|
| `baseUrl` / `OPENAI_BASE_URL` | The provider's ClawRouter Base URL -- **must end at `/v1`** exactly |
| `envKey` / `OPENAI_API_KEY` | The proxy API key from **Settings** > **Proxy API Key**. ClawRouter validates it, then injects your real managed key upstream |
| `model.name` / `OPENAI_MODEL` | The model ID to use. Get model IDs from the provider's **Models** tab > **Fetch Models** |

Credential priority: CLI flags > shell exports > `.env` file > `settings.json` env block. If the settings file does not take effect, use Option A or run `/auth` inside Qwen Code.

> **Works with every provider:** ClawRouter translates the OpenAI Chat Completions API into the provider's native format automatically.

---

## Model Parameters (Context, Reasoning)

Per-model parameters live in the model entry's `generationConfig` (Option B):

```json
{
  "id": "qwen3.5-plus",
  "name": "qwen3.5-plus",
  "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1",
  "envKey": "CLAWROUTER_API_KEY",
  "generationConfig": {
    "contextWindowSize": 1000000,
    "extra_body": { "enable_thinking": true },
    "samplingParams": { "max_tokens": 65536 }
  }
}
```

- `contextWindowSize` -- the model's real context window; `samplingParams.max_tokens` -- output cap. Fill both from the provider's official model docs.
- `extra_body` -- extra request params for OpenAI-compatible APIs (e.g. Qwen's `enable_thinking` + `thinking_budget`).
- Reasoning effort is global: `"model": { "reasoningEffort": "low|medium|high|xhigh|max" }` or the `/effort` command -- the value is mapped to the provider's supported levels.

Reasoning effort value sets differ per model (`low/medium/high` vs `low/medium/xhigh` vs `low/high/max`) -- always verify in the provider's docs. ClawRouter translates reasoning/thinking parameters into the provider's native dialect automatically.

References: <https://qwenlm.github.io/qwen-code-docs/en/users/configuration/model-providers/> and <https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/>.

---

## Verify the Connection

1. Start Qwen Code and run `/model` -- or send a short prompt.
2. Open the ClawRouter **Logs** page -- the request should appear with a successful response.

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- The key is missing, wrong, or was regenerated. Copy the current key from **Settings** > **Proxy API Key**. This 401 comes from ClawRouter itself, before any upstream request.

**Settings not applied**
- Remember the credential priority (flags > exports > .env > settings.json) -- a stale shell export wins over `settings.json`. Restart Qwen Code after editing.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`. Verify the port (default: 3030) and that the base URL ends at `/v1`.

**"Model not found" errors**
- The model ID must exist on the upstream provider. Use **Fetch Models** in the provider's Models tab for the current list.
