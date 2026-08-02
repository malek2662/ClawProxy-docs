# API Reference

ClawRouter exposes a RESTful API for managing providers, keys, models, and settings programmatically. All endpoints are available at `http://localhost:3030`.

> **Version 1.0.14**

---

## Provider Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | List all providers with key/today stats |
| POST | `/api/providers` | Create a new provider. Accepts optional `models[]` (`{id,name}` or `{model_id,display_name}`) to seed the Models tab, and optional `default_headers` (object of strings) |
| GET | `/api/providers/:id` | Get single provider details |
| PUT | `/api/providers/:id` | Update provider settings (`default_headers: null` clears static headers) |
| DELETE | `/api/providers/:id` | Delete provider (cascades) |
| PATCH | `/api/providers/:id/toggle` | Toggle enabled/disabled |

---

## Connection Testing

Every test runs a free `/models` check **followed by a 1-token generation probe** (`max_tokens: 1`) -- the `/models` 200 alone only proves authentication, not usable credit. Returns `{ valid, latencyMs, status?, error?, errorType?, softWarning? }`. 401/403 and hard billing (402, "insufficient balance" / `insufficient_quota` -- reported as "recharge required") = invalid; window-quota, transient 429, and gated probe models = valid with a soft warning.

Key-level tests **auto-disable** a key when the test proves it definitively invalid (`!valid` + `errorType: "AUTH_ERROR"` -- bad/expired key or hard billing), via the same record-error path as real traffic; the response gains `auto_disabled: true`. Never disabled on transient/network/timeout, rate limits, window quota, or content-moderation rejections. Re-testing an already-disabled key reports `auto_disabled: true` without re-firing the notification. The provider-level test does **not** disable keys.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/providers/:id/test` | Test provider connection. Uses the first eligible key in managed mode, keyless otherwise. Accepts optional `{ "key_value": "..." }` to test an unsaved key (test-before-save). Does not disable keys |
| POST | `/api/providers/:id/keys/:keyId/test` | Test one key; persists `test_status`, `test_latency_ms`, `tested_at`, `last_test_error` on the key row. Auto-disables on a definitive invalid verdict (adds `auto_disabled: true`) |
| POST | `/api/providers/:id/keys/test-all` | Test all enabled keys sequentially; persists each result, same auto-disable rule per key. Returns `{ results: [...] }` (per-item `auto_disabled` flag) |

---

## API Key Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/keys` | List all keys for provider |
| POST | `/api/providers/:id/keys` | Add a single key (400 if the provider's API Key Mode is `none`) |
| POST | `/api/providers/:id/keys/bulk` | Bulk add keys (newline-separated) |
| PUT | `/api/providers/:id/keys/:keyId` | Update key (label, priority) |
| DELETE | `/api/providers/:id/keys/:keyId` | Delete key |
| PATCH | `/api/providers/:id/keys/:keyId/toggle` | Toggle key enabled/disabled |
| PATCH | `/api/providers/:id/keys/:keyId/reset` | Reset key stats to zero |
| POST | `/api/providers/:id/keys/reorder` | Reorder key priorities |
| GET | `/api/providers/:id/keys/:keyId/errors` | Get last 50 errors for key |

---

## Provider Fallback Chain

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fallbacks` | List ALL fallback rows across providers, ordered by provider_id + priority (powers the global Fallback page) |
| GET | `/api/providers/:id/fallbacks` | List fallback entries |
| POST | `/api/providers/:id/fallbacks` | Add fallback entry (`fallback_model_id: null` = Automatic) |
| PUT | `/api/providers/:id/fallbacks/:fbId` | Update fallback entry |
| DELETE | `/api/providers/:id/fallbacks/:fbId` | Delete fallback entry |
| POST | `/api/providers/:id/fallbacks/reorder` | Reorder fallback chain |

---

## Model Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/models` | List saved models |
| POST | `/api/providers/:id/models` | Add a model |
| POST | `/api/providers/:id/models/bulk` | Bulk add models (`{ models: [{ model_id, display_name? }] }`) |
| DELETE | `/api/providers/:id/models/:modelId` | Delete a model |
| POST | `/api/providers/:id/models/reorder` | Reorder model priorities |
| POST | `/api/providers/:id/models/fetch` | Fetch models from upstream. Returns `{ models, fetched_at, cached }`. 5-min in-memory cache; `?force=1` bypasses. Cache invalidated on key add/delete/toggle |

---

## Model Circuits & Usage

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/model-circuits` | Open model circuits for the provider. Returns `[{ model_id, failures, remaining_s, last_error_type }]` -- powers the Models-tab "Skipped" badges |
| GET | `/api/providers/:id/usage` | Provider quota/usage probe (Kimi Coding, Z.AI GLM Coding). Uses the first eligible key, falling back to **any** enabled key when all are quota-backed-off. Returns `{ supported, membership, region, parallelLimit, disabled, windows: [{ kind, label, limit, used, remaining, resetTime, exhausted }], billing: { usedCents, limitCents, currency, exhausted } \| null }`. Returns `{ supported: false }` for providers without a known usage endpoint |
| GET | `/api/providers/:id/usage?all=1` | Probes **every enabled key** in parallel (each key is a separate quota account) -- powers the provider **Quota tab**. Returns `{ supported, keys: [{ key_id, label, hint, usage \| null, invalid? }] }` |

Both usage modes **auto-disable definitively rejected keys**: the rejection runs through the same error classification as real traffic and only an auth-error outcome (401/403, hard-billing codes) disables the key (disable + error history + `key_disabled` notification). Network failures, transient 5xx, rate limits, window-quota rejections, and no-plan payloads never disable. Z.AI's HTTP-200 `{"code":1000,"msg":"Authentication Failed"}` dead-key envelope is detected and treated like a real 401.

---

## Circuit Breaker

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/circuit-status` | Get circuit breaker state |
| POST | `/api/providers/:id/circuit-reset` | Reset circuit breaker |

---

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List all notifications |
| POST | `/api/notifications/:id/read` | Mark as read |
| DELETE | `/api/notifications` | Clear all notifications |

---

## Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/logs` | List logs (paginated, filterable) |
| GET | `/api/logs/clients` | List distinct client names seen in logs (powers the client filter) |
| GET | `/api/logs/:id` | Get single log detail |
| GET | `/api/logs/:id/raw` | Get parsed raw request/response headers and bodies for a log |
| DELETE | `/api/logs` | Clear all logs |

---

## Global Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all global settings |
| PUT | `/api/settings` | Update global settings (includes `proxy_auth_enabled` -- toggle proxy API key requirement on `/proxy/*`, default `true`) |

---

## Proxy API Key

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/proxy-key` | Get the proxy API key and auth state. Returns `{ key, enabled }` |
| POST | `/api/settings/proxy-key/regenerate` | Generate a new proxy API key. Returns `{ key, enabled }`. The old key stops working immediately |

---

## System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (status, uptime) |
| GET | `/api/stats` | Global stats (range: 24h, 7d, all). `today.estimated_cost` = sum of request costs since local midnight |
| GET | `/api/providers/:id/stats` | Provider-specific stats |
| GET | `/api/license-status` | Activation/license status |
| POST | `/api/check-activation` | Trigger manual activation check |

---

## WebSocket

| Endpoint | Description |
|----------|-------------|
| `/ws/logs` | Real-time log updates + notification broadcasts |

---

## Proxy

| Endpoint | Description |
|----------|-------------|
| `POST /proxy/{providerId}/*` | Main proxy endpoint (all AI requests) |

Requests require the **proxy API key** by default -- sent as `Authorization: Bearer <key>` (OpenAI style) or `x-api-key: <key>` (Anthropic style). Requests without a valid key get HTTP 401. The key is shown in the dashboard under **Settings > Proxy API Key**. The requirement can be toggled via the `proxy_auth_enabled` global setting (`PUT /api/settings`).
