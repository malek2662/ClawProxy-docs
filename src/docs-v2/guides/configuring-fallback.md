# Configuring Fallback

Step-by-step guide for setting up provider fallback chains and building a complete multi-provider fallback system.

> **Version 1.0.17**

---

## Configure Provider Fallback Chain

**Goal:** Route to a backup provider when your primary provider fails completely.

**Prerequisites:** You need at least two providers configured in ClawRouter.

**Steps:**

1. Open the primary provider's detail page.
2. Go to the **Fallback** tab.
3. The **chain diagram** shows the current flow: source provider > each fallback target with its pinned model or `auto`.
4. Click **Add Fallback Provider**.
5. Pick a target from the provider dropdown -- it shows all providers. Cross-format targets are translated automatically.
6. Choose the model handling:
   - **Automatic** (default): the originally requested model ID is tried on the fallback provider first; if rejected, ClawRouter cascades through the fallback provider's saved model list (requires Model Fallback enabled on that provider).
   - **A saved model**: pick from the target's Models tab entries.
   - **A live model**: click **Fetch models** to load the target provider's catalog without leaving this page.
   - **Custom**: type any model ID and press Enter.
7. The entry is saved immediately after adding.
8. Repeat to add more fallback providers. They are tried in order (1 > 2 > 3...).
9. Use the **up/down arrows** to reorder the chain. Click an entry's model to edit it, or the delete button to remove it.

**When it activates:** When ALL keys on the primary provider are exhausted, or when the circuit breaker is OPEN.

> **Note:** The fallback chain is configured in the **Fallback** tab only -- it is no longer in the Settings tab.

---

## Manage All Chains from the Global Fallback Page

**Goal:** See and edit every provider's fallback chain in one place.

1. Click **Fallback** in the sidebar.
2. Each provider card summarizes its chain inline: `A > B (auto) > C (model-id)`. Disabled targets are struck through.
3. Click a card to expand it -- the full chain editor appears (the same editor as the provider's Fallback tab, same data).
4. Add, edit, reorder, or delete entries exactly as you would on the provider detail page.

---

## Set Up a Complete Multi-Provider Fallback System

**Goal:** Create a robust AI routing setup with key rotation, model fallback, and provider fallback.

**Scenario:** You want to use Groq as primary, with OpenRouter as fallback, and model fallback enabled on both.

### Step A: Set Up Groq (Primary Provider)

1. **Providers** > **Add Provider** > **Quick Setup** > **Groq** > **Create Provider**. The preset's recommended models are seeded into the Models tab automatically.
2. **API Keys** tab: Add your Groq API key(s). Add multiple for extra resilience. Use **Test All Keys** to verify them.
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled**.
   - Review the seeded models and adjust priority with the arrows, or click **Fetch Models** to load the live catalog.
   - Example order: `openai/gpt-oss-120b` > `llama-3.3-70b-versatile` > `qwen/qwen3-32b`.

### Step B: Set Up OpenRouter (Fallback Provider)

1. **Providers** > **Add Provider** > **Quick Setup** > **OpenRouter** > **Create Provider**.
2. **API Keys** tab: Add your OpenRouter API key(s).
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled** (required for the Automatic cascade).
   - Add free models: `openai/gpt-oss-120b:free` > `meta-llama/llama-3.3-70b-instruct:free`.

### Step C: Configure the Fallback Chain

1. Go to the **Groq** provider's **Fallback** tab (or use the global **Fallback** page).
2. Click **Add Fallback Provider** > select **OpenRouter**.
3. Leave the model on **Automatic** -- the requested model is tried on OpenRouter first, then OpenRouter's saved model list is used as a cascade. Or pin a specific model such as `openai/gpt-oss-120b:free`.
4. The entry is saved immediately.

### Step D: Configure Your AI Client

1. On the **Groq** provider page, click **"Prompt for AI"** on the Base URL banner.
2. Pick your client's tab (OpenClaw, OpenCode, Claude Code, Codex CLI, Cline, Aider, or Custom).
3. Copy the generated prompt and paste it to your AI agent.

### What Happens on Failure

1. Request goes to Groq with Key #1.
2. If Key #1 fails > try Key #2, Key #3...
3. If model `gpt-oss-120b` fails > try `llama-3.3-70b-versatile` > `qwen/qwen3-32b`.
4. If all Groq keys exhausted > route to OpenRouter automatically.
5. On OpenRouter, the same key rotation and model fallback applies.
6. Your client receives a successful response without seeing any of the internal retries.
