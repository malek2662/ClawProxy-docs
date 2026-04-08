# ClawProxy How-To Guides

Step-by-step tutorials for every operation in ClawProxy. Each guide is self-contained and accurate.

> **Version 1.0.12**

---

## Table of Contents

1. [First Launch & Activation](#first-launch--activation)
2. [Add a Provider via Quick Setup](#add-a-provider-via-quick-setup)
3. [Add a Custom Provider](#add-a-custom-provider)
4. [Add a Bypass Provider (Kilo AI / OpenCode Zen)](#add-a-bypass-provider-kilo-ai--opencode-zen)
5. [Add API Keys to a Provider](#add-api-keys-to-a-provider)
6. [Bulk Add Multiple API Keys](#bulk-add-multiple-api-keys)
7. [Discover Available Models (Fetch Models)](#discover-available-models-fetch-models)
8. [Enable Model Fallback](#enable-model-fallback)
9. [Configure Provider Fallback Chain](#configure-provider-fallback-chain)
10. [Configure OpenClaw Using "Prompt for AI"](#configure-openclaw-using-prompt-for-ai)
11. [Configure OpenClaw Manually](#configure-openclaw-manually)
12. [Monitor Events with Notifications](#monitor-events-with-notifications)
13. [View and Filter Logs](#view-and-filter-logs)
14. [View Key Error History](#view-key-error-history)
15. [Reset the Circuit Breaker](#reset-the-circuit-breaker)
16. [Change Rotation Strategy](#change-rotation-strategy)
17. [Configure Timeout Settings](#configure-timeout-settings)
18. [Enable/Disable a Provider](#enabledisable-a-provider)
19. [Delete a Provider](#delete-a-provider)
20. [Use CLI Commands](#use-cli-commands)
21. [Check for Updates](#check-for-updates)
22. [Set Up a Complete Multi-Provider Fallback System](#set-up-a-complete-multi-provider-fallback-system)
23. [Configure Global Settings](#configure-global-settings)

---

## First Launch & Activation

**Goal:** Start ClawProxy for the first time and get it activated.

**Steps:**

1. Open a terminal and run:
   ```bash
   clawproxy start
   ```
2. Open your browser and go to `http://localhost:3030`.
3. You will see the **Awaiting Activation** screen.
4. Your **Installation ID** is displayed on screen.
5. Click **Copy** to copy the Installation ID to your clipboard.
6. Send the Installation ID to the developer:
   - **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
   - **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
7. Wait for the developer to confirm your activation.
8. Once confirmed, click **Check Activation** on the screen.
9. The dashboard loads and you can begin adding providers.

---

## Add a Provider via Quick Setup

**Goal:** Add a new AI provider using a pre-built template.

**Steps:**

1. Open the dashboard at `http://localhost:3030`.
2. Click **Providers** in the sidebar.
3. Click **Add Provider** (button at the top).
4. Click **Quick Setup**.
5. A grid of provider templates appears. Select your provider (e.g., **Google Gemini**, **Groq**, **OpenRouter**).
6. All fields are automatically filled:
   - **Name**: Provider name
   - **API Format**: Correct format for this provider
   - **Upstream URL**: Official API endpoint
   - **API Key Mode**: `Managed` (default for most providers)
7. Review the fields. Customize the name or any field if you wish.
8. Click **Create Provider**.
9. You are taken to the provider's detail page.
10. The **Base URL** at the top is your auto-generated proxy URL — you will use this in your AI client.
11. Go to the **API Keys** tab and add your API key(s) (see [Guide 5](#add-api-keys-to-a-provider)).

---

## Add a Custom Provider

**Goal:** Add a provider that is not in the template list.

**Steps:**

1. Go to **Providers** → **Add Provider** → **Custom**.
2. Fill in the fields:
   - **Provider Name**: Internal reference name (e.g., `My-Custom-LLM`). This also generates the provider ID (slug).
   - **API Format**: Select the correct format:
     - `OpenAI Chat Completions` — for most OpenAI-compatible providers
     - `OpenAI Responses` — for OpenAI Responses API
     - `Anthropic Messages` — for Anthropic Claude
     - `Google Generative AI` — for Google Gemini
   - **Upstream URL**: The full base URL of the provider's API (e.g., `https://api.example.com/v1`).
   - **API Key Mode**:
     - `Managed` — ClawProxy manages multiple keys with rotation
     - `None` — No API key (for free/bypass endpoints)
     - `Pass Through` — Forward client's key directly
3. Click **Create Provider**.
4. Copy the auto-generated **Base URL**.
5. Add your API keys in the **API Keys** tab.

---

## Add a Bypass Provider (Kilo AI / OpenCode Zen)

**Goal:** Set up a bypass provider that requires no API key.

**Why These Are Special:** Bypass providers (Kilo AI and OpenCode Zen) access high-performance models without requiring an API key. ClawProxy handles the bypass internally.

**Steps:**

1. Go to **Providers** → **Add Provider** → **Quick Setup**.
2. Select **Kilo AI** or **OpenCode Zen** from the template grid.
3. The fields are auto-filled. **Before clicking Create:**
   - Change **API Key Mode** from `Managed` to **`None`**.
4. Click **Create Provider**.
5. **Do NOT add any API keys** — these providers do not need them.
6. Copy the auto-generated **Base URL** from the top of the provider page.
7. *(Optional but recommended)* Go to the **Models** tab:
   - Click **Fetch Models** to retrieve the full list of available models.
   - Models will show **Free** and **Paid** badges.
   - Click **+ Add** next to free models you want in your fallback list.
   - Copy model IDs to use in your AI client configuration.

**Available Free Models — Kilo AI:**
- `minimax/minimax-m2.5:free`, `giga-potato-thinking`, `giga-potato`, `stepfun/step-3.5-flash:free`, `kilo-auto/free`, `openrouter/free`

**Available Free Models — OpenCode Zen:**
- `gpt-5-nano`, `minimax-m2.5-free`, `big-pickle`, `trinity-large-preview-free`

---

## Add API Keys to a Provider

**Goal:** Add one or more API keys to a provider for key rotation.

**Steps:**

1. Open the provider's detail page (click the provider from the Providers list).
2. Go to the **API Keys** tab.
3. Click **Add API Key**.
4. Paste your API key in the input field.
5. *(Optional)* Add a **label** to identify this key (e.g., "Free tier key #1").
6. Click **Add**.
7. The key appears in the table with a masked view (first 4 + last 4 characters shown).
8. Repeat to add more keys. Each additional key increases your effective rate limit capacity.

**Priority Order:** Keys are used in priority order. The first key has highest priority. You can drag-and-drop to reorder keys.

---

## Bulk Add Multiple API Keys

**Goal:** Add many API keys at once.

**Steps:**

1. Open the provider's **API Keys** tab.
2. Click **Bulk Add** (or the bulk add option).
3. Paste multiple keys, each on a **new line**.
4. Click **Add**.
5. All keys are added with auto-assigned priorities.

---

## Discover Available Models (Fetch Models)

**Goal:** See what models a provider offers and add them to your fallback list.

**Steps:**

1. Open the provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models** (or "Fetch from Provider").
4. ClawProxy queries the upstream provider's API and displays available models.
5. For **Kilo AI** and **OpenCode Zen**: models show **Free** / **Paid** badges.
6. Use the **search box** to filter models by name or ID.
7. Click **+ Add** next to any model to add it to the fallback list.
8. Click **Add All** to add all displayed models at once.
9. To use a model ID in your AI client, simply **copy the Model ID** shown in the list.

**How to use the model ID in your AI client (OpenClaw):**
1. Copy the model ID from the Fetch Models list (e.g., `giga-potato-thinking`).
2. In your OpenClaw config, add it to the models array:
   ```json
   { "id": "giga-potato-thinking", "name": "giga-potato-thinking" }
   ```

> **Note:** For providers without a public models endpoint (Perplexity, Anthropic), ClawProxy returns a hardcoded list of known supported models.

---

## Enable Model Fallback

**Goal:** Automatically switch to a different model when one fails.

**Steps:**

1. Open the provider's **Models** tab.
2. Toggle **Model Fallback** to **Enabled**.
3. Add models in priority order:
   - Type a model ID manually and press Enter or click Add.
   - Or use **Fetch Models** and click **+ Add** for each desired model.
4. The first model in the list is the most preferred. If it fails, the second is tried, then the third, etc.
5. Drag-and-drop models to reorder priorities.

**When it activates:** Only when a model returns a "model not found" or "invalid model" error (not on rate limits or auth errors).

**Example scenario:**
- You have models: `gpt-5-nano` (priority 1), `minimax-m2.5-free` (priority 2), `big-pickle` (priority 3).
- Client requests `gpt-5-nano`. If it returns a model error, ClawProxy silently retries with `minimax-m2.5-free`. If that also fails, it tries `big-pickle`.

---

## Configure Provider Fallback Chain

**Goal:** Route to a backup provider when your primary provider fails completely.

**Prerequisites:** You need at least two providers with the **same API format** configured in ClawProxy.

**Steps:**

1. Open the primary provider's detail page.
2. Go to the **Settings** tab.
3. Scroll down to the **Provider Fallback Chain** section.
4. Click **Add Fallback Provider**.
5. A dropdown appears showing only providers with the same API format. Select one.
6. *(Optional)* Set a **Target Model ID**:
   - If the fallback provider has saved models (from its Models tab), they appear as a dropdown.
   - Set this if the fallback provider uses different model names than your primary.
   - Leave empty to pass the original model name through.
7. The entry is saved immediately after adding.
8. Repeat to add more fallback providers. They are tried in order (1 → 2 → 3...).
9. Drag-and-drop to reorder the chain.

**When it activates:** When ALL keys on the primary provider are exhausted, or when the circuit breaker is OPEN.

---

## Configure OpenClaw Using "Prompt for AI"

**Goal:** Automatically configure a provider in OpenClaw using the AI-generated prompt.

**Steps:**

1. Open the provider's detail page in ClawProxy dashboard.
2. Click the **"Prompt for AI"** button (magic wand icon).
3. A modal appears with a generated prompt containing:
   - The provider's Base URL
   - Provider name
   - API format
   - Recommended model IDs
   - Full `openclaw.json` configuration template
4. Click **Copy** to copy the entire prompt.
5. Open your OpenClaw AI agent.
6. Paste the prompt and send it.
7. The AI agent will update your `openclaw.json` automatically.

> **Tip:** If the prompt contains outdated model IDs, you can edit them before pasting. Use **Fetch Models** in the Models tab to get the latest list.

---

## Configure OpenClaw Manually

**Goal:** Manually add a ClawProxy provider to your OpenClaw configuration.

**Steps:**

1. Open `~/.openclaw/openclaw.json` in a text editor.
2. Find the `models.providers` section.
3. Add a new entry:
   ```json
   "my-provider": {
     "baseUrl": "http://localhost:3030/proxy/my-provider-id/v1",
     "apiKey": "dummy-key",
     "api": "openai-completions",
     "models": [
       { "id": "model-id-1", "name": "Model 1" },
       { "id": "model-id-2", "name": "Model 2" }
     ]
   }
   ```
4. **baseUrl**: Copy from the provider's detail page in ClawProxy (the auto-generated Base URL).
5. **apiKey**: Use any dummy value like `dummy-key`. ClawProxy strips this and injects the real key.
6. **api**: Must match the provider's API format:
   - `openai-completions` for OpenAI Chat Completions format
   - `openai-responses` for OpenAI Responses format
   - `anthropic-messages` for Anthropic format
   - `google-generative-ai` for Google Gemini format
7. **models**: List the models you want available. Get model IDs from the provider's **Models** tab → **Fetch Models**.
8. Save the file.

> **Base URL format:**
> - For `openai-completions` / `openai-responses` / `anthropic-messages`: ends with `/v1`
> - For `google-generative-ai`: ends with `/v1beta`

---

## Monitor Events with Notifications

**Goal:** Stay informed about key rotation, circuit breaker, and fallback events.

**Steps:**

1. Look at the **Bell icon** in the sidebar. A red badge shows the count of unread notifications.
2. Click the bell to open the notification panel.
3. Each notification shows:
   - **Type badge** (color-coded by severity)
   - **Message** (human-readable description of what happened)
   - **Timestamp**
4. Click any notification to navigate directly to the affected provider's page.
5. Click **Mark All as Read** to clear the badge count.
6. Click **Clear All** to remove all notifications.

**Notification types you may see:**
- **Key Disabled** (red) — A key was permanently disabled.
- **Rate Limited** (yellow) — A key hit a rate limit and entered cooldown.
- **Circuit Open** (red) — Provider circuit breaker tripped.
- **Recovered** (green) — Provider recovered after cooldown.
- **All Keys Failed** (red) — Every key for a provider failed.
- **Model Fallback** (blue) — Switched to a different model automatically.
- **Provider Fallback** (yellow) — Switched to a fallback provider.

---

## View and Filter Logs

**Goal:** See all proxy requests and their results.

**Steps:**

1. Click **Logs** in the sidebar.
2. The log list loads with the most recent requests first.
3. A green **"Live"** indicator shows real-time WebSocket connection — new logs appear automatically.
4. Use the **filters** to narrow down:
   - **Provider**: Select a specific provider or "All"
   - **Status**: All, Success, Error, Pending, Timeout
   - **Model**: Type a model name to search
5. Navigate through pages using the pagination controls (50 logs per page).
6. Click any log row to expand and see full request/response details.
7. To clear all logs: click **Clear Logs** → confirm in the dialog.

---

## View Key Error History

**Goal:** Diagnose why a specific API key is failing.

**Steps:**

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

## Reset the Circuit Breaker

**Goal:** Manually reset a provider's circuit breaker after it has tripped.

**Steps:**

1. Open the provider's **Settings** tab.
2. If the circuit breaker is not in the `CLOSED` state, you will see:
   - The current state badge (**OPEN** = red, **HALF_OPEN** = amber)
   - The failure count
   - A **Reset** button
3. Click **Reset**.
4. The circuit breaker returns to the **CLOSED** state, and normal routing resumes immediately.

> **Note:** The circuit breaker also resets automatically after the cooldown period (default 30 seconds, configurable in **Settings**) if the provider recovers.

---

## Change Rotation Strategy

**Goal:** Switch between On Error and Round Robin key rotation.

**Steps:**

1. Open the provider's **Settings** tab.
2. In the provider config form (left column), find **Key Rotation Mode**.
3. Select your preferred strategy:
   - **On Error**: Uses the primary key until it fails, then rotates.
   - **Round Robin**: Evenly distributes across all keys.
4. If you selected **Round Robin**, also set **Requests Per Key** — the number of requests to send with one key before rotating (default: 1).
5. Click **Save Provider Settings**.

---

## Configure Timeout Settings

**Goal:** Adjust how long ClawProxy waits for upstream responses.

**Steps:**

1. Open the provider's **Settings** tab.
2. Find **Timeout (ms)** — default is `120000` (2 minutes).
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

**Steps:**

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

**Steps:**

1. Go to **Providers** in the sidebar.
2. Hover over the provider card.
3. Click the **delete** (trash) icon.
4. A confirmation dialog appears.
5. Click **Confirm** to delete.
6. The provider, all its API keys, fallback chain entries, saved models, and related logs are permanently removed.

> **Warning:** This action is irreversible. Make sure you no longer need the provider before deleting.

---

## Use CLI Commands

**Goal:** Manage ClawProxy from the terminal.

**Commands:**

```bash
# Start the server
clawproxy start

# Stop the server
clawproxy stop

# Restart the server
clawproxy restart

# Check status (running/stopped, PID, port, uptime)
clawproxy status

# Follow live logs (Ctrl+C to exit)
clawproxy logs

# Install as system service
clawproxy install

# Remove system service (keeps database)
clawproxy uninstall

# Show version
clawproxy --version

# Show help
clawproxy --help

# Start on a custom port
clawproxy start --port 8080
```

---

## Check for Updates

**Goal:** Check if a newer version of ClawProxy is available and update.

**Steps:**

1. ClawProxy checks for updates automatically during its periodic license check.
2. If a new version is available, an **Update Available** badge appears in the sidebar.
3. Click the badge to open the **Update Modal**.
4. The modal shows:
   - **Current version** → **Latest version**
   - **Changelog** (if provided)
   - **Install commands**:
     - **Linux/macOS**: `curl -fsSL https://get.clawproxy.qzz.io/install.sh | bash`
     - **Windows**: `irm https://get.clawproxy.qzz.io/install.ps1 | iex`
5. Run the install command in your terminal to update.

---

## Set Up a Complete Multi-Provider Fallback System

**Goal:** Create a robust AI routing setup with key rotation, model fallback, and provider fallback.

**Scenario:** You want to use Groq as primary, with OpenRouter as fallback, and model fallback enabled on both.

**Steps:**

### Step A: Set Up Groq (Primary Provider)

1. **Providers** → **Add Provider** → **Quick Setup** → **Groq** → **Create Provider**.
2. **API Keys** tab: Add your Groq API key(s). Add multiple for extra resilience.
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled**.
   - Click **Fetch Models** to load available models.
   - Add models in priority order: `openai/gpt-oss-120b` → `llama-3.3-70b-versatile` → `llama-3.1-8b-instant`.

### Step B: Set Up OpenRouter (Fallback Provider)

1. **Providers** → **Add Provider** → **Quick Setup** → **OpenRouter** → **Create Provider**.
2. **API Keys** tab: Add your OpenRouter API key(s).
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled**.
   - Add free models: `openai/gpt-oss-120b:free` → `meta-llama/llama-3.3-70b-instruct:free`.

### Step C: Configure the Fallback Chain

1. Go to the **Groq** provider's **Settings** tab.
2. Scroll to **Provider Fallback Chain**.
3. Click **Add Fallback Provider** → select **OpenRouter**.
4. Set **Target Model ID** to `openai/gpt-oss-120b:free` (or leave empty if using the same model names).
5. The entry is saved immediately.

### Step D: Configure OpenClaw

1. On the **Groq** provider page, click **"Prompt for AI"**.
2. Copy the prompt and paste to your OpenClaw agent.
3. Your AI client now sends requests to Groq through ClawProxy.

### What Happens on Failure:

1. Request goes to Groq with Key #1.
2. If Key #1 fails → try Key #2, Key #3...
3. If model `gpt-oss-120b` fails → try `llama-3.3-70b-versatile` → `llama-3.1-8b-instant`.
4. If all Groq keys exhausted → route to OpenRouter automatically.
5. On OpenRouter, same key rotation and model fallback applies.
6. Your client receives a successful response without seeing any of the internal retries.

---

## Configure Global Settings

**Goal:** Adjust system-wide proxy behavior such as key retry strategy, rate limit backoff, circuit breaker thresholds, and log retention.

**Steps:**

1. Click **Settings** in the sidebar.
2. The **Global Settings** page displays all configurable options with their current values.
3. Adjust the settings you want to change:

   **Key Retry Behavior:**
   - **Key Retry Mode**: `All` (try every key) or `Fixed` (try up to a limit).
   - **Key Retry Limit**: When mode is `Fixed`, the maximum number of keys to try per request before triggering the fallback chain. Default: `5`.

   **Rate Limit & Circuit Breaker:**
   - **Rate Limit Backoff (seconds)**: How long a key is put on cooldown after a rate limit error. Default: `60`.
   - **Circuit Breaker Threshold**: Number of provider-level failures within the time window before the circuit opens. Default: `5`.
   - **Circuit Breaker Cooldown (seconds)**: How long before a tripped circuit enters the half-open state for a recovery test. Default: `30`.

   **Log Retention:**
   - **Auto Cleanup Logs**: Toggle automatic cleanup of old request logs. Default: enabled.
   - **Log Retention Days**: Number of days to keep logs before auto-cleanup removes them. Default: `7`.

4. Click **Save Settings**.
5. Changes take effect immediately — no restart required.

> **Tip:** If you have many API keys (e.g., 50+) but want faster failover to a fallback provider, switch Key Retry Mode to `Fixed` with a lower limit (e.g., 5-10).

---

## Support & Developer Info

**ClawProxy** is developed and maintained by **Malek-Rsh**.

- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
