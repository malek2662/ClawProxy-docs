# Frequently Asked Questions (FAQ)

Here are the most common questions regarding **ClawProxy** configuration and usage.

> **Version 1.0.9**

---

## 🔑 Providers & Keys

### Do I need to define my models in the ClawProxy dashboard?
**Generally, no.** You only define the Provider and its Keys in ClawProxy. The actual Model selection happens in your client (like OpenClaw). When OpenClaw requests a specific model name, ClawProxy accepts it and forwards it to the upstream.

The **exception** is when you want to use **Model Fallback** — in that case, you add models to the provider's **Models** tab so ClawProxy knows what to fall back to. These saved models also appear as a convenient dropdown when configuring Target Model IDs in the Provider Fallback Chain.

### What's the fastest way to add a new provider?
Use the **Quick Setup** option in the Add Provider panel. It displays a grid of pre-built templates for all major providers (OpenRouter, Gemini, NVIDIA NIM, Groq, Perplexity, Ollama, Cerebras, Cohere, Z.AI, and more). Selecting one auto-fills the name, API format, upstream URL, and key mode — you only need to add your API key.

### Can I use different API formats together?
**Yes.** ClawProxy translates requests into the format required by each upstream provider. You configure the format once per provider, and ClawProxy handles all translation behind the scenes.

> **Note:** The Provider Fallback Chain filters by API format to prevent accidental cross-format routing errors (see below).

### Why am I getting "Model Not Found" or routing errors?
The specific Model IDs used by external AI providers are subject to change without notice. If you experience model errors, verify the current valid Model ID directly with the target provider's official documentation. You can also enable **Model Fallback** in the provider's Models tab, so ClawProxy will automatically retry with another model from your saved list when this happens.

### How do I see why a specific API key is failing?
Open the provider's **API Keys** tab and click the error count badge next to the key in question. This opens the **Error History** modal showing the last 50 errors with their type (rate limit, auth error, server error, etc.), HTTP status code, and timestamp.

---

## 🛡️ Reliability & Rotation

### I have three free-tier keys for an AI service. What happens when I hit a rate limit?
Due to ClawProxy's Smart Key Rotation, when your active key hits a 429 rate limit error, ClawProxy instantly flags that key for a cooldown period and re-sends the request using your second key. The user receives the response without ever knowing a rate limit occurred. A **Rate Limited** notification will also appear in the dashboard bell icon.

### What's the difference between Model Fallback and Provider Fallback?

**Model Fallback** (configured in the **Models** tab):
*   Stays within the *same provider* and *same API key*.
*   Triggers when a specific *model* is unavailable (HTTP 404/400 with a model error).
*   Retries with the next model in your priority list.
*   Use this when you want automatic model switching within a single provider.

**Provider Fallback Chain** (configured in the **Settings** tab):
*   Switches to a *completely different provider*.
*   Triggers when the entire primary provider fails (all keys exhausted, or the circuit breaker opens).
*   You can configure multiple fallbacks tried in order (1 → 2 → 3...).
*   Each fallback entry can optionally target a specific model on that provider.

### Why does the Provider Fallback list only show certain providers?
ClawProxy automatically filters the fallback list to show only providers that share the **same API format** as your current provider. This is a safety feature — for example, a Google Gemini provider (google-generative-ai format) won't accidentally be routed to an Anthropic provider (anthropic-messages format). Both providers need to speak the same API language for the fallback to work correctly.

### If I configure a Provider Fallback Chain with Provider B and C, but B is also down, does it try C?
**Yes.** ClawProxy tries each provider in the chain in order until one succeeds. If B fails, it automatically tries C.

### If I configure Provider A to fallback to Provider B, what happens if Provider A's connection drops entirely?
ClawProxy detects the failure (network error or HTTP 5xx) and automatically routes to Provider B and its associated Target Model ID. If you have a chain of fallbacks, it will try each one in order.

### What is the Circuit Breaker?
The Circuit Breaker is an automatic health monitor. If a provider accumulates 5 failures within 60 seconds, ClawProxy stops sending requests to it for 30 seconds (the "cooldown"). During cooldown, all requests go directly to your configured fallback chain — eliminating the latency of waiting for a clearly unavailable provider to fail on each request.

After the cooldown, ClawProxy sends a single test request to check recovery. On success, normal routing resumes automatically. You can also manually reset the circuit breaker from the provider's **Settings** tab. A **Circuit Open** and **Recovered** notification will fire for each state change.

---

## 🔔 Notifications

### What are the bell notifications in the dashboard?
The notification bell (sidebar) gives you a real-time feed of everything happening inside ClawProxy — key rotation events, circuit breaker trips, fallback activations, and more. Each notification includes a type badge, a human-readable message, and a timestamp. Clicking a notification takes you directly to the affected provider.

### What notification types exist?
- **Key Disabled** 🔴 — A key was permanently disabled due to repeated auth failures.
- **Rate Limited** 🟡 — A key entered a 60-second cooldown after hitting a rate limit.
- **Circuit Open** 🔴 — A provider's circuit breaker tripped after 5 failures in 60 seconds.
- **Recovered** 🟢 — A provider recovered and is accepting requests again.
- **All Keys Failed** 🔴 — Every key for a provider exhausted, triggering the fallback chain.
- **Model Fallback** 🔵 — A model error triggered an automatic switch to the next model.
- **Provider Fallback** 🟡 — A complete provider failure triggered a switch to a fallback provider.

### Do notifications persist after restart?
No. Notifications reflect live session events only and are cleared when the proxy restarts. This is by design — they are not a log replacement, but a real-time alerting system. For a full history, use the **Logs** section.

---

## 🛠️ General Troubleshooting

### Where can I see what the proxy is doing?
Use the **Logs** section in the ClawProxy dashboard for a real-time and historical view of all requests, responses, errors, and fallback events. The log view uses live WebSocket streaming — no toggling needed. You can also use the CLI: run `clawproxy logs` in your terminal to monitor live traffic.

### How do I restart the proxy?
Run `clawproxy restart` from your terminal to quickly reboot the service.

### How do I fetch the available models for a provider?
Go to the provider's **Models** tab and click **Fetch from Provider**. ClawProxy will query the upstream API and display the available models — with **Free/Paid badges** for supported providers (Kilo AI, OpenCode). Select any you want to add to your saved list. For providers without a public models endpoint (like Perplexity or Anthropic), ClawProxy returns the known supported model list automatically.

### The dashboard is slow to load when I have many providers — is that normal?
On large setups with many providers and extensive logs, initial loading can take a few seconds. This is expected behavior and resolves quickly once data is loaded.

### A key shows errors but is still active — why hasn't it been disabled?
ClawProxy only permanently disables keys on **auth errors** (401, 403 without content moderation context, 402). For other errors like rate limits or server errors, the key is temporarily put in a cooldown or backoff and continues rotating normally. Check the **Error History** modal on that key for details.

> **Still need help?** Reach out through GitHub, Reddit, or Email as listed in the documentation.
