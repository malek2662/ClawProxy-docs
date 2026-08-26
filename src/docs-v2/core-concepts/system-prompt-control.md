# System Prompt Control (Prompt Injection)

Inject, replace, or surgically edit the system prompt of every request — per client, per provider, or per combo — directly at the gateway.

> **Version 1.0.17**

---

## What Is System Prompt Control?

ClawRouter can modify the **system prompt** of any request that passes through it, before the request is translated and sent upstream. You define a **rule** once — on a client, a provider, or a combo — and every matching request is adjusted automatically:

```
Client request → [client rule] → [combo rule] → [provider rule] → translation → upstream
```

No client reconfiguration. No per-project instruction files. The change lives in one place and applies everywhere the traffic flows.

---

## Why It Matters

Not all instructions are equal. Modern models are trained to follow an **instruction hierarchy**: the system prompt outranks user messages, which outrank project files.

| Layer | Example | Authority |
|---|---|---|
| System prompt | The client's built-in prompt, **your injected rules** | Highest |
| User messages | What you type in the chat | Medium |
| Project files | `CLAUDE.md`, `AGENTS.md` (sent as user-turn context) | Lowest |

This is not folklore — it is how the clients are built. Claude Code, for example, deliberately injects `CLAUDE.md` as *user-turn* context and lets its built-in system prompt win any conflict. **A gateway rule sits at the same tier as the client's own system prompt — strictly above every project file.**

Concretely, that means you can:

- **Steer agent behavior globally** — enforce planning-before-acting, verbosity, language, or tool-use discipline for every client at once, without editing a single client config.
- **Correct a provider's behavior** — append house rules only for traffic through a specific provider or combo.
- **Neutralize a bad instruction** — surgically remove or rewrite one sentence inside a client's 20,000-token system prompt without touching the rest.
- **Standardize a stack** — one rule on the `coding-stack` combo shapes every model behind it identically.

---

## The Three Tiers

Rules can live at three levels. When several match the same request, they compose in a fixed order:

| Order | Tier | Scope | Typical use |
|---|---|---|---|
| 1 | **Client** | Matches the detected client name (OpenCode, Claude Code, Codex…) — any provider | House rules per tool |
| 2 | **Combo** | Every request through that combo | Stack-wide behavior |
| 3 | **Provider** | Every request served by that provider — including via combos | Provider-specific corrections |

**Composition semantics:**

- `prepend` / `append` **concatenate** in tier order (client text first, then combo, then provider).
- `replace` **resets** the accumulated text — the tier closest to the model wins.
- `patch` rules run **sequentially**, each on the result of the previous tier.

---

## The Four Modes

| Mode | What it does |
|---|---|
| **Prepend** | Adds your text *before* the client's system prompt (creates one when the client sends none). |
| **Append** | Adds your text *after* the client's system prompt — still inside the system tier, so it keeps outranking user messages. |
| **Replace** | Discards the client's system prompt entirely and installs yours. Maximum control — use deliberately. |
| **Patch** | Surgical find-and-replace **inside the existing system prompt only** (exact text or regex, up to 20 rules). |

### Patch mode — surgical edits

Patch rules are the precision instrument. Each rule is `{ find, replace, regex? }`:

```json
{
  "mode": "patch",
  "patches": [
    { "find": "Never use emojis in code comments.", "replace": "" },
    { "find": "/always respond in English/i", "replace": "always respond in the user's language", "regex": true }
  ]
}
```

Only the system prompt is ever touched. **Conversation messages and `tools[]` definitions are structurally untouchable** — in every supported API format, tools are a separate field, so a patch can never break tool calling.

---

## Where to Manage Rules

Everything is managed from one place — **Prompt Injection** in the sidebar (syringe icon):

- **Client Rules tab** — create rules matched by client identity, with a live list of **detected clients** from your logs (click one to pre-fill a rule). Priority decides which rule wins when several match (first enabled match, lowest priority number).
- **Provider Rules tab** — every provider with its current rule status; edit in a slide-over.
- **Combo Rules tab** — same for combos.

The same rules can also be edited in place: a provider's **Prompt tab**, or a combo's **System Prompt card**.

### Seeing what actually happened — the Inspector

Open any request in **Logs → System Prompt tab**:

- The client's **original** system prompt, extracted per API format.
- An **Original / Effective** toggle — *Effective* shows the exact text the model received after all matching rules were applied (with a "after N rules" indicator).
- Badges for every rule tier that fired, and an **Edit rule** button that jumps straight to that rule's editor.

The logged request body always preserves what the client sent (pre-injection); the Effective view is computed from that body plus the active rules.

---

## Format Coverage

Rules work identically across all four supported API formats — OpenAI Chat, OpenAI Responses, Anthropic Messages, and Google Gemini — **including translated traffic**. Injection happens on the client-format body *before* translation, so the pivot engine carries your text into the provider's native dialect for free:

| Target format | Where the text lands |
|---|---|
| OpenAI Chat | A `system` message in the leading system/developer run |
| OpenAI Responses | Joined into `instructions` |
| Anthropic Messages | A `system` block (cache-control breakpoints preserved) |
| Google Gemini | Joined into `systemInstruction` |

Non-chat traffic (e.g. ElevenLabs audio passthrough) is never modified. When no rule matches, the request body is forwarded **byte-identical** — zero parsing, zero copying.

Rules are also **prompt-cache friendly**: injection only ever adds or sets stable text, so provider-side prompt caching keeps working.

---

## Recipes

**Enforce planning discipline on every coding client:**
> Client rule, match `opencode` (or `Claude Code`), mode *Append*:
> "Before writing code, state a 3-step plan. Prefer existing project conventions over new abstractions."

**Provider-specific correction:**
> Provider rule on your Kimi provider, mode *Append*:
> "Always answer in English, regardless of the conversation language."

**Replace a weak built-in prompt entirely:**
> Provider rule, mode *Replace* — your full battle-tested system prompt. Every request through that provider runs on your prompt.

**Remove one bad line from a huge client prompt:**
> Client rule, mode *Patch*: find the exact sentence → replace with nothing. The other ~20k tokens pass through untouched.

---

## Notes & Limits

- Patch mode needs an existing system prompt to edit — if the client sends none, a patch rule has no effect (use prepend instead).
- Client rules match against the client name ClawRouter detects from headers/User-Agent (case-insensitive *contains*). Check the Detected Clients list on the Prompt Injection page for the exact names seen in your traffic.
- Rule text is limited to 100,000 characters; patch `find` to 5,000 per rule (20 rules max) — validated on save.
- Error responses from upstream providers are passed through unchanged; rules apply to requests, not responses.
