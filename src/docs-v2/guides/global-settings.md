# Global Settings

Step-by-step guide for configuring system-wide proxy behavior: key retry strategy, rate limit backoff, circuit breaker thresholds, and log retention.

> **Version 1.0.17**

---

## Configure Global Settings

**Goal:** Adjust system-wide proxy behavior.

1. Click **Settings** in the sidebar.
2. The **Global Settings** page displays all configurable options with their current values.
3. Adjust the settings you want to change:

### Key Retry Behavior

| Setting | Default | Description |
|---------|---------|-------------|
| **Key Retry Mode** | `All` | `All` = try every key before giving up. `Fixed` = try up to a limit. |
| **Key Retry Limit** | `5` | When mode is `Fixed`, the maximum number of keys to try per request before triggering the fallback chain. |

### Rate Limit & Circuit Breaker

| Setting | Default | Description |
|---------|---------|-------------|
| **Rate Limit Backoff** | `60` seconds | How long a key is put on cooldown after a rate limit error. |
| **Quota Backoff** | `1800` seconds | Fallback backoff for window-quota exhaustion (Kimi Coding 5-hour/weekly/monthly cycles, Z.AI 5-hour/7-day windows) when no exact reset time is known. When ClawRouter knows the key's actual window reset (per-key quota snapshot, usage probe, or monthly-cycle anchor), that exact time is used instead. The key is never disabled -- it recovers at the window reset. |
| **Circuit Breaker Threshold** | `5` | Number of provider-level failures within the time window before the circuit opens. |
| **Circuit Breaker Cooldown** | `30` seconds | How long before a tripped circuit enters the half-open state for a recovery test. |
| **Model Circuit Threshold** | `2` | Consecutive failures before a model is skipped entirely (routed straight to the next fallback model). |
| **Model Circuit Permanent Cooldown** | `1800` seconds | Model-skip cooldown for not-found/invalid/gated model errors. |
| **Model Circuit Transient Cooldown** | `120` seconds | Model-skip cooldown for overloaded/rate-limited model failures. |

### Log Retention

| Setting | Default | Description |
|---------|---------|-------------|
| **Auto Cleanup Logs** | Enabled | Toggle automatic cleanup of old request logs. |
| **Log Retention Days** | `7` | Number of days to keep logs before auto-cleanup removes them. |

4. Click **Save Settings**.
5. Changes take effect immediately -- no restart required.

---

## Proxy API Key

All requests to `/proxy/*` require a **proxy API key** by default. This is separate from your upstream provider keys -- it authenticates your AI clients to ClawRouter itself.

The key is managed from the **Proxy API Key** card on the **Settings** page:

- **Key format:** `cr_` followed by 48 hex characters. Auto-generated on first use and stored locally.
- **Copy:** Click **Copy** to copy the full key.
- **Regenerate:** Click **Regenerate** to issue a new key. The old key is **invalidated immediately** -- update all configured clients afterwards.
- **Require proxy API key toggle:** On by default. Turning it off restores the old behavior where any key value is accepted (not recommended).

**How clients send the key:**

| Client Style | Header |
|--------------|--------|
| OpenAI style | `Authorization: Bearer <key>` |
| Anthropic style | `x-api-key: <key>` |

Requests without a valid key get HTTP 401 with the error body shaped in the client's API format: "Invalid or missing API key. Use the proxy API key from the ClawRouter dashboard (Settings > Proxy API Key)."

> **Note:** The **"Prompt for AI"** dialog embeds your real proxy key in its generated templates automatically -- no manual copying needed.

> **Dashboard API is unchanged:** The admin API (`/api/*`) still uses the dashboard password session token, not the proxy key.

> **Pass Through limitation:** Providers with API Key Mode **Pass Through** forward the client's credential to the upstream provider. With proxy auth enabled, that credential is the proxy key -- not a valid upstream key. Pass Through mode and proxy auth are effectively incompatible; use **Managed** or **None** mode for such providers.

---

## Appearance (Provider Icon Style)

Providers show **real brand icons** across the dashboard (provider cards, detail pages, fallback chains). The **Appearance** card on the **Settings** page controls how those icons are rendered:

| Style | Description |
|-------|-------------|
| **Color** (default) | Full brand colors |
| **Mono** | Single-tone glyphs that follow the dashboard text color |

The toggle applies **instantly** and is remembered **per browser** (stored in local storage on this device -- it does not sync to other browsers or machines). Brands that have no color variant render mono in both modes, and unmapped/custom providers fall back to a 2-letter brand-color tile.

---

## When to Use Fixed Key Retry Mode

If you have many API keys (e.g., 50+) but want faster failover to a fallback provider, switch Key Retry Mode to `Fixed` with a lower limit (e.g., 5-10). This prevents ClawRouter from trying every single key before moving to the fallback chain.

- **All** (default): On failure, ClawRouter tries every available key for the provider before giving up.
- **Fixed**: ClawRouter tries up to the configured **Key Retry Limit** number of keys, then triggers the fallback chain.
