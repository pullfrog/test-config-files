#!/usr/bin/env node
import { spawn } from "child_process";

const server = spawn("node", ["build/index.js"]);

let output = "";

server.stdout.on("data", (data) => {
  output += data.toString();
});

server.stderr.on("data", (data) => {
  console.error("Server error:", data.toString());
});

// Send initialize request
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0",
    },
  },
};

server.stdin.write(JSON.stringify(initRequest) + "\n");

// Send tools/list request
const listToolsRequest = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
};

setTimeout(() => {
  server.stdin.write(JSON.stringify(listToolsRequest) + "\n");
}, 100);

// Send tools/call request
const callToolRequest = {
  jsonrpc: "2.0",
  id: 3,
  method: "tools/call",
  params: {
    name: "tell_story",
    arguments: {},
  },
};

setTimeout(() => {
  server.stdin.write(JSON.stringify(callToolRequest) + "\n");
}, 200);

setTimeout(() => {
  server.stdin.end();

  setTimeout(() => {
    server.kill();

    // Parse and validate responses
    const lines = output.trim().split("\n");
    let foundSecret = false;

    for (const line of lines) {
      try {
        const response = JSON.parse(line);
        if (response.id === 3 && response.result?.content) {
          const content = response.result.content[0];
          if (content.type === "text") {
            const data = JSON.parse(content.text);
            if (data.story && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.story)) {
              console.log("✓ Build works! Story value:", data.story);
              foundSecret = true;
            }
          }
        }
      } catch (e) {
        // Ignore parse errors for non-JSON lines
      }
    }

    if (!foundSecret) {
      console.error("✗ Test failed: No valid story found in response");
      console.error("Output:", output);
      process.exit(1);
    }

    process.exit(0);
  }, 100);
}, 400);
