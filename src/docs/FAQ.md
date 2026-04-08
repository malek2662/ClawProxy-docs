# Frequently Asked Questions (FAQ)

Comprehensive answers to common questions about **ClawProxy** configuration and usage.

> **Version 1.0.12**

---

## Activation

### How do I activate ClawProxy?
After installation, ClawProxy shows your unique **Installation ID** on the Awaiting Activation screen. Send this ID to the developer at [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io) or via [Reddit](https://reddit.com/user/Malek262). Once the developer confirms your activation, click the **Check Activation** button and the dashboard will become fully functional.

### How do I check for updates?
If a newer version is available, an **Update Available** badge appears in the sidebar. Click it to see the latest version, changelog, and install commands.

---

## Providers & Keys

### Do I need to define my models in the ClawProxy dashboard?
**Generally, no.** You define the Provider and its API Keys in ClawProxy. Model selection happens in your AI client (like OpenClaw). When your client requests a model, ClawProxy forwards the request upstream as-is.

**Exception:** Add models to the provider's **Models tab** if you want to use **Model Fallback** (automatic retry with a different model). Saved models also appear as options when setting Target Model IDs in the Provider Fallback Chain.

### What's the fastest way to add a new provider?
Use **Quick Setup** in the Add Provider panel. Select a template from the grid of 14+ pre-built providers. All fields are auto-filled — you only need to add your API key (or change key mode to None for bypass providers).

### What are the available API formats?
| Format | Description | Proxy URL Pattern |
|--------|-------------|-------------------|
| `openai-completions` | OpenAI Chat Completions (most providers) | `/proxy/{id}/v1` |
| `openai-responses` | OpenAI Responses API | `/proxy/{id}/v1` |
| `anthropic-messages` | Anthropic Claude Messages | `/proxy/{id}/v1` |
| `google-generative-ai` | Google Gemini API | `/proxy/{id}/v1beta` |

### What are the API Key Modes?
- **Managed** (default): ClawProxy stores and manages multiple API keys, handling rotation and fallback automatically. The client's key is stripped and replaced with the managed key.
- **None**: No API key is sent to upstream. Used for bypass providers (Kilo AI, OpenCode Zen).
- **Pass Through**: The client's API key is forwarded directly to the upstream provider without modification. No key rotation or management.

### What's the difference between "On Error" and "Round Robin" rotation?
- **On Error**: Uses the highest-priority key until it fails, then rotates to the next key. Best for maximizing usage of a primary key.
- **Round Robin**: Distributes requests evenly across all keys. After a configurable number of requests per key (default: 1), it rotates to the next. Best for load balancing across multiple free-tier keys.

### How do I see why a specific API key is failing?
Open the provider's **API Keys** tab and click the **error count badge** next to the key. This opens the **Error History** modal showing the last 50 errors with type (rate limit, auth error, server error, etc.), HTTP status code, and timestamp.

### Can I add multiple API keys to the same provider?
Yes, this is one of ClawProxy's core features. Add as many keys as you want. ClawProxy rotates between them automatically when errors occur, effectively combining their quotas into one stable connection.

### Why was my API key permanently disabled?
ClawProxy permanently disables a key when it receives an **auth error** (HTTP 401, 402, 403 without content moderation context). This means the key is invalid, expired, or revoked. Check the Error History for details. You can re-enable it manually from the API Keys tab if you believe it was a transient issue.

### Can I use different API formats together?
**Yes.** Each provider has its own format. ClawProxy translates requests into the correct format for each upstream. However, the **Provider Fallback Chain** only allows fallbacks to providers with the **same API format** — this is a safety filter to prevent format incompatibility.

---

## Bypass Providers (Kilo AI & OpenCode Zen)

### What are bypass providers?
Bypass providers (Kilo AI and OpenCode Zen) are special providers that access high-performance AI models without requiring an API key. ClawProxy handles the direct request bypass internally.

### How do I set up a bypass provider?
1. Go to **Providers** → **Add Provider** → **Quick Setup**.
2. Select **Kilo AI** or **OpenCode Zen**.
3. **Before clicking Create:** Change the **API Key Mode** from `Managed` to `None`.
4. Click **Create Provider**.
5. Do NOT add any API keys.
6. Copy the Base URL and use it in your AI client.

### How do I discover available models for bypass providers?
1. Open the bypass provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models**.
4. A list of all available models appears with **Free** and **Paid** badges.
5. Click **+ Add** next to any model to add it to your fallback list.
6. To use a model in your AI client, copy the **Model ID** shown in the list.

### What do the Free/Paid badges mean?
For Kilo AI and OpenCode Zen, ClawProxy fetches live data about each model's pricing status:
- **Free**: The model is accessible without a paid subscription.
- **Paid**: The model requires an active subscription or credits on the provider's platform.

---

## Model Fallback

### What is Model Fallback?
Model Fallback automatically retries a failed request with an alternative model **within the same provider and using the same API key**. It triggers when a model returns a "model not found" or "invalid model" error.

### When does Model Fallback trigger?
Only on **MODEL_ERROR** classification:
- HTTP 404 with "model" in the error message
- HTTP 400 with "model" + "not found" / "invalid" patterns
- HTTP 401 with "ModelError" or "PAID_MODEL_AUTH_REQUIRED" (OpenCode/Kilo quirk)

### How do I enable Model Fallback?
1. Open the provider's **Models** tab.
2. Toggle **Model Fallback** to **Enabled**.
3. Add models in priority order — the first model is the most preferred.
4. Use **Fetch Models** to retrieve the available list from upstream, or type model IDs manually.

### If a fallback model also fails, what happens?
ClawProxy tries models in order (1 → 2 → 3...). If all models fail, it moves to the next key. If all keys are exhausted, the Provider Fallback Chain is triggered.

---

## Provider Fallback Chain

### What is the Provider Fallback Chain?
It is an ordered list of backup providers that ClawProxy routes to when the primary provider completely fails (all keys exhausted or circuit breaker opens).

### How do I configure it?
1. Go to the provider's **Settings** tab → **Provider Fallback Chain** section.
2. Click **Add Fallback Provider**.
3. Select a provider from the dropdown (only same-format providers shown).
4. Optionally set a **Target Model ID** — leave empty to pass the original model name through.
5. Add more fallbacks as needed. They are tried in order.
6. Each entry is saved immediately on add.

### Why does the fallback list only show certain providers?
ClawProxy filters by **API format** to prevent incompatible routing. An `openai-completions` provider only shows other `openai-completions` providers as fallbacks.

### What is the Target Model ID for?
Different providers may use different names for the same model. If Provider A uses `gpt-5` and Provider B uses `openai/gpt-5`, set the Target Model ID to `openai/gpt-5` so ClawProxy rewrites the model name when falling back to Provider B. Leave empty if both providers use the same model names.

### Can I add the same provider as its own fallback?
Yes. This is useful for targeting a different model on the same provider when the primary request fails.

### If Provider B in my fallback chain is also down, does it try Provider C?
**Yes.** ClawProxy tries each provider in the chain sequentially until one succeeds. If all fail, the error is returned to the client.

---

## Circuit Breaker

### What is the Circuit Breaker?
An automatic health monitor that protects against cascading failures. If a provider accumulates **5 failures within 60 seconds**, ClawProxy stops sending requests to it and routes directly to the fallback chain.

### What are the exact thresholds?
- **Failure threshold:** 5 failures within a 60-second window (configurable via **Settings** page)
- **Cooldown duration:** 30 seconds (configurable via **Settings** page)
- **Recovery test:** After cooldown, one test request is sent. If it succeeds, normal routing resumes.

### Can I reset the Circuit Breaker manually?
Yes. Go to the provider's **Settings** tab. If the circuit breaker is OPEN or HALF_OPEN, you will see its status and a **Reset** button.

### Does it reset when the proxy restarts?
Yes. The Circuit Breaker is in-memory and resets on restart. This is by design.

---

## Notifications

### What notification types exist?
| Type | Trigger | Severity |
|------|---------|----------|
| **Key Disabled** | Key permanently disabled due to auth error (401/402/403) | Critical |
| **Rate Limited** | Key entered 60-second cooldown after rate limit (429) | Warning |
| **Circuit Open** | Provider circuit breaker tripped (5 failures in 60s) | Critical |
| **Recovered** | Provider recovered after circuit breaker cooldown | Info |
| **All Keys Failed** | Every key for a provider failed | Critical |
| **Model Fallback** | Model error triggered automatic switch to next model | Info |
| **Provider Fallback** | Provider failure triggered switch to fallback provider | Warning |

### Do notifications persist after restart?
No. Notifications are in-memory (last 100 events) and cleared on restart. This is by design — they are a real-time alerting system, not a log replacement. Use the **Logs** section for persistent history.

### How do notifications work?
Notifications are delivered in real-time via WebSocket — no page refresh needed. Click the **Bell icon** in the sidebar to view them. Click any notification to navigate to the affected provider.

---

## Logs & Monitoring

### Where can I see what the proxy is doing?
Two options:
- **Dashboard Logs page**: Real-time and historical view with filters (provider, status, model). Uses live WebSocket streaming.
- **CLI**: Run `clawproxy logs` in your terminal to follow live traffic.

### What information does each log entry show?
Each log entry includes: Provider ID, model name, HTTP method, response status code, duration (ms), timestamp, and the full request/response details (expandable).

### Can I filter logs?
Yes. The Logs page supports filtering by:
- **Provider**: All or a specific provider
- **Status**: All, Success, Error, Pending, Timeout
- **Model**: Search by model name
- **Pagination**: Navigate through pages (50 logs per page default)

### Are logs persistent?
Yes, logs are stored in the SQLite database. They survive restarts. Old logs are automatically cleaned up after 7 days by default. You can adjust the retention period and toggle auto-cleanup on/off from the **Settings** page in the dashboard.

### Can I clear all logs?
Yes. Click the **Clear Logs** button on the Logs page (with confirmation dialog).

---

## CLI Commands

### What CLI commands are available?
| Command | Description |
|---------|-------------|
| `clawproxy start` | Start the server as a background service |
| `clawproxy stop` | Stop the server gracefully |
| `clawproxy restart` | Restart the server |
| `clawproxy status` | Show running status, PID, port, uptime |
| `clawproxy logs` | Follow live server logs (Ctrl+C to exit) |
| `clawproxy uninstall` | Remove the background service (preserves database) |
| `clawproxy install` | Install as system service and start |
| `clawproxy --version` | Show current version |

### What platforms are supported?
- **Linux**: Uses systemd (with fallback process manager)
- **macOS**: Uses launchd (with fallback process manager)
- **Windows**: Uses Windows Service

---

## Configuration & Environment

### What port does ClawProxy use?
Default port is **3030**. Override with the `PORT` environment variable or `--port` CLI flag.

### What environment variables are supported?
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3030` | Server port |
| `HOST` | `0.0.0.0` | Bind address |
| `DB_PATH` | `./clawproxy.db` | Database file path |
| `LOG_RETENTION_DAYS` | `7` | Auto-cleanup age for old logs (also configurable in Settings) |
| `MAX_LOG_BODY_SIZE` | `5242880` (5MB) | Max body characters stored in logs |
| `AUTO_CLEANUP_LOGS` | `true` | Enable/disable automatic log cleanup (also configurable in Settings) |

### Where is data stored?
Everything is stored locally on your machine. Providers, keys, logs, and configurations are kept in a local database in the installation directory.

### Does ClawProxy send data externally?
The only external requests ClawProxy makes are:
1. **To the AI providers you configure** — forwarding your API requests.
2. **Periodic license check** — a lightweight check for activation status and available updates.

---

## Global Settings

### Where do I configure global proxy behavior?
Click **Settings** in the sidebar to access the **Global Settings** page. This page lets you configure system-wide defaults that were previously hardcoded:

| Setting | Default | Description |
|---------|---------|-------------|
| **Key Retry Mode** | `all` | `all` = try every available key; `fixed` = try up to a fixed limit |
| **Key Retry Limit** | `5` | Max keys to try per request (only applies when mode is `fixed`) |
| **Rate Limit Backoff** | `60s` | Cooldown duration after a key hits a rate limit |
| **Circuit Breaker Threshold** | `5` | Failures within window before circuit opens |
| **Circuit Breaker Cooldown** | `30s` | Seconds before a tripped circuit enters half-open state |
| **Auto Cleanup Logs** | `true` | Enable automatic log retention cleanup |
| **Log Retention Days** | `7` | Days to keep request logs before auto-cleanup |

### What is the difference between "all" and "fixed" key retry mode?
- **All** (default): On failure, ClawProxy tries every available key for the provider before giving up and triggering the fallback chain.
- **Fixed**: ClawProxy tries up to the configured **Key Retry Limit** number of keys, then triggers the fallback chain. Useful when you have many keys but want faster failover to the fallback provider.

---

## Troubleshooting

### I'm getting "Model Not Found" errors — what do I do?
1. Verify the model ID is correct by checking the provider's official documentation.
2. Use **Fetch Models** in the Models tab to get the current list from the provider.
3. Enable **Model Fallback** with alternative models as backups.
4. Model IDs change frequently — what worked yesterday may not work today.

### My requests fail with "not_activated" (403) — what happened?
Your ClawProxy installation is not yet activated. Check the dashboard — if you see the Awaiting Activation screen, send your Installation ID to the developer and click **Check Activation** once confirmed.

### A key shows errors but is still active — why?
ClawProxy only permanently disables keys on **auth errors** (401, 402, 403). For rate limits, server errors, and timeouts, the key enters a temporary cooldown or backoff (default 60 seconds, configurable via the **Settings** page) and continues rotating normally.

### The dashboard is slow to load — is that normal?
On large setups with many providers and extensive logs, initial loading can take a few seconds. This resolves once data is loaded. The stats use a 5-second cache to prevent excessive reloading.

### How do I completely reset my configuration?
Delete the local database file and restart ClawProxy. This removes all providers, keys, and logs. You may need to contact the developer to re-activate.

---

## Support & Developer Info

**ClawProxy** is developed and maintained by **Malek-Rsh**.

- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
