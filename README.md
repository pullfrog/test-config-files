# test-repo-mcp

Test repository for validating repo-level MCP server merging across all Pullfrog agents.

Each agent has its own config file that registers `robinMCP` as a local stdio MCP server:

- **Claude Code**: `.mcp.json`
- **Cursor**: `.cursor/mcp.json`
- **Codex CLI**: `.codex/config.toml`
- **Gemini CLI**: `.gemini/settings.json`
- **OpenCode**: `opencode.json`

## robinMCP

A minimal MCP server (`mcp-servers/robin-mcp/`) that exposes one tool:

- `get_test_value` — reads a secret from `/tmp/pullfrog-mcp-secret/secret.txt` (written by the test runner via `repoSetup` before the agent starts). The path is outside the repo, so agents cannot read it via `file_read`.

## How the test works

1. Test runner generates a random UUID and writes it to `/tmp/pullfrog-mcp-secret/secret.txt` via `repoSetup`.
2. Each agent natively discovers the repo-level MCP config and merges `robinMCP` alongside `gh_pullfrog`.
3. The agent calls `get_test_value` from `robinMCP` and passes the returned value to `set_output`.
4. The test validator compares the output against the original UUID.
