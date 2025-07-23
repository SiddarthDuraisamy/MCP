import path from 'path';
import url from 'url';

import { Client } from '@modelcontextprotocol/sdk/client';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp';

const client = new Client({ name: 'vertex-mcp-client', version: '1.0.0' });

// ✅ Use plain string, NOT an object
const transport = new StreamableHTTPClientTransport('http://localhost:3000/mcp');

export async function getUsersFromMCP() {
  await client.connect(transport);
  const users = await client.callResource('get_users');
  return users;
}

// Run if script is executed directly
const __filename = url.fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
  getUsersFromMCP()
    .then(console.log)
    .catch(console.error);
}
