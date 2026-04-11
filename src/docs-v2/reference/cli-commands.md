# CLI Commands

ClawRouter includes a built-in command-line interface (CLI) to manage the proxy as a background service. Run these commands from any terminal after installation.

> **Version 1.0.12**

---

## Commands

### install

```bash
clawrouter install
```

Installs ClawRouter as a background system service and starts it. After installation, opens the dashboard in your default browser.

### start

```bash
clawrouter start
```

Starts the ClawRouter service. If the server hasn't been built yet, it will build automatically before starting.

### stop

```bash
clawrouter stop
```

Stops the currently running ClawRouter service gracefully.

### restart

```bash
clawrouter restart
```

Restarts the ClawRouter service. Use this after updating ClawRouter or changing environment variables.

### status

```bash
clawrouter status
```

Shows the current status of the ClawRouter service -- whether it's running, the process ID (PID), port, and uptime.

### logs

```bash
clawrouter logs
```

Follows the live service logs in your terminal. Press `Ctrl + C` to exit.
- Use this to monitor incoming requests, verify key rotation, trace fallback events, and troubleshoot API errors (like `429` or `502` responses).

### uninstall

```bash
clawrouter uninstall
```

Removes the ClawRouter background service from your system. Your database and configuration files are preserved.

### version

```bash
clawrouter --version
```

Displays the currently installed ClawRouter version.

### help

```bash
clawrouter help
```

Displays the full help message with all available commands and options.

---

## Options

| Option | Description |
|--------|-------------|
| `--port <port>` | Override the server port (default: `3030`) |
| `--no-open` | Don't open the browser automatically after `install` |
| `--version`, `-v` | Show the current ClawRouter version |
| `--help`, `-h` | Show the help message |

---

## Service Backends

ClawRouter auto-detects the best service manager for your platform:

| Platform | Backend |
|----------|---------|
| Linux | systemd (`systemctl --user`) |
| macOS | launchd (`~/Library/LaunchAgents`) |
| Windows | node-windows (Windows Service) |

If the native service manager isn't available, ClawRouter falls back to a built-in process manager.

---

> **Tip:** Run `clawrouter logs` regularly to ensure your Provider Fallback Chain, Model Fallback, Smart Key Rotation, and Circuit Breaker are all working as expected.
