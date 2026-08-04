# Provider Fallback Chain

Switches to a completely different provider when the primary provider fails entirely (all keys exhausted or circuit breaker opens).

> **Version 1.0.15**

---

## How It Works

The Provider Fallback Chain is an ordered list of backup providers. When all keys on the primary provider are exhausted, or the circuit breaker is OPEN, ClawRouter routes the request to the next provider in the chain -- automatically and transparently.

Each fallback provider in the chain is tried sequentially until one succeeds. If all fail, the error is returned to the client.

---

## Configuration (Fallback Tab)

Each provider has a dedicated **Fallback** tab (between Models and Settings):

1. Open the primary provider's detail page.
2. Go to the **Fallback** tab.
3. A **visual chain diagram** shows the flow: source provider > each fallback target with its pinned model or `auto`.
4. Click **Add Fallback Provider**.
5. Pick a target from the provider dropdown -- it shows **all** your providers. Cross-format targets are fine: ClawRouter translates between API formats automatically (see API Format Translation).
6. Choose a model from the dropdown:
   - **Automatic** (default) -- see semantics below.
   - A saved model from the target's Models tab.
   - A live model -- click **Fetch models** to pull the target provider's catalog on demand.
   - Or type any **custom model ID** and press Enter.
7. The entry is saved immediately after adding.

**Managing the chain:**
- **Edit a model**: click the model shown on any entry to change it (same dropdown as above, including Fetch models).
- **Reorder**: use the up/down arrows -- entries are tried in order (1 > 2 > 3...).
- **Delete**: remove an entry with the delete button.
- Disabled fallback targets are visually marked so you can spot dead links in the chain.

> **Note:** The fallback chain UI lives only in the **Fallback** tab (and the global Fallback page) -- it is no longer in the Settings tab.

---

## "Automatic" Model Semantics

When an entry's model is set to **Automatic** (`fallback_model_id` empty):

1. The **originally requested model ID** is tried on the fallback provider first, as-is.
2. If the fallback provider rejects it with a model error, ClawRouter **cascades through that provider's saved model list** (its Models tab entries, in priority order).

> **Requirement:** The cascade in step 2 requires **Model Fallback to be enabled on the fallback provider** (its Models tab). Without it, only the original model ID is tried.

Pin a specific model instead when the fallback provider uses different model names than the primary.

---

## Global Fallback Page

The **Fallback** page in the sidebar (`/fallback`) summarizes every provider's chain in one place:

- Each provider card shows its chain inline: `A > B (auto) > C (model-id)`.
- Expand any card to reveal the **full chain editor** -- the same editor as the provider's Fallback tab, reading and writing the same data. Changes made in either place are reflected in both.

---

## Any Provider Can Be a Fallback

The fallback provider picker shows all providers -- including ones with a different API format than the primary. ClawRouter translates requests and responses between formats automatically (streaming included), so a fallback chain can mix, for example, an `anthropic-messages` primary with an `openai-completions` fallback. See API Format Translation for details.

---

## When It Activates

The Provider Fallback Chain triggers when:
- **All keys on the primary provider are exhausted** (every key failed or is in cooldown)
- **The circuit breaker is OPEN** (provider accumulated too many failures)

It does NOT trigger on single-key errors -- those are handled by key rotation first.

---

## Frequently Asked Questions

### Why does the fallback list only show certain providers?
It doesn't -- the picker shows **all** providers. Fallback chains can mix API formats; ClawRouter translates between formats automatically. A provider only cannot be its **own** fallback target.

### Can I add the same provider as its own fallback?
No -- a provider cannot be its own fallback target. To retry a different model on the same provider, use **Model Fallback** (Models tab) instead.

### If Provider B in my fallback chain is also down, does it try Provider C?
**Yes.** ClawRouter tries each provider in the chain sequentially until one succeeds. If all fail, the error is returned to the client.

### Fallback chain not triggering?
Checklist:
1. Is a Provider Fallback Chain configured? (Check the provider's **Fallback** tab.)
2. Is the fallback provider enabled?
3. Have all keys on the primary provider been exhausted? (Fallback only triggers after all keys fail, not on a single key error.)
4. Is the circuit breaker OPEN? (If so, it should skip directly to the fallback chain.)

### Fallback succeeds but with wrong model?
The fallback provider uses different model naming conventions. Edit the fallback entry and pin the exact model ID the fallback provider expects -- or use **Automatic** with Model Fallback enabled on the target to cascade through its saved model list.
