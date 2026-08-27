# API Format Translation

ClawRouter automatically translates between AI API formats, so any AI client works with any provider -- regardless of which API format each side speaks.

> **Version 1.0.18**

---

## What It Is

Every AI client speaks an API format (OpenAI Chat Completions, Anthropic Messages, etc.), and every provider speaks one too. Previously these had to match. ClawRouter now translates between formats automatically -- **any-to-any**: every client format works with every provider format.

Your client keeps using its native format. ClawRouter detects it, translates to the provider's format when needed, and translates the response back -- transparently, for streaming and non-streaming traffic.

---

## Supported Formats

| Format | Description | Proxy URL Pattern |
|--------|-------------|-------------------|
| `openai-completions` | OpenAI Chat Completions (most providers) | `/proxy/{id}/v1` |
| `openai-responses` | OpenAI Responses API | `/proxy/{id}/v1` |
| `anthropic-messages` | Anthropic Claude Messages | `/proxy/{id}/v1` |
| `google-generative-ai` | Google Gemini API | `/proxy/{id}/v1beta` |

Every combination works: an OpenAI-style client can talk to an Anthropic-format provider, a Claude Code client can talk to a Google Gemini provider, and so on.

> **Excluded from translation:** the `elevenlabs` format (ElevenLabs audio) is a **non-chat passthrough** -- requests are forwarded byte-identical, and chat-style requests to an ElevenLabs provider fail with HTTP 400. See Providers > ElevenLabs (Audio).

---

## How the Client Format Is Detected

ClawRouter auto-detects the client's API format from the **request path**:

| Request Path | Detected Client Format |
|--------------|------------------------|
| `/v1/chat/completions` | `openai-completions` |
| `/v1/responses` | `openai-responses` |
| `/v1/messages` | `anthropic-messages` |
| `/v1beta/models/...` | `google-generative-ai` |

No configuration is needed -- point your client at the provider's Base URL and ClawRouter handles the rest.

---

## Zero-Copy Passthrough

When the client format and the provider format **match**, traffic is passed through **byte-identical** -- no parsing, no re-serialization, zero translation overhead. Translation only kicks in when the two formats differ.

---

## What Translation Preserves

Cross-format translation is full-fidelity, covering:

- **Streaming (SSE)** and non-streaming responses
- **Tool calling** (function calling / tool use blocks)
- **Reasoning / thinking blocks**
- **Token usage accounting** (so the Usage page stays accurate)
- **Images** and multimodal content

---

## Cross-Format Fallback Chains

The Provider Fallback Chain can now mix providers of different formats. The old same-format filter was removed -- the fallback dropdown shows **all** providers, and fallbacks across formats are translated automatically.

Example: a `google-generative-ai` primary can fall back to an `openai-completions` provider -- ClawRouter translates the request and response in both directions.

---

## "Prompt for AI" -- Every Tab, Every Provider

All 7 tabs of the **"Prompt for AI"** dialog (OpenClaw, OpenCode, Claude Code, Codex CLI, Qwen Code, DeepSeek Harness, Custom / Other) now work with **every provider**. When the client's native format differs from the provider's format, the tab shows an **amber note** explaining that ClawRouter translates automatically -- instead of the old "not available" explanation.

### Claude Code Identity Preamble

Claude Code clients (detected via the `claude-cli` user-agent) automatically receive the Claude Code identity/system preamble when talking to **non-Anthropic** providers, so the experience matches native Anthropic behavior.

---

## Limitations

- **Non-chat endpoints are not translated.** Embeddings, image generation, model listings, and similar endpoints pass through as before. Translation applies to chat-style request/response traffic.
- **The `elevenlabs` format is never translated.** ElevenLabs is a passthrough audio provider (Speech-to-Text / Text-to-Speech) -- every request is forwarded byte-identical regardless of path.
- **Pass Through key mode + proxy API key auth are incompatible.** Providers in Pass Through mode forward the client's credential upstream -- with proxy auth enabled, that credential is the proxy key, not a real provider key. Use Managed or None mode for such providers. See Global Settings > Proxy API Key.
