# Key Rotation

ClawRouter allows you to add **multiple API keys to the same provider**. When one key hits a rate limit or fails, the next key is used instantly and transparently.

> **Version 1.0.14**

---

## How Key Rotation Works

### Rotation Strategies

| Strategy | Behavior | Best For |
|----------|----------|----------|
| **On Error** (default) | Uses the highest-priority key until it fails, then rotates | Maximizing usage of a primary key |
| **Round Robin** | Distributes requests evenly across keys (configurable requests per key) | Load balancing free-tier keys |

### On Error Strategy

- Always uses the highest-priority (first) eligible key.
- Only rotates when the current key encounters an error.
- Rate-limited keys enter cooldown (default 60s, configurable). Next key used immediately.
- Auth error keys are permanently disabled. Next key used.

### Round Robin Strategy

- Rotates evenly across all eligible keys.
- After `requests_per_key` requests (default: 1), rotates to the next key.
- After the last key, wraps back to the first.
- On error, same backoff/disable behavior as On Error mode applies.

---

## Error Handling by Type

| Error | HTTP Status | Key Action |
|-------|-------------|------------|
| **Rate Limit** | 429 | Key enters cooldown (default 60 seconds, configurable in **Settings**). Next key used immediately. |
| **Quota Exhausted** (window quota) | 429, 403, 400, 401 | Key backed off until the quota window resets (default cap 1800 seconds, `quota_backoff_s`). **Never disabled** -- recovers automatically. Next key used. |
| **Auth Error** | 401, 402, hard-billing bodies | Key is permanently disabled. Next key used. |
| **Overloaded** | 503, 529 | Retries the same key after 2-second wait (up to 2 retries, configurable in **Settings**). |
| **Model Error** | varies | Handled by Model Fallback (same key, different model). |
| **Request Error** | 400, 413, 422 | Returned to client immediately (affects all keys equally). |
| **Server/Timeout/Network Error** | varies | Tries next key. |

---

## Key Status Indicators

| Status | Badge | Meaning |
|--------|-------|---------|
| **Active** | Green | Key is operational |
| **Unstable** | Amber | Key has >3 consecutive errors but is not disabled |
| **Disabled** | Red | Key permanently disabled due to auth errors |

---

## Key Error History

Each key tracks the last 50 errors. To view:

1. Open the provider's **API Keys** tab.
2. Find the key with errors -- an **error count badge** (red number) appears next to it.
3. Click the error count badge.
4. The **Error History** modal opens showing:
   - Error type (Rate Limit, Auth Error, Server Error, etc.)
   - HTTP status code
   - Error message
   - Timestamp

---

## Key Priority

Keys are used in priority order. The first key in the list has highest priority.

- Use the **up/down arrows** to reorder keys in the API Keys tab.
- Add a **label** to each key for easy identification (e.g., "Free tier key #1") -- labels are editable inline.
- Keys show individual stats: total requests, successful, failed, last used, and last error.

---

## Connection Testing

Every key can be tested. ClawRouter runs a free `/models` check (where available) **followed by a 1-token generation probe** (`max_tokens: 1`) -- the `/models` 200 alone only proves the key authenticates, not that the account can actually generate.

- **Per-key test**: click the test button on any key row. The result -- success or error -- is persisted and shown in the **Last Test** column along with a **latency badge**.
- **Test All Keys**: tests every enabled key sequentially; you can stop mid-run with **Stop Testing**.
- **Test before save**: the Add API Key form can test a key before you commit it.

**How results are interpreted:**

| Probe Result | Meaning |
|-------------|---------|
| 401 / 403 | Key invalid -- the upstream rejected the credential. The key is **auto-disabled** |
| 402 / hard-billing body ("insufficient balance", `insufficient_quota`, Z.AI 1113) | Key invalid -- "recharge required". The key is **auto-disabled** |
| Window-quota body (Kimi `access_terminated`, "usage limit", "billing cycle", Z.AI 1308-1321) | Key **valid** -- the quota window is full but recovers at the reset (soft warning) |
| Transient 429 / gated probe model | Key **valid** -- soft warning names the cause |
| Other non-auth statuses | Key accepted (e.g., 400/404 on the probe still prove the credential works) |

---

## Key Retry Mode (Global Setting)

Configured in the **Settings** page in the sidebar:

| Mode | Behavior |
|------|----------|
| **All** (default) | Try every available key before giving up and triggering the fallback chain |
| **Fixed** | Try at most `key_retry_limit` keys (default: 5), then trigger the fallback chain |

The **Fixed** mode is useful when you have many keys (e.g., 50+) but want faster failover to a fallback provider.

---

## Frequently Asked Questions

### Can I add multiple API keys to the same provider?
Yes, this is one of ClawRouter's core features. Add as many keys as you want. ClawRouter rotates between them automatically when errors occur, effectively combining their quotas into one stable connection.

### Why was my API key permanently disabled?
ClawRouter permanently disables a key when it receives a **hard auth/billing error** (invalid credential, HTTP 402, "credit balance too low" style bodies). This means the key is invalid, expired, revoked, or out of money. Check the Error History for details. You can re-enable it manually from the API Keys tab if you believe it was a transient issue.

### A key shows errors but is still active -- why?
ClawRouter only permanently disables keys on **hard auth/billing errors**. For rate limits, server errors, and timeouts, the key enters a temporary cooldown or backoff (default 60 seconds, configurable via the **Settings** page) and continues rotating normally. **Quota-window exhaustion** (Kimi Coding 5-hour/weekly cycles) backs the key off until the window resets -- the key is never disabled and recovers automatically.

### All keys in cooldown at the same time?
Add more keys to the pool, switch to Round Robin rotation to distribute load, or reduce request frequency from your client. Cooldowns expire automatically after the backoff period.
