# DeepSeek Harness Setup

DeepSeek Harness (`dsh`, npm `@deepseek-ai/dsh`) is DeepSeek's open-source agent harness -- the tools/files/sandbox/control-loop layer around a model, built on plugins. It speaks OpenAI-compatible APIs through its `llm-pi-ai` provider plugin -- point it at ClawRouter so every request benefits from key rotation, fallback chains, and logging.

> **Version 1.0.18**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **DeepSeek Harness** tab.
3. Click **Copy** and paste the prompt to your AI agent -- or follow the generated instructions yourself.

The generated prompt contains the `settings.yaml` block below, pre-filled with the correct Base URL, your saved model IDs, and your real proxy API key.

---

## Method 2: Manual Configuration

1. Edit `~/.dsh/settings.yaml` (create it if missing) and merge in a provider under `llm-pi-ai` -- keep all existing providers untouched:

```yaml
llm-pi-ai:
  providers:
    clawrouter-my-provider:
      api: openai-completions
      baseURL: "http://localhost:3030/proxy/my-provider-id/v1"
      apiKeyEnv: CLAWROUTER_API_KEY
      models:
        - id: model-id-1
        - id: model-id-2
```

2. Provide the key (either):
   ```bash
   export CLAWROUTER_API_KEY="cr_your_proxy_key"
   ```
   -- or enter it in the Web UI (`npx @deepseek-ai/dsh web` > **Settings** > **Models**); keys are stored redacted in `~/.dsh/.credentials.yaml`.

3. Select the new provider/model in the Web UI or TUI model picker.

| Field | Description |
|-------|-------------|
| `api` | `openai-completions` -- ClawRouter speaks it on every provider and translates into the provider's native format automatically |
| `baseURL` | The provider's ClawRouter Base URL -- **must end at `/v1`** exactly |
| `apiKeyEnv` | Name of the environment variable holding the **proxy API key** (not the upstream key) |
| `models` | List of model IDs. Get them from the provider's **Models** tab > **Fetch Models** |

> **Provider IDs are permanent** in Harness (sessions and credentials key off them). Never rename a provider -- add a new one and delete the old instead.

---

## Model Parameters & Compatibility

- Gateway-compat fixes are available per provider and per model under `compat` (e.g. `supportsDeveloperRole: false`, `maxTokensField: max_tokens`, `thinkingFormat`) -- leave unset unless a model misbehaves.
- Reasoning effort is configured on the route/model config (`reasoningEffort`: `off` / `low` / `high` / `max` on the built-in DeepSeek route). For `llm-pi-ai` providers, reasoning parameters pass through in the provider's own dialect -- ClawRouter translates them automatically.
- Reasoning effort value sets differ per model (`low/medium/high` vs `low/medium/xhigh` vs `low/high/max`) -- always verify in the provider's official model docs.
- Model discovery uses the OpenAI-compatible `GET /models` on the `baseURL` (ClawRouter proxies it upstream); model IDs can also be typed by hand.

References: <https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/docs/user/guide/providers.md> (full config catalog: <https://raw.githubusercontent.com/deepseek-ai/deepseek-harness/master/docs/config-catalog.md>).

---

## Verify the Connection

1. Start the Web UI (`npx @deepseek-ai/dsh web`) or the TUI and select your new provider/model.
2. Send a short prompt and check the ClawRouter **Logs** page for the successful request.

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- `CLAWROUTER_API_KEY` is unset, wrong, or the proxy key was regenerated. Copy the current key from **Settings** > **Proxy API Key**. This 401 comes from ClawRouter itself, before any upstream request.

**`MISSING_CREDENTIAL` / `UNKNOWN_MODEL`**
- The env var named by `apiKeyEnv` is not set, or the model ID is not listed under the provider's `models` in `settings.yaml`.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`. Verify the port (default: 3030) and that the base URL ends at `/v1`.

**"Model not found" errors**
- The model ID must exist on the upstream provider. Use **Fetch Models** in the provider's Models tab for the current list.
