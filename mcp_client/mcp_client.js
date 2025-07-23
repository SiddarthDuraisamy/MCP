import path from 'path';
import url from 'url';

// ✅ Import from exact .js files using relative paths
import { Client } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StreamableHTTPClientTransport } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js';

const client = new Client({ name: 'vertex-mcp-client', version: '1.0.0' });

const transport = new StreamableHTTPClientTransport('http://localhost:3000/mcp');

export async function getUsersFromMCP() {
  await client.connect(transport);
  const users = await client.callResource('get_users');
  return users;
}

// Script execution check
const __filename = url.fileURLToPath(import.meta.url);
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
  getUsersFromMCP()
    .then(console.log)
    .catch(console.error);
}
