# API Reference

ClawRouter exposes a RESTful API for managing providers, keys, models, and settings programmatically. All endpoints are available at `http://localhost:3030`.

> **Version 1.0.12**

---

## Provider Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | List all providers with key/today stats |
| POST | `/api/providers` | Create a new provider |
| GET | `/api/providers/:id` | Get single provider details |
| PUT | `/api/providers/:id` | Update provider settings |
| DELETE | `/api/providers/:id` | Delete provider (cascades) |
| PATCH | `/api/providers/:id/toggle` | Toggle enabled/disabled |

---

## API Key Management

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

---

## Provider Fallback Chain

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/fallbacks` | List fallback entries |
| POST | `/api/providers/:id/fallbacks` | Add fallback entry |
| PUT | `/api/providers/:id/fallbacks/:fbId` | Update fallback entry |
| DELETE | `/api/providers/:id/fallbacks/:fbId` | Delete fallback entry |
| POST | `/api/providers/:id/fallbacks/reorder` | Reorder fallback chain |

---

## Model Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers/:id/models` | List saved models |
| POST | `/api/providers/:id/models` | Add a model |
| DELETE | `/api/providers/:id/models/:modelId` | Delete a model |
| POST | `/api/providers/:id/models/reorder` | Reorder model priorities |
| POST | `/api/providers/:id/models/fetch` | Fetch models from upstream |

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
| GET | `/api/logs/:id` | Get single log detail |
| DELETE | `/api/logs` | Clear all logs |

---

## Global Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all global settings |
| PUT | `/api/settings` | Update global settings |

---

## System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check (status, uptime) |
| GET | `/api/stats` | Global stats (range: 24h, 7d, all) |
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
