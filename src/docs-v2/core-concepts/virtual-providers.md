# Virtual Providers (Combos)

Merge models from multiple providers behind a single endpoint — add it to your AI client once and the client sees every member model.

> **Version 1.0.18**

---

## What Is a Combo?

A **combo** (virtual provider) is a named ClawRouter endpoint that aggregates models from several real providers:

```
Client → /proxy/{combo-id}/v1/chat/completions → ClawRouter → the right member provider
```

Instead of configuring Kimi, xAI, and OpenCode Zen separately in every client, you create one combo (e.g. `coding-stack`) and add a single provider entry to the client. The client then picks between `kimi/k3`, `xai/grok-4`, `zen/big-pickle`, … from one list.

Combos work with **every client format** — OpenAI, Anthropic, Responses API, and Gemini style paths are all accepted on the same endpoint; ClawRouter translates per member automatically.

---

## How Routing Works

Each member row binds three things: a **provider**, a **model** on that provider, and a public **alias** — the model name clients actually use (e.g. `kimi/k3`).

When a request arrives at the combo endpoint:

1. ClawRouter reads the requested model (the alias) in the client's own API format.
2. It resolves the alias to the combo's members, in **priority order** (the order shown on the combo page).
3. The request is forwarded to the first matching member with the alias rewritten to the member's bare model id.
4. If that member fails, the request moves to the next member serving the same alias — full key rotation, fallback chains, circuit breakers, and format translation of the member apply per hop.
5. An alias no member serves returns a 404 in the client's API format.

**Duplicate aliases = failover.** Two members may publish the same alias (same model via two providers). The first (highest-priority) member is tried first; the second takes over on failure.

A bare model id (no prefix) also works when exactly **one** member serves that model.

---

## Creating a Combo

1. Open the **Combos** page in the dashboard sidebar.
2. Click **New Combo**, give it a name, and press **Create** — the combo is created immediately and its detail page opens.
3. On the detail page, add members: pick a provider, pick (or type) the model, and edit the public alias if needed (defaults to `provider-id/model-id`).
4. Reorder members with the arrows — order is the failover priority — then **Save**.

The detail page shows the combo's **Base URL** (copy button) and a **Prompt for AI** button that generates ready-to-paste configuration for OpenClaw, OpenCode, Claude Code, Codex CLI, Qwen Code, DeepSeek Harness, or a custom client — with the alias list and per-model limits pre-filled.

## Model Discovery

`GET /proxy/{combo-id}/v1/models` (and the Gemini `/v1beta` variant) returns the synthesized model list — one entry per alias, failover duplicates published once. Clients that fetch a model list see the aliases exactly as they appear on the combo page.

## Logging & Notifications

Combo requests are logged under the **combo id** (filterable in Logs, marked "(Combo)"). A normal serve by the priority member is a clean row. When a real failover serves the request, the row shows the requested alias, the served model, and an amber fallback badge with the serving provider — plus a Provider Fallback notification.

## When to Use a Combo vs a Fallback Chain

- **Fallback chain** — one model identity, automatic backup *providers* when it fails. The client keeps calling one model name.
- **Combo** — many *different* models from different providers behind one client configuration, chosen by the client per request, with optional same-alias failover.

They compose: a combo member that has its own fallback chain will fall through its chain before the combo moves to the next member.
