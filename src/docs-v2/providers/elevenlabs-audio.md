# ElevenLabs (Audio)

Speech-to-Text (Scribe) and Text-to-Speech through ClawRouter. ElevenLabs is a **passthrough audio provider** -- requests are forwarded byte-identical, with your managed API key injected automatically.

> **Version 1.0.16**

> **Not a chat provider:** ElevenLabs has no chat completions. Chat-style requests (`/v1/chat/completions`, `/v1/messages`, etc.) sent to an ElevenLabs provider fail with HTTP 400 -- format translation does not apply.

---

## The ElevenLabs Preset

| Setting | Value |
|---------|-------|
| **Template** | Quick Setup > **ElevenLabs** |
| **Upstream URL** | `https://api.elevenlabs.io/v1` |
| **API Format** | `elevenlabs` |
| **API Key Mode** | `Managed` |
| **Get API Key** | [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |

**Seeded models:** `scribe_v2`, `scribe_v1` (Speech-to-Text) and `eleven_v3`, `eleven_multilingual_v2`, `eleven_flash_v2_5`, `eleven_turbo_v2_5` (Text-to-Speech). Use **Fetch Models** on the Models tab to pull the live TTS model list -- the Scribe STT models are always included.

### Authentication

ElevenLabs requires the **`xi-api-key: <key>`** header -- a Bearer or `x-api-key` credential is rejected upstream with HTTP 401 (`invalid_authorization_header`). ClawRouter handles this for you in Managed key mode:

1. Your client authenticates to ClawRouter with the normal **proxy API key** (**Settings** > **Proxy API Key**).
2. ClawRouter strips that credential and injects your managed ElevenLabs key as `xi-api-key` on the way out.

Key rotation, backoff, and connection testing work exactly as on chat providers.

---

## Using the Proxy

Point your client (or curl) at the provider's Base URL and call the standard ElevenLabs v1 endpoints:

```
http://localhost:3030/proxy/{provider-id}/v1
```

| Endpoint | Purpose |
|----------|---------|
| `POST /v1/text-to-speech/{voice_id}` | Text-to-Speech -- binary audio, piped byte-identical |
| `POST /v1/text-to-speech/{voice_id}/stream` | Streaming TTS -- zero-buffering audio pipe |
| `POST /v1/speech-to-text` | Speech-to-Text (multipart/form-data, JSON transcript) |
| `GET /v1/voices` | List available voices |
| `GET /v1/models` | List TTS models |
| `GET /v1/user` | Account info (also used by the connection test) |

### Text-to-Speech Example

```bash
curl -X POST http://localhost:3030/proxy/{provider-id}/v1/text-to-speech/{voice_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer cr_your_proxy_key" \
  -d '{
    "text": "Hello from ClawRouter!",
    "model_id": "eleven_multilingual_v2"
  }' \
  --output speech.mp3
```

### Speech-to-Text Example

```bash
curl -X POST http://localhost:3030/proxy/{provider-id}/v1/speech-to-text \
  -H "Authorization: Bearer cr_your_proxy_key" \
  -F "model_id=scribe_v2" \
  -F "file=@/path/to/audio.mp3"
```

Returns the JSON transcript from the Scribe model.

---

## Connection Testing

The **Test** button uses a zero-cost `GET /v1/user` probe -- no characters are billed. A definitively invalid key (401/403, or hard billing) is auto-disabled, exactly as on chat providers.

---

## Limitations

- **No chat / no format translation.** `elevenlabs` is a non-chat passthrough format. Chat requests fail with HTTP 400.
- **No Quota tab / usage probe.** ElevenLabs has no supported usage endpoint.
- **No token or cost extraction.** Audio responses carry no token usage, so these requests show no token counts or estimated cost in the logs. Binary audio bodies are never stored in logs -- a placeholder is recorded instead.
- **Realtime STT/TTS is not proxied.** ElevenLabs realtime endpoints run over client-direct WebSocket (`wss://api.elevenlabs.io/...`) -- connect to ElevenLabs directly for those. (Client-side vs server-side streaming are commit strategies over the same realtime endpoint; both bypass the proxy.)
