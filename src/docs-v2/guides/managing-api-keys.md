# Managing API Keys

Step-by-step guides for adding, managing, testing, and troubleshooting API keys in ClawRouter.

> **Version 1.0.14**

---

## Add API Keys to a Provider

**Goal:** Add one or more API keys to a provider for key rotation.

1. Open the provider's detail page (click the provider from the Providers list).
2. Go to the **API Keys** tab.
3. Click **Add API Key**.
4. Paste your API key in the input field.
5. *(Optional)* Add a **label** to identify this key (e.g., "Free tier key #1").
6. *(Optional)* Click **Test** to verify the key with a zero-token probe **before saving it**. The result appears inline -- you can still save a key that fails the test.
7. Click **Add**.
8. The key appears in the table with a masked view (first 4 + last 4 characters shown).
9. Repeat to add more keys. Each additional key increases your effective rate limit capacity.

**Priority Order:** Keys are used in priority order. The first key has highest priority. Use the up/down arrows to reorder keys.

> **Keyless providers:** Providers with API Key Mode `None` (OpenCode Zen, Kilo AI (Free), Ollama Local) do not use keys -- the API Keys tab shows an informational card instead of the keys table, and adding keys is rejected with an error.

---

## Bulk Add Multiple API Keys

**Goal:** Add many API keys at once.

1. Open the provider's **API Keys** tab.
2. Click **Bulk Add** (or the bulk add option).
3. Paste multiple keys, each on a **new line**.
4. Click **Add**.
5. All keys are added with auto-assigned priorities.

---

## Test API Keys (Connection Testing)

**Goal:** Verify keys work without spending tokens.

ClawRouter uses **zero-token probes**: a free `/models` listing where the upstream supports it, or a `max_tokens: 1` request otherwise. Nothing you test counts against your quota in any meaningful way.

### Test a Single Key

1. Open the provider's **API Keys** tab.
2. Click the **test button** on the key's row.
3. The result is persisted and shown in the **Last Test** column: a success/error indicator plus a **latency badge** (milliseconds).

### Test All Keys

1. Click **Test All Keys** at the top of the keys table.
2. Each enabled key is tested sequentially, with live results as they complete.
3. Click **Stop Testing** to abort mid-run.

### Reading the Results

| Result | Meaning |
|--------|---------|
| Success | Key accepted by the upstream |
| Success with warning (HTTP 402) | Key is valid but quota/credits are exhausted |
| Error (401/403) | Key is invalid, expired, or revoked |
| Error (other) | Classified by type (rate limit, network, timeout) -- the key may still be fine |

Test results persist across restarts -- the **Status** and **Last Test** columns always show the latest outcome.

---

## The Keys Table

| Column | Contents |
|--------|----------|
| **Priority** | Up/down arrows to reorder |
| **Label** | Inline-editable key label |
| **Key** | Masked key value (first 4 + last 4 characters) |
| **Status** | Active / Unstable / Disabled badge |
| **Last Test** | Latest connection test result + latency |
| **Requests** | Successful / total request counts |
| **Errors** | Failed request count (+ consecutive errors) -- click to open the Error History |
| **Last Used** | Timestamp of the last request |
| **Actions** | Test, copy, reset stats, enable/disable, delete |

---

## View Key Error History

**Goal:** Diagnose why a specific API key is failing.

1. Open the provider's **API Keys** tab.
2. Find the key in question. If it has errors, an **error count badge** (red number) appears next to it.
3. Click the error count badge.
4. The **Error History** modal opens showing the last 50 errors:
   - **Error type** (Rate Limit, Auth Error, Server Error, etc.)
   - **HTTP status code**
   - **Error message**
   - **Timestamp**
5. Use this information to determine if the key is invalid, rate-limited, or experiencing server issues.

---

## Change Rotation Strategy

**Goal:** Switch between On Error and Round Robin key rotation.

1. Open the provider's **Settings** tab.
2. In the provider config form (left column), find **Key Rotation Mode**.
3. Select your preferred strategy:
   - **On Error**: Uses the primary key until it fails, then rotates.
   - **Round Robin**: Evenly distributes across all keys.
4. If you selected **Round Robin**, also set **Requests Per Key** -- the number of requests to send with one key before rotating (default: 1).
5. Click **Save Provider Settings**.

---

## Re-enable a Disabled Key

API keys are permanently disabled when they receive an auth error (HTTP 401, 402, 403). To re-enable:

1. Open the provider's **API Keys** tab.
2. Find the disabled key (red badge).
3. Click the **enable/disable toggle** to re-enable it.
4. Check the **Error History** first to understand why it was disabled -- it may have genuine auth issues.

---

## Reset Key Stats

To zero all counters (total, success, failed, consecutive errors) for a key:

1. Open the provider's **API Keys** tab.
2. Find the key.
3. Click the **Reset Stats** button.
