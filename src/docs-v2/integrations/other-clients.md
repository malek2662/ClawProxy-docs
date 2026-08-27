# Other / Custom Clients

Any AI client that supports a custom base URL can route through ClawRouter. This page gives the generic connection details, ready-to-paste environment variable blocks, and a guide for Aider.

> **Version 1.0.18**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

> **Fastest setup:** the **"Prompt for AI"** dialog on every provider page has a **Custom / Other** tab that emits all of the values below -- endpoint URLs, env export blocks, and a curl example -- pre-filled for that specific provider, with your real proxy API key embedded.

---

## Endpoint Reference

ClawRouter accepts **every endpoint style on every provider** and translates into the provider's native format automatically. Replace `{provider-id}` with your provider's ID (shown in its Base URL on the dashboard):

| Style | Base URL | Endpoint |
|-------|----------|----------|
| OpenAI-compatible | `http://localhost:3030/proxy/{provider-id}/v1` | Chat: `POST .../v1/chat/completions` -- Responses: `POST .../v1/responses` |
| Anthropic-compatible | `http://localhost:3030/proxy/{provider-id}` | Messages: `POST .../v1/messages` |
| Google Generative AI | `http://localhost:3030/proxy/{provider-id}/v1beta` | Generate: `POST .../v1beta/models/{model}:generateContent` |

**Authentication:** send the proxy API key as `Authorization: Bearer cr_your_proxy_key` (OpenAI style) or `x-api-key: cr_your_proxy_key` (Anthropic style). ClawRouter validates it, then injects the real upstream key itself.

> **Audio (ElevenLabs):** `elevenlabs` providers expose the ElevenLabs Speech-to-Text / Text-to-Speech API at `/proxy/{provider-id}/v1` -- see Providers > ElevenLabs (Audio) for curl examples.

---

## Environment Variable Blocks

Many clients read their connection settings from environment variables. Paste the block matching your client's style into your shell:

```bash
# Claude Code / Anthropic-style clients
export ANTHROPIC_BASE_URL="http://localhost:3030/proxy/{provider-id}"
export ANTHROPIC_AUTH_TOKEN="cr_your_proxy_key"
export ANTHROPIC_MODEL="model-id"

# OpenAI-style clients
export OPENAI_BASE_URL="http://localhost:3030/proxy/{provider-id}/v1"
export OPENAI_API_KEY="cr_your_proxy_key"

# Google Gemini-style clients
export GOOGLE_GEMINI_BASE_URL="http://localhost:3030/proxy/{provider-id}/v1beta"
export GEMINI_API_KEY="cr_your_proxy_key"
```

> Note the Anthropic block has **no** `/v1` suffix in the base URL -- Anthropic-style clients append `/v1/messages` themselves.

---

## Aider

Aider is a terminal pair-programming agent. Route it through ClawRouter with its OpenAI-compatible mode:

```bash
export OPENAI_API_BASE="http://localhost:3030/proxy/{provider-id}/v1"
export OPENAI_API_KEY="cr_your_proxy_key"

aider --model openai/model-id
```

- The `openai/` prefix tells aider to treat the model as a generic OpenAI-compatible endpoint.
- Aider does not support custom Anthropic base URLs reliably -- always use the OpenAI-compatible endpoint shown here.

---

## Verify the Connection

Test any provider directly with curl before configuring your client:

```bash
curl -X POST http://localhost:3030/proxy/{provider-id}/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cr_your_proxy_key" \
  -d '{ "model": "model-id", "messages": [{"role": "user", "content": "Hello"}] }'
```

A successful JSON response means the provider, keys, and proxy auth are all working -- then check the **Logs** page in the dashboard to see the request details.

---

## Troubleshooting

**HTTP 401 "Invalid or missing API key"**
- The credential is missing, wrong, or was regenerated. Copy the current key from **Settings** > **Proxy API Key** and resend. This 401 comes from ClawRouter itself, before any upstream request.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify the host/port (default: `localhost:3030`) and the provider ID in the path.

**"Model not found" errors**
- The model ID must match exactly what the upstream provider expects. Use **Fetch Models** in the provider's Models tab for the current list.
- Enable **Model Fallback** with backup models so a stale ID fails over automatically.

**Wrong Base URL suffix**
- OpenAI-style clients need the base URL to end at `/v1`; Anthropic-style clients need the bare endpoint with **no** `/v1`; Google-style clients need `/v1beta`. When in doubt, copy the exact value from the **Custom / Other** tab of the "Prompt for AI" dialog.
