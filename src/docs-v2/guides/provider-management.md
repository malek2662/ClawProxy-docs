# Provider Management

Step-by-step guides for managing provider lifecycle: testing connections, resetting the circuit breaker, configuring timeouts, enabling/disabling, and deleting providers.

> **Version 1.0.18**

---

## The Providers Page

The Providers list groups your providers into four sections: **Favorites** (starred providers, shown first), **Free-Friendly**, **API Key Providers**, and **Custom**.

Each provider card shows:
- Provider **brand icon** (real brand icons; color or mono -- switchable in **Settings > Appearance**), name, and API format badge
- A **health badge**:

| Badge | Meaning |
|-------|---------|
| **No keys** | Managed provider with no API keys added yet |
| **N errors today** | Requests failed in the last 24 hours |
| **Healthy** | Keys present, no errors today |

- A **quick-test button** (lightning icon) -- runs a connection probe against the provider and shows the result inline
- A **star button** -- adds/removes the provider from Favorites (also available in the provider detail header)
- Power (enable/disable) and delete buttons on hover

> **Deep links:** Opening `/providers?add=1` opens the Add Provider panel directly -- the Dashboard's **Add Provider** button uses this.

---

## Test a Provider Connection

**Goal:** Verify a provider's connectivity and credentials without sending real traffic.

**From the Providers list:** click the lightning icon on any provider card.

**From the provider detail page:** use the test button in the **API Keys** tab (per-key) or **Test All Keys**.

The probe runs a free `/models` check followed by a 1-token generation request -- a 200 on `/models` alone only proves authentication, not usable credit. Results:
- **Success** -- provider reachable, credentials accepted, generation works
- **Success with warning** -- credentials valid but a quota window is full (recovers at the reset) or a transient issue (rate limit, gated probe model)
- **Error** -- invalid credentials (401/403), hard billing (402, "insufficient balance" / "insufficient_quota" -- reported as "recharge required"), or classified failure (rate limit, timeout, network)

---

## View Live Quota & Usage (Quota Tab)

**Goal:** See the remaining quota windows of every key on subscription providers with a usage endpoint.

The **Quota tab** (`?tab=quota`) appears only for providers with a known usage endpoint:

- **Kimi for Coding** (`api.kimi.com/coding`)
- **Z.AI GLM Coding** (`api.z.ai/api/coding` or `open.bigmodel.cn/api/coding`)

Other providers don't see the tab -- deep links to `?tab=quota` fall back to the Overview tab.

1. Open the provider's detail page and click the **Quota** tab.
2. Click **Fetch Quota** -- nothing auto-fetches; the probe runs only on demand (it costs no tokens).
3. You get **one card per enabled key** (each key is a separate quota account), **sorted usable keys first** -- then exhausted keys, keys with no active plan, and invalid keys last:
   - **Membership level, region, and parallel limit** badges (plus the plan name for Z.AI)
   - **Per-window progress bars** with remaining quota and a reset countdown -- Kimi: 5-hour window, weekly cycle. Z.AI: 5-hour session and weekly token windows (the weekly window may be percentage-only and renders as %), plus the monthly web-search count
   - **Booster wallet** monthly spending cap (Kimi)
   - A disabled marker when the account reports `STATUS_DISABLED`
4. Per-key probe failures don't fail the other cards -- the affected key shows an inline amber badge instead.

> **Note:** When every key is quota-backed-off, the probe still runs (it costs no tokens) so you can see exactly when each window resets.

### Per-Key Snapshots & Window-Accurate Cooldowns

Every successful quota probe saves a **snapshot of that key's windows** (kind, usage, reset time). ClawRouter uses these snapshots at request time: when a key exhausts a quota window, it cools down until **that key's own exhausted window reset** -- a 5-hour exhaustion cools down until the 5-hour reset, a weekly exhaustion until the weekly reset -- instead of a shared blanket cooldown.

A key can also show 5-hour and weekly quota available yet fail with a **monthly billing-cycle** exhaustion. This surfaces as **"Monthly usage cycle exhausted"** -- the key is **not disabled**; it is retried in ~10-day steps anchored to its last successful use until the cycle renews. See Key Rotation > Quota Window Cooldowns for the full behavior.

### Probe-Based Auto-Disable

When the quota endpoint **definitively rejects** a key, the rejection runs through the same error classification as real traffic -- and only an **auth-error outcome** (401/403 invalid key, hard-billing codes) disables the key, identical to a real failed request (disable + error history + `key_disabled` notification). The card renders red **"Invalid key -- auto-disabled"**.

A probe **never** disables a key on: network failures, transient 5xx, rate limits, window-quota rejections (Kimi `access_terminated`), or no-plan payloads.

> **Z.AI trap:** a dead Z.AI key returns **HTTP 200** with `{"code":1000,"msg":"Authentication Failed","success":false}` from the monitor endpoint. ClawRouter detects this envelope (auth-family codes 1000-1005) and treats it exactly like a real 401.

> **No GLM Coding Plan?** A valid Z.AI key without an active coding plan returns a "coding plan" error payload -- the key stays enabled and the Quota tab shows an amber **"key valid, no active plan"** note.

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
