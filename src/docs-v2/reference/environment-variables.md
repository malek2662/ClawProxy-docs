# Environment Variables

All environment variables that ClawProxy recognizes, with their defaults and descriptions.

> **Version 1.0.12**

---

## Server Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3030` | Server listening port. Can also be overridden with the `--port` CLI flag. |
| `HOST` | `0.0.0.0` | Bind address. `0.0.0.0` binds to all network interfaces. |
| `DB_PATH` | `./clawproxy.db` | Path to the SQLite database file. |

---

## Log Management

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_RETENTION_DAYS` | `7` | Number of days to keep request logs before automatic cleanup. Also configurable from the **Settings** page in the dashboard. |
| `MAX_LOG_BODY_SIZE` | `5242880` (5 MB) | Maximum request/response body size (in characters) stored in log entries. Bodies exceeding this limit are truncated. |
| `AUTO_CLEANUP_LOGS` | `true` | Enable or disable automatic log cleanup. Also configurable from the **Settings** page in the dashboard. |

---

## Notes

- Environment variables are read at server startup. Changes require a restart to take effect.
- The `--port` CLI flag takes precedence over the `PORT` environment variable.
- Log retention and auto-cleanup settings can also be changed at runtime from the **Settings** page in the dashboard, without needing a restart.
- All data is stored locally in the SQLite database. No data is sent externally except to the AI providers you configure and a periodic license check.
