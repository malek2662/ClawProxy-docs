# Client Setup Overview

ClawRouter works with any AI client that supports a custom base URL. This page explains the two setup methods and what all clients have in common -- then points you to the dedicated guide for your client.

> **Version 1.0.17**

---

## Dedicated Client Guides

Step-by-step instructions -- exact config files, copy-paste snippets, and troubleshooting -- for each client:

| Client | Guide |
|--------|-------|
| **OpenClaw** | Client Setup > **OpenClaw** |
| **OpenCode** | Client Setup > **OpenCode** |
| **Claude Code** | Client Setup > **Claude Code** |
| **Codex CLI** | Client Setup > **Codex CLI** |
| **Qwen Code** | Client Setup > **Qwen Code** |
| **DeepSeek Harness** | Client Setup > **DeepSeek Harness** |
| **Any other client** (Cline, Aider, Kilo CLI, ...) | Client Setup > **Other / Custom Clients** |

---

## What Every Client Needs

Regardless of the client, three things are always required:

1. **A running ClawRouter** -- `clawrouter status` should show the service up (default port **3030**).
2. **A configured provider** -- created in the dashboard, with API keys added (unless it is a keyless preset).
3. **The proxy API key** -- shown in **Settings** > **Proxy API Key**. Clients authenticate to ClawRouter with this key; ClawRouter then injects the real upstream key itself.

Requests without a valid proxy API key get HTTP 401. The key can be sent as `Authorization: Bearer <key>` (OpenAI style) or `x-api-key: <key>` (Anthropic style).

> **Any client, any provider:** ClawRouter detects the client's API format from the request path and translates to the provider's format automatically -- every client below works with **every** provider, regardless of format.

---

## Method 1: "Prompt for AI" (Recommended)

Every provider page has a **"Prompt for AI"** button (on the Base URL banner) that opens a tabbed dialog with ready-to-paste setup instructions for 7 AI clients:

| Tab | Target Client |
|-----|---------------|
| **OpenClaw** (default) | `openclaw.json` via `config.patch`, using native provider IDs where available |
| **OpenCode** | `opencode.json` custom provider (`@ai-sdk/openai-compatible`, `@ai-sdk/openai`, or `@ai-sdk/anthropic`) |
| **Claude Code** | `~/.claude/settings.json` env block |
| **Codex CLI** | `~/.codex/config.toml` model provider (Responses API) |
| **Qwen Code** | Env vars or `~/.qwen/settings.json` `modelProviders` |
| **DeepSeek Harness** | `~/.dsh/settings.yaml` `llm-pi-ai` provider |
| **Custom / Other** | Generic endpoint reference, env export blocks, and a curl example |

1. Open the provider's detail page.
2. Click **"Prompt for AI"** on the **Base URL** banner at the top.
3. Select your client's tab, click **Copy**, and paste the prompt to your AI agent (or follow the instructions yourself).

**How templates are generated:**
- Model lists come from the provider's **actual saved models** (Models tab). If none are saved, the preset's recommended models are used.
- The `apiKey` is your real **proxy API key** (from **Settings** > **Proxy API Key**), embedded automatically -- no manual copying needed.
- Every prompt includes a **Model Parameters** section: the client's exact config keys for context-window / max-output / reasoning (verified against current client docs), known reasoning/thinking facts for the provider (e.g. Qwen's `enable_thinking` + `thinking_budget`, or `reasoning_effort` `low/medium/xhigh` on qwen3.8-max), and a link to the provider's official model docs so the agent fills in exact per-model values instead of guessing.
- All tabs work with **every provider**. When the client's native API format differs from the provider's, the tab shows an **amber note** that ClawRouter translates automatically. Reasoning/thinking parameters are translated into the provider's native dialect too.

---

## Method 2: Manual Configuration

Prefer editing config files yourself? Each dedicated client guide has the exact file path and a copy-paste config block. The only client-specific differences are the config file location and the base URL suffix:

| Client | Base URL Suffix |
|--------|-----------------|
| OpenClaw | `/v1` (or `/v1beta` for Google) -- as shown on the provider's banner |
| OpenCode | `/v1` required |
| Codex CLI | `/v1` required |
| Qwen Code | `/v1` required |
| DeepSeek Harness | `/v1` required |
| Claude Code | **No** `/v1` -- Claude Code appends `/v1/messages` itself |

The base URL always starts with `http://localhost:3030/proxy/{provider-id}` (adjust host/port if you changed them).
