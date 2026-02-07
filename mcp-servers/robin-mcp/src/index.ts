#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "robinMCP",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_test_value",
        description: "Returns a read-only test value (no side effects, safe operation)",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// test nonce is passed as a process argument by the test runner.
// this is the most agent-agnostic approach: process args are always forwarded
// by MCP clients since they're part of the command definition itself.
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_test_value") {
    const value = process.argv[2] ?? "NO_TEST_VALUE_FOUND";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ value }, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
