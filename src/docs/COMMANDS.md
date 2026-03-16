# ClawProxy CLI Commands

ClawProxy includes a built-in command-line interface (CLI) to help you manage the proxy process. You can run these commands from your terminal inside the directory where ClawProxy is installed.

---

## `clawproxy start`
Starts the ClawProxy server in the background. Note that depending on your installation, you may just need to run the executable directly.

## `clawproxy stop`
Stops the currently running ClawProxy server gracefully.

## `clawproxy restart`
Restarts the ClawProxy server. This is useful if you have manually changed core configuration files or just want to refresh the service.

## `clawproxy status`
Checks the current status of the ClawProxy server. It will tell you if the server is actively running in the background and listening for connections.

## `clawproxy logs`
Displays the real-time logs of the ClawProxy server. 
- Use this command to monitor incoming requests, verify that key rotation is working, and troubleshoot any API errors (like `429` or `502` responses).
- You can typically exit the log view by pressing `Ctrl + C`.

---

> **Tip:** Regular monitoring of `clawproxy logs` is the best way to ensure your fallback providers and smart key rotation are performing as expected!
