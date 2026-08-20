# Configuring Models

Step-by-step guides for discovering models, adding them to your provider, and enabling Model Fallback.

> **Version 1.0.16**

---

## Discover Available Models (Fetch Models)

**Goal:** See what models a provider offers and add them to your fallback list.

1. Open the provider's detail page.
2. Go to the **Models** tab.
3. Click **Fetch Models** (or "Fetch from Provider").
4. ClawRouter queries the upstream provider's API and displays available models.
5. For **Kilo AI** and **OpenCode Zen**: models show **Free** / **Paid** badges.
6. Use the **search box** to filter models by name or ID.
7. Click **+ Add** next to any model to add it to the fallback list.
8. Click **Add All Free** to add every free model at once (bypass providers).
9. To use a model ID in your AI client, simply **copy the Model ID** shown in the list.

**How to use the model ID in your AI client (OpenClaw):**
1. Copy the model ID from the Fetch Models list (e.g., `giga-potato-thinking`).
2. In your OpenClaw config, add it to the models array:
   ```json
   { "id": "giga-potato-thinking", "name": "giga-potato-thinking" }
   ```

**Caching:** Fetched lists are cached in memory for **5 minutes** (concurrent fetches share a single upstream request). The cache is invalidated automatically when a key is added, deleted, or toggled. Once results are displayed, the button becomes **Refresh** and forces a fresh fetch, bypassing the cache.

> **Note:** For providers without a public models endpoint (Perplexity, MiniMax), ClawRouter returns a hardcoded list of known supported models. Anthropic is fetched live from its paginated `/v1/models` endpoint, with a hardcoded list only as a fallback.

---

## Seeded Preset Models

When you create a provider from a **Quick Setup preset**, the preset's recommended models are saved to the Models tab automatically. You can reorder, delete, or add to them like any manually added model -- they are a starting point, not a locked list.

---

## Enable Model Fallback

**Goal:** Automatically switch to a different model when one fails.

1. Open the provider's **Models** tab.
2. Toggle **Model Fallback** to **Enabled**.
3. Add models in priority order:
   - Type a model ID manually and press Enter or click Add.
   - Or use **Fetch Models** and click **+ Add** for each desired model.
4. The first model in the list is the most preferred. If it fails, the second is tried, then the third, etc.
5. Use the up/down arrows to reorder priorities.

**When it activates:** Only when a model returns a "model not found", "invalid model", or "subscription required" error (not on rate limits or auth errors).

**Example scenario:**
- You have models: `gpt-5-nano` (priority 1), `minimax-m2.5-free` (priority 2), `big-pickle` (priority 3).
- Client requests `gpt-5-nano`. If it returns a model error, ClawRouter silently retries with `minimax-m2.5-free`. If that also fails, it tries `big-pickle`.

---

## Model Circuit Breaker ("Skipped" Badges)

Models that fail repeatedly are skipped automatically so requests don't waste time hitting a dead model. While skipped, the model's row on the **Models** tab shows an amber **"Skipped - reason - ~time"** badge with the failure reason and approximate remaining cooldown.

> **Tip:** Plan-gated models (e.g., Ollama Cloud models that require a subscription) surface this way. Providers don't mark free vs paid models in their API, so a gated model is discovered at runtime and shows up as a "Skipped" badge. Remove it from your fallback list if you don't have the required plan.

See **Core Concepts > Model Fallback > Model Circuit Breaker** for the full behavior (thresholds, error-type-aware cooldowns, fail-open probing, and the related settings).

---

## Do I Need to Define Models in the Dashboard?

**Generally, no.** You define the Provider and its API Keys in ClawRouter. Model selection happens in your AI client (like OpenClaw). When your client requests a model, ClawRouter forwards the request upstream as-is.

**Exception:** Add models to the provider's **Models tab** if you want to use **Model Fallback** (automatic retry with a different model). Saved models also appear as options when configuring the Provider Fallback Chain, and power the **Automatic** cascade on fallback entries.
