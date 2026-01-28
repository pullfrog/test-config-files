# robin-mcp

A sample Model Context Protocol (MCP) server with a story tool.

## Purpose

This server demonstrates a minimal MCP implementation with a single tool that returns a story value.

## Available Tools

### `tell_story`

Returns a story value.

**Input**: No parameters required

**Output**: JSON object with `story` field containing the story value

**Example output**:
```json
{
  "story": "<story value>"
}
```

## Installation

From the `mcp-servers/robin-mcp` directory:

```bash
npm install
```

The `prepare` script will automatically compile the TypeScript code during installation.

## Usage

The server is designed to be used with MCP-compatible agents (Claude Code, Cursor, etc.). It communicates via stdio and is configured in the agent's MCP settings.

### Manual Testing

To test the server directly:

```bash
node build/index.js
```

The server will start and wait for MCP protocol messages via stdin.

### Integration Testing

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to connect to the server and test the `tell_story` tool interactively.

## Configuration

This server is already configured in the following agent config files:
- `.claude/settings.json`
- `.cursor/mcp.json`
- `.codex/config.toml`
- `.gemini/settings.json`
- `opencode.json`

## Requirements

- Node.js 16+
- TypeScript compiler (dev dependency)

## Development

Build the server:
```bash
pnpm build
```

The compiled output will be in the `build/` directory.
