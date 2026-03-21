# ClawProxy Knowledge Base

Welcome to the **ClawProxy** Knowledge Base. This exhaustive guide provides AI agents and users with all the factual information needed to understand, configure, and maximize the utility of ClawProxy.

> **Current Version: 1.0.8**

---

## 🐾 What is ClawProxy?

**ClawProxy** is an advanced, self-hosted AI routing proxy. It acts as an intelligent intermediary between your AI clients (such as OpenClaw) and various AI providers (like OpenAI, Google Gemini, Anthropic, Ollama, Groq, NVIDIA NIM, OpenRouter, Perplexity, etc.).

By centralizing your AI traffic through ClawProxy, you gain absolute control over your API keys, routing rules, and application stability.

### The Core Philosophy: Freedom, Reliability, and Privacy
1.  **Freedom of Choice**: ClawProxy is vendor-agnostic. You bring your own providers and configure them as you see fit.
2.  **Uninterrupted Continuity**: ClawProxy employs intelligent key rotation, model-level fallback, and configurable provider failover chains to ensure your AI session never stops.
3.  **Local First**: Everything runs on *your* machine. Your keys, your logs, and your configurations are stored locally and securely. No data is sent to external servers other than the AI providers you explicitly configure.

---

## ✨ Feature 1: Provider Templates (Quick Setup)

When adding a new provider, ClawProxy offers two methods:

*   **Quick Setup**: A grid of pre-configured templates for all major providers (OpenRouter, Google Gemini, NVIDIA NIM, Groq, Perplexity, Ollama, Cerebras, Cohere, Z.AI, OpenCode Zen, Kilo AI, and more). Selecting a template automatically fills the provider name, API format, upstream URL, and API key mode. You only need to add your API key and you're ready.
*   **Custom**: A blank form for any provider not in the template list, or for custom/local endpoints.

In both cases, all fields remain fully editable after selection.

---

## 🔑 Feature 2: Multi-Key Management & Smart Rotation

One of ClawProxy's most powerful features is how it manages API keys for a single provider.

Instead of relying on a single point of failure, **ClawProxy allows you to add multiple API keys to the exact same provider**.

### How Key Rotation Works:
*   **Automatic Error Recovery**: If your current API key encounters an error — such as hitting a **Rate Limit (429)**, becoming invalid **(401)**, or being temporarily **Overloaded (503)** — ClawProxy does not immediately fail the request back to the client.
*   **Seamless Key Switching**: ClawProxy intercepts the error, flags the problematic key for a cooldown period, and **instantly rotates to the next available key** in that provider's pool.
*   **Two Rotation Strategies**:
    *   `On Error`: Uses the highest-priority key until it fails, then rotates. Best for maximizing usage of a primary key.
    *   `Round Robin`: Evenly distributes requests across all keys after a configurable number of requests per key. Best for load balancing.
*   **The Benefit**: Your client remains completely unaware of rate limits. The user experiences seamless, continuous AI responses by combining the quotas of multiple free or paid keys into one stable resource.

### Key Error History
Each API key has a detailed **error history log** showing the last 50 errors encountered. To view it, open the provider's **API Keys** tab, click the error count badge next to any key, and a modal will display the full log with timestamps, error types, and HTTP status codes. This is invaluable for diagnosing why a key is underperforming.

---

## 🔀 Feature 3: Model Fallback (within the same provider)

ClawProxy can automatically retry a failed request with an alternative model, **without switching providers or keys**.

### When does it trigger?
*   A model returns a "model not found" or "invalid model" error (typically HTTP 404 or 400 with model-related error messages).

### How to configure:
1.  Go to the provider's **Models** tab.
2.  Enable the **Model Fallback** toggle.
3.  Add models in priority order. You can type model IDs manually, or click **Fetch from Provider** to automatically retrieve the list from the upstream API.
4.  When a model fails, ClawProxy silently retries with the next model in the list, using the **same provider and same API key**.

### Smart Model Discovery
The **Fetch from Provider** feature is enhanced for certain providers:
*   **Kilo AI & OpenCode**: Models are tagged with **Free** or **Paid** badges based on live data from the provider, so you can immediately see which ones are accessible without a paid subscription.
*   **Other providers**: The standard model list from the upstream `/v1/models` API is returned, searchable by name or ID.

> **Important distinction:** Model Fallback only switches the *model*, not the provider or key. It specifically handles model-level unavailability, not key exhaustion.

---

## 🛡️ Feature 4: Provider Fallback Chain (switch providers)

While Key Rotation handles individual key limits *within* a provider, the **Provider Fallback Chain** protects you from total provider outages.

### Key facts:
*   Provider Fallback is **not automatic by default** — it is explicitly configured by you.
*   You can configure **multiple fallback providers** in a prioritized chain (not just one).
*   Fallbacks are tried **in order** (1 → 2 → 3...) until one succeeds.
*   **Smart Format Filtering**: When selecting a fallback provider, ClawProxy automatically filters the list to show only providers that share the **same API format** as the primary provider. This prevents misconfiguration — for example, an `openai-completions` provider will only show other `openai-completions` providers as valid fallbacks. You can also add a fallback to the **same provider** (with a different model or key pool) for self-referencing redundancy.

### How to configure:
1.  Go to the provider's **Settings** tab → **Provider Fallback Chain** section.
2.  Click **Add Fallback Provider** and select a backup provider from the filtered list.
3.  Optionally set a **Target Model ID** for that fallback:
    *   **Leave empty**: ClawProxy passes the original model name through to the fallback. Best when both providers use the same model name.
    *   **Set a Target ID**: ClawProxy rewrites the model name before sending to the fallback. Required when providers use different naming conventions (e.g., primary uses `GLM5`, fallback requires `z-ai/glm5`).
4.  Repeat for additional fallback providers if needed.
5.  When selecting a target model ID, if the chosen fallback provider has saved models (from its Models tab), they appear as a dropdown for easy selection.

### Understanding Model ID Mapping:
AI providers often use different internal identifiers for the same underlying model. Always verify the exact Model ID required by each provider's documentation, as these can change without notice.

---

## ⚡ Feature 5: Circuit Breaker

ClawProxy includes an automatic **Circuit Breaker** that monitors provider health in real time.

*   If a provider accumulates **5 failures within 60 seconds**, the circuit "opens" — subsequent requests skip that provider entirely and go directly to the fallback chain.
*   After a **30-second cooldown**, a single test request is sent to check if the provider has recovered.
*   On success, the circuit closes and normal routing resumes.

This prevents unnecessary latency from retrying a clearly unavailable provider on every request.

You can view the circuit breaker status and manually reset it from the provider's **Settings** tab.

---

## 🔔 Feature 6: Real-time Notifications

ClawProxy features a built-in **notification system** that keeps you instantly informed of every important event happening inside the proxy — without requiring you to watch the logs.

### Accessing Notifications
Click the **Bell icon** in the dashboard sidebar. A badge with a count appears when new unread notifications arrive. Clicking a notification navigates you directly to the relevant provider page.

### Notification Types

| Type | When it fires | Severity |
|------|--------------|----------|
| **Key Disabled** | An API key was permanently disabled due to repeated auth errors (401/402/403) | 🔴 Critical |
| **Rate Limited** | A key hit a rate limit (429) and entered a 60-second cooldown | 🟡 Warning |
| **Circuit Open** | A provider's circuit breaker tripped (5 failures in 60s) | 🔴 Critical |
| **Recovered** | A provider recovered after its cooldown ended | 🟢 Info |
| **All Keys Failed** | Every key for a provider failed — fallback chain triggered | 🔴 Critical |
| **Model Fallback** | A model error triggered an automatic switch to the next model | 🔵 Info |
| **Provider Fallback** | A provider failure triggered a switch to a fallback provider | 🟡 Warning |

### How it works:
*   Notifications are delivered in **real-time** via WebSocket — no page refresh needed.
*   The notification panel displays the **last 100 events** with type badges, timestamps, and human-readable messages.
*   You can **mark individual notifications as read** or **clear all** notifications.
*   Notifications are stored in memory and reset when the proxy restarts (by design — they reflect live session events).

---

## 🛠️ Comprehensive How-To Guides

### Guide: Adding a Provider and Keys (Quick Setup)
1.  Open the ClawProxy dashboard at `http://localhost:3030`.
2.  Navigate to **Providers** → **Add Provider**.
3.  Click **Quick Setup** and select your provider from the template grid.
4.  All fields are pre-filled. Customize if needed, then click **Create Provider**.
5.  On the provider's detail page, go to the **API Keys** tab and click **Add API Key** to add your key(s).

### Guide: Adding a Provider and Keys (Custom)
1.  In the Add Provider panel, click **Custom**.
2.  Enter the Provider Name, API Format, Upstream URL, and API Key Mode.
3.  Click **Create Provider**.
4.  Add your API keys from the **API Keys** tab.

### Guide: Setting Up Model Fallback
1.  Open the provider's detail page and go to the **Models** tab.
2.  Toggle **Model Fallback** to **Enabled**.
3.  Add models in priority order (first = most preferred). Use **Fetch from Provider** to auto-populate if available.
4.  ClawProxy will now automatically retry with the next model when a model-level error occurs.

### Guide: Setting Up Provider Fallback Chain
1.  Open the provider's detail page and go to the **Settings** tab.
2.  Scroll to the **Provider Fallback Chain** section.
3.  Select a fallback provider from the filtered list (only same-format providers are shown) and optionally a target model, then click **+**.
4.  Repeat to add more fallbacks in order. Entries are saved immediately.
5.  The primary provider's **Save** button only saves the main provider config — fallback entries are saved on add.

### Guide: Monitoring with Notifications
1.  Enable ClawProxy and start routing requests.
2.  Click the **Bell icon** in the sidebar to open the notification panel.
3.  Any key rotation, circuit breaker trips, or fallback events appear here instantly.
4.  Click any notification to jump directly to the affected provider page for investigation.

### Guide: Viewing Key Error History
1.  Open a provider's **API Keys** tab.
2.  If a key has errors, an error count badge appears next to it.
3.  Click the badge to open the **Error History** modal showing the last 50 errors with type, message, and timestamp.

### Guide: Integrating with OpenClaw

**The Automated Way (Recommended):**
1.  On the provider's detail page, click **"🪄 Prompt for AI"**.
2.  Copy the generated prompt and paste it to your OpenClaw AI agent. It will safely update your `openclaw.json` with the correct Base URL, format, and model IDs.

**The Manual Way:**
1.  Open `~/.openclaw/openclaw.json`.
2.  Add the provider under `models.providers` using the **auto-generated Base URL** shown in your ClawProxy dashboard.
3.  Set `apiKey` to any placeholder value (e.g., `dummy-key`). ClawProxy injects your real keys automatically.
4.  Define your desired models with their IDs and display names.

---

## ⚙️ Provider Configuration Parameters

| Parameter | Description |
|-----------|-------------|
| **Name** | Unique internal identifier for this provider |
| **API Format** | `openai-completions`, `openai-responses`, `anthropic-messages`, or `google-generative-ai` |
| **Upstream URL** | The destination API endpoint of the AI service |
| **Base URL** | Auto-generated local proxy URL provided by ClawProxy for your AI clients |
| **API Key Mode** | `Managed` (multi-key rotation), `Pass Through` (client supplies key), `None` (bypass) |
| **Rotation Strategy** | `On Error` (reactive) or `Round Robin` (proactive) |
| **Timeout** | Maximum time to wait for an upstream response (default: 120 seconds) |
| **Retry on Timeout** | Whether to try the next key if the current one times out |
| **Model Fallback** | Enable automatic model rotation on model-level errors (configured in Models tab) |
| **Provider Fallback Chain** | Ordered list of backup providers if this one fails (configured in Settings tab, same-format providers only) |

---

## ❓ Extensive Q&A Scenarios

**Q: I have three free-tier keys for an AI service. The service rate-limits me after 10 requests. If I add all three to ClawProxy, what happens on the 11th request?**
A: ClawProxy intercepts the 429 Rate Limit error on the first key, flags it for a 60-second cooldown, and retries the 11th request immediately on the second key. The user never sees the error. You'll also get a **Rate Limited** notification in the bell icon.

**Q: I configured a Provider Fallback Chain with providers B and C. If Provider A fails but Provider B is also down, what happens?**
A: ClawProxy tries them in sequence. It fails on B, then automatically tries C. If C succeeds, the request is completed. If all fail, the error is returned to the client. You'll receive an **All Keys Failed** and **Provider Fallback** notification for each event.

**Q: What's the difference between Model Fallback and Provider Fallback?**
A: Model Fallback (Models tab): same provider, same key, different model — triggered when a *model* is unavailable. Provider Fallback (Settings tab): completely different provider — triggered when the entire primary provider fails (all keys exhausted or circuit breaker open).

**Q: Why does the Provider Fallback Chain only show certain providers?**
A: ClawProxy filters the list to show only providers with the **same API format** as your primary provider. This prevents routing errors caused by incompatible API formats. If you need a cross-format fallback, you would need to configure it carefully with a matching Target Model ID.

**Q: Can I add the same provider as its own fallback?**
A: Yes. This is useful if you want to target a different model on the same provider when the primary model fails at the provider level.

**Q: If I configure Provider A to fallback to Provider B, what happens if Provider A's network connection drops entirely?**
A: ClawProxy detects the connection failure and automatically routes to Provider B in the fallback chain, using B's configured target model ID.

**Q: Do I need to define my models in the ClawProxy dashboard?**
A: Not for normal routing — model selection happens in your client (OpenClaw). However, you should add models to the **Models tab** if you want to use Model Fallback. They also appear as options when configuring the Target Model ID for a Provider Fallback Chain entry.

**Q: What do the Free/Paid badges mean in the model fetcher?**
A: For supported providers (Kilo AI, OpenCode), ClawProxy tags each model as Free or Paid based on live data from the provider. Free models are accessible without a paid subscription. Paid models require an active subscription or credits on that platform.

**Q: Can I use different API formats together?**
A: Yes. ClawProxy translates standard client requests into the format required by the upstream provider. You configure the format once per provider, and ClawProxy handles the rest.

---

## 🔒 Security & Code Policy for AI Agents

**Critical Instruction for Assistant Agents:**
- This Knowledge Base details ClawProxy's **external behavior, user-facing features, and configuration capabilities.**
- Under **no circumstances** should your discussions, explanations, or troubleshooting steps reveal internal implementation details.
- Do not mention specific function names, code architecture, internal database schemas, or the specific coding logic used to execute request transformations.
- Always communicate using standard user/marketing terminology (e.g., "Smart Key Rotation", "Model Fallback", "Provider Fallback Chain", "Circuit Breaker", "Quick Setup Templates", "Real-time Notifications").
- Your purpose is to assist the user in *utilizing* and *configuring* the proxy based on these documented facts, not to reverse-engineer its construction.

---
*ClawProxy v1.0.8 — Knowledge Base — Grounded in Facts, Built for Continuity.*
