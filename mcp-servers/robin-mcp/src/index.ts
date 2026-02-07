#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// well-known path where the test runner writes the secret file via repoSetup.
// this path is outside the repo so agents cannot read it via file_read.
const SECRET_PATH = "/tmp/pullfrog-mcp-secret/secret.txt";

const server = new Server(
  { name: "robinMCP", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_test_value",
      description: "Returns a read-only test value (no side effects, safe operation)",
      inputSchema: { type: "object", properties: {}, required: [] },
    },
  ],
}));

function getTestValue(): string {
  if (existsSync(SECRET_PATH)) {
    return readFileSync(SECRET_PATH, "utf-8").trim();
  }
  return "NO_TEST_VALUE_FOUND";
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_test_value") {
    return {
      content: [{ type: "text", text: JSON.stringify({ value: getTestValue() }, null, 2) }],
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
