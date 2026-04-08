# Circuit Breaker

Automatic health monitoring that prevents cascading failures by temporarily stopping requests to a failing provider.

> **Version 1.0.12**

---

## How It Works

If a provider accumulates too many failures within a time window, the circuit breaker "opens" and ClawProxy stops sending requests to that provider. Instead, requests are routed directly to the fallback chain. After a cooldown period, the circuit breaker tests recovery with a single request.

---

## Thresholds

All thresholds are configurable via the **Settings** page in the sidebar.

| Parameter | Default | Configurable |
|-----------|---------|--------------|
| **Failure Threshold** | 5 failures | Yes |
| **Failure Window** | 60 seconds | No |
| **Cooldown Duration** | 30 seconds | Yes |
| **Recovery Test** | 1 request | No |

---

## States

| State | Meaning | Behavior |
|-------|---------|----------|
| **CLOSED** | Normal operation | All requests go to this provider |
| **OPEN** | Provider failed (threshold reached) | Requests skip this provider, go directly to fallback chain |
| **HALF_OPEN** | Testing recovery after cooldown | One test request sent; success > CLOSED, failure > OPEN |

---

## Key Behaviors

- Only triggers on **provider-level failures** (all keys exhausted), not single-key errors.
- Resets on proxy restart (in-memory by design).
- Can be manually reset from the provider's **Settings** tab.
- Fires **Circuit Open** notification when tripping, **Recovered** notification when closing.

---

## Manual Reset

1. Open the provider's **Settings** tab.
2. If the circuit breaker is not in the `CLOSED` state, you will see:
   - The current state badge (**OPEN** = red, **HALF_OPEN** = amber)
   - The failure count
   - A **Reset** button
3. Click **Reset**.
4. The circuit breaker returns to the **CLOSED** state, and normal routing resumes immediately.

---

## Frequently Asked Questions

### Circuit breaker keeps tripping (OPEN)?
The provider is consistently failing (default: 5+ failures in 60 seconds). Possible solutions:
1. Check the provider's status -- it may be genuinely down.
2. Verify your API keys are valid.
3. Check for rate limiting across all keys.
4. Increase the circuit breaker threshold in **Settings** if the current value is too sensitive.
5. Manually reset after the issue resolves.

### Requests going to fallback even though provider seems healthy?
The circuit breaker might be OPEN from a recent failure burst. Check the circuit breaker status in the Settings tab and click **Reset** to force it back to CLOSED.

### Does it reset when the proxy restarts?
Yes. The circuit breaker is in-memory and resets to CLOSED on every restart. This is by design -- no stale state persists.

### Does the circuit breaker state lost after restart?
Expected behavior. The circuit breaker is in-memory by design and resets to CLOSED on every restart. This ensures no stale state persists.
