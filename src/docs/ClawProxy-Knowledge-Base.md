# ClawProxy Knowledge Base

The authoritative reference for **ClawProxy** — covering every feature, setting, behavior, and workflow. Designed for both end users and AI support agents.

> **Current Version: 1.0.12**

---

## What is ClawProxy?

**ClawProxy** is a self-hosted AI routing proxy that sits between your AI client (OpenClaw or any OpenAI-compatible tool) and upstream AI providers. It manages API key rotation, provider fallback chains, model-level fallback, circuit breaking, real-time notifications, and full request logging.

**Core Principles:**
1. **Freedom of Choice**: Vendor-agnostic. You bring your own providers and configure them as you see fit.
2. **Uninterrupted Continuity**: Smart Key Rotation, Model Fallback, Provider Fallback Chain, and Circuit Breaker ensure your AI session never stops.
3. **Local First**: Everything runs on your machine. Keys, logs, and configs are stored locally and securely. No data is sent externally except to the AI providers you configure and a periodic license check.

**Request Flow:**
```
Client → http://localhost:3030/proxy/{providerId}/v1/... → ClawProxy → upstream provider
```

---

## Provider Templates (Quick Setup)

ClawProxy provides **13 built-in provider templates** pre-configured with the correct name, API format, upstream URL, and API key mode.

**Available Templates:**

| Template | API Format | Upstream URL | Key Mode |
|----------|-----------|-------------|----------|
| OpenRouter | openai-completions | `https://openrouter.ai/api/v1` | Managed |
| Google Gemini | google-generative-ai | `https://generativelanguage.googleapis.com/v1beta` | Managed |
| NVIDIA NIM | openai-completions | `https://integrate.api.nvidia.com/v1` | Managed |
| Groq | openai-completions | `https://api.groq.com/openai/v1` | Managed |
| OpenAI | openai-completions | `https://api.openai.com/v1` | Managed |
| Anthropic | anthropic-messages | `https://api.anthropic.com/v1` | Managed |
| Ollama Cloud | openai-completions | `https://ollama.com/v1` | Managed |
| Kilo AI | openai-completions | `https://api.kilo.ai/api/gateway` | Managed* |
| OpenCode Zen | openai-completions | `https://opencode.ai/zen/v1` | Managed* |
| Perplexity | openai-completions | `https://api.perplexity.ai` | Managed |
| Cerebras | openai-completions | `https://api.cerebras.ai/v1` | Managed |
| Cohere | openai-completions | `https://api.cohere.com/v1` | Managed |
| Z.AI API | openai-completions | `https://api.z.ai/api/paas/v4` | Managed |
| Z.AI Coding | openai-completions | `https://api.z.ai/api/coding/paas/v4` | Managed |

> **\* Kilo AI and OpenCode Zen:** These are bypass providers. The template defaults to `Managed`, but users **must change the API Key Mode to `None`** before creating. No API keys should be added.

**Two setup methods:**
- **Quick Setup**: Select a template. All fields auto-filled. Customize if needed, then create.
- **Custom**: Blank form for any provider not in the template list.

---

## Multi-Key Management & Smart Rotation

ClawProxy allows you to add **multiple API keys to the same provider**. When one key hits a rate limit or fails, the next key is used instantly and transparently.

### How Key Rotation Works

**Two Rotation Strategies:**

| Strategy | Behavior | Best For |
|----------|----------|----------|
| **On Error** | Uses the highest-priority key until it fails, then rotates | Maximizing usage of a primary key |
| **Round Robin** | Distributes requests evenly across keys (configurable requests per key) | Load balancing free-tier keys |

**On Error Handling:**
- **Rate Limit (429)**: Key enters cooldown (default 60 seconds, configurable in **Settings**). Next key used immediately.
- **Auth Error (401/402/403)**: Key is permanently disabled. Next key used.
- **Overloaded (503/529)**: Retries the same key after 2-second wait (up to 2 retries, configurable in **Settings**).
- **Model Error**: Handled by Model Fallback (same key, different model).
- **Request Error (400/413/422)**: Returned to client immediately (affects all keys equally).
- **Server/Timeout/Network Error**: Tries next key.

### Key Error History
Each key tracks the last 50 errors. View via the **error count badge** on the API Keys tab → click to open the Error History modal showing type, message, HTTP status, and timestamp.

### Key Status Indicators
- **Active** (green): Key is operational.
- **Unstable** (amber): Key has >3 consecutive errors but is not disabled.
- **Disabled** (red): Key permanently disabled due to auth errors.

---

## Model Fallback (Within Same Provider)

Automatically retries a failed request with an alternative model, **same provider, same API key**.

### Trigger Conditions
Only triggers on **MODEL_ERROR** classification:
- HTTP 404 with "model" in the error message
- HTTP 400 with "model" + "not found" / "invalid" patterns
- HTTP 401 with "ModelError" or "PAID_MODEL_AUTH_REQUIRED" (OpenCode/Kilo specific)

### Configuration
1. Provider's **Models** tab → enable **Model Fallback** toggle.
2. Add models in priority order (first = most preferred).
3. Use **Fetch Models** to retrieve models from the upstream API.
4. For Kilo AI and OpenCode: fetched models show **Free/Paid** badges.

### Behavior
- Models are tried in priority order: 1 → 2 → 3...
- If all models fail → try next key.
- If all keys exhausted → trigger Provider Fallback Chain.

---

## Provider Fallback Chain

Switches to a completely different provider when the primary provider fails entirely (all keys exhausted or circuit breaker opens).

### Configuration
1. Provider's **Settings** tab → **Provider Fallback Chain** section.
2. **Add Fallback Provider** — dropdown shows only providers with the **same API format**.
3. Optionally set a **Target Model ID** — rewrites the model name for the fallback provider. Leave empty to pass original model name.
4. Add multiple fallbacks — tried in priority order (1 → 2 → 3...).
5. Entries are saved immediately on add. The main "Save Provider Settings" button does NOT control fallback entries.

### Smart Format Filtering
The fallback dropdown only shows providers matching the primary provider's API format. This prevents format incompatibility errors.

### Target Model ID Mapping
| Scenario | What to Set |
|----------|-------------|
| Both providers use the same model names | Leave empty |
| Providers use different names for the same model | Set the exact model ID the fallback provider expects |
| Want to route to a completely different model on failure | Set the desired model ID |

---

## Circuit Breaker

Automatic health monitoring that prevents cascading failures.

### Default Thresholds (Configurable in Settings)
| Parameter | Default |
|-----------|---------|
| Failure threshold | 5 failures |
| Failure window | 60 seconds |
| Cooldown duration | 30 seconds |

### States
| State | Meaning | Behavior |
|-------|---------|----------|
| **CLOSED** | Normal operation | All requests go to this provider |
| **OPEN** | Provider failed | Requests skip provider, go directly to fallback chain |
| **HALF_OPEN** | Testing recovery | One test request sent; success → CLOSED, failure → OPEN |

### Key Behaviors
- Only triggers on **provider-level failures** (all keys exhausted), not single-key errors.
- Resets on proxy restart (in-memory by design).
- Can be manually reset from the provider's **Settings** tab.
- Fires **Circuit Open** notification when tripping, **Recovered** notification when closing.

---

## Real-time Notifications

Built-in notification system delivered via WebSocket in real-time.

### Notification Types

| Type | When It Fires | Severity |
|------|--------------|----------|
| **Key Disabled** | API key permanently disabled due to auth error (401/402/403) | Critical |
| **Rate Limited** | Key entered 60-second cooldown after rate limit (429) | Warning |
| **Circuit Open** | Provider circuit breaker tripped (5 failures in 60s) | Critical |
| **Recovered** | Provider recovered after circuit breaker cooldown | Info |
| **All Keys Failed** | Every key for a provider exhausted | Critical |
| **Model Fallback** | Model error triggered automatic switch to next model | Info |
| **Provider Fallback** | Provider failure triggered switch to fallback provider | Warning |

### Accessing Notifications
- Click the **Bell icon** in the sidebar. Badge shows unread count.
- Click any notification to navigate to the affected provider.
- Mark individual as read or clear all.
- Last 100 notifications stored in memory. Cleared on restart.

---

## Request Logging & Dashboard

### Dashboard
The main dashboard shows:
- **Stats Row 1**: Requests Today, Success Rate, Active Providers, Active Keys
- **Stats Row 2**: Errors Today, Timeouts Today, Avg Duration, Uptime
- **Request Volume Chart**: 24h/7d/all ranges with success/failure areas
- **Recent Errors Panel**: Latest errors with type badges
- **Last 5 Requests Panel**: Recent requests with status

### Logs Page
- **Real-time WebSocket streaming**: New logs appear instantly, no refresh needed.
- **Connection indicator**: Green "Live" (pulsing) or amber "Reconnecting".
- **Filters**: Provider, Status (success/error/pending/timeout), Model search.
- **Pagination**: 50 logs per page.
- **Each log shows**: Provider, model, HTTP method, status code, duration, timestamp.
- **Expandable details**: Full request/response headers and body.
- **Clear all logs** with confirmation.

---

## "Prompt for AI" Integration

Every provider page has a **"Prompt for AI"** button that generates a ready-to-use prompt for your AI agent (OpenClaw).

### What It Generates
- Provider Base URL
- Provider Name
- API format
- Curated list of recommended Model IDs
- Full `openclaw.json` configuration template

### How to Use
1. Click **"Prompt for AI"** on the provider's detail page.
2. Copy the generated prompt.
3. Paste it to your OpenClaw AI agent.
4. The agent will safely update your `openclaw.json`.

For providers with saved models in the Models tab, the prompt includes those models. For custom providers, it provides a template where you insert the Model IDs.

---

## Provider Configuration Parameters

### Provider Settings

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| **Name** | (from template) | Any string | Unique internal identifier |
| **API Format** | (from template) | openai-completions, openai-responses, anthropic-messages, google-generative-ai | Protocol for upstream communication |
| **Upstream URL** | (from template) | Any URL | Destination API endpoint |
| **Base URL** | Auto-generated | Read-only | Local proxy URL for your AI client |
| **API Key Mode** | Managed | Managed, None, Pass Through | How API keys are handled |
| **Rotation Strategy** | On Error | On Error, Round Robin | When to rotate between keys |
| **Requests Per Key** | 1 | Number (min 1) | (Round Robin only) Requests before rotation |
| **Timeout** | 120000ms (2 min) | Number (ms) | Max wait time for upstream response |
| **Retry on Timeout** | Enabled | Enabled/Disabled | Try next key on timeout |
| **Model Fallback** | Disabled | Enabled/Disabled | Auto-switch model on model error |
| **Enabled** | Yes | Yes/No | Provider active/inactive |

### Base URL Format
| API Format | Proxy URL Pattern |
|-----------|-------------------|
| openai-completions | `http://localhost:3030/proxy/{provider-id}/v1` |
| openai-responses | `http://localhost:3030/proxy/{provider-id}/v1` |
| anthropic-messages | `http://localhost:3030/proxy/{provider-id}/v1` |
| google-generative-ai | `http://localhost:3030/proxy/{provider-id}/v1beta` |

---

## Dashboard Navigation & Screens

### Sidebar Navigation
- **Dashboard**: Global stats and charts
- **Providers**: Provider list, add/manage providers
- **Logs**: Request log viewer with real-time updates
- **Settings**: Global configuration for key retry, rate limit backoff, circuit breaker, and log management
- **Bell icon**: Notification panel
- **Update badge**: Shows when a new version is available

### Special Screens
- **Awaiting Activation**: Shows on first launch before activation. Displays Installation ID, copy button, and Check Activation button.
- **Update Modal**: Shows when clicked on update badge. Displays current/latest version, changelog, and install commands for Linux/macOS/Windows.

---

## Provider Detail Page (4 Tabs)

### Overview Tab
- Stats cards: Total requests, requests today, success rate (color-coded), total errors
- Request volume chart (24h/7d/all)
- Configuration summary
- Quick stats: total keys, active keys, avg duration, today's success rate

### API Keys Tab
- Add single key (with optional label) or bulk add (newline-separated)
- Key table: masked key, label, priority, status badge, stats (total/success/failed), last used, last error
- Actions per key: view error history, enable/disable, reset stats, delete
- Drag-and-drop reorder for priority

### Models Tab
- Fallback models list (priority-ordered, drag to reorder)
- Manual add input
- Model Fallback toggle (Enabled/Disabled)
- **Fetch Models** button — retrieves available models from upstream
- Fetched models panel: search, filter, Free/Paid/Other badges, "+ Add" per model, "Add All" button

### Settings Tab
- Circuit Breaker status (if not CLOSED): state badge, failure count, Reset button
- **Left column**: Provider config form (name, upstream URL, key mode, rotation mode, requests per key, timeout, retry on timeout) + Save button
- **Right column**: Provider Fallback Chain (ordered list, add/delete/reorder)

---

## Error Classification Reference

ClawProxy classifies upstream errors to determine the correct recovery action.

| Error Type | HTTP Status | Body Patterns | Recovery Action |
|------------|-------------|---------------|-----------------|
| **AUTH_ERROR** | 401, 402, 403 | (no model patterns), API_KEY_INVALID, FAILED_PRECONDITION | Disable key permanently, try next key |
| **RATE_LIMIT** | 429, 498 (Groq) | Rate limit patterns | 60s backoff on key, try next key |
| **MODEL_ERROR** | 404, 400, 401 | "model", "ModelError", "PAID_MODEL_AUTH_REQUIRED" | Try next model (if enabled), then next key |
| **OVERLOADED** | 503, 529 (Anthropic) | "overloaded", "capacity", "resource exhausted" | Wait 2s, retry same key (up to 2x) |
| **REQUEST_ERROR** | 400, 413, 422, 499 | Bad format, too large, unprocessable | Return to client immediately |
| **SERVER_ERROR** | 500, 502, 503 (non-overload) | Server-side transient | Try next key |
| **TIMEOUT** | 504, 408, timeout/AbortError | Network timeout | Try next key (if retry_on_timeout) |
| **NETWORK_ERROR** | Other | Connection failures | Try next key |

### Provider-Specific Quirks
- **OpenCode.ai**: Returns HTTP 401 for unsupported models (body: "ModelError") → classified as MODEL_ERROR, not AUTH_ERROR.
- **Kilo.ai**: Returns HTTP 401 for non-free models when no auth (body: "PAID_MODEL_AUTH_REQUIRED") → classified as MODEL_ERROR.
- **Google Gemini**: Returns HTTP 400 for invalid API keys (body: "API_KEY_INVALID") → classified as AUTH_ERROR.
- **MiniMax**: Returns HTTP 200 for most errors with custom status codes in body → parsed from response body.
- **Anthropic**: Uses custom HTTP 529 for overloaded → classified as OVERLOADED.
- **Groq**: Uses custom HTTP 498 for flex tier capacity → classified as RATE_LIMIT.

---

## Retry Cascade (Exact Order)

When a request fails, ClawProxy follows this exact retry cascade:

1. **REQUEST_ERROR** (400/413/422/499) → Return to client immediately (will fail with any key).
2. **OVERLOADED** (503/529) → Wait 2 seconds, retry same key (up to 2 inner retries).
3. **MODEL_ERROR** (404/400/401 with model patterns) → Try next model from provider_models if model_fallback_enabled (same key).
4. **AUTH_ERROR / RATE_LIMIT / SERVER_ERROR / TIMEOUT / NETWORK_ERROR** → Try next key.
5. **All keys exhausted** → Trigger Provider Fallback Chain (tried in priority order).
6. **All fallback providers exhausted** → Return error to client.

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `clawproxy install` | Install as system service + start + open browser |
| `clawproxy start` | Start the server as a background service |
| `clawproxy stop` | Stop the server gracefully |
| `clawproxy restart` | Restart the server |
| `clawproxy status` | Show running status, PID, port, uptime |
| `clawproxy logs` | Follow live server logs (Ctrl+C to exit) |
| `clawproxy uninstall` | Remove background service (preserves database) |
| `clawproxy --version` | Show current version |
| `clawproxy --help` | Show help |

**Options:** `--port <port>` (override default 3030), `--no-open` (don't open browser on install)

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3030` | Server listening port |
| `HOST` | `0.0.0.0` | Bind address |
| `DB_PATH` | `./clawproxy.db` | SQLite database file path |

> **Note:** Log retention, log body size limits, and other operational settings are now configurable from the **Settings** page in the dashboard.

---

## Activation

### How to Activate
1. First launch → Awaiting Activation screen displays your unique **Installation ID**.
2. Copy the ID and send it to the developer via email or Reddit.
3. Once the developer confirms activation, click **Check Activation** on the screen.
4. The dashboard becomes fully functional.

### Update Check
If a newer version is available:
- **Update Available** badge appears in the sidebar.
- Click to see version comparison, changelog, and install commands.


---

## Complete How-To Index

| Task | Where |
|------|-------|
| Add a provider (Quick Setup) | Providers → Add Provider → Quick Setup |
| Add a provider (Custom) | Providers → Add Provider → Custom |
| Add API keys | Provider detail → API Keys tab → Add API Key |
| Bulk add keys | Provider detail → API Keys tab → Bulk Add |
| Enable Model Fallback | Provider detail → Models tab → toggle → add models |
| Fetch available models | Provider detail → Models tab → Fetch Models |
| Configure Provider Fallback | Provider detail → Settings tab → Fallback Chain |
| View key error history | Provider detail → API Keys tab → click error badge |
| Reset circuit breaker | Provider detail → Settings tab → Reset button |
| Configure OpenClaw | Provider detail → "Prompt for AI" button |
| Monitor events | Sidebar → Bell icon |
| View logs | Sidebar → Logs |
| Check activation status | Dashboard → Check Activation (if not activated) |
| Configure global settings | Sidebar → Settings |
| Update ClawProxy | Sidebar → Update badge → follow instructions |

---

## Support & Developer Info

**ClawProxy** is developed and maintained by **Malek-Rsh**.

- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)

*ClawProxy v1.0.12 — Knowledge Base — Grounded in Facts, Built for Continuity.*
