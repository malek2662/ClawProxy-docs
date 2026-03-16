# Frequently Asked Questions (FAQ)

Here are the most common questions regarding **ClawProxy** configuration and usage.

---

## 🔑 Providers & Keys

### Do I need to define my models in the ClawProxy dashboard?
**No.** You only define the Provider and its Keys in ClawProxy. The actual Model selection happens in your client (like OpenClaw). When OpenClaw requests a specific model name, ClawProxy dynamically accepts it and forwards it to the Upstream URL. *(The only exception is specifying Target Model IDs for Fallback configurations).*

### Can I use different API formats together?
**Yes.** ClawProxy translates standard client requests into the format required by the upstream provider. You can send OpenClaw requests in a standard format, and ClawProxy will handle the formatting behind the scenes based on the API format you selected when creating the provider.

### Why am I getting "Model Not Found" or routing errors?
The specific Model IDs used by external AI providers are subject to change without notice. If you experience unexpected routing behavior or model errors, please independently verify the current valid Model ID directly with the target provider's official documentation.

---

## 🛡️ Reliability & Rotation

### I have three free-tier keys for an AI service. The service rate-limits me after 10 requests. What happens in ClawProxy?
Due to ClawProxy's Key Rotation, the first 10 requests will likely succeed on the first key. On the 11th request, the first key will return a 429 Rate Limit error. ClawProxy will instantly intercept this, bench the first key, and re-send the 11th request using your second key. The user will simply receive the response without ever knowing a rate limit occurred.

### If I configure Provider A to fallback to Provider B, what happens if Provider A's network connection drops entirely?
Because you explicitly configured Provider B as a fallback for Provider A, ClawProxy will detect the connection failure (e.g., a 502/503 error) and automatically attempt to process the request using Provider B and its associated Target Model ID.

---

## 🛠️ General Troubleshooting

### Where can I see what the proxy is doing?
Use the ClawProxy CLI! Simply open your terminal in the installation directory and run `clawproxy logs` to monitor real-time traffic, error intercepts, and see which keys are being rotated.

### How do I restart the proxy if I get stuck?
You can use the `clawproxy restart` command to quickly reboot the service.

> **Still need help?** Reach out through GitHub, Reddit, or Email as listed in the documentation.
