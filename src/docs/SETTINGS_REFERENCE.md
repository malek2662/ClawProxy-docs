# ClawProxy Settings Reference

Complete reference of every configurable parameter, default value, and behavior in ClawProxy.

> **Version 1.0.12**

---

## Provider Settings

These settings are configured per provider in the **Settings** tab of the provider's detail page.

### Core Settings

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **Name** | From template or user input | Any string | Unique identifier for the provider. Also generates the provider ID (URL slug). |
| **API Format** | From template | `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai` | Determines how ClawProxy communicates with the upstream provider. Set at creation, read-only after. |
| **Upstream URL** | From template | Any valid URL | The base URL of the upstream AI provider's API. |
| **Enabled** | `true` | `true` / `false` | Whether the provider accepts proxy requests. Disabled providers are also excluded from fallback chains. |

### Key Management Settings

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **API Key Mode** | `Managed` | `Managed`, `None`, `Pass Through` | How API keys are handled for this provider. |
| **Key Rotation Mode** | `On Error` | `On Error`, `Round Robin` | When to rotate between managed keys. Only applies when API Key Mode = Managed. |
| **Requests Per Key** | `1` | Any positive integer | (Round Robin only) Number of requests sent to one key before rotating to the next. |

### API Key Mode Details

| Mode | Behavior |
|------|----------|
| **Managed** | ClawProxy stores and manages multiple API keys. The client's API key header is stripped and replaced with the managed key. Supports rotation, backoff, and automatic disabling. |
| **None** | No API key is sent to the upstream. The proxy strips any auth headers from the client request. Use for bypass providers (Kilo AI, OpenCode Zen). |
| **Pass Through** | The client's API key is forwarded to the upstream without modification. No key rotation or management. ClawProxy acts as a transparent proxy for auth. |

### Reliability Settings

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **Timeout** | `120000` ms (2 minutes) | Any positive integer (ms) | Maximum time to wait for an upstream response before considering it a timeout. |
| **Retry on Timeout** | `Enabled` | `Enabled` / `Disabled` | If enabled, a timeout triggers a retry with the next available key. If disabled, the timeout error is returned to the client. |
| **Model Fallback** | `Disabled` | `Enabled` / `Disabled` | If enabled, model-level errors trigger automatic retry with the next model in the fallback list. Configured in the Models tab. |

---

## Global Settings

These settings apply to the entire proxy and are configured on the **Settings** page in the dashboard sidebar.

### Key Retry Behavior

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **Key Retry Mode** (`key_retry_mode`) | `all` | `all`, `fixed` | `all` — try every available key before giving up. `fixed` — try at most `key_retry_limit` keys before giving up. |
| **Key Retry Limit** (`key_retry_limit`) | `5` | Any positive integer | Maximum number of keys to try per request when Key Retry Mode is `fixed`. Ignored when mode is `all`. |

### Rate Limit & Circuit Breaker

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **Rate Limit Backoff** (`rate_limit_backoff_s`) | `60` | Any positive integer (seconds) | How long a key is put in cooldown after hitting a rate limit (HTTP 429). |
| **Circuit Breaker Threshold** (`circuit_breaker_threshold`) | `5` | Any positive integer | Number of provider-level failures (all keys exhausted) within the failure window before the circuit opens. |
| **Circuit Breaker Cooldown** (`circuit_breaker_cooldown_s`) | `30` | Any positive integer (seconds) | How long the circuit stays OPEN before transitioning to HALF_OPEN for a recovery test. |

### Log Retention

| Setting | Default | Options | Description |
|---------|---------|---------|-------------|
| **Auto Cleanup Logs** (`auto_cleanup_logs`) | `true` | `true` / `false` | Whether old request logs are automatically deleted on a periodic schedule. |
| **Log Retention Days** (`log_retention_days`) | `7` | Any positive integer | Number of days to keep request logs before automatic deletion. Only applies when Auto Cleanup Logs is enabled. |

> Global settings are stored in the database and take effect immediately. Changes to circuit breaker parameters apply to new failure tracking — existing circuit breaker states are not retroactively affected.

---

## Key Rotation Strategies

### On Error (Default)

| Behavior | Detail |
|----------|--------|
| Primary key | Always uses the highest-priority (first) eligible key |
| Rotation trigger | Only when the current key encounters an error |
| Best for | Maximizing usage of a single primary key before rotating |
| Rate limit handling | Failed key enters cooldown (default 60s, configurable), next key used |
| Auth error handling | Failed key permanently disabled, next key used |

### Round Robin

| Behavior | Detail |
|----------|--------|
| Key distribution | Rotates evenly across all eligible keys |
| Rotation trigger | After `requests_per_key` requests, rotates to next key |
| Wrapping | After the last key, wraps back to the first |
| Best for | Load balancing across multiple free-tier keys to avoid rate limits |
| Error handling | Same as On Error (backoff, disable, etc.) |

---

## Circuit Breaker Parameters

The Circuit Breaker is automatic and applies per-provider. Threshold and cooldown are configurable in the **Settings** page (see [Global Settings](#global-settings)).

| Parameter | Default | Configurable | Description |
|-----------|---------|--------------|-------------|
| **Failure Threshold** | 5 | Yes (`circuit_breaker_threshold`) | Number of provider-level failures to trigger the circuit |
| **Failure Window** | 60 seconds | No | Time window for counting failures |
| **Cooldown Duration** | 30 seconds | Yes (`circuit_breaker_cooldown_s`) | Time the circuit stays OPEN before testing recovery |
| **Recovery Test** | 1 request | No | Number of test requests in HALF_OPEN state |

### Circuit Breaker States

| State | Meaning | Request Handling |
|-------|---------|-----------------|
| **CLOSED** | Normal operation | All requests go to this provider |
| **OPEN** | Provider failed (threshold reached within 60s window) | All requests skip this provider and go to fallback chain |
| **HALF_OPEN** | Testing recovery after cooldown | One test request sent. Success → CLOSED. Failure → back to OPEN. |

> Circuit breaker is in-memory and resets on proxy restart. Can be manually reset from the Settings tab.

---

## Key Backoff & Error Handling

| Error Type | Key Action | Backoff Duration | Notification |
|------------|-----------|-----------------|-------------|
| **Rate Limit** (429, Groq 498) | Temporary cooldown | 60 seconds (configurable via `rate_limit_backoff_s`) | Key Rate Limited |
| **Auth Error** (401, 402, 403) | Permanently disabled | Permanent | Key Disabled |
| **Overloaded** (503, 529) | Retry same key | 2 seconds (up to 2 retries) | None |
| **Model Error** | No key action | N/A | Model Fallback (if enabled) |
| **Request Error** (400, 413, 422) | No key action | N/A | None |
| **Server Error** (500, 502) | Try next key | N/A | None |
| **Timeout** (504, 408) | Try next key (if retry_on_timeout) | N/A | None |
| **Network Error** | Try next key | N/A | None |

---

## Fallback Chain Settings

### Provider Fallback Chain Entry

| Field | Required | Description |
|-------|----------|-------------|
| **Fallback Provider** | Yes | The provider to route to on failure. Must have the same API format. |
| **Target Model ID** | No | If set, rewrites the model name in the request to this value. If empty, the original model name is passed through. |
| **Priority** | Auto | Order in which fallbacks are tried (1 = first). Drag to reorder. |

### Model Fallback List Entry

| Field | Required | Description |
|-------|----------|-------------|
| **Model ID** | Yes | The model identifier to try on fallback |
| **Display Name** | Yes | Human-readable name (usually same as ID) |
| **Priority** | Auto | Order in which models are tried (1 = first). Drag to reorder. |

---

## API Formats & URL Mapping

| API Format | Auth Method | Proxy URL Pattern | Upstream URL Path |
|-----------|------------|-------------------|-------------------|
| `openai-completions` | Bearer token | `/proxy/{id}/v1` | `/v1` |
| `openai-responses` | Bearer token | `/proxy/{id}/v1` | `/v1` |
| `anthropic-messages` | x-api-key header | `/proxy/{id}/v1` | `/v1` |
| `google-generative-ai` | Query parameter `?key=` | `/proxy/{id}/v1beta` | `/v1beta` |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3030` | Server listening port |
| `HOST` | `0.0.0.0` | Bind address (0.0.0.0 = all interfaces) |
| `DB_PATH` | `./clawproxy.db` | Path to SQLite database file |
| `LOG_RETENTION_DAYS` | `7` | Days before old request logs are automatically deleted. Also configurable in Settings page. |
| `MAX_LOG_BODY_SIZE` | `5242880` (5 MB) | Maximum request/response body size stored in log entries |
| `AUTO_CLEANUP_LOGS` | `true` | Enable/disable automatic log cleanup. Also configurable in Settings page. |

---

## CLI Command Options

| Command | Options | Description |
|---------|---------|-------------|
| `clawproxy install` | `--port <port>`, `--no-open` | Install as system service, optional port override, skip browser open |
| `clawproxy start` | `--port <port>` | Start server with optional port override |
| `clawproxy stop` | — | Graceful shutdown |
| `clawproxy restart` | — | Restart service |
| `clawproxy status` | — | Show running state, PID, port, uptime |
| `clawproxy logs` | — | Follow live logs (Ctrl+C to exit) |
| `clawproxy uninstall` | — | Remove service (preserves database) |
| `clawproxy --version` | — | Show version |
| `clawproxy --help` | — | Show help |

---

## Notification Types Reference

| Type | Severity | Badge Color | Trigger Condition |
|------|----------|------------|-------------------|
| `key_disabled` | Critical | Red | API key permanently disabled (AUTH_ERROR) |
| `key_rate_limited` | Warning | Yellow | Key entered 60s cooldown (RATE_LIMIT) |
| `circuit_open` | Critical | Red | Circuit breaker tripped (5 failures in 60s) |
| `provider_cooldown` | Info | Green | Provider recovered (circuit HALF_OPEN → CLOSED) |
| `all_keys_failed` | Critical | Red | Every key for provider exhausted |
| `model_fallback` | Info | Blue | Model error → switched to fallback model |
| `provider_fallback` | Warning | Yellow | Provider failure → switched to fallback provider |

**Storage:** In-memory ring buffer, max 100. Cleared on restart. Delivered via WebSocket in real-time.

---

## Database Configuration

| Setting | Value |
|---------|-------|
| **Engine** | SQLite (better-sqlite3) |
| **File** | `clawproxy.db` (or DB_PATH env) |
| **Mode** | WAL (Write-Ahead Logging) |
| **Foreign Keys** | Enabled |
| **Synchronous** | NORMAL |
| **Request Body Limit** | 10 MB |
| **CORS** | Enabled (all origins) |

---

## Request Size Limits

| Limit | Value |
|-------|-------|
| **Max request body** | 10 MB |
| **Max log body stored** | 5 MB (configurable via MAX_LOG_BODY_SIZE) |
| **Key error history** | Last 50 errors per key |
| **Notification buffer** | Last 100 notifications |
| **Log retention** | 7 days (configurable via Settings page or LOG_RETENTION_DAYS env) |

---

## Activation

ClawProxy requires a one-time activation after installation. Your unique **Installation ID** is displayed on the Awaiting Activation screen. Send it to the developer, and once confirmed, click **Check Activation** to unlock the dashboard.

---

## API Endpoints Reference

### Provider Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | List all providers with key/today stats |
| POST | `/api/providers` | Create a new provider |
| GET | `/api/providers/:id` | Get single provider details |
| PUT | `/api/providers/:id` | Update provider settings |
| DELETE | `/api/providers/:id` | Delete provider (cascades) |
| PATCH | `/api/providers/:id/toggle` | Toggle enabled/disabled |

### API Key Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/keys` | List all keys for provider |
| POST | `/api/providers/:id/keys` | Add a single key |
| POST | `/api/providers/:id/keys/bulk` | Bulk add keys (newline-separated) |
| PUT | `/api/providers/:id/keys/:keyId` | Update key (label, priority) |
| DELETE | `/api/providers/:id/keys/:keyId` | Delete key |
| PATCH | `/api/providers/:id/keys/:keyId/toggle` | Toggle key enabled/disabled |
| PATCH | `/api/providers/:id/keys/:keyId/reset` | Reset key stats to zero |
| POST | `/api/providers/:id/keys/reorder` | Reorder key priorities |
| GET | `/api/providers/:id/keys/:keyId/errors` | Get last 50 errors for key |

### Provider Fallback Chain
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/fallbacks` | List fallback entries |
| POST | `/api/providers/:id/fallbacks` | Add fallback entry |
| PUT | `/api/providers/:id/fallbacks/:fbId` | Update fallback entry |
| DELETE | `/api/providers/:id/fallbacks/:fbId` | Delete fallback entry |
| POST | `/api/providers/:id/fallbacks/reorder` | Reorder fallback chain |

### Model Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/models` | List saved models |
| POST | `/api/providers/:id/models` | Add a model |
| DELETE | `/api/providers/:id/models/:modelId` | Delete a model |
| POST | `/api/providers/:id/models/reorder` | Reorder model priorities |
| POST | `/api/providers/:id/models/fetch` | Fetch models from upstream |

### Circuit Breaker
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/circuit-status` | Get circuit breaker state |
| POST | `/api/providers/:id/circuit-reset` | Reset circuit breaker |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| POST | `/api/notifications/:id/read` | Mark as read |
| DELETE | `/api/notifications` | Clear all notifications |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | List logs (paginated, filterable) |
| GET | `/api/logs/:id` | Get single log detail |
| DELETE | `/api/logs` | Clear all logs |

### Global Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all global settings |
| PUT | `/api/settings` | Update global settings |

### System
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (status, uptime) |
| GET | `/api/stats` | Global stats (range: 24h, 7d, all) |
| GET | `/api/providers/:id/stats` | Provider-specific stats |
| GET | `/api/license-status` | Activation/license status |
| POST | `/api/check-activation` | Trigger manual activation check |

### WebSocket
| Endpoint | Description |
|----------|-------------|
| `/ws/logs` | Real-time log updates + notification broadcasts |

### Proxy
| Endpoint | Description |
|----------|-------------|
| `POST /proxy/{providerId}/*` | Main proxy endpoint (all AI requests) |

---

## Support & Developer Info

**ClawProxy** is developed and maintained by **Malek-Rsh**.

- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
