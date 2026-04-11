# Global Settings

Step-by-step guide for configuring system-wide proxy behavior: key retry strategy, rate limit backoff, circuit breaker thresholds, and log retention.

> **Version 1.0.12**

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
| **Circuit Breaker Threshold** | `5` | Number of provider-level failures within the time window before the circuit opens. |
| **Circuit Breaker Cooldown** | `30` seconds | How long before a tripped circuit enters the half-open state for a recovery test. |

### Log Retention

| Setting | Default | Description |
|---------|---------|-------------|
| **Auto Cleanup Logs** | Enabled | Toggle automatic cleanup of old request logs. |
| **Log Retention Days** | `7` | Number of days to keep logs before auto-cleanup removes them. |

4. Click **Save Settings**.
5. Changes take effect immediately -- no restart required.

---

## When to Use Fixed Key Retry Mode

If you have many API keys (e.g., 50+) but want faster failover to a fallback provider, switch Key Retry Mode to `Fixed` with a lower limit (e.g., 5-10). This prevents ClawRouter from trying every single key before moving to the fallback chain.

- **All** (default): On failure, ClawRouter tries every available key for the provider before giving up.
- **Fixed**: ClawRouter tries up to the configured **Key Retry Limit** number of keys, then triggers the fallback chain.
