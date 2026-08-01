# AI Client Setup (Prompt for AI)

The **Prompt for AI** dialog generates ready-to-paste setup instructions for 7 AI clients, tailored to the specific provider -- with the correct Base URL, model IDs, and config format for each client.

> **Version 1.0.14**

---

## Opening the Dialog

1. Open the provider's detail page.
2. Click **"Prompt for AI"** on the **Base URL** banner at the top.
3. A tabbed modal opens with one tab per client: **OpenClaw** (default), **OpenCode**, **Claude Code**, **Codex CLI**, **Cline**, **Aider**, **Custom / Other**.
4. Select your client's tab, click **Copy**, and paste the prompt to your AI agent (or follow the instructions yourself).

The modal is fixed-height (85vh) with internal scrolling, and the tabs wrap onto multiple rows -- all 7 clients are always visible, never hidden behind a scrollbar.

**How templates are generated:**
- Model lists come from the provider's **actual saved models** (Models tab). If none are saved, the preset's recommended models are used.
- The `apiKey` is your real **proxy API key** (from **Settings** > **Proxy API Key**), embedded automatically -- no manual copying needed.
- All tabs work with **every provider**. When the client's native API format differs from the provider's, the tab shows an **amber note** that ClawRouter translates automatically.

---

## Base URL Rules by Client

| Client | Base URL Suffix |
|--------|-----------------|
| OpenClaw | `/v1` (or `/v1beta` for Google) -- as shown on the banner |
| OpenCode | `/v1` required |
| Codex CLI | `/v1` required |
| Cline | `/v1` required |
| Aider | `/v1` required |
| Claude Code | **No** `/v1` -- Claude Code appends `/v1/messages` itself |

---

## OpenClaw

The default tab. Generates instructions for the OpenClaw agent to update `openclaw.json` safely via the `config.patch` gateway tool (backup first, merge only, plus model allowlist registration).

- Uses **native OpenClaw provider IDs** where available (e.g., `google`, `nvidia`, `zai`, `ollama`, `opencode`, `kilocode`) so built-in provider features are preserved.
- Includes `X-Title` / `X-Provider` headers so ClawRouter can identify the client.

Works with all API formats.

## OpenCode

Generates an `opencode.json` custom provider block (project root or `~/.config/opencode/opencode.json`).

- Uses `@ai-sdk/openai-compatible` for OpenAI formats, `@ai-sdk/anthropic` for `anthropic-messages`.
- The `baseURL` must end at `/v1` -- OpenCode appends the endpoint path itself.
- Works with all API formats -- ClawRouter translates automatically when the provider's format differs.

## Claude Code

Generates an `env` block for `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:3030/proxy/your-provider",
    "ANTHROPIC_AUTH_TOKEN": "cr_your_proxy_key",
    "ANTHROPIC_MODEL": "model-id",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "model-id"
  }
}
```

- `ANTHROPIC_BASE_URL` has **no** `/v1` suffix -- Claude Code appends `/v1/messages` itself.
- `ANTHROPIC_AUTH_TOKEN` is your proxy API key (the template embeds it automatically).
- Works with **all** providers. For non-Anthropic providers, ClawRouter translates the API format automatically and injects the Claude Code identity/system preamble, so the experience matches native Anthropic behavior.

## Codex CLI

Generates a `[model_providers.<slug>]` table for `~/.codex/config.toml`:

```toml
model = "model-id"
model_provider = "clawrouter-your-provider"

[model_providers.clawrouter-your-provider]
name = "ClawRouter Your Provider"
base_url = "http://localhost:3030/proxy/your-provider/v1"
env_key = "CLAWROUTER_API_KEY"
wire_api = "chat"
```

- `wire_api` is `"responses"` for `openai-responses` providers, `"chat"` otherwise.
- The key is read from an environment variable: `export CLAWROUTER_API_KEY="cr_your_proxy_key"` -- use the proxy API key from **Settings** > **Proxy API Key** (the template embeds it automatically).
- Works with **all** providers -- ClawRouter translates automatically when the provider's format differs.

## Cline

Generates values for Cline's **OpenAI Compatible** settings (Base URL, API Key, Model ID). The Base URL must end at `/v1` -- Cline appends `/chat/completions` itself. Works with **all** providers -- ClawRouter translates automatically when the provider's format differs.

## Aider

Generates environment variables plus the launch command:

```bash
export OPENAI_API_BASE="http://localhost:3030/proxy/your-provider/v1"
export OPENAI_API_KEY="cr_your_proxy_key"
aider --model openai/model-id
```

The `openai/` prefix tells aider to treat it as a generic OpenAI-compatible endpoint. Works with **all** providers -- ClawRouter translates automatically when the provider's format differs.

## Custom / Other

A generic reference for any client that supports a custom base URL: the correct endpoint URLs for the provider's API format, auth header guidance, available model IDs, and a ready-to-run `curl` example. Works with all API formats.
