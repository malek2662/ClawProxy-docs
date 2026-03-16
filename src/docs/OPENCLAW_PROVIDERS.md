# OpenClaw Integration Guide

This document contains a registry of custom providers and models supported by **ClawProxy**. 
You can use this guide to easily add these providers to your **OpenClaw** configuration.

---

## 🛠️ How to Add These Models to OpenClaw

To add any of the providers below to OpenClaw, open your OpenClaw configuration file (`~/.openclaw/openclaw.json`) and place the provider configuration inside the `models.providers` section.

> **Note about `apiKey`:** 
> You can use any dummy value (e.g., `dummy-key`) for the `apiKey` field in OpenClaw. ClawProxy will automatically strip the dummy key and inject your real, managed API keys to authenticate with the upstream providers!

> **🔒 100% Local Privacy & Security:** 
> ClawProxy runs entirely on your local machine. All your API keys, subscription tokens, and configuration details are stored securely in your local database. **No data, telemetry, or keys are ever sent to any external server.** You have complete ownership and privacy over your accounts.

> **💡 Note about Models:** 
> You **do not** individually add models inside the ClawProxy Dashboard. You only add the *Provider*. Models are defined dynamically inside your OpenClaw configuration (`models.providers[...].models` array). ClawProxy simply accepts any requested model from OpenClaw and passes it correctly to the Upstream base URL!

> **⚠️ Note on Model IDs:** 
> The specific Model IDs used by external AI providers are subject to change without notice. If you experience unexpected routing behavior or model errors, please independently verify the current valid Model ID directly with the target provider's official documentation.

---

## 🤖 Method 1: The "Prompt for AI" (Recommended)

ClawProxy features an intelligent **"🪄 Prompt for AI"** button on every provider's page. This generates a sophisticated, ready-to-use prompt that you can simply copy and paste to OpenClaw's AI agent.

1.  **Add Provider**: Create your provider in the ClawProxy Dashboard.
2.  **Generate Prompt**: Click **"🪄 Prompt for AI"** on the provider's page.
3.  **Deploy**: Paste the prompt to your OpenClaw agent to automatically configure the provider and its best models.

---

## 📝 Method 2: Manual Configuration

If you prefer to edit your `openclaw.json` manually, use the structure below. Ensure you use the **auto-generated Base URL** provided by ClawProxy.

```json
"PROVIDER_NAME": {
  "baseUrl": "AUTO_GENERATED_CLAWPROXY_URL",
  "apiKey": "dummy-key",
  "api": "API_FORMAT",
  "models": [
    { "id": "MODEL_ID", "name": "FRIENDLY_NAME" }
  ]
}
```

**Workflow in ClawProxy Dashboard:**
1.  **Name**: Set an internal reference name.
2.  **Upstream URL**: Enter the official service endpoint.
3.  **API Key Mode**: Select `Managed` (secure) or `None` (bypass).
4.  **Base URL**: Copy the **auto-generated** proxy URL.
5.  **Keys**: Add your API keys on the provider's specific management page.

-----

## 🎁 Special Bonus: Exclusive "Bypass" Providers
These providers are a special gift. I leverage internal methods to access high-performance models typically locked behind specific CLIs (OpenCode or Kilo Code). **No API key is required**; ClawProxy handles the direct request bypass.

### 1. Kilo Provider (Bypass)
*   **Upstream Base URL (in ClawProxy):** `https://api.kilo.ai/api/gateway`
*   **Provider Name:** `custom-kilo`
*   **Base URL:** `http://localhost:3030/proxy/custom-kilo/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   **`minimax/minimax-m2.5:free`**
        *   *Context: 204k*
        *   SOTA large language model designed for real-world productivity and coding. High performance on SWE-Bench Verified (80.2%).
    *   **`giga-potato-thinking`**
        *   *Context: 256k*
        *   Stealth model deeply optimized for agentic programming, with advanced visual understanding capability and explicit reasoning.
    *   **`giga-potato`**
        *   *Context: 256k*
        *   Standard version of the stealth model optimized for agentic tasks.
    *   **`stepfun/step-3.5-flash:free`**
        *   *Context: 256k*
        *   StepFun's highly capable and speed-efficient MoE reasoning model, excellent for handling very long contexts.
    *   **`kilo-auto/free`**
        *   *Context: 204k*
        *   Dynamic router that automatically points your request to an available free model.
    *   **`openrouter/free`**
        *   *Context: 200k*
        *   The simplest way to get free inference. Automatically routes to random free models on OpenRouter, filtering for supported features (image understanding, tool calling, etc.).

**Example Implementation in `openclaw.json`:**
```json
"custom-kilo": {
  "baseUrl": "http://localhost:3030/proxy/custom-kilo/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "minimax/minimax-m2.5:free", "name": "minimax/minimax-m2.5:free" },
      { "id": "giga-potato-thinking", "name": "giga-potato-thinking" },
      { "id": "giga-potato", "name": "giga-potato" },
      { "id": "stepfun/step-3.5-flash:free", "name": "stepfun/step-3.5-flash:free" },
      { "id": "kilo-auto/free", "name": "kilo-auto/free" },
      { "id": "openrouter/free", "name": "openrouter/free" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-kilo`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://api.kilo.ai/api/gateway`
5. **API Key Mode:** Select **None** *(Important: These bypass providers do not use keys)*
6. Click **Create Provider**.
7. Do **not** add any API keys to this provider.
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 2. OpenCode Provider (Bypass)
This provider offers high-performance coding and reasoning models. It uses two separate endpoints in ClawProxy depending on the model you want to use.

#### A. Standard Models Endpoint
*   **Upstream Base URL (in ClawProxy):** `https://opencode.ai/zen/v1`
*   **Provider Name in OpenClaw:** `custom-opencode`
*   **Base URL:** `http://localhost:3030/proxy/opencode/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   **`minimax-m2.5-free`**
        *   *Context: 204k*
        *   SOTA large language model designed for real-world productivity and coding. High performance on SWE-Bench Verified (80.2%).
    *   **`big-pickle`**
        *   *Context: 200k*
        *   High-speed stealth model based on GLM architecture. Deeply optimized for full-lifecycle application development, complex code refactoring, and agentic scripting.
    *   **`trinity-large-preview-free`**
        *   *Context: 128k*
        *   Arcee AI's frontier 400B MoE model. Excels at following long, constraint-filled prompts and navigating complex agentic environments like OpenCode.

**Example Implementation in `openclaw.json`:**
```json
"custom-opencode": {
  "baseUrl": "http://localhost:3030/proxy/opencode/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "minimax-m2.5-free", "name": "minimax-m2.5-free" },
      { "id": "big-pickle", "name": "big-pickle" },
      { "id": "trinity-large-preview-free", "name": "trinity-large-preview-free" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-opencode`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://opencode.ai/zen/v1`
5. **API Key Mode:** Select **None** *(Important: These bypass providers do not use keys)*
6. Click **Create Provider**.
7. Do **not** add any API keys to this provider.
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



#### B. Responses Endpoint (For GPT-5 Nano)
This specific model requires a different API format in ClawProxy. **Important:** In your ClawProxy dashboard, set the API format for this provider to `responses`, but in OpenClaw, keep it as `openai-completions`.
*   **Provider Name in OpenClaw:** `custom-opencode-responses`
*   **Base URL:** `http://localhost:3030/proxy/opencode1/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   **`gpt-5-nano`**
        *   *Context: 400k*
        *   Ultra-fast, affordable preview variant of OpenAI's reasoning models. Best for low latency tasks, integrated tool calling, and rapid interactions with an enormous context window.

**Example Implementation in `openclaw.json`:**
```json
"custom-opencode-responses": {
  "baseUrl": "http://localhost:3030/proxy/opencode1/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "gpt-5-nano", "name": "gpt-5-nano" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-opencode-responses`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://opencode.ai/zen/v1`
5. **API Key Mode:** Select **None** *(Important: These bypass providers do not use keys)*
6. Click **Create Provider**.
7. Do **not** add any API keys to this provider.
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.


---

## 📡 Free Tier API Directory (No Credit/Card Required)
These providers offer a genuine free tier or quota without requiring trial credits. Rankings are based on model power (Newest/Strongest first).

### 1. Ollama Cloud
Access the latest frontier open-weight models (GLM-5, MiniMax, Qwen 3.5) hosted on Ollama's cloud ecosystem. No local hardware or credit card required.
*   **Upstream Base URL (in ClawProxy):** `https://ollama.com/v1`
*   **Provider Name:** `custom-ollama`
*   **Base URL:** `http://localhost:3030/proxy/olamma/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `glm-5:cloud` (Strongest / Reasoning)
    *   `minimax-m2.5:cloud` (Productivity / Coding)
    *   `qwen3.5:397b-cloud` (Newest Multimodal)
    *   `glm-4.7:cloud` (High Performance)
    *   `gemini-3-flash-preview:cloud` (Frontier Speed)
    *   `deepseek-v3.2:cloud` (Efficiency / Reasoning)
    *   `kimi-k2.5:cloud` (Newest Multimodal)
    check for more models : https://ollama.com/search?c=cloud&o=newest

**Example Implementation in `openclaw.json`:**
```json
"ollama": {
  "baseUrl": "http://localhost:3030/proxy/olamma/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "glm-5:cloud", "name": "glm-5:cloud" },
      { "id": "minimax-m2.5:cloud", "name": "minimax-m2.5:cloud" },
      { "id": "qwen3.5:397b-cloud", "name": "qwen3.5:397b-cloud" },
      { "id": "glm-4.7:cloud", "name": "glm-4.7:cloud" },
      { "id": "gemini-3-flash-preview:cloud", "name": "gemini-3-flash-preview:cloud" },
      { "id": "deepseek-v3.2:cloud", "name": "deepseek-v3.2:cloud" },
      { "id": "kimi-k2.5:cloud", "name": "kimi-k2.5:cloud" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `olamma`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://ollama.com/v1`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and paste `sk-not-required` (Ollama Cloud uses header auth, but ClawProxy manages the flow).
8. Copy the generated **Base URL** and use it in your OpenClaw JSON.



### 2. Google AI Studio (Gemini)
The most generous free tier with high rate limits. Requires a free API key from Google AI Studio.
*   **Upstream Base URL (in ClawProxy):** `https://generativelanguage.googleapis.com`
*   **Provider Name:** `custom-google`
*   **Base URL:** `http://localhost:3030/proxy/mygemini/v1beta` "auto generate in ClawProxy dashboard"
*   **API Format:** `google-generative-ai`
*   **Models:**
    *   `gemini-3.1-pro-preview` (Flagship)
    *   `gemini-3.1-flash-lite-preview` (Newest Lite)
    *   `gemini-3-flash-preview` (High Speed)
    *   `gemini-2.5-pro`
    *   `gemini-2.5-flash`
    *   `gemini-2.5-flash-lite`

**Example Implementation in `openclaw.json`:**
```json
"custom-google": {
  "baseUrl": "http://localhost:3030/proxy/mygemini/v1beta",
  "apiKey": "dummy-key",
  "api": "google-generative-ai",
  "models": [
      { "id": "gemini-3.1-pro-preview", "name": "gemini-3.1-pro-preview" },
      { "id": "gemini-3.1-flash-lite-preview", "name": "gemini-3.1-flash-lite-preview" },
      { "id": "gemini-3-flash-preview", "name": "gemini-3-flash-preview" },
      { "id": "gemini-2.5-pro", "name": "gemini-2.5-pro" },
      { "id": "gemini-2.5-flash", "name": "gemini-2.5-flash" },
      { "id": "gemini-2.5-flash-lite", "name": "gemini-2.5-flash-lite" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-google`
3. **API Format:** Select **Google Gemini**
4. **Upstream Base URL:** `https://generativelanguage.googleapis.com`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 3. Groq (LPU Inference)
Extreme speed inference for open models. Free tier is rate-limited but completely free.
*   **Upstream Base URL (in ClawProxy):** `https://api.groq.com/openai`
*   **Provider Name:** `custom-groq`
*   **Base URL:** `http://localhost:3030/proxy/groq/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `openai/gpt-oss-120b` (New Flagship)
    *   `llama-3.3-70b-versatile`
    *   `llama-3.1-8b-instant`
    *   `mixtral-8x7b-32768`

**Example Implementation in `openclaw.json`:**
```json
"custom-groq": {
  "baseUrl": "http://localhost:3030/proxy/groq/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "openai/gpt-oss-120b", "name": "openai/gpt-oss-120b" },
      { "id": "llama-3.3-70b-versatile", "name": "llama-3.3-70b-versatile" },
      { "id": "llama-3.1-8b-instant", "name": "llama-3.1-8b-instant" },
      { "id": "mixtral-8x7b-32768", "name": "mixtral-8x7b-32768" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-groq`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://api.groq.com/openai`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 4. OpenRouter (Free Tier)
Aggregator for various free models. Requires an OpenRouter API key.
*   **Upstream Base URL (in ClawProxy):** `https://openrouter.ai/api/v1`
*   **Provider Name:** `custom-openrouter`
*   **Base URL:** `http://localhost:3030/proxy/openrouter/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `stepfun/step-3.5-flash:free`
    *   `arcee-ai/trinity-large-preview:free`
    *   `z-ai/glm-4.5-air:free`
    *   `qwen/qwen3-coder:free`
    *   `openai/gpt-oss-120b:free`
    *   `google/gemma-3-27b-it:free`
    *   `meta-llama/llama-3.3-70b-instruct:free`
    *   `mistralai/mistral-small-3.1-24b-instruct:free`
    *   `nousresearch/hermes-3-llama-3.1-405b:free`
    check openrouter website for more models : https://openrouter.ai/models

**Example Implementation in `openclaw.json`:**
```json
"custom-openrouter": {
  "baseUrl": "http://localhost:3030/proxy/openrouter/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "stepfun/step-3.5-flash:free", "name": "stepfun/step-3.5-flash:free" },
      { "id": "arcee-ai/trinity-large-preview:free", "name": "arcee-ai/trinity-large-preview:free" },
      { "id": "z-ai/glm-4.5-air:free", "name": "z-ai/glm-4.5-air:free" },
      { "id": "qwen/qwen3-coder:free", "name": "qwen/qwen3-coder:free" },
      { "id": "openai/gpt-oss-120b:free", "name": "openai/gpt-oss-120b:free" },
      { "id": "google/gemma-3-27b-it:free", "name": "google/gemma-3-27b-it:free" },
      { "id": "meta-llama/llama-3.3-70b-instruct:free", "name": "meta-llama/llama-3.3-70b-instruct:free" },
      { "id": "mistralai/mistral-small-3.1-24b-instruct:free", "name": "mistralai/mistral-small-3.1-24b-instruct:free" },
      { "id": "nousresearch/hermes-3-llama-3.1-405b:free", "name": "nousresearch/hermes-3-llama-3.1-405b:free" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-openrouter`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://openrouter.ai/api`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 5. NVIDIA NIM
High-performance quantization of top-tier models. Free tier is often available via developer program signup.
*   **Upstream Base URL (in ClawProxy):** `https://integrate.api.nvidia.com`
*   **Provider Name:** `custom-nvidia`
*   **Base URL:** `http://localhost:3030/proxy/custom-nvidia/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `z-ai/glm5`
    *   `z-ai/glm4.7`
    *   `moonshotai/kimi-k2.5`
    *   `moonshotai/kimi-k2-thinking` (Reasoning)
    *   `minimaxai/minimax-m2.5`
    *   `qwen/qwen3.5-397b-a17b`
    *   `deepseek-ai/deepseek-v3.2`
    *   `deepseek-ai/deepseek-r1`
    check nvidia website for more models : https://build.nvidia.com/models

**Example Implementation in `openclaw.json`:**
```json
"custom-nvidia": {
  "baseUrl": "http://localhost:3030/proxy/custom-nvidia/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "z-ai/glm5", "name": "z-ai/glm5" },
      { "id": "z-ai/glm4.7", "name": "z-ai/glm4.7" },
      { "id": "moonshotai/kimi-k2.5", "name": "moonshotai/kimi-k2.5" },
      { "id": "moonshotai/kimi-k2-thinking", "name": "moonshotai/kimi-k2-thinking" },
      { "id": "minimaxai/minimax-m2.5", "name": "minimaxai/minimax-m2.5" },
      { "id": "qwen/qwen3.5-397b-a17b", "name": "qwen/qwen3.5-397b-a17b" },
      { "id": "deepseek-ai/deepseek-v3.2", "name": "deepseek-ai/deepseek-v3.2" },
      { "id": "deepseek-ai/deepseek-r1", "name": "deepseek-ai/deepseek-r1" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-nvidia`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://integrate.api.nvidia.com`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 6. Cohere
Excellent for RAG and multilingual tasks. Free for development/research.
*   **Upstream Base URL (in ClawProxy):** `https://api.cohere.com`
*   **Provider Name:** `custom-cohere`
*   **Base URL:** `http://localhost:3030/proxy/cohere/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `command-r-plus-08-2024`
    *   `command-r-08-2024`
    *   `c4ai-aya-expanse-32b` (Multilingual)

**Example Implementation in `openclaw.json`:**
```json
"custom-cohere": {
  "baseUrl": "http://localhost:3030/proxy/cohere/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "command-r-plus-08-2024", "name": "command-r-plus-08-2024" },
      { "id": "command-r-08-2024", "name": "command-r-08-2024" },
      { "id": "c4ai-aya-expanse-32b", "name": "c4ai-aya-expanse-32b" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-cohere`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://api.cohere.com`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



### 7. Cerebras
Specialized for high-throughput inference on open models.
*   **Upstream Base URL (in ClawProxy):** `https://api.cerebras.ai`
*   **Provider Name:** `custom-cerebras`
*   **Base URL:** `http://localhost:3030/proxy/cerebras/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `llama-3.3-70b`
    *   `llama-3.1-8b`

**Example Implementation in `openclaw.json`:**
```json
"custom-cerebras": {
  "baseUrl": "http://localhost:3030/proxy/cerebras/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "llama-3.3-70b", "name": "llama-3.3-70b" },
      { "id": "llama-3.1-8b", "name": "llama-3.1-8b" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-cerebras`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://api.cerebras.ai`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.


---

## 💳 Paid & Subscription API Providers (API Keys Only)
If you have paid API accounts (such as Perplexity Pro Developer API, OpenAI API, Anthropic API, etc.), you can securely configure them in ClawProxy. Because ClawProxy encrypts and stores everything locally, your premium keys remain 100% safe.

> **⚠️ IMPORTANT NOTE:** 
> ClawProxy currently **ONLY supports standard Developer API Keys**. 
> It does **NOT** support web session tokens, OAuth logins, or direct consumer web subscriptions (like putting your ChatGPT Plus or Claude Pro web account credentials). You must generate an actual API Key from the provider's developer console.

### Example: Perplexity Pro
Use your Perplexity API key to access live web search and reasoning models.
*   **Upstream Base URL (in ClawProxy):** `https://api.perplexity.ai`
*   **Provider Name:** `custom-perplexity`
*   **Base URL:** `http://localhost:3030/proxy/perplexity/v1` "auto generate in ClawProxy dashboard"
*   **API Format:** `openai-completions`
*   **Models:**
    *   `sonar-reasoning-pro`
    *   `sonar-pro`

**Example Implementation in `openclaw.json`:**
```json
"custom-perplexity": {
  "baseUrl": "http://localhost:3030/proxy/perplexity/v1",
  "apiKey": "dummy-key",
  "api": "openai-completions",
  "models": [
      { "id": "sonar-reasoning-pro", "name": "sonar-reasoning-pro" },
      { "id": "sonar-pro", "name": "sonar-pro" }
  ]
}
```

**How to configure in ClawProxy Dashboard:**
1. Go to **Providers** → **Add Provider**
2. **Name:** `custom-perplexity`
3. **API Format:** Select **OpenAI Chat Completions**
4. **Upstream Base URL:** `https://api.perplexity.ai`
5. **API Key Mode:** Select **Managed**
6. Click **Create Provider**.
7. Click **Add API Key** inside the provider page and securely paste your key(s).
8. Copy the generated **Base URL** (shown at the top of the provider page) and use it in your OpenClaw JSON.



*You can apply this exact same setup to any other paid developer accounts by simply setting the appropriate Upstream URL and API Format.*

---

## 🤝 Support & Developer Info

**ClawProxy** is proudly developed and maintained by **malek262**.
If you need support, have questions, or want to report an issue, feel free to reach out through any of the following channels:

*   **GitHub:** [@malek262](https://github.com/malek262)
*   **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)
*   **Email:** [malekqq1@gmail.com](mailto:malekqq1@gmail.com)

> *Thank you for using ClawProxy!*
