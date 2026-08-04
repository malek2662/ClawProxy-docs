# Monitoring & Notifications

Step-by-step guides for monitoring proxy activity through notifications, request logs, and usage stats.

> **Version 1.0.15**

---

## Monitor Events with Notifications

**Goal:** Stay informed about key rotation, circuit breaker, and fallback events.

1. Look at the **Bell icon** in the sidebar. A red badge shows the count of unread notifications.
2. Click the bell to open the notification panel.
3. Each notification shows:
   - **Type badge** (color-coded by severity)
   - **Message** (human-readable description of what happened)
   - **Timestamp**
4. Click any notification to navigate directly to the relevant provider tab -- key events open the **API Keys** tab, model fallback opens **Models**, provider fallback opens **Fallback**, circuit events open **Settings**.
5. Click **Mark All as Read** to clear the badge count.
6. Click **Clear All** to remove all notifications.

### Notification Types

| Type | Badge Color | Trigger | Severity |
|------|------------|---------|----------|
| **Key Disabled** | Red | Key permanently disabled due to a hard auth/billing error | Critical |
| **Rate Limited** | Yellow | Key entered cooldown after a rate limit (429) or quota-window exhaustion | Warning |
| **Circuit Open** | Red | Provider circuit breaker tripped (5 failures in 60s) | Critical |
| **Recovered** | Green | Provider recovered after circuit breaker cooldown | Info |
| **All Keys Failed** | Red | Every key for a provider failed | Critical |
| **Model Fallback** | Blue | Model error triggered automatic switch to next model | Info |
| **Model Circuit Open** | Amber | A model failed repeatedly and is now being skipped (model circuit breaker) | Warning |
| **Provider Fallback** | Yellow | Provider failure triggered switch to fallback provider | Warning |

### Notification Throttling

Condition-style notifications that would otherwise fire **per request** while a failure persists -- **Rate Limited**, **All Keys Failed**, **Model Fallback**, **Provider Fallback** -- are deduplicated: the first one fires immediately and identical repeats are suppressed for **5 minutes** while the condition persists. Transition events (**Key Disabled**, **Circuit Open**, **Model Circuit Open**, **Recovered**) fire once by nature and are never throttled. Clearing all notifications also resets the throttle state.

> **Note:** Notifications are in-memory (last 100 events) and cleared on restart. This is by design -- they are a real-time alerting system, not a log replacement. Use the **Logs** section for persistent history.

---

## View and Filter Logs

**Goal:** See all proxy requests and their results.

1. Click **Logs** in the sidebar.
2. The log list loads with the most recent requests first.
3. A green **"Live"** indicator shows real-time WebSocket connection -- new logs appear automatically.
4. Use the **filters** to narrow down:
   - **Provider**: Select a specific provider or "All"
   - **Status**: All, Success, Error, Pending, Timeout
   - **Model**: Type a model name to search
5. Navigate through pages using the pagination controls (50 logs per page).
6. Click any log row to expand and see full request/response details.
7. To clear all logs: click **Clear Logs** > confirm in the dialog.

### What Each Log Entry Shows

- Provider badge and model badge (always visible)
- HTTP method
- Response status code
- Duration (ms)
- Timestamp
- Full request/response details (expandable)

### Model Fallback Visibility

When a model fallback hop served the request (the originally requested model failed and a fallback model answered), the log row carries the requested model ID:

- The log table shows an amber **"requested > served"** badge on the model column.
- The log detail drawer header shows the same amber **requested > served** model badge next to the provider badge.
- The drawer's **Info** tab includes a **Model Fallback** card listing the requested and served model IDs.

### Log Persistence

Logs are stored in the SQLite database and survive restarts. Old logs are automatically cleaned up after 7 days by default. You can adjust the retention period and toggle auto-cleanup on/off from the **Settings** page in the dashboard.

---

## Dashboard Stats

The main dashboard provides an overview of proxy activity:

**Stats Row 1:** Requests Today, Success Rate, Active Providers, Active Keys (the Active Providers and Active Keys cards link straight to the Providers page)

**Stats Row 2:** Errors Today, Timeouts Today, Avg Duration, Uptime

**Est. Cost Today:** Estimated spend for the current day (see Cost Estimation below)

**Request Volume Chart:** 24h/7d/all ranges with success/failure areas

**Recent Errors Panel / Last 5 Requests Panel:** Compact single-line rows -- click any row to open the full log detail

**Add Provider button:** In the dashboard header -- jumps straight to the Providers page with the Add Provider panel already open

---

## Usage & Cost Estimation

The **Usage** page in the sidebar breaks down token consumption and cost per provider and model.

**How cost is calculated** (in precedence order):

1. **Provider-reported cost** -- when the upstream reports the actual cost of a request (OpenRouter, OpenCode BYOK, Perplexity), that value is used.
2. **Static pricing estimate** -- otherwise, ClawRouter estimates cost from a built-in pricing table (~50 popular models) using cache-aware math (cached tokens are priced separately from fresh input).

> **All costs are estimates.** The Usage page labels them accordingly -- they are for guidance only, never actual billing. Check your provider's dashboard for authoritative numbers.
