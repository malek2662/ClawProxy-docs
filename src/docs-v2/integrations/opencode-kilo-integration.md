# OpenCode & Kilo CLI Integration

This guide explains how to route AI requests through **ClawProxy** using **OpenCode CLI** or **Kilo CLI**. Both tools share the same configuration format, so everything here applies to both.

> **Version 1.0.12**

---

## How It Works

OpenCode and Kilo CLI use the [Vercel AI SDK](https://sdk.vercel.ai/) under the hood. You can point any SDK provider package at ClawProxy instead of the upstream API by overriding the `baseURL` in your config. ClawProxy then handles key rotation, fallback chains, circuit breaking, and logging -- all transparently.

```
OpenCode/Kilo CLI -> ClawProxy (localhost:3030) -> upstream provider
```

> **100% Local Privacy:** ClawProxy runs entirely on your local machine. All API keys, configurations, and logs are stored locally. No data is sent to external servers other than the AI providers you explicitly configure.

> **Note on Built-In Free Models:** Both Kilo CLI and OpenCode CLI already provide access to their own free models out of the box -- no signup or API key required. ClawProxy adds value on top by enabling **key rotation**, **provider fallback chains**, **circuit breaking**, and **centralized logging** across all your providers, including third-party free-tier APIs that require their own keys (Google Gemini, Groq, OpenRouter, NVIDIA, etc.).

---

## Prerequisites

1. **ClawProxy running** on `http://localhost:3030` (default).
2. **Provider created** in the ClawProxy dashboard with API keys added (if applicable).
3. Copy the **Base URL** from the provider's detail page in the dashboard.

---

## Configuration File Location

| Tool | Config Path |
|------|------------|
| OpenCode CLI | `~/.config/opencode/opencode.json` |
| Kilo CLI | `~/.config/kilo/kilo.json` |

Create the file if it doesn't exist. The structure is identical for both.

---

## Config Structure Overview

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "my-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Provider (via Proxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/{provider-id}/v1",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "model-id": {
          "name": "Display Name",
          "limit": {
            "context": 128000,
            "output": 8192
          }
        }
      }
    }
  }
}
```

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `npm` | Yes | AI SDK package to use. See SDK Packages below. |
| `name` | Yes | Display name shown in the CLI provider selector. |
| `options.baseURL` | Yes | ClawProxy proxy URL for this provider. |
| `options.headers` | No | Custom headers sent with every request. Use for auth tokens. |
| `models` | Yes | Dictionary of available models with their limits. |
| `models.{id}.name` | Yes | Human-readable model name. |
| `models.{id}.limit.context` | Yes | Maximum input tokens (context window). |
| `models.{id}.limit.output` | Yes | Maximum output tokens. |
| `models.{id}.variants` | No | Named presets for provider-specific features (e.g., thinking modes). |

### SDK Packages

| Package | Use For |
|---------|---------|
| `@ai-sdk/openai-compatible` | Most providers -- OpenRouter, NVIDIA, Groq, Cerebras, Cohere, Ollama Cloud, etc. |
| `@ai-sdk/google` | Google Gemini only (uses the native Google SDK). |
| `@ai-sdk/anthropic` | Anthropic Claude (native Anthropic SDK). |
| `@ai-sdk/openai` | OpenAI (native OpenAI SDK). |

> **Tip:** When in doubt, use `@ai-sdk/openai-compatible`. It works with any OpenAI-compatible endpoint, which covers the majority of providers routed through ClawProxy.

### About the Authorization Header

Use **any value** for the `Authorization` header (e.g., `"Bearer any-value"`). ClawProxy strips the client header and injects your real, managed API keys before forwarding to the upstream provider.

> **Exception:** If your provider's API Key Mode is set to **Pass Through** in ClawProxy, the header you set here will be forwarded as-is to the upstream provider.

---

## Setup Steps

1. **Create the provider** in ClawProxy dashboard (Quick Setup or Custom).
2. **Add your API keys** in the provider's **API Keys** tab.
3. **Copy the Base URL** from the top of the provider's detail page.
4. **Edit your config file** (`opencode.json` or `kilo.json`) and add the provider entry.
5. **Launch the CLI** -- your new provider appears in the provider selector.
6. **Select the provider** and enter any value when prompted for an API key.

---

## Provider Configurations

### Google AI Studio (Gemini)

The most generous free tier with high rate limits. Get a free API key from [Google AI Studio](https://aistudio.google.com/).

| Setting | Value |
|---------|-------|
| **Dashboard Template** | Quick Setup > **Google Gemini** |
| **API Key Mode** | `Managed` |
| **SDK Package** | `@ai-sdk/google` |

> **Note:** Google Gemini uses `@ai-sdk/google` (not `openai-compatible`) and the Base URL ends with `/v1beta`.

**Models:**

| Model ID | Description | Context | Output |
|----------|-------------|---------|--------|
| `gemini-3.1-pro-preview` | Flagship -- best quality | 1,000,000 | 64,000 |
| `gemini-3-flash-preview` | High speed with large context | 1,048,576 | 65,536 |
| `gemini-2.5-pro` | Previous gen Pro | 128,000 | 64,000 |
| `gemini-2.5-flash` | Previous gen Flash | 1,048,576 | 65,536 |
| `gemini-3.1-flash-lite-preview` | Newest lightweight model | 1,000,000 | 65,536 |

**Configuration:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "google-proxy": {
      "npm": "@ai-sdk/google",
      "name": "Google Gemini (via ClawProxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/google-gemini/v1beta",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "gemini-3.1-pro-preview": {
          "name": "Gemini 3.1 Pro",
          "limit": { "context": 1000000, "output": 64000 },
          "variants": {
            "low": {
              "thinkingConfig": { "includeThoughts": true, "thinkingLevel": "low" }
            },
            "high": {
              "thinkingConfig": { "includeThoughts": true, "thinkingLevel": "high" }
            }
          }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash",
          "limit": { "context": 1048576, "output": 65536 },
          "variants": {
            "low": {
              "thinkingConfig": { "includeThoughts": true, "thinkingLevel": "low" }
            },
            "high": {
              "thinkingConfig": { "includeThoughts": true, "thinkingLevel": "high" }
            }
          }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro",
          "limit": { "context": 128000, "output": 64000 },
          "variants": {
            "high": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 16000 }
            },
            "max": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 24576 }
            }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash",
          "limit": { "context": 1048576, "output": 65536 },
          "variants": {
            "high": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 16000 }
            },
            "max": {
              "thinkingConfig": { "includeThoughts": true, "thinkingBudget": 24576 }
            }
          }
        },
        "gemini-3.1-flash-lite-preview": {
          "name": "Gemini 3.1 Flash Lite",
          "limit": { "context": 1000000, "output": 65536 }
        }
      }
    }
  }
}
```

> **About Variants:** The `variants` field enables thinking/reasoning modes for Gemini models. Select a variant in the CLI to activate extended thinking with configurable budget or level. Models without variants run in standard mode.

---

### Groq (LPU Inference)

Extreme speed inference for open models. Free tier is rate-limited but completely free. Get a key from [Groq Console](https://console.groq.com/).

| Setting | Value |
|---------|-------|
| **Dashboard Template** | Quick Setup > **Groq** |
| **API Key Mode** | `Managed` |
| **SDK Package** | `@ai-sdk/openai-compatible` |

**Models:**

| Model ID | Description | Context | Output |
|----------|-------------|---------|--------|
| `openai/gpt-oss-120b` | New Flagship | 131,072 | 16,384 |
| `llama-3.3-70b-versatile` | Versatile | 128,000 | 32,768 |
| `llama-3.1-8b-instant` | Ultra-fast | 131,072 | 8,192 |
| `mixtral-8x7b-32768` | Large context MoE | 32,768 | 8,192 |

**Configuration:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "groq-proxy": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Groq (via ClawProxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/groq/v1",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "openai/gpt-oss-120b": {
          "name": "GPT-OSS 120B",
          "limit": { "context": 131072, "output": 16384 }
        },
        "llama-3.3-70b-versatile": {
          "name": "Llama 3.3 70B",
          "limit": { "context": 128000, "output": 32768 }
        },
        "llama-3.1-8b-instant": {
          "name": "Llama 3.1 8B Instant",
          "limit": { "context": 131072, "output": 8192 }
        },
        "mixtral-8x7b-32768": {
          "name": "Mixtral 8x7B",
          "limit": { "context": 32768, "output": 8192 }
        }
      }
    }
  }
}
```

---

### OpenRouter (Free Tier)

Model aggregator with many free models. Get a free key from [OpenRouter](https://openrouter.ai/).

| Setting | Value |
|---------|-------|
| **Dashboard Template** | Quick Setup > **OpenRouter** |
| **API Key Mode** | `Managed` |
| **SDK Package** | `@ai-sdk/openai-compatible` |

**Free Models:**

| Model ID | Context | Output |
|----------|---------|--------|
| `stepfun/step-3.5-flash:free` | 256,000 | 8,192 |
| `arcee-ai/trinity-large-preview:free` | 128,000 | 8,192 |
| `z-ai/glm-4.5-air:free` | 128,000 | 8,192 |
| `qwen/qwen3-coder:free` | 128,000 | 8,192 |
| `openai/gpt-oss-120b:free` | 131,072 | 16,384 |
| `google/gemma-3-27b-it:free` | 96,000 | 8,192 |
| `meta-llama/llama-3.3-70b-instruct:free` | 128,000 | 8,192 |

Check for more: https://openrouter.ai/models

**Configuration:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openrouter-proxy": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "OpenRouter (via ClawProxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/openrouter/v1",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "stepfun/step-3.5-flash:free": {
          "name": "Step 3.5 Flash",
          "limit": { "context": 256000, "output": 8192 }
        },
        "arcee-ai/trinity-large-preview:free": {
          "name": "Trinity Large Preview",
          "limit": { "context": 128000, "output": 8192 }
        },
        "z-ai/glm-4.5-air:free": {
          "name": "GLM 4.5 Air",
          "limit": { "context": 128000, "output": 8192 }
        },
        "qwen/qwen3-coder:free": {
          "name": "Qwen3 Coder",
          "limit": { "context": 128000, "output": 8192 }
        },
        "openai/gpt-oss-120b:free": {
          "name": "GPT-OSS 120B",
          "limit": { "context": 131072, "output": 16384 }
        },
        "google/gemma-3-27b-it:free": {
          "name": "Gemma 3 27B",
          "limit": { "context": 96000, "output": 8192 }
        },
        "meta-llama/llama-3.3-70b-instruct:free": {
          "name": "Llama 3.3 70B",
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  }
}
```

---

### NVIDIA NIM

High-performance hosted models. Free tier available via [NVIDIA Developer](https://build.nvidia.com/).

| Setting | Value |
|---------|-------|
| **Dashboard Template** | Quick Setup > **NVIDIA NIM** |
| **API Key Mode** | `Managed` |
| **SDK Package** | `@ai-sdk/openai-compatible` |

**Models:**

| Model ID | Description | Context | Output |
|----------|-------------|---------|--------|
| `z-ai/glm5` | Flagship | 128,000 | 16,384 |
| `minimaxai/minimax-m2.5` | Productivity / Coding | 204,800 | 8,192 |
| `moonshotai/kimi-k2.5` | Newest Multimodal | 128,000 | 8,192 |
| `deepseek-ai/deepseek-v3.2` | Efficient Reasoning | 128,000 | 8,192 |
| `deepseek-ai/deepseek-r1` | Deep Reasoning | 128,000 | 8,192 |

Check for more: https://build.nvidia.com/models

**Configuration:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "nvidia-proxy": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "NVIDIA NIM (via ClawProxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/nvidia-nim/v1",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "z-ai/glm5": {
          "name": "GLM 5",
          "limit": { "context": 128000, "output": 16384 }
        },
        "minimaxai/minimax-m2.5": {
          "name": "MiniMax M2.5",
          "limit": { "context": 204800, "output": 8192 }
        },
        "moonshotai/kimi-k2.5": {
          "name": "Kimi K2.5",
          "limit": { "context": 128000, "output": 8192 }
        },
        "deepseek-ai/deepseek-v3.2": {
          "name": "DeepSeek V3.2",
          "limit": { "context": 128000, "output": 8192 }
        },
        "deepseek-ai/deepseek-r1": {
          "name": "DeepSeek R1",
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  }
}
```

---

### Ollama Cloud

Access frontier open-weight models hosted on Ollama's cloud. No local hardware required. Get a key from [Ollama](https://ollama.com/).

| Setting | Value |
|---------|-------|
| **Dashboard Template** | Quick Setup > **Ollama Cloud** |
| **API Key Mode** | `Managed` |
| **SDK Package** | `@ai-sdk/openai-compatible` |

**Models:**

| Model ID | Description | Context | Output |
|----------|-------------|---------|--------|
| `glm-5:cloud` | Strongest / Reasoning | 128,000 | 16,384 |
| `minimax-m2.5:cloud` | Productivity / Coding | 204,800 | 8,192 |
| `qwen3.5:397b-cloud` | Newest Multimodal | 128,000 | 8,192 |
| `gemini-3-flash-preview:cloud` | Frontier Speed | 128,000 | 8,192 |
| `deepseek-v3.2:cloud` | Efficient Reasoning | 128,000 | 8,192 |

Check for more: https://ollama.com/search?c=cloud&o=newest

**Configuration:**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama-proxy": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama Cloud (via ClawProxy)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/ollama-cloud/v1",
        "headers": {
          "Authorization": "Bearer any-value"
        }
      },
      "models": {
        "glm-5:cloud": {
          "name": "GLM 5",
          "limit": { "context": 128000, "output": 16384 }
        },
        "minimax-m2.5:cloud": {
          "name": "MiniMax M2.5",
          "limit": { "context": 204800, "output": 8192 }
        },
        "qwen3.5:397b-cloud": {
          "name": "Qwen 3.5 397B",
          "limit": { "context": 128000, "output": 8192 }
        },
        "gemini-3-flash-preview:cloud": {
          "name": "Gemini 3 Flash",
          "limit": { "context": 128000, "output": 8192 }
        },
        "deepseek-v3.2:cloud": {
          "name": "DeepSeek V3.2",
          "limit": { "context": 128000, "output": 8192 }
        }
      }
    }
  }
}
```

> **Note:** When adding the API key in ClawProxy, use `sk-not-required` as the key value. Ollama Cloud uses header-based auth that ClawProxy manages automatically.

---

## Combining Multiple Providers

You can add multiple providers in a single config file. Each provider appears as a separate option in the CLI's provider selector.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "google-proxy": {
      "npm": "@ai-sdk/google",
      "name": "Google Gemini (Free)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/google-gemini/v1beta",
        "headers": { "Authorization": "Bearer any-value" }
      },
      "models": {
        "gemini-3.1-pro-preview": {
          "name": "Gemini 3.1 Pro",
          "limit": { "context": 1000000, "output": 64000 }
        }
      }
    },
    "nvidia-proxy": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "NVIDIA NIM (Free)",
      "options": {
        "baseURL": "http://localhost:3030/proxy/nvidia-nim/v1",
        "headers": { "Authorization": "Bearer any-value" }
      },
      "models": {
        "minimaxai/minimax-m2.5": {
          "name": "MiniMax M2.5",
          "limit": { "context": 204800, "output": 8192 }
        }
      }
    }
  }
}
```

> **Tip:** You can mix free-tier providers with paid providers -- all in the same config file.

---

## Adding Any Provider

ClawProxy supports **any provider** with an OpenAI-compatible, Google, or Anthropic API format. To add a provider not listed here:

1. **Create the provider** in ClawProxy dashboard (Quick Setup template or Custom).
2. **Identify the right SDK package:**
   - Most providers > `@ai-sdk/openai-compatible`
   - Google Gemini > `@ai-sdk/google`
   - Anthropic Claude > `@ai-sdk/anthropic`
3. **Copy the Base URL** from the provider's detail page.
4. **Look up model IDs and limits** from the provider's documentation, or use **Fetch Models** in the ClawProxy dashboard.
5. **Add the entry** to your config file following the structure above.

---

## Troubleshooting

**Provider not appearing in CLI?**
- Verify the JSON is valid (no trailing commas, correct brackets).
- Restart the CLI after editing the config file.

**"Model not found" errors?**
- Double-check the model ID matches exactly what the upstream provider expects.
- Use **Fetch Models** in ClawProxy dashboard to see current valid model IDs.
- External providers may change model IDs without notice.

**Connection refused?**
- Ensure ClawProxy is running: `clawproxy status` or check `http://localhost:3030`.
- Verify the `baseURL` port matches your ClawProxy port (default: 3030).

**Auth errors from upstream?**
- Check that API keys are correctly added in the ClawProxy dashboard (not in the CLI config).
- Verify the API Key Mode matches your provider type (`Managed` for most providers).

**Streaming not working?**
- ClawProxy supports SSE streaming with zero buffering. If you experience issues, check the ClawProxy logs at `http://localhost:3030` > **Logs** page for error details.
