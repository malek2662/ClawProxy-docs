# Monitoring & Notifications

Step-by-step guides for monitoring proxy activity through notifications and request logs.

> **Version 1.0.12**

---

## Monitor Events with Notifications

**Goal:** Stay informed about key rotation, circuit breaker, and fallback events.

1. Look at the **Bell icon** in the sidebar. A red badge shows the count of unread notifications.
2. Click the bell to open the notification panel.
3. Each notification shows:
   - **Type badge** (color-coded by severity)
   - **Message** (human-readable description of what happened)
   - **Timestamp**
4. Click any notification to navigate directly to the affected provider's page.
5. Click **Mark All as Read** to clear the badge count.
6. Click **Clear All** to remove all notifications.

### Notification Types

| Type | Badge Color | Trigger | Severity |
|------|------------|---------|----------|
| **Key Disabled** | Red | Key permanently disabled due to auth error (401/402/403) | Critical |
| **Rate Limited** | Yellow | Key entered 60-second cooldown after rate limit (429) | Warning |
| **Circuit Open** | Red | Provider circuit breaker tripped (5 failures in 60s) | Critical |
| **Recovered** | Green | Provider recovered after circuit breaker cooldown | Info |
| **All Keys Failed** | Red | Every key for a provider failed | Critical |
| **Model Fallback** | Blue | Model error triggered automatic switch to next model | Info |
| **Provider Fallback** | Yellow | Provider failure triggered switch to fallback provider | Warning |

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

- Provider ID
- Model name
- HTTP method
- Response status code
- Duration (ms)
- Timestamp
- Full request/response details (expandable)

### Log Persistence

Logs are stored in the SQLite database and survive restarts. Old logs are automatically cleaned up after 7 days by default. You can adjust the retention period and toggle auto-cleanup on/off from the **Settings** page in the dashboard.

---

## Dashboard Stats

The main dashboard provides an overview of proxy activity:

**Stats Row 1:** Requests Today, Success Rate, Active Providers, Active Keys

**Stats Row 2:** Errors Today, Timeouts Today, Avg Duration, Uptime

**Request Volume Chart:** 24h/7d/all ranges with success/failure areas

**Recent Errors Panel:** Latest errors with type badges

**Last 5 Requests Panel:** Recent requests with status
