# Provider Management

Step-by-step guides for managing provider lifecycle: testing connections, resetting the circuit breaker, configuring timeouts, enabling/disabling, and deleting providers.

> **Version 1.0.13**

---

## The Providers Page

The Providers list groups your providers into three sections: **Free-Friendly**, **API Key Providers**, and **Custom**.

Each provider card shows:
- Provider icon, name, and API format badge
- A **health badge**:

| Badge | Meaning |
|-------|---------|
| **No keys** | Managed provider with no API keys added yet |
| **N errors today** | Requests failed in the last 24 hours |
| **Healthy** | Keys present, no errors today |

- A **quick-test button** (lightning icon) -- runs a zero-token connection probe against the provider and shows the result inline
- Power (enable/disable) and delete buttons on hover

> **Deep links:** Opening `/providers?add=1` opens the Add Provider panel directly -- the Dashboard's **Add Provider** button uses this.

---

## Test a Provider Connection

**Goal:** Verify a provider's connectivity and credentials without sending real traffic.

**From the Providers list:** click the lightning icon on any provider card.

**From the provider detail page:** use the test button in the **API Keys** tab (per-key) or **Test All Keys**.

The probe is zero-token: a free `/models` listing where the upstream supports it, or a `max_tokens: 1` request otherwise. Results:
- **Success** -- provider reachable, credentials accepted
- **Success with warning** -- credentials valid but quota exhausted (HTTP 402)
- **Error** -- invalid credentials (401/403) or classified failure (rate limit, timeout, network)

---

## Reset the Circuit Breaker

**Goal:** Manually reset a provider's circuit breaker after it has tripped.

1. Open the provider's **Settings** tab.
2. If the circuit breaker is not in the `CLOSED` state, you will see:
   - The current state badge (**OPEN** = red, **HALF_OPEN** = amber)
   - The failure count
   - A **Reset** button
3. Click **Reset**.
4. The circuit breaker returns to the **CLOSED** state, and normal routing resumes immediately.

> **Note:** The circuit breaker also resets automatically after the cooldown period (default 30 seconds, configurable in **Settings**) if the provider recovers.

---

## Configure Timeout Settings

**Goal:** Adjust how long ClawRouter waits for upstream responses.

1. Open the provider's **Settings** tab.
2. Find **Timeout (ms)** -- default is `120000` (2 minutes).
3. Enter a new value in milliseconds. Examples:
   - `30000` = 30 seconds (for fast models)
   - `120000` = 2 minutes (default, for standard models)
   - `300000` = 5 minutes (for long-running reasoning models)
4. Find **Retry on Timeout** toggle:
   - **Enabled** (default): If a request times out, try the next key.
   - **Disabled**: If a request times out, return the error to the client.
5. Click **Save Provider Settings**.

---

## Enable/Disable a Provider

**Goal:** Temporarily disable a provider without deleting it.

**From the Providers list:**
1. Go to **Providers** in the sidebar.
2. Hover over the provider card.
3. Click the **power button** icon to toggle enabled/disabled.

**From the provider detail page:**
1. The provider's enabled state is shown in the overview.
2. Toggle as needed.

A disabled provider:
- Does not accept proxy requests (returns an error)
- Is not available as a fallback target
- Retains all keys, models, and configuration

---

## Delete a Provider

**Goal:** Permanently remove a provider and all its data.

1. Go to **Providers** in the sidebar.
2. Hover over the provider card.
3. Click the **delete** (trash) icon.
4. A confirmation dialog appears.
5. Click **Confirm** to delete.
6. The provider, all its API keys, fallback chain entries, saved models, and related logs are permanently removed.

> **Warning:** This action is irreversible. Make sure you no longer need the provider before deleting.

---

## Check for Updates

**Goal:** Check if a newer version of ClawRouter is available and update.

1. ClawRouter checks for updates automatically during its periodic license check.
2. If a new version is available, an **Update Available** badge appears in the sidebar.
3. Click the badge to open the **Update Modal**.
4. The modal shows:
   - **Current version** > **Latest version**
   - **Changelog** (if provided)
   - **Install/update commands** for your platform
5. Run the provided command in your terminal to update.
