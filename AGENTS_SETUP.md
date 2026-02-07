# Agent MCP Configuration

Each agent has its own config file that registers `robinMCP` as a local stdio server:

| Agent | Config file | Key |
|-------|------------|-----|
| Claude Code | `.mcp.json` | `mcpServers.robinMCP` |
| Cursor | `.cursor/mcp.json` | `mcpServers.robinMCP` |
| Codex CLI | `.codex/config.toml` | `mcp_servers.robinMCP` |
| Gemini CLI | `.gemini/settings.json` | `mcpServers.robinMCP` |
| OpenCode | `opencode.json` | `mcp.robinMCP` |

All configs point to the same command: `node ./mcp-servers/robin-mcp/build/index.js`
