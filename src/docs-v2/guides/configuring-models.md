# Configuring Models

Step-by-step guides for discovering models, adding them to your provider, and enabling Model Fallback.

> **Version 1.0.12**

---

## Discover Available Models (Fetch Models)

**Goal:** See what models a provider offers and add them to your fallback list.

1. Open the provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models** (or "Fetch from Provider").
4. ClawProxy queries the upstream provider's API and displays available models.
5. For **Kilo AI** and **OpenCode Zen**: models show **Free** / **Paid** badges.
6. Use the **search box** to filter models by name or ID.
7. Click **+ Add** next to any model to add it to the fallback list.
8. Click **Add All** to add all displayed models at once.
9. To use a model ID in your AI client, simply **copy the Model ID** shown in the list.

**How to use the model ID in your AI client (OpenClaw):**
1. Copy the model ID from the Fetch Models list (e.g., `giga-potato-thinking`).
2. In your OpenClaw config, add it to the models array:
   ```json
   { "id": "giga-potato-thinking", "name": "giga-potato-thinking" }
   ```

> **Note:** For providers without a public models endpoint (Perplexity, Anthropic), ClawProxy returns a hardcoded list of known supported models.

---

## Enable Model Fallback

**Goal:** Automatically switch to a different model when one fails.

1. Open the provider's **Models** tab.
2. Toggle **Model Fallback** to **Enabled**.
3. Add models in priority order:
   - Type a model ID manually and press Enter or click Add.
   - Or use **Fetch Models** and click **+ Add** for each desired model.
4. The first model in the list is the most preferred. If it fails, the second is tried, then the third, etc.
5. Drag-and-drop models to reorder priorities.

**When it activates:** Only when a model returns a "model not found" or "invalid model" error (not on rate limits or auth errors).

**Example scenario:**
- You have models: `gpt-5-nano` (priority 1), `minimax-m2.5-free` (priority 2), `big-pickle` (priority 3).
- Client requests `gpt-5-nano`. If it returns a model error, ClawProxy silently retries with `minimax-m2.5-free`. If that also fails, it tries `big-pickle`.

---

## Do I Need to Define Models in the Dashboard?

**Generally, no.** You define the Provider and its API Keys in ClawProxy. Model selection happens in your AI client (like OpenClaw). When your client requests a model, ClawProxy forwards the request upstream as-is.

**Exception:** Add models to the provider's **Models tab** if you want to use **Model Fallback** (automatic retry with a different model). Saved models also appear as options when setting Target Model IDs in the Provider Fallback Chain.
