import { McpServer } from '@modelcontextprotocol/server';
import { serveStdio } from '@modelcontextprotocol/server/stdio';
import { z } from 'zod';

serveStdio(
  () => {
    const server = new McpServer({ name: 'modern-only', version: '1' });
    server.registerTool(
      'echo',
      { inputSchema: z.object({ text: z.string() }) },
      async ({ text }) => ({ content: [{ type: 'text', text: `modern:${text}` }] }),
    );
    return server;
  },
  { legacy: 'reject' },
);
