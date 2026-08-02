# Error Classification & Retry Cascade

ClawRouter classifies upstream errors to determine the correct recovery action. Each error type triggers a specific behavior in the retry cascade.

> **Version 1.0.14**

---

## Error Classification Reference

| Error Type | HTTP Status | Body Patterns | Recovery Action |
|------------|-------------|---------------|-----------------|
| **AUTH_ERROR** | 401, 402, 403 (no model/subscription patterns) | API_KEY_INVALID, FAILED_PRECONDITION, hard-billing bodies ("credit balance", "insufficient balance"), 429 with `insufficient_quota`, Z.AI codes 1000-1005 / 1113 / 1309 / 1314 / 1315 | Disable key permanently, try next key |
| **QUOTA_EXHAUSTED** | 429, 403, 400, 401 | Window-quota bodies: "usage limit", "access_terminated", "billing cycle", "quota will be refreshed", "quota exceeded", "usage_limit_reached"; Z.AI codes 1308 / 1310 / 1316-1321 | Long backoff on key (`quota_backoff_s`, default 1800s), **never disabled**, try next key |
| **RATE_LIMIT** | 429 (transient bodies), 498 (Groq) | Rate limit patterns | 60s backoff on key, try next key |
| **MODEL_ERROR** | 404, 400, 401, 403 | "model", "ModelError", "PAID_MODEL_AUTH_REQUIRED", "requires a subscription" | Try next model (if enabled), then next key |
| **OVERLOADED** | 503, 529 (Anthropic) | "overloaded", "capacity", "resource exhausted" | Wait 2s, retry same key (up to 2x) |
| **REQUEST_ERROR** | 400, 413, 422, 499 | Bad format, too large, unprocessable | Return to client immediately |
| **SERVER_ERROR** | 500, 502, 503 (non-overload) | Server-side transient | Try next key |
| **TIMEOUT** | 504, 408, timeout/AbortError | Network timeout | Try next key (if retry_on_timeout) |
| **NETWORK_ERROR** | Other | Connection failures | Wait 1s, retry same key (up to 3x), then exhaust to fallback |

---

## Retry Cascade (Exact Order)

When a request fails, ClawRouter follows this exact retry cascade:

1. **REQUEST_ERROR** (400/413/422/499) > Return to client immediately (will fail with any key).
2. **OVERLOADED** (503/529) > Wait 2 seconds, retry same key (up to 2 inner retries).
3. **MODEL_ERROR** (404/400/401/403 with model or subscription patterns) > Try next model from provider_models if model_fallback_enabled (same key). Repeated model failures trip the **model circuit breaker**, after which the model is skipped entirely -- see Model Fallback.
4. **AUTH_ERROR / QUOTA_EXHAUSTED / RATE_LIMIT / SERVER_ERROR / TIMEOUT / NETWORK_ERROR** > Try next key.
5. **All keys exhausted** > Trigger Provider Fallback Chain (tried in priority order).
6. **All fallback providers exhausted** > Return error to client.

---

## Key Backoff & Error Handling Summary

| Error Type | Key Action | Backoff Duration | Notification |
|------------|-----------|-----------------|-------------|
| **Rate Limit** (429, Groq 498) | Temporary cooldown | 60 seconds (configurable) | Key Rate Limited |
| **Quota Exhausted** (window quota: Kimi Coding 5h/weekly cycles) | Long cooldown -- **never disabled** | Until the actual window reset, capped at `quota_backoff_s` (default 1800s, configurable) | Key Rate Limited |
| **Auth Error** (401, 402, hard-billing bodies) | Permanently disabled | Permanent | Key Disabled |
| **Overloaded** (503, 529) | Retry same key | 2 seconds (up to 2 retries) | None |
| **Model Error** | No key action | N/A | Model Fallback (if enabled) |
| **Request Error** (400, 413, 422) | No key action | N/A | None |
| **Server Error** (500, 502) | Try next key | N/A | None |
| **Timeout** (504, 408) | Try next key (if retry_on_timeout) | N/A | None |
| **Network Error** | Retry same key (up to 3x) | 1 second between retries | None |

---

## Window Quota vs Hard Billing

Two kinds of "out of quota" errors exist, and ClawRouter treats them very differently:

- **Window quota (QUOTA_EXHAUSTED)** -- self-resetting cycles: Kimi Coding's 5-hour/weekly/monthly windows, Z.AI's 5-hour/7-day windows (codes 1308/1310/1316-1321), OpenAI monthly quota. The key is valid; its quota window is simply full. The key enters a **long backoff** and is **never disabled**. ClawRouter probes the provider's usage endpoint for the actual reset time (Kimi Coding: `GET {base}/usages`) and backs off until that time, capped at `quota_backoff_s` (default 1800 seconds, configurable in **Settings**). It recovers automatically when the window resets.
- **Hard billing (AUTH_ERROR)** -- the account has no money left: HTTP 402, "credit balance too low", MiniMax `insufficient_balance`, Z.AI code 1113 / `insufficient_quota` (a 429!). These disable the key permanently, like any auth error.

The distinction matters because window-quota errors often arrive on auth-looking statuses -- **Kimi Coding returns HTTP 403 `access_terminated_error`, not 429** -- and naively treating every 403 as an auth error would disable a perfectly good key.

---

## Provider-Specific Quirks

Some providers return non-standard HTTP status codes that ClawRouter handles specially:

| Provider | Quirk | How ClawRouter Handles It |
|----------|-------|-------------------------|
| **OpenCode.ai** | Returns HTTP 401 for unsupported models (body: "ModelError") | Classified as MODEL_ERROR, not AUTH_ERROR. Key is not disabled. |
| **Kilo.ai** | Returns HTTP 401 for non-free models when no auth (body: "PAID_MODEL_AUTH_REQUIRED") | Classified as MODEL_ERROR. |
| **Ollama Cloud** | Returns HTTP 403 "this model requires a subscription, upgrade for access" for plan-gated models | Classified as MODEL_ERROR. The free-tier key stays enabled; model fallback and the model circuit apply. |
| **Kimi Coding** | Returns HTTP 403 `access_terminated_error` (not 429) when a 5-hour, weekly, or monthly quota window is full | Classified as QUOTA_EXHAUSTED. Key backed off until the actual window reset (probed from the usage endpoint), never disabled. |
| **Z.AI** | Puts a numeric-string **business code** in `error.code` that beats the HTTP status -- hard billing, window quotas, model gating, and rate limits all ride on 429 | Code-driven classification (table below). A 429 can disable the key (1113), back it off (1308-1321), or just rate-limit it (1302/1313). |
| **Google Gemini** | Returns HTTP 400 for invalid API keys (body: "API_KEY_INVALID") | Classified as AUTH_ERROR. Key is disabled. |
| **MiniMax** | Returns HTTP 200 for most errors with custom status codes in body | Parsed from response body (1004/2049/1008 = AUTH_ERROR, 1002/2045/2056 = RATE_LIMIT). |
| **Anthropic** | Uses custom HTTP 529 for overloaded | Classified as OVERLOADED. |
| **Groq** | Uses custom HTTP 498 for flex tier capacity | Classified as RATE_LIMIT. |

### Z.AI Business Codes

Z.AI returns a numeric-string code in `error.code` that overrides the HTTP status (almost everything arrives as 429). ClawRouter classifies by code, per Z.AI's published error table:

| Code | Meaning | Classification | Key Action |
|------|---------|----------------|------------|
| 1113 | Insufficient balance (hard billing) | AUTH_ERROR | **Disabled** -- recharge required |
| 1308, 1310, 1316-1321 | Self-resetting 5-hour / 7-day quota windows | QUOTA_EXHAUSTED | Long backoff, **never disabled** |
| 1309, 1314, 1315 | Expired / wrong plan | AUTH_ERROR | **Disabled** |
| 1311 | Plan doesn't include the model | MODEL_ERROR | Model fallback |
| 1302, 1313 | Rate limit | RATE_LIMIT | 60s backoff |
| 1305 | Overloaded | OVERLOADED | Retry same key |
| 1211 | Unknown model | MODEL_ERROR | Model fallback |

> **Dead-key trap:** Z.AI's monitor endpoint returns **HTTP 200** with `{"code":1000,"msg":"Authentication Failed","success":false}` for a dead key. ClawRouter detects this envelope (auth-family codes 1000-1005, with or without the message) and treats it exactly like a real 401.
