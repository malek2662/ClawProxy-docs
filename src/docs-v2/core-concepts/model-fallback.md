# Model Fallback

Automatically retries a failed request with an alternative model, **same provider, same API key**.

> **Version 1.0.13**

---

## How It Works

When a model returns a "model not found" or "invalid model" error, ClawRouter silently switches to the next model in your priority list and retries the request -- using the same API key, on the same provider.

**Example scenario:**
- You have models: `gpt-5-nano` (priority 1), `minimax-m2.5-free` (priority 2), `big-pickle` (priority 3).
- Client requests `gpt-5-nano`. If it returns a model error, ClawRouter silently retries with `minimax-m2.5-free`. If that also fails, it tries `big-pickle`.
- Your client never sees the internal retries.

---

## Trigger Conditions

Model Fallback only triggers on **MODEL_ERROR** classification:

| HTTP Status | Body Pattern | Example |
|-------------|-------------|---------|
| 404 | "model" in the error message | Standard model not found |
| 400 | "model" + "not found" / "invalid" patterns | Invalid model ID |
| 401 | "ModelError" | OpenCode Zen quirk |
| 401 | "PAID_MODEL_AUTH_REQUIRED" | Kilo AI paid model without subscription |

Model Fallback does **NOT** trigger on rate limits, auth errors, server errors, or timeouts. Those are handled by key rotation.

---

## Configuration

1. Open the provider's **Models** tab.
2. Toggle **Model Fallback** to **Enabled**.
3. Add models in priority order:
   - Type a model ID manually and press Enter or click Add.
   - Or use **Fetch Models** to automatically retrieve available models from the upstream API.
4. The first model in the list is the most preferred.
5. Use the up/down arrows to reorder priorities.

> **Seeded models:** When you create a provider from a Quick Setup preset, the preset's recommended models are saved to the Models tab automatically -- no manual adding needed.

---

## Fetch Models

The **Fetch Models** button queries the upstream provider's API and displays available models.

- For **Kilo AI** and **OpenCode Zen**: models show **Free** and **Paid** badges.
- Use the **search box** to filter models by name or ID.
- Click **+ Add** next to any model to add it to the fallback list.
- Click **Add All Free** to add every free model at once (bypass providers).

**Caching:** Results are cached in memory for **5 minutes** -- repeated fetches within that window return instantly, and concurrent fetches are deduplicated into a single upstream request. The cache is invalidated automatically whenever a key is added, deleted, or toggled (model catalogs can differ per key tier). Once results are displayed, the button becomes **Refresh** -- clicking it forces a fresh fetch, bypassing the cache.

> **Note:** For providers without a public models endpoint (Perplexity, MiniMax), ClawRouter returns a hardcoded list of known supported models. Anthropic has a live paginated `/v1/models` endpoint -- ClawRouter fetches it for real, with a hardcoded list only as a fallback.

---

## Behavior Cascade

When a model error occurs:

1. Models are tried in priority order: 1 > 2 > 3...
2. If all models fail > try next key.
3. If all keys exhausted > trigger Provider Fallback Chain.

---

## Frequently Asked Questions

### What is the difference between Model Fallback and Provider Fallback?
- **Model Fallback** = same provider, same key, different model.
- **Provider Fallback** = different provider entirely (all keys and models exhausted first).

### Model Fallback not triggering?
Checklist:
1. Is **Model Fallback** toggled to **Enabled** in the Models tab?
2. Are there models saved in the fallback list? (Must have at least 2 models.)
3. Is the error actually a model error? Check the log -- only MODEL_ERROR classification triggers fallback. Rate limits and auth errors do NOT trigger model fallback.

### "PAID_MODEL_AUTH_REQUIRED" error?
You're trying to use a paid model on a bypass provider (Kilo AI or OpenCode Zen) without a paid subscription. Use only **Free** models. Go to **Models** tab > **Fetch Models** and look for models with the **Free** badge.
