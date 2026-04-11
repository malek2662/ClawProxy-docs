# Your First Provider

Step-by-step guide to adding your first AI provider to ClawRouter. Choose from Quick Setup templates or create a custom configuration.

> **Version 1.0.12**

---

## Add a Provider via Quick Setup

**Goal:** Add a new AI provider using a pre-built template.

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
10. The **Base URL** at the top is your auto-generated proxy URL -- you will use this in your AI client.
11. Go to the **API Keys** tab and add your API key(s).

---

## Add a Custom Provider

**Goal:** Add a provider that is not in the template list.

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
     - `None` -- No API key (for free/bypass endpoints)
     - `Pass Through` -- Forward client's key directly
3. Click **Create Provider**.
4. Copy the auto-generated **Base URL**.
5. Add your API keys in the **API Keys** tab.

---

## Add a Bypass Provider (Kilo AI / OpenCode Zen)

**Goal:** Set up a bypass provider that requires no API key.

Bypass providers (Kilo AI and OpenCode Zen) access high-performance models without requiring an API key. ClawRouter handles the bypass internally.

1. Go to **Providers** > **Add Provider** > **Quick Setup**.
2. Select **Kilo AI** or **OpenCode Zen** from the template grid.
3. The fields are auto-filled. **Before clicking Create:**
   - Change **API Key Mode** from `Managed` to **`None`**.
4. Click **Create Provider**.
5. **Do NOT add any API keys** -- these providers do not need them.
6. Copy the auto-generated **Base URL** from the top of the provider page.
7. *(Optional but recommended)* Go to the **Models** tab:
   - Click **Fetch Models** to retrieve the full list of available models.
   - Models will show **Free** and **Paid** badges.
   - Click **+ Add** next to free models you want in your fallback list.
   - Copy model IDs to use in your AI client configuration.

**Available Free Models -- Kilo AI:**
- `minimax/minimax-m2.5:free`, `giga-potato-thinking`, `giga-potato`, `stepfun/step-3.5-flash:free`, `kilo-auto/free`, `openrouter/free`

**Available Free Models -- OpenCode Zen:**
- `gpt-5-nano`, `minimax-m2.5-free`, `big-pickle`, `trinity-large-preview-free`

---

## What's Next?

After creating your first provider:

- **Add API keys** -- see the Managing API Keys guide for single and bulk key operations
- **Enable Model Fallback** -- automatically switch models when one is unavailable
- **Set up Provider Fallback Chain** -- route to a backup provider when the primary fails
- **Configure your AI client** -- use the "Prompt for AI" feature or manual configuration
