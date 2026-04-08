# Configuring Fallback

Step-by-step guide for setting up provider fallback chains and building a complete multi-provider fallback system.

> **Version 1.0.12**

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
8. Repeat to add more fallback providers. They are tried in order (1 > 2 > 3...).
9. Drag-and-drop to reorder the chain.

**When it activates:** When ALL keys on the primary provider are exhausted, or when the circuit breaker is OPEN.

---

## Set Up a Complete Multi-Provider Fallback System

**Goal:** Create a robust AI routing setup with key rotation, model fallback, and provider fallback.

**Scenario:** You want to use Groq as primary, with OpenRouter as fallback, and model fallback enabled on both.

### Step A: Set Up Groq (Primary Provider)

1. **Providers** > **Add Provider** > **Quick Setup** > **Groq** > **Create Provider**.
2. **API Keys** tab: Add your Groq API key(s). Add multiple for extra resilience.
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled**.
   - Click **Fetch Models** to load available models.
   - Add models in priority order: `openai/gpt-oss-120b` > `llama-3.3-70b-versatile` > `llama-3.1-8b-instant`.

### Step B: Set Up OpenRouter (Fallback Provider)

1. **Providers** > **Add Provider** > **Quick Setup** > **OpenRouter** > **Create Provider**.
2. **API Keys** tab: Add your OpenRouter API key(s).
3. **Models** tab:
   - Toggle **Model Fallback** to **Enabled**.
   - Add free models: `openai/gpt-oss-120b:free` > `meta-llama/llama-3.3-70b-instruct:free`.

### Step C: Configure the Fallback Chain

1. Go to the **Groq** provider's **Settings** tab.
2. Scroll to **Provider Fallback Chain**.
3. Click **Add Fallback Provider** > select **OpenRouter**.
4. Set **Target Model ID** to `openai/gpt-oss-120b:free` (or leave empty if using the same model names).
5. The entry is saved immediately.

### Step D: Configure OpenClaw

1. On the **Groq** provider page, click **"Prompt for AI"**.
2. Copy the prompt and paste to your OpenClaw agent.
3. Your AI client now sends requests to Groq through ClawProxy.

### What Happens on Failure

1. Request goes to Groq with Key #1.
2. If Key #1 fails > try Key #2, Key #3...
3. If model `gpt-oss-120b` fails > try `llama-3.3-70b-versatile` > `llama-3.1-8b-instant`.
4. If all Groq keys exhausted > route to OpenRouter automatically.
5. On OpenRouter, same key rotation and model fallback applies.
6. Your client receives a successful response without seeing any of the internal retries.
