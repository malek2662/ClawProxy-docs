# Provider Fallback Chain

Switches to a completely different provider when the primary provider fails entirely (all keys exhausted or circuit breaker opens).

> **Version 1.0.12**

---

## How It Works

The Provider Fallback Chain is an ordered list of backup providers. When all keys on the primary provider are exhausted, or the circuit breaker is OPEN, ClawRouter routes the request to the next provider in the chain -- automatically and transparently.

Each fallback provider in the chain is tried sequentially until one succeeds. If all fail, the error is returned to the client.

---

## Configuration

1. Open the primary provider's detail page.
2. Go to the **Settings** tab.
3. Scroll down to the **Provider Fallback Chain** section.
4. Click **Add Fallback Provider**.
5. A dropdown appears showing only providers with the **same API format** (safety filter).
6. *(Optional)* Set a **Target Model ID** -- if the fallback provider has saved models, they appear as a dropdown. Leave empty to pass the original model name through.
7. The entry is saved immediately after adding.
8. Repeat to add more fallback providers. They are tried in order (1 > 2 > 3...).
9. Drag-and-drop to reorder the chain.

---

## Smart Format Filtering

The fallback dropdown only shows providers matching the primary provider's API format. This prevents format incompatibility errors.

An `openai-completions` provider only shows other `openai-completions` providers as potential fallbacks.

---

## Target Model ID Mapping

Different providers may use different names for the same model. Use the Target Model ID to handle this:

| Scenario | What to Set |
|----------|-------------|
| Both providers use the same model names | Leave empty |
| Providers use different names for the same model | Set the exact model ID the fallback provider expects |
| Want to route to a completely different model on failure | Set the desired model ID |

**Example:** If Provider A uses `gpt-5` and Provider B uses `openai/gpt-5`, set the Target Model ID to `openai/gpt-5` when adding Provider B as a fallback.

---

## When It Activates

The Provider Fallback Chain triggers when:
- **All keys on the primary provider are exhausted** (every key failed or is in cooldown)
- **The circuit breaker is OPEN** (provider accumulated too many failures)

It does NOT trigger on single-key errors -- those are handled by key rotation first.

---

## Frequently Asked Questions

### Why does the fallback list only show certain providers?
ClawRouter filters by **API format** to prevent incompatible routing. Create another provider with the same API format first, then add it as a fallback.

### Can I add the same provider as its own fallback?
Yes. This is useful for targeting a different model on the same provider when the primary request fails.

### If Provider B in my fallback chain is also down, does it try Provider C?
**Yes.** ClawRouter tries each provider in the chain sequentially until one succeeds. If all fail, the error is returned to the client.

### Fallback chain not triggering?
Checklist:
1. Is a Provider Fallback Chain configured? (Check Settings tab > Fallback Chain section.)
2. Is the fallback provider enabled?
3. Have all keys on the primary provider been exhausted? (Fallback only triggers after all keys fail, not on a single key error.)
4. Is the circuit breaker OPEN? (If so, it should skip directly to the fallback chain.)

### Fallback succeeds but with wrong model?
The fallback provider uses different model naming conventions. Set the **Target Model ID** on the fallback chain entry to the exact model ID the fallback provider expects.
