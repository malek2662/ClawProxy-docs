# ClawProxy Quickstart Guide

This guide will walk you through the professional setup of **ClawProxy** and its integration with **OpenClaw**.

> **ℹ️ Installation Note:** ClawProxy is premium software. After completing your payment, you will receive your personal copy of the software along with specific installation instructions.
>
> **Version 1.0.9**

> **🔑 Activation Required:** After installing ClawProxy, the app will display your unique **Installation ID**. Reply with this ID using the **same email or channel you used to confirm your purchase** — your installation will then be activated promptly. Once activated, everything works automatically with no further steps needed.

---

## 🚀 Step 1: Adding a Provider in ClawProxy

Before configuring your AI client (like OpenClaw), you must first add the provider to your local ClawProxy dashboard.

1.  **Open the Dashboard**: Navigate to `http://localhost:3030` in your browser.
2.  **Add Provider**: Go to **Providers** → **Add Provider**.
3.  **Choose your setup method:**

---

### ⚡ Method A: Quick Setup (Recommended)

ClawProxy includes built-in **Provider Templates** for all major AI providers. Instead of manually entering URLs and settings, simply click **Quick Setup**, and you'll see a grid of ready-to-use providers.

1.  Click **Quick Setup** in the Add Provider panel.
2.  Select your provider from the grid (e.g., OpenRouter, NVIDIA NIM, Groq, Gemini, Perplexity, etc.).
3.  All fields are **automatically filled**: Name, API Format, Upstream URL, and API Key Mode.
4.  You can still customize any field after selecting the template.
5.  Click **Create Provider**.
6.  Go to the provider's **API Keys** tab and add your keys.

---

### 🛠️ Method B: Custom Provider

For providers not listed in the templates, or any custom/local endpoint:

1.  Click **Custom** in the Add Provider panel.
2.  **Configure the Fields**:
    *   **Provider Name**: A reference name for your own use (e.g., `My-Groq-Account`).
    *   **API Format**: Select the format used by the service (e.g., `OpenAI Chat Completions` or `Google Gemini`).
    *   **Upstream URL**: The official API base URL provided by the service (e.g., `https://api.groq.com/openai/v1`).
    *   **Base URL**: This is **auto-generated** by ClawProxy once you save. You will use this URL in your OpenClaw configuration.
    *   **API Key Mode**:
        *   `Managed`: ClawProxy manages multiple keys and handles rotation.
        *   `None`: Used for bypass providers that require no keys.
        *   `Pass Through`: Directly passes the client's key to the upstream.
    *   **Rotation Strategy**: Choose between `On Error` (rotates only when a limit is hit) or `Round Robin` (rotates keys evenly across every request).
3.  Click **Create Provider**.
4.  Go to the provider's **API Keys** tab and add your keys.

---

## ⚙️ Step 2: Advanced Configuration (Optional)

After creating a provider, you can configure advanced reliability features from the provider's detail page.

### 🔀 Model Fallback (within the same provider)

Found in the **Models** tab of any provider.

If a specific model becomes unavailable (e.g., returns a "model not found" error), ClawProxy can automatically retry with the **next model in your priority list** — using the same provider and the same API key.

1.  Go to the provider's **Models** tab.
2.  Enable the **Model Fallback** toggle.
3.  Add your models in priority order. You can:
    *   Type model IDs manually.
    *   Click **Fetch from Provider** to automatically retrieve the available model list from the upstream API.
4.  If a model fails, ClawProxy silently retries with the next one in the list.

> **Note:** This only switches the *model*, not the provider or key. It's for model-level errors, not key exhaustion.

---

### 🛡️ Provider Fallback Chain (switch to a different provider)

Found in the **Settings** tab of any provider.

If the **entire provider** fails (all keys exhausted, or the provider is down), ClawProxy will automatically route to a backup provider in order.

1.  Go to the provider's **Settings** tab → **Provider Fallback Chain** section.
2.  Click **Add Fallback Provider** — the list automatically shows only providers with the **same API format** as your current provider (e.g., an OpenAI-format provider will only show other OpenAI-format providers).
3.  Optionally specify a **Target Model ID**. If the fallback provider has saved models, they appear as a dropdown.
4.  Add multiple fallback providers — they will be tried in order (1 → 2 → 3...) until one succeeds.
5.  Each entry is saved immediately — no need to click a separate Save button for the chain.

> **Key difference:** Model Fallback = same provider, different model. Provider Fallback Chain = different provider entirely.

---

### 🔔 Monitoring with Notifications

ClawProxy features a built-in **notification bell** in the dashboard sidebar. It delivers real-time alerts for every important event:

*   A key getting rate-limited or disabled
*   A circuit breaker tripping or recovering
*   A model or provider fallback being activated

Click any notification to navigate directly to the affected provider. Use this alongside the **Logs** section for full visibility into what ClawProxy is doing on your behalf.

---

## 🪄 Step 3: Configuring OpenClaw (The Easy Way)

Once your provider is running in ClawProxy, adding it to OpenClaw is effortless using our built-in automation.

### The "Prompt for AI" Feature

ClawProxy features a sophisticated **"🪄 Prompt for AI"** button on every provider's page. This generates a perfectly tailored instruction set for your OpenClaw AI agent.

1.  Click the **"🪄 Prompt for AI"** button on the provider's detail page.
2.  **Copy the Generated Prompt**:
    *   **For Supported Providers**: The prompt automatically includes the **Base URL**, **Provider Name**, and a curated list of the **Best Model IDs**.
    *   **For Custom Providers**: ClawProxy provides a comprehensive template with all connection details; you insert the specific Model IDs from the provider's documentation.
3.  **Paste to OpenClaw**: Feed this prompt directly to your OpenClaw AI agent. It will update your `openclaw.json` configuration safely and without errors.

---

## 📝 Manual Configuration Reference

If you prefer manual editing, follow this structure in your `~/.openclaw/openclaw.json`:

```json
"PROVIDER_NAME": {
  "baseUrl": "YOUR_CLAWPROXY_AUTO_GENERATED_URL",
  "apiKey": "dummy-key",
  "api": "API_FORMAT",
  "models": [
    { "id": "MODEL_ID", "name": "FRIENDLY_NAME" }
  ]
}
```

---

## 🎁 Recommended Ready-to-Use Providers

For the best experience, we recommend starting with these high-performance options:

### 1. Kilo Provider (Bypass - No Key Required)
*   **Use Quick Setup template:** `Kilo AI`
*   **Upstream URL**: `https://api.kilo.ai/api/gateway`
*   **Top Models**: `giga-potato-thinking`, `minimax/minimax-m2.5:free`

### 2. OpenCode Provider (Bypass - Optimized for Coding)
*   **Use Quick Setup template:** `OpenCode Zen`
*   **Upstream URL**: `https://opencode.ai/zen/v1`
*   **Top Models**: `minimax-m2.5-free`, `big-pickle`

### 3. Google AI Studio (Official Free Tier)
*   **Use Quick Setup template:** `Google Gemini`
*   **Upstream URL**: `https://generativelanguage.googleapis.com/v1beta`
*   **Top Models**: `gemini-3.1-pro-preview`, `gemini-2.5-flash`

---

## 🤝 Support & Resources

*   **CLI Commands**: Learn how to use `clawproxy logs` and `restart` in our [Commands Guide](COMMANDS.md).
*   **FAQ**: Find solutions to common issues in the [FAQ section](FAQ.md).

---

## 📬 Contact & Community

Get in touch with the developer or join our community for support and updates.

<div style="display: flex; gap: 24px; margin-top: 20px; flex-wrap: wrap;">
  <a href="https://github.com/malek262" target="_blank" style="text-decoration: none; color: var(--text-main); display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-light); transition: all 0.2s;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
    <span>GitHub</span>
  </a>

  <a href="https://reddit.com/user/Malek262" target="_blank" style="text-decoration: none; color: var(--text-main); display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-light); transition: all 0.2s;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17 12h-5V7"></path></svg>
    <span>Reddit</span>
  </a>

  <a href="mailto:support@clawproxy.qzz.io" style="text-decoration: none; color: var(--text-main); display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-light); transition: all 0.2s;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
    <span>Email</span>
  </a>
</div>

> *Thank you for choosing ClawProxy for a more reliable AI experience!*
