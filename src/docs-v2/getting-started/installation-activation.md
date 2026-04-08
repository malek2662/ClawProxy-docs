# Installation & Activation

ClawProxy requires a one-time activation after installation. This guide covers the full process from first launch to a fully functional dashboard.

> **Version 1.0.12**

---

## System Requirements

ClawProxy runs on **Linux**, **macOS**, and **Windows**. The CLI auto-detects the best service manager for your platform:

| Platform | Service Backend |
|----------|----------------|
| Linux | systemd (`systemctl --user`) |
| macOS | launchd (`~/Library/LaunchAgents`) |
| Windows | node-windows (Windows Service) |

If the native service manager isn't available, ClawProxy falls back to a built-in process manager.

---

## Installing ClawProxy

ClawProxy is premium software. After your payment is confirmed, you will receive the installation command and setup instructions automatically.

**Install as a system service (recommended):**
```bash
clawproxy install
```

This installs ClawProxy as a background system service, starts it, and opens the dashboard in your default browser.

**Or start manually:**
```bash
clawproxy start
```

---

## Activation Process

### Step 1: Get Your Installation ID

1. Open your browser and go to `http://localhost:3030`.
2. You will see the **Awaiting Activation** screen.
3. Your unique **Installation ID** is displayed on screen.
4. Click **Copy** to copy the Installation ID to your clipboard.

### Step 2: Request Activation

Send the Installation ID to the developer:
- **Email:** [support@clawproxy.qzz.io](mailto:support@clawproxy.qzz.io)
- **Reddit:** [u/Malek262](https://reddit.com/user/Malek262)

### Step 3: Confirm Activation

1. Wait for the developer to confirm your activation.
2. Once confirmed, click **Check Activation** on the Awaiting Activation screen.
3. The dashboard loads and you can begin adding providers.

---

## Update Check

ClawProxy checks for updates automatically during its periodic license check.

If a newer version is available:
1. An **Update Available** badge appears in the sidebar.
2. Click the badge to open the **Update Modal**.
3. The modal shows:
   - **Current version** > **Latest version**
   - **Changelog** (if provided)
   - **Install/update commands** for your platform
4. Run the provided command in your terminal to update.

---

## Activation Troubleshooting

### "not_activated" (HTTP 403) on proxy requests

Your ClawProxy installation has not been activated yet. Open the dashboard, copy your Installation ID, send it to the developer, and click **Check Activation** once confirmed.

### Was activated but now shows "Awaiting Activation"

Possible causes:
- You moved ClawProxy to a different machine (the Installation ID is machine-specific).
- Local data was reset.

**Solution:** Contact the developer. If on a new machine, send the new Installation ID.

### "Check Activation" button doesn't work

The activation server may be unreachable. Check your internet connection. If you're behind a firewall, ensure outbound HTTPS requests are allowed.

---

## Data Storage & Privacy

Everything is stored locally on your machine. Providers, keys, logs, and configurations are kept in a local SQLite database in the installation directory.

The only external requests ClawProxy makes are:
1. **To the AI providers you configure** -- forwarding your API requests.
2. **Periodic license check** -- a lightweight check for activation status and available updates.
