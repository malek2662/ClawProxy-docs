# Troubleshooting

Diagnose and resolve common issues with ClawProxy.

> **Version 1.0.12**

---

## Activation Issues

### Problem: "not_activated" (HTTP 403) on proxy requests
**Cause:** Your ClawProxy installation has not been activated yet.
**Solution:**
1. Open the dashboard at `http://localhost:3030`.
2. Copy your **Installation ID** from the Awaiting Activation screen.
3. Send it to [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io) or [Reddit u/Malek262](https://reddit.com/user/Malek262).
4. Once the developer confirms activation, click **Check Activation**.

### Problem: Was activated but now shows "Awaiting Activation"
**Possible causes:**
- You moved ClawProxy to a different machine (the Installation ID is machine-specific).
- Local data was reset.
**Solution:** Contact the developer. If on a new machine, send the new Installation ID.

### Problem: "Check Activation" button doesn't work
**Cause:** Network issue preventing ClawProxy from reaching the activation server.
**Solution:** Check your internet connection. If you're behind a firewall, ensure outbound HTTPS requests are allowed.

---

## Proxy Request Errors

### Problem: HTTP 502 "Bad Gateway"
**Cause:** ClawProxy could not reach the upstream provider.
**Possible fixes:**
1. Check the **Upstream URL** in the provider's Settings tab -- make sure it's correct.
2. Test the upstream URL directly in your browser or with `curl`.
3. Check your internet connection.
4. The provider may be temporarily down -- check their status page.

### Problem: HTTP 504 "Gateway Timeout"
**Cause:** The upstream provider took too long to respond.
**Possible fixes:**
1. Increase the **Timeout** setting in the provider's Settings tab (default: 120000ms / 2 minutes).
2. For slow reasoning models, set to 300000ms (5 minutes) or higher.
3. Enable **Retry on Timeout** to automatically try the next key.

### Problem: HTTP 429 "Rate Limited"
**Cause:** Your API key hit the provider's rate limit.
**What ClawProxy does:** Automatically rotates to the next key with a cooldown on the rate-limited key (default 60 seconds, configurable in **Settings** > **Rate Limit Backoff**).
**If all keys rate-limited:**
1. Add more API keys to spread the load.
2. Consider switching to Round Robin rotation to distribute requests more evenly.
3. Wait for the backoff period to expire -- keys automatically recover from cooldown.

### Problem: HTTP 401/403 "Unauthorized"
**Cause:** The API key is invalid, expired, or revoked.
**What ClawProxy does:** Permanently disables the key and tries the next one.
**Solution:**
1. Check the key's Error History for details.
2. Verify the key is valid in the provider's developer console.
3. If the key was disabled incorrectly, re-enable it from the API Keys tab.
4. Add a new valid key if needed.

### Problem: Requests succeed but return wrong/empty responses
**Possible causes:**
- Incorrect API format configured for the provider.
- Model ID is wrong or outdated.
**Solution:**
1. Verify the **API Format** matches the provider (e.g., use `google-generative-ai` for Gemini, not `openai-completions`).
2. Use **Fetch Models** to get the latest model IDs.

---

## API Key Issues

### Problem: Key marked as "Disabled" -- how to re-enable?
1. Open the provider's **API Keys** tab.
2. Find the disabled key.
3. Click the **enable/disable toggle** to re-enable it.
4. Check the **Error History** first to understand why it was disabled -- it may have genuine auth issues.

### Problem: Key shows "Unstable" status
**Cause:** The key has more than 3 consecutive errors but hasn't been disabled (errors are not auth-related).
**Solution:** Check the Error History. The key may be experiencing temporary server issues. It will auto-recover when a request succeeds.

### Problem: All keys in cooldown at the same time
**Cause:** All keys hit rate limits simultaneously.
**Solutions:**
1. Add more keys to the pool.
2. Switch to Round Robin rotation to distribute load.
3. Reduce request frequency from your client.
4. Wait for the backoff period (default 60 seconds, configurable in **Settings**) -- cooldowns expire automatically.

### Problem: Key stats seem wrong or inflated
**Solution:** Click the **Reset Stats** button on the key to zero all counters (total, success, failed, consecutive errors).

---

## Model Errors

### Problem: "Model not found" (HTTP 404)
**Cause:** The model ID is invalid or the model has been deprecated by the provider.
**Solutions:**
1. Go to the provider's **Models** tab > **Fetch Models** to get the current list.
2. Update the model ID in your client configuration.
3. Enable **Model Fallback** with alternative models as backups.

### Problem: Model Fallback not triggering
**Checklist:**
1. Is **Model Fallback** toggled to **Enabled** in the Models tab?
2. Are there models saved in the fallback list? (Must have at least 2 models.)
3. Is the error actually a model error? Check the log -- only MODEL_ERROR classification triggers fallback. Rate limits and auth errors do NOT trigger model fallback.

### Problem: "PAID_MODEL_AUTH_REQUIRED" error
**Cause:** You're trying to use a paid model on a bypass provider (Kilo AI or OpenCode Zen) without a paid subscription.
**Solution:** Use only **Free** models. Go to **Models** tab > **Fetch Models** and look for models with the **Free** badge.

---

## Provider Fallback Issues

### Problem: Fallback chain not triggering
**Checklist:**
1. Is a Provider Fallback Chain configured? (Check Settings tab > Fallback Chain section.)
2. Is the fallback provider enabled?
3. Have all keys on the primary provider been exhausted? (Fallback only triggers after all keys fail, not on a single key error.)
4. Is the circuit breaker OPEN? (If so, it should skip directly to the fallback chain.)

### Problem: "No fallback providers" in notification
**Cause:** The primary provider failed but no fallback chain is configured.
**Solution:** Go to Settings tab > Add Fallback Provider.

### Problem: Fallback dropdown is empty
**Cause:** No other providers with the **same API format** exist.
**Solution:** Create another provider with the same API format first, then add it as a fallback.

### Problem: Fallback succeeds but with wrong model
**Cause:** The fallback provider uses different model naming conventions.
**Solution:** Set the **Target Model ID** on the fallback chain entry to the exact model ID the fallback provider expects.

---

## Circuit Breaker Issues

### Problem: Circuit breaker keeps tripping (OPEN)
**Cause:** The provider is consistently failing (default: 5+ failures in 60 seconds; threshold is configurable in **Settings** > **Circuit Breaker Threshold**).
**Solutions:**
1. Check the provider's status -- it may be genuinely down.
2. Verify your API keys are valid.
3. Check for rate limiting across all keys.
4. Increase the circuit breaker threshold in **Settings** if the current value is too sensitive.
5. Manually reset the circuit breaker from the provider's Settings tab after the issue resolves.

### Problem: Requests going to fallback even though provider seems healthy
**Cause:** Circuit breaker might be OPEN from a recent failure burst.
**Solution:**
1. Check the circuit breaker status in the Settings tab.
2. Click **Reset** to force it back to CLOSED.
3. The next request will go to the primary provider.

### Problem: Circuit breaker state lost after restart
**Expected behavior:** The circuit breaker is in-memory by design and resets to CLOSED on every restart. This ensures no stale state persists.

---

## Connection & Network Issues

### Problem: Dashboard not loading at localhost:3030
**Possible causes:**
1. ClawProxy is not running -- run `clawproxy status` to check.
2. Wrong port -- check if a custom port is configured.
3. Firewall blocking local connections.
**Solutions:**
1. Run `clawproxy start` to start the server.
2. Check `clawproxy status` for the actual port.
3. Try accessing via `http://127.0.0.1:3030` instead.

### Problem: WebSocket "Reconnecting" status on Logs page
**Cause:** The WebSocket connection to the server dropped.
**Solution:** Usually reconnects automatically within 3 seconds. If persistent:
1. Check that ClawProxy is still running (`clawproxy status`).
2. Refresh the page.
3. Check for network issues between your browser and the server.

### Problem: "EADDRINUSE" error on startup
**Cause:** Port 3030 (or your configured port) is already in use.
**Solutions:**
1. Run `clawproxy stop` first, then `clawproxy start`.
2. Use a different port: `clawproxy start --port 8080`.
3. Find and kill the process using the port: `lsof -i :3030` (Linux/macOS).

---

## Dashboard & UI Issues

### Problem: Stats show "0" even though requests are being made
**Possible causes:**
1. Stats use a 5-second cache -- wait a moment and refresh.
2. Requests might be failing before reaching the logging stage.
**Solution:** Check the Logs page for detailed request entries.

### Problem: Notifications not appearing
**Possible causes:**
1. WebSocket connection might be down -- check the connection indicator on the Logs page.
2. The event type might not generate a notification (e.g., successful requests don't notify).
**Solution:** Refresh the page to re-establish the WebSocket connection.

### Problem: Provider list seems outdated
**Solution:** Navigate away from the Providers page and back. The data has a short stale time and will refresh.

---

## CLI Issues

### Problem: `clawproxy: command not found`
**Cause:** ClawProxy is not in your system PATH.
**Solutions:**
1. Run the install command again.
2. Restart your terminal to reload PATH.
3. Run directly from the installation directory: `node /path/to/clawproxy/bin/clawproxy.js`

### Problem: `clawproxy status` says "not running" but dashboard works
**Cause:** ClawProxy might have been started in a different way (directly via `npm start` instead of the CLI service manager).
**Solution:** Use `clawproxy stop` then `clawproxy start` to ensure it runs through the service manager.

### Problem: `clawproxy logs` shows nothing
**Cause:** No requests have been made, or the service is writing logs elsewhere.
**Solution:** Make a test request through the proxy and check again.

---

## Provider-Specific Issues

### OpenCode Zen -- HTTP 401 but key is correct
**Explanation:** OpenCode returns HTTP 401 for unsupported models with a "ModelError" in the body. ClawProxy correctly classifies this as MODEL_ERROR (not AUTH_ERROR), so your key won't be disabled.
**Solution:** Check that the model ID exists. Use **Fetch Models** to get the current list.

### Kilo AI -- HTTP 401 for certain models
**Explanation:** Kilo returns HTTP 401 with "PAID_MODEL_AUTH_REQUIRED" for models that require a paid subscription. ClawProxy classifies this as MODEL_ERROR.
**Solution:** Use only **Free** models. Check the **Free/Paid** badges in Fetch Models.

### Google Gemini -- HTTP 400 and key gets disabled
**Explanation:** Google returns HTTP 400 (not 401) for invalid API keys with "API_KEY_INVALID" in the body. ClawProxy correctly classifies this as AUTH_ERROR.
**Solution:** Verify your API key at [Google AI Studio](https://aistudio.google.com/).

### Google Gemini -- Wrong Base URL format
**Reminder:** Google Gemini uses `/v1beta` in the proxy URL, not `/v1`. The correct Base URL format is:
```
http://localhost:3030/proxy/{provider-id}/v1beta
```

### Anthropic -- HTTP 529 errors
**Explanation:** Anthropic uses a custom HTTP 529 status for overloaded servers. ClawProxy classifies this as OVERLOADED and retries the same key after 2 seconds (up to 2 times).
**Solution:** If persistent, add more providers to your fallback chain or wait for Anthropic to recover.

### Groq -- HTTP 498 errors
**Explanation:** Groq uses a custom HTTP 498 for flex tier capacity limits. ClawProxy classifies this as RATE_LIMIT.
**Solution:** Wait for the rate limit backoff period (default 60 seconds, configurable in **Settings**), or add more keys / a fallback provider.

### MiniMax -- Requests succeed but errors in body
**Explanation:** MiniMax returns HTTP 200 for most errors with custom status codes in the response body. ClawProxy parses the body to detect these:
- Status 1004, 2049, 1008 > AUTH_ERROR
- Status 1002, 2045, 2056 > RATE_LIMIT
**Solution:** Check the Error History for the actual error codes.

### Ollama Cloud -- Key requirements
**Note:** Ollama Cloud uses header-based auth managed by ClawProxy. Add `sk-not-required` as the key. Do not leave the keys tab empty as the managed mode requires at least one key entry.

### Perplexity -- No models returned from Fetch
**Explanation:** Perplexity does not have a public `/v1/models` endpoint. ClawProxy returns a hardcoded list of known supported models instead.
**Solution:** Use the models shown by Fetch Models, or check Perplexity's documentation for the latest model list.

---

## Complete Reset

If all else fails and you need to start fresh:

1. Stop ClawProxy:
   ```bash
   clawproxy stop
   ```
2. Delete the local database and restart:
   ```bash
   clawproxy start
   ```
3. You will need to reconfigure all providers and keys. Contact the developer if re-activation is needed.

> **Warning:** This removes all providers, keys, and logs.
