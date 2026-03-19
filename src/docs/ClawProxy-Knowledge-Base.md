# ClawProxy Knowledge Base

Welcome to the **ClawProxy** Knowledge Base. This exhaustive guide provides AI agents and users with all the factual information needed to understand, configure, and maximize the utility of ClawProxy.

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

> **Important distinction:** Model Fallback only switches the *model*, not the provider or key. It specifically handles model-level unavailability, not key exhaustion.

---

## 🛡️ Feature 4: Provider Fallback Chain (switch providers)

While Key Rotation handles individual key limits *within* a provider, the **Provider Fallback Chain** protects you from total provider outages.

### Key facts:
*   Provider Fallback is **not automatic by default** — it is explicitly configured by you.
*   You can configure **multiple fallback providers** in a prioritized chain (not just one).
*   Fallbacks are tried **in order** (1 → 2 → 3...) until one succeeds.

### How to configure:
1.  Go to the provider's **Settings** tab → **Provider Fallback Chain** section.
2.  Click **Add Fallback Provider** and select a backup provider.
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
3.  Select a fallback provider and optionally a target model, then click the **+** button.
4.  Repeat to add more fallbacks in order.
5.  Save changes.

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
| **Provider Fallback Chain** | Ordered list of backup providers if this one is unavailable (configured in Settings tab) |

---

## ❓ Extensive Q&A Scenarios

**Q: I have three free-tier keys for an AI service. The service rate-limits me after 10 requests. If I add all three to ClawProxy, what happens on the 11th request?**
A: ClawProxy intercepts the 429 Rate Limit error on the first key, flags it for a 60-second cooldown, and retries the 11th request immediately on the second key. The user never sees the error.

**Q: I configured a Provider Fallback Chain with providers B and C. If Provider A fails but Provider B is also down, what happens?**
A: ClawProxy tries them in sequence. It fails on B, then automatically tries C. If C succeeds, the request is completed. If all fail, the error is returned to the client.

**Q: What's the difference between Model Fallback and Provider Fallback?**
A: Model Fallback (Models tab): same provider, same key, different model — triggered when a *model* is unavailable. Provider Fallback (Settings tab): completely different provider — triggered when the entire primary provider fails (all keys exhausted or circuit breaker open).

**Q: If I configure Provider A to fallback to Provider B, what happens if Provider A's network connection drops entirely?**
A: ClawProxy detects the connection failure and automatically routes to Provider B in the fallback chain, using B's configured target model ID.

**Q: Do I need to define my models in the ClawProxy dashboard?**
A: Not for normal routing — model selection happens in your client (OpenClaw). However, you should add models to the **Models tab** if you want to use Model Fallback. They also appear as options when configuring the Target Model ID for a Provider Fallback Chain entry.

**Q: Can I use different API formats together?**
A: Yes. ClawProxy translates standard client requests into the format required by the upstream provider. You configure the format once per provider, and ClawProxy handles the rest.



---
*Generated by the ClawProxy Knowledge Team - Grounded in Facts, Built for Continuity.*
