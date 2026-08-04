# Cline Setup

Cline is an AI coding assistant that runs as a VS Code extension. It has a built-in "OpenAI Compatible" provider option -- point it at ClawRouter and every request benefits from key rotation, fallback chains, and logging.

> **Version 1.0.15**

---

## Prerequisites

1. **ClawRouter running** -- `clawrouter status` (default: `http://localhost:3030`).
2. **A provider created** in the ClawRouter dashboard, with API keys added.
3. **The proxy API key** -- copy it from **Settings** > **Proxy API Key** in the dashboard.

---

## Method 1: "Prompt for AI" (Recommended)

1. Open the provider's detail page in the ClawRouter dashboard.
2. Click **"Prompt for AI"** on the Base URL banner and select the **Cline** tab.
3. Click **Copy** -- the prompt lists the exact four values below with your provider's Base URL, your saved model IDs, and your real proxy API key.

---

## Method 2: Manual Configuration

Open **Cline Settings** (gear icon in the Cline sidebar) and set:

| Field | Value |
|-------|-------|
| **API Provider** | `OpenAI Compatible` |
| **Base URL** | `http://localhost:3030/proxy/my-provider-id/v1` |
| **API Key** | `cr_your_proxy_key` (the proxy API key from **Settings** > **Proxy API Key**) |
| **Model ID** | A model ID from the provider's **Models** tab > **Fetch Models** |

Notes:

- The **Base URL must end at `/v1`** exactly -- Cline appends `/chat/completions` itself.
- If the model list is not auto-detected, enter the **Model ID** manually exactly as shown in the ClawRouter Models tab.
- **Google Gemini providers:** their Base URL ends with `/v1beta` instead of `/v1` -- copy the exact Base URL from the provider's banner in the dashboard.

---

## Choosing the Provider & Model

- **Which upstream provider answers** is decided by the Base URL -- each ClawRouter provider has its own `/proxy/{provider-id}` endpoint. Create multiple Cline API configurations (or edit the Base URL) to switch providers.
- **Which model answers** is decided by the Model ID field. ClawRouter forwards it upstream as-is; with Model Fallback enabled, a failing model is automatically substituted.
- **Works with every provider:** Cline speaks the OpenAI Chat Completions format; when the provider uses a different API format, ClawRouter translates automatically.

---

## Verify the Connection

1. Save the settings and start a new Cline task with a short instruction (e.g., "Say hello").
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
- The API Key field is empty, wrong, or the proxy key was regenerated. Copy the current key from **Settings** > **Proxy API Key**. This 401 comes from ClawRouter itself, before any upstream request.

**Connection refused**
- Ensure ClawRouter is running: `clawrouter status`.
- Verify the Base URL port matches your ClawRouter port (default: 3030) and that it ends at `/v1` (or `/v1beta` for Google providers).

**"Model not found" errors**
- The Model ID must match exactly what the upstream provider expects. Use **Fetch Models** in the provider's Models tab for the current list -- providers change model IDs without notice.
- Enable **Model Fallback** with backup models so a stale ID fails over automatically.
