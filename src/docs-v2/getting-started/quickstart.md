# Quickstart Guide

Get ClawProxy running and route your first AI request in minutes.

> **Version 1.0.12**

> **Installation Note:** ClawProxy is premium software. After your payment is confirmed, you will receive the installation command and setup instructions automatically.

> **Activation Required:** After installing ClawProxy, the app displays your unique **Installation ID**. To activate, contact the developer at [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io) or via [Reddit](https://reddit.com/user/Malek262) with your Installation ID. Your installation will then be activated promptly. Once activated, everything works automatically with no further steps needed.

---

## Step 1: First Launch & Activation

1. **Start ClawProxy** using the CLI:
   ```bash
   clawproxy start
   ```
2. **Open the Dashboard** at `http://localhost:3030` in your browser.
3. If this is your first launch, you will see the **Awaiting Activation** screen:
   - Your **Installation ID** is displayed on screen.
   - Click the **Copy** button to copy it.
   - Send it to the developer via email or Reddit.
   - Once the developer confirms activation, click **Check Activation** on the screen.
4. The dashboard loads and you can start adding providers.

---

## Step 2: Adding a Provider

Navigate to **Providers** > **Add Provider**. You have two methods:

### Method A: Quick Setup (Recommended)

ClawProxy includes **13 built-in provider templates** with pre-configured settings.

1. Click **Quick Setup** in the Add Provider panel.
2. Select your provider from the grid:
   - **OpenRouter**, **Google Gemini**, **NVIDIA NIM**, **Groq**, **OpenAI**, **Anthropic**
   - **Ollama Cloud**, **Kilo AI**, **OpenCode Zen**, **Perplexity**, **Cerebras**, **Cohere**
   - **Z.AI API**, **Z.AI Coding**
3. All fields are **automatically filled**: Name, API Format, Upstream URL, and API Key Mode.
4. **For Bypass providers (Kilo AI, OpenCode Zen):** Change the **API Key Mode** from `Managed` to `None` before creating the provider. These providers do not require API keys.
5. Customize any field if needed, then click **Create Provider**.
6. Copy the auto-generated **Base URL** shown at the top of the provider page -- you will use this in your AI client.

### Method B: Custom Provider

For providers not in the template list, or for custom/local endpoints:

1. Click **Custom** in the Add Provider panel.
2. Fill in the fields:
   - **Provider Name**: An internal reference name (e.g., `My-Custom-Provider`).
   - **API Format**: The protocol used by the service:
     - `OpenAI Chat Completions` -- Most providers (OpenRouter, Groq, NVIDIA, etc.)
     - `OpenAI Responses` -- OpenAI Responses API format
     - `Anthropic Messages` -- Anthropic Claude API
     - `Google Generative AI` -- Google Gemini API
   - **Upstream URL**: The official API base URL of the service.
   - **API Key Mode**:
     - `Managed` -- ClawProxy manages multiple keys with rotation (default).
     - `None` -- No API key needed (for bypass/free providers).
     - `Pass Through` -- Forwards the client's API key directly to upstream.
   - **Rotation Strategy**: `On Error` (use primary key until it fails) or `Round Robin` (distribute requests evenly).
3. Click **Create Provider**.
4. Copy the auto-generated **Base URL**.

---

## Step 3: Adding API Keys

> Skip this step for bypass providers (Kilo AI, OpenCode Zen) where API Key Mode is set to `None`.

1. Open the provider's detail page and go to the **API Keys** tab.
2. Click **Add API Key**.
3. Paste your API key. Optionally add a label (e.g., "Free tier key #1").
4. Click **Add**.
5. To add multiple keys at once, use the **Bulk Add** option -- paste multiple keys separated by newlines.

**Why add multiple keys?** ClawProxy rotates between keys automatically. When one key hits a rate limit, the next key is used instantly -- your client never sees an error.

---

## Step 4: Advanced Configuration (Optional)

### Model Fallback (within the same provider)

Found in the **Models** tab of any provider.

If a specific model is unavailable (returns a "model not found" error), ClawProxy can automatically retry with the next model in your priority list -- using the same API key.

1. Go to the provider's **Models** tab.
2. Enable the **Model Fallback** toggle.
3. Add models in priority order. You can:
   - Type model IDs manually.
   - Click **Fetch Models** to automatically retrieve the available model list from the upstream API. For Kilo AI and OpenCode, models show **Free/Paid** badges.
4. Click **+ Add** next to each model you want. Models are tried in the order you add them.

> **Note:** Model Fallback only switches the *model*, not the provider or key. It handles model-level errors only.

### Provider Fallback Chain (switch to a different provider)

Found in the **Settings** tab of any provider.

If the entire provider fails (all keys exhausted or circuit breaker opens), ClawProxy routes to backup providers in order.

1. Go to the provider's **Settings** tab > **Provider Fallback Chain** section.
2. Click **Add Fallback Provider**. The dropdown only shows providers with the **same API format** (safety filter).
3. Optionally set a **Target Model ID** -- if the fallback provider has saved models, they appear as a dropdown. Leave empty to pass the original model name through.
4. Add multiple fallback providers -- they are tried in order (1 > 2 > 3...).
5. Each entry is saved immediately on add -- no separate Save button needed.

> **Key difference:** Model Fallback = same provider, different model. Provider Fallback = different provider entirely.

### Circuit Breaker

The Circuit Breaker is automatic. If a provider has **5 failures within 60 seconds**, ClawProxy stops sending requests to it for **30 seconds** and routes directly to the fallback chain. After cooldown, a single test request checks recovery. You can view status and manually reset from the provider's **Settings** tab. These thresholds are configurable from the **Settings** page in the sidebar.

### Monitoring with Notifications

The **notification bell** in the sidebar delivers real-time alerts:
- Key getting rate-limited or disabled
- Circuit breaker tripping or recovering
- Model or provider fallback activations

Click any notification to navigate to the affected provider.

---

## Step 5: Configuring Your AI Client

Once your provider is running in ClawProxy, configure your AI client to use the auto-generated **Base URL**.

### The "Prompt for AI" Feature (Recommended for OpenClaw)

1. On the provider's detail page, click the **"Prompt for AI"** button.
2. The generated prompt includes the **Base URL**, **Provider Name**, and recommended **Model IDs**.
3. Copy the prompt and paste it to your OpenClaw AI agent. It will update your `openclaw.json` automatically.

### Manual Configuration

For OpenClaw or any compatible client, add the provider to your configuration:

```json
"PROVIDER_NAME": {
  "baseUrl": "http://localhost:3030/proxy/YOUR_PROVIDER_ID/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
    { "id": "MODEL_ID", "name": "Display Name" }
  ]
}
```

> **apiKey**: Use any dummy value (e.g., `dummy-key`). ClawProxy strips it and injects your real managed keys automatically.

> **Base URL format**: The exact URL depends on the API format:
> - `openai-completions` / `openai-responses` / `anthropic-messages` > `/proxy/{id}/v1`
> - `google-generative-ai` > `/proxy/{id}/v1beta`

---

## Recommended Starting Providers

### 1. Kilo AI (Bypass -- No Key Required)
- **Template:** Quick Setup > **Kilo AI**
- **Important:** Change API Key Mode to **None** before creating
- **Top Free Models:** `giga-potato-thinking`, `minimax/minimax-m2.5:free`, `stepfun/step-3.5-flash:free`

### 2. OpenCode Zen (Bypass -- No Key Required)
- **Template:** Quick Setup > **OpenCode Zen**
- **Important:** Change API Key Mode to **None** before creating
- **Top Free Models:** `minimax-m2.5-free`, `big-pickle`, `gpt-5-nano`

### 3. Google Gemini (Free Tier -- Key Required)
- **Template:** Quick Setup > **Google Gemini**
- **Get free API key at:** [Google AI Studio](https://aistudio.google.com/)
- **Top Models:** `gemini-3.1-pro-preview`, `gemini-2.5-flash`
