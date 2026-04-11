# Error Classification & Retry Cascade

ClawRouter classifies upstream errors to determine the correct recovery action. Each error type triggers a specific behavior in the retry cascade.

> **Version 1.0.12**

---

## Error Classification Reference

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

---

## Retry Cascade (Exact Order)

When a request fails, ClawRouter follows this exact retry cascade:

1. **REQUEST_ERROR** (400/413/422/499) > Return to client immediately (will fail with any key).
2. **OVERLOADED** (503/529) > Wait 2 seconds, retry same key (up to 2 inner retries).
3. **MODEL_ERROR** (404/400/401 with model patterns) > Try next model from provider_models if model_fallback_enabled (same key).
4. **AUTH_ERROR / RATE_LIMIT / SERVER_ERROR / TIMEOUT / NETWORK_ERROR** > Try next key.
5. **All keys exhausted** > Trigger Provider Fallback Chain (tried in priority order).
6. **All fallback providers exhausted** > Return error to client.

---

## Key Backoff & Error Handling Summary

| Error Type | Key Action | Backoff Duration | Notification |
|------------|-----------|-----------------|-------------|
| **Rate Limit** (429, Groq 498) | Temporary cooldown | 60 seconds (configurable) | Key Rate Limited |
| **Auth Error** (401, 402, 403) | Permanently disabled | Permanent | Key Disabled |
| **Overloaded** (503, 529) | Retry same key | 2 seconds (up to 2 retries) | None |
| **Model Error** | No key action | N/A | Model Fallback (if enabled) |
| **Request Error** (400, 413, 422) | No key action | N/A | None |
| **Server Error** (500, 502) | Try next key | N/A | None |
| **Timeout** (504, 408) | Try next key (if retry_on_timeout) | N/A | None |
| **Network Error** | Try next key | N/A | None |

---

## Provider-Specific Quirks

Some providers return non-standard HTTP status codes that ClawRouter handles specially:

| Provider | Quirk | How ClawRouter Handles It |
|----------|-------|-------------------------|
| **OpenCode.ai** | Returns HTTP 401 for unsupported models (body: "ModelError") | Classified as MODEL_ERROR, not AUTH_ERROR. Key is not disabled. |
| **Kilo.ai** | Returns HTTP 401 for non-free models when no auth (body: "PAID_MODEL_AUTH_REQUIRED") | Classified as MODEL_ERROR. |
| **Google Gemini** | Returns HTTP 400 for invalid API keys (body: "API_KEY_INVALID") | Classified as AUTH_ERROR. Key is disabled. |
| **MiniMax** | Returns HTTP 200 for most errors with custom status codes in body | Parsed from response body (1004/2049/1008 = AUTH_ERROR, 1002/2045/2056 = RATE_LIMIT). |
| **Anthropic** | Uses custom HTTP 529 for overloaded | Classified as OVERLOADED. |
| **Groq** | Uses custom HTTP 498 for flex tier capacity | Classified as RATE_LIMIT. |
