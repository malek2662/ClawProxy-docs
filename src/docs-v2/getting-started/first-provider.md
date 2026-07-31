# Your First Provider

Step-by-step guide to adding your first AI provider to ClawRouter. Choose from Quick Setup presets or create a custom configuration.

> **Version 1.0.13**

---

## Add a Provider via Quick Setup

**Goal:** Add a new AI provider using a pre-built preset.

1. Open the dashboard at `http://localhost:3030`.
2. Click **Providers** in the sidebar.
3. Click **Add Provider** (button at the top).
4. Click **Quick Setup**.
5. A searchable grid of 50 presets appears, grouped into **Free & Free-Tier** and **API Key Providers**. Select your provider (e.g., **Google Gemini**, **Groq**, **OpenRouter**).
6. All fields are automatically filled:
   - **Name**: Provider name
   - **API Format**: Correct format for this provider
   - **Upstream URL**: Official API endpoint
   - **API Key Mode**: `Managed` for most providers, `None` for keyless presets
7. Review the fields. Customize the name or any field if you wish.
8. Click **Create Provider**. The preset's recommended models are seeded into the Models tab automatically.
9. You are taken to the provider's detail page.
10. The **Base URL** at the top is your auto-generated proxy URL -- you will use this in your AI client.
11. Go to the **API Keys** tab and add your API key(s) -- skip this for keyless presets. Use the built-in **Test** button to verify each key.

---

## Add a Custom Provider

**Goal:** Add a provider that is not in the preset list.

1. Go to **Providers** > **Add Provider** > **Custom**.
2. Fill in the fields:
   - **Provider Name**: Internal reference name (e.g., `My-Custom-LLM`). This also generates the provider ID (slug).
   - **API Format**: Select the correct format:
     - `OpenAI Chat Completions` -- for most OpenAI-compatible providers
     - `OpenAI Responses` -- for OpenAI Responses API
     - `Anthropic Messages` -- for Anthropic Claude
     - `Google Generative AI` -- for Google Gemini
   - **Upstream URL**: The full base URL of the provider's API (e.g., `https://api.example.com/v1`).
   - **API Key Mode**:
     - `Managed` -- ClawRouter manages multiple keys with rotation
     - `None` -- No API key (for free/keyless endpoints)
     - `Pass Through` -- Forward client's key directly
3. Click **Create Provider**.
4. Copy the auto-generated **Base URL**.
5. Add your API keys in the **API Keys** tab.

---

## Add a Keyless Provider (No API Key)

**Goal:** Set up a provider that requires no API key at all.

Keyless presets access high-performance models without signup or keys. ClawRouter sends the required headers automatically (via the preset's default headers).

1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Select **OpenCode Zen**, **Kilo AI (Free)**, or **Ollama (Local)** from the preset grid.
3. Click **Create Provider** -- the API Key Mode is already set to `None`.
4. **Do NOT add any API keys** -- the keys tab shows an informational card for these providers.
5. Copy the auto-generated **Base URL** from the top of the provider page.
6. *(Optional but recommended)* Go to the **Models** tab:
   - The preset's recommended models are already seeded.
   - Click **Fetch Models** to retrieve the full live list.
   - For Kilo AI and OpenCode Zen, models show **Free** and **Paid** badges.
   - Click **+ Add** next to free models you want in your fallback list, or **Add All Free**.

**Available Free Models -- Kilo AI (Free):**
- `minimax/minimax-m2.5:free`, `stepfun/step-3.5-flash:free`, `kilo-auto/free`, `openrouter/free`

**Available Free Models -- OpenCode Zen:**
- `gpt-5-nano`, `minimax-m2.5-free`, `big-pickle`, `trinity-large-preview-free`

---

## What's Next?

After creating your first provider:

- **Add API keys** -- see the Managing API Keys guide for single, bulk, and connection-testing operations
- **Enable Model Fallback** -- automatically switch models when one is unavailable
- **Set up Provider Fallback Chain** -- route to a backup provider when the primary fails (Fallback tab)
- **Configure your AI client** -- use the "Prompt for AI" dialog (7 client tabs) or manual configuration
