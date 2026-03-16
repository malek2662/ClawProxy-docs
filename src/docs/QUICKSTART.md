# ClawProxy Quickstart Guide

This guide will walk you through the professional setup of **ClawProxy** and its integration with **OpenClaw**. 

> **ℹ️ Installation Note:** ClawProxy is premium software. After completing your payment, you will receive your personal copy of the software along with specific installation instructions.

---

## 🚀 Step 1: Adding a Provider in ClawProxy

Before configuring your AI client (like OpenClaw), you must first add the provider to your local ClawProxy dashboard.

1.  **Open the Dashboard**: Navigate to `http://localhost:3030` in your browser.
2.  **Add Provider**: Go to **Providers** → **Add Provider**.
3.  **Configure the Fields**:
    *   **Internal Name**: A reference name for your own use (e.g., `My-Groq-Account`).
    *   **API Format**: Select the format used by the service (e.g., `OpenAI Chat Completions` or `Google Gemini`).
    *   **Upstream URL**: The official API base URL provided by the service (e.g., `https://api.groq.com/openai`).
    *   **Base URL**: This is **auto-generated** by ClawProxy once you save. You will use this URL in your OpenClaw configuration.
    *   **API Key Mode**: 
        *   `Managed`: ClawProxy manages multiple keys and handles rotation.
        *   `None`: Used for bypass providers that require no keys.
        *   `Pass Through`: Directly passes the client's key to the upstream.
    *   **Rotation Strategy**: Choose between `On Error` (rotates only when a limit is hit) or `Round Robin` (rotates keys for every request).
4.  **Save and Manage Keys**: After clicking **Create**, go to the provider's detail page and click **Add API Key** to securely store your keys.

---

## ⚡ Step 2: Configuring OpenClaw (The Easy Way)

Once your provider is running in ClawProxy, adding it to OpenClaw is completely effortless using our intelligent automation.

### 🪄 The "Prompt for AI" Feature

ClawProxy features a sophisticated **"Prompt for AI"** button on every provider's page. This feature generates a perfectly tailored instruction set for your OpenClaw AI agent.

1.  Click the **"🪄 Prompt for AI"** button on the provider's detail page.
2.  **Copy the Generated Prompt**:
    *   **For Supported Providers**: If the provider is officially supported, the prompt will automatically include the **Base URL**, **Provider Name**, and a curated list of the **Best Model IDs** and names.
    *   **For Custom Providers**: If you are using a unique provider, ClawProxy provides a **comprehensive template**. In this case, you will see all connection details, but you must manually insert the specific **Model IDs** and names from the provider's official documentation into the prompt template.
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
*   **Upstream URL**: `https://api.kilo.ai/api/gateway`
*   **Top Models**: `giga-potato-thinking`, `minimax/minimax-m2.5:free`

### 2. OpenCode Provider (Bypass - Optimized for Coding)
*   **Upstream URL**: `https://opencode.ai/zen/v1`
*   **Top Models**: `minimax-m2.5-free`, `big-pickle`

### 3. Google AI Studio (Official Free Tier)
*   **Upstream URL**: `https://generativelanguage.googleapis.com`
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

  <a href="mailto:malekqq1@gmail.com" style="text-decoration: none; color: var(--text-main); display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border-light); transition: all 0.2s;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
    <span>Email</span>
  </a>
</div>

> *Thank you for choosing ClawProxy for a more reliable AI experience!*
