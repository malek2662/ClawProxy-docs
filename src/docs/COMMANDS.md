# ClawProxy CLI Commands

ClawProxy includes a built-in command-line interface (CLI) to help you manage the proxy process. You can run these commands from your terminal inside the directory where ClawProxy is installed.

---

## `clawproxy start`
Starts the ClawProxy server in the background as a system service.

## `clawproxy stop`
Stops the currently running ClawProxy server gracefully, waiting for active requests to complete before shutting down.

## `clawproxy restart`
Restarts the ClawProxy server. Use this after changing configuration or to refresh the service.

## `clawproxy status`
Checks the current status of the ClawProxy server — shows whether it is running, the process ID, listening port, and uptime.

## `clawproxy logs`
Displays the real-time logs of the ClawProxy server.
- Use this command to monitor incoming requests, verify key rotation is working, trace fallback events, and troubleshoot API errors (like `429` or `502` responses).
- Exit the log view by pressing `Ctrl + C`.

## `clawproxy uninstall`
Removes the ClawProxy background service from your system. This does not delete your database or configuration files.

---

> **Tip:** Regular monitoring of `clawproxy logs` is the best way to ensure your Provider Fallback Chain, Model Fallback, Smart Key Rotation, and Circuit Breaker are all performing as expected.
