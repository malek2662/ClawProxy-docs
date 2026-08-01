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

Zero-token probes -- a free `/models` listing where available, else a `max_tokens: 1` request. Returns `{ valid, latencyMs, status?, error?, errorType?, softWarning? }`. HTTP 402 = valid with quota soft warning; 401/403 = invalid.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/providers/:id/test` | Test provider connection. Uses the first eligible key in managed mode, keyless otherwise. Accepts optional `{ "key_value": "..." }` to test an unsaved key (test-before-save) |
| POST | `/api/providers/:id/keys/:keyId/test` | Test one key; persists `test_status`, `test_latency_ms`, `tested_at`, `last_test_error` on the key row |
| POST | `/api/providers/:id/keys/test-all` | Test all enabled keys sequentially; persists each result. Returns `{ results: [...] }` |

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
