let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  while (true) {
    const index = buffer.indexOf('\n');
    if (index < 0) return;
    const line = buffer.slice(0, index);
    buffer = buffer.slice(index + 1);
    const request = JSON.parse(line);
    if (request.method === 'server/discover') process.exit(0);
    if (request.id === undefined) continue;
    let result;
    if (request.method === 'initialize') {
      result = {
        protocolVersion: '2025-11-25',
        capabilities: { tools: {} },
        serverInfo: { name: 'strict-legacy', version: '1' },
      };
    } else if (request.method === 'tools/list') {
      result = {
        tools: [{ name: 'echo', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }],
      };
    } else if (request.method === 'tools/call') {
      result = { content: [{ type: 'text', text: `legacy:${request.params.arguments.text}` }] };
    } else if (request.method === 'ping') {
      result = {};
    } else {
      process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, error: { code: -32601, message: 'Method not found' } })}\n`);
      continue;
    }
    process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', id: request.id, result })}\n`);
  }
});
