# Frequently Asked Questions

Answers to common questions about ClawRouter configuration and usage.

> **Version 1.0.17**

---

## Providers & Keys

### Do I need to define my models in the ClawRouter dashboard?
**Generally, no.** You define the Provider and its API Keys in ClawRouter. Model selection happens in your AI client (like OpenClaw). When your client requests a model, ClawRouter forwards the request upstream as-is.

**Exception:** Add models to the provider's **Models tab** if you want to use **Model Fallback** (automatic retry with a different model). Saved models also appear as model options when configuring the Provider Fallback Chain, and power the **Automatic** cascade on fallback entries.

### What's the fastest way to add a new provider?
Use **Quick Setup** in the Add Provider panel. Search or browse the grid of 51 pre-built presets, grouped into **Free & Free-Tier** and **API Key Providers**. All fields are auto-filled -- including the correct API Key Mode -- so you only need to add your API key (keyless presets need no key at all).

### What are the available API formats?
| Format | Description | Proxy URL Pattern |
|--------|-------------|-------------------|
| `openai-completions` | OpenAI Chat Completions (most providers) | `/proxy/{id}/v1` |
| `openai-responses` | OpenAI Responses API | `/proxy/{id}/v1` |
| `anthropic-messages` | Anthropic Claude Messages | `/proxy/{id}/v1` |
| `google-generative-ai` | Google Gemini API | `/proxy/{id}/v1beta` |
| `elevenlabs` | ElevenLabs audio (STT/TTS) -- passthrough, no translation | `/proxy/{id}/v1` |

### Can I use different API formats together?
**Yes.** Each provider has its own format. ClawRouter translates requests into the correct format for each upstream -- any client format works with any provider format. The **Provider Fallback Chain** can also mix formats: any provider can be a fallback target, and cross-format fallbacks are translated automatically. See API Format Translation.

### How do I see why a specific API key is failing?
Open the provider's **API Keys** tab and click the **error count badge** next to the key. This opens the **Error History** modal showing the last 50 errors with type, HTTP status code, and timestamp.

---

## Bypass Providers (Keyless: OpenCode Zen, Kilo AI (Free), Ollama (Local))

### What are bypass providers?
Bypass providers (OpenCode Zen, Kilo AI (Free), and Ollama (Local)) are providers that work without an API key. They ship with API Key Mode `None`, and ClawRouter merges the preset's static default headers (e.g., OpenCode Zen's `Authorization: Bearer public`) into every upstream request automatically.

### How do I set up a bypass provider?
1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Select **OpenCode Zen**, **Kilo AI (Free)**, or **Ollama (Local)**.
3. Click **Create Provider** -- the API Key Mode is already set to `None`, no change needed.
4. Do NOT add any API keys (the keys tab shows an informational card, and adding keys is rejected with an error).
5. Copy the Base URL and use it in your AI client.

### What do the Free/Paid badges mean?
For Kilo AI and OpenCode Zen, ClawRouter fetches live data about each model's pricing status:
- **Free**: The model is accessible without a paid subscription.
- **Paid**: The model requires an active subscription or credits on the provider's platform.

---

## Notifications

### Do notifications persist after restart?
No. Notifications are in-memory (last 100 events) and cleared on restart. This is by design -- they are a real-time alerting system, not a log replacement. Use the **Logs** section for persistent history.

### How do notifications work?
Notifications are delivered in real-time via WebSocket -- no page refresh needed. Click the **Bell icon** in the sidebar to view them. Click any notification to navigate to the affected provider.

---

## Logs & Monitoring

### Where can I see what the proxy is doing?
Two options:
- **Dashboard Logs page**: Real-time and historical view with filters (provider, status, model). Uses live WebSocket streaming.
- **CLI**: Run `clawrouter logs` in your terminal to follow live traffic.

### Are logs persistent?
Yes, logs are stored in the SQLite database. They survive restarts. Old logs are automatically cleaned up after 7 days by default. You can adjust the retention period and toggle auto-cleanup on/off from the **Settings** page in the dashboard.

### Can I clear all logs?
Yes. Click the **Clear Logs** button on the Logs page (with confirmation dialog).

---

## Configuration & Environment

### What port does ClawRouter use?
Default port is **3030**. Override with the `PORT` environment variable or `--port` CLI flag.

### Where is data stored?
Everything is stored locally on your machine. Providers, keys, logs, and configurations are kept in a local database in the installation directory.

### What is the dashboard password?
The dashboard (including the admin API and live log feed) is protected by a password. On first run the password is **`changeme`** -- change it from **Settings** > **Dashboard Security**. Your session lasts 12 hours and is cleared when you close the browser tab, so you sign in again on your next visit.

### Does ClawRouter send data externally?
The only external requests ClawRouter makes are:
1. **To the AI providers you configure** -- forwarding your API requests.
2. **Periodic license check** -- a lightweight check for activation status and available updates.

---

## Global Settings

### Where do I configure global proxy behavior?
Click **Settings** in the sidebar to access the **Global Settings** page. This page lets you configure system-wide defaults:

| Setting | Default | Description |
|---------|---------|-------------|
| **Key Retry Mode** | `all` | `all` = try every available key; `fixed` = try up to a fixed limit |
| **Key Retry Limit** | `5` | Max keys to try per request (only applies when mode is `fixed`) |
| **Rate Limit Backoff** | `60s` | Cooldown duration after a key hits a rate limit |
| **Quota Backoff** | `1800s` | Fallback cooldown for quota-window exhaustion when no exact window reset is known (exact per-key resets are used when available) |
| **Circuit Breaker Threshold** | `5` | Failures within window before circuit opens |
| **Circuit Breaker Cooldown** | `30s` | Seconds before a tripped circuit enters half-open state |
| **Model Circuit Threshold / Cooldowns** | `2` / `1800s` / `120s` | Consecutive model failures before a model is skipped, and its permanent/transient cooldowns |
| **Require Proxy API Key** | `true` | Clients must present the proxy API key on every proxy request (managed from the Proxy API Key card) |
| **Auto Cleanup Logs** | `true` | Enable automatic log retention cleanup |
| **Log Retention Days** | `7` | Days to keep request logs before auto-cleanup |

The Settings page also has an **Appearance** card (provider icon style: Color/Mono, remembered per browser) and a **Dashboard Security** card (change the dashboard password).

### What is the difference between "all" and "fixed" key retry mode?
- **All** (default): On failure, ClawRouter tries every available key for the provider before giving up and triggering the fallback chain.
- **Fixed**: ClawRouter tries up to the configured **Key Retry Limit** number of keys, then triggers the fallback chain. Useful when you have many keys but want faster failover to the fallback provider.

---

## Troubleshooting Quick Reference

### I'm getting "Model Not Found" errors -- what do I do?
1. Verify the model ID is correct by checking the provider's official documentation.
2. Use **Fetch Models** in the Models tab to get the current list from the provider.
3. Enable **Model Fallback** with alternative models as backups.
4. Model IDs change frequently -- what worked yesterday may not work today.

### My requests fail with "not_activated" (403) -- what happened?
Your ClawRouter installation is not yet activated. Check the dashboard -- if you see the Awaiting Activation screen, send your Installation ID to the developer and click **Check Activation** once confirmed.

### The dashboard is slow to load -- is that normal?
On large setups with many providers and extensive logs, initial loading can take a few seconds. This resolves once data is loaded. The stats use a 5-second cache to prevent excessive reloading.

### How do I completely reset my configuration?
Delete the local database file and restart ClawRouter. This removes all providers, keys, and logs. You may need to contact the developer to re-activate.
