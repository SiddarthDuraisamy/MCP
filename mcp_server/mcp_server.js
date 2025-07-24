import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import pg from "pg";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

const { Pool } = pg;
const db = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const mcpServer = new McpServer({ name: "Postgres MCP Server", version: "1.0.0" });

mcpServer.resource("get_users", {
  description: "Fetch all users from the users table.",
  async handler() {
    const res = await db.query("SELECT * FROM users");
    return res.rows;
  },
});

// Setup Express server
const app = express();
app.use(express.json());

// MCP transport session management
const transports = {};

app.post('/mcp', async (req, res) => {
  let sessionId = req.headers['mcp-session-id'];
  let transport;

  if (sessionId && transports[sessionId]) {
    transport = transports[sessionId];
  } else {
    // ✅ Fixed: pass sessionIdGenerator to avoid crash
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID()
    });
    transports[transport.sessionId] = transport;
    await mcpServer.connect(transport);
  }

  await transport.handleRequest(req, res, req.body);
});

app.listen(3000, () => {
  console.log('✅ MCP server (via Express) listening on port 3000');
});
