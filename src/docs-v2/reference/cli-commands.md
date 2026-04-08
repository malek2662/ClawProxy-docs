# CLI Commands

ClawProxy includes a built-in command-line interface (CLI) to manage the proxy as a background service. Run these commands from any terminal after installation.

> **Version 1.0.12**

---

## Commands

### install

```bash
clawproxy install
```

Installs ClawProxy as a background system service and starts it. After installation, opens the dashboard in your default browser.

### start

```bash
clawproxy start
```

Starts the ClawProxy service. If the server hasn't been built yet, it will build automatically before starting.

### stop

```bash
clawproxy stop
```

Stops the currently running ClawProxy service gracefully.

### restart

```bash
clawproxy restart
```

Restarts the ClawProxy service. Use this after updating ClawProxy or changing environment variables.

### status

```bash
clawproxy status
```

Shows the current status of the ClawProxy service -- whether it's running, the process ID (PID), port, and uptime.

### logs

```bash
clawproxy logs
```

Follows the live service logs in your terminal. Press `Ctrl + C` to exit.
- Use this to monitor incoming requests, verify key rotation, trace fallback events, and troubleshoot API errors (like `429` or `502` responses).

### uninstall

```bash
clawproxy uninstall
```

Removes the ClawProxy background service from your system. Your database and configuration files are preserved.

### version

```bash
clawproxy --version
```

Displays the currently installed ClawProxy version.

### help

```bash
clawproxy help
```

Displays the full help message with all available commands and options.

---

## Options

| Option | Description |
|--------|-------------|
| `--port <port>` | Override the server port (default: `3030`) |
| `--no-open` | Don't open the browser automatically after `install` |
| `--version`, `-v` | Show the current ClawProxy version |
| `--help`, `-h` | Show the help message |

---

## Service Backends

ClawProxy auto-detects the best service manager for your platform:

| Platform | Backend |
|----------|---------|
| Linux | systemd (`systemctl --user`) |
| macOS | launchd (`~/Library/LaunchAgents`) |
| Windows | node-windows (Windows Service) |

If the native service manager isn't available, ClawProxy falls back to a built-in process manager.

---

> **Tip:** Run `clawproxy logs` regularly to ensure your Provider Fallback Chain, Model Fallback, Smart Key Rotation, and Circuit Breaker are all working as expected.
