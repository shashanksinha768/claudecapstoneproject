import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE_URL = 'https://shashanksinha768.atlassian.net';
const DEFAULT_PAGE_ID = '8552449';

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

const server = new McpServer({
  name: 'confluence',
  version: '1.0.0',
});

server.tool(
  'get_confluence_page',
  'Fetch a Confluence page by ID and return its title and plain-text content',
  { page_id: z.string().optional().describe('Confluence page ID (defaults to 8552449)') },
  async ({ page_id }) => {
    const email = process.env.CONFLUENCE_EMAIL;
    const token = process.env.CONFLUENCE_API_TOKEN;

    if (!email || !token) {
      return {
        content: [{
          type: 'text',
          text: 'ERROR: Confluence credentials not configured.\n' +
                'Set these environment variables:\n' +
                '  CONFLUENCE_EMAIL=your-email@example.com\n' +
                '  CONFLUENCE_API_TOKEN=your-api-token\n' +
                'Get your API token at: https://id.atlassian.com/manage-profile/security/api-tokens',
        }],
        isError: true,
      };
    }

    const pageId = page_id || DEFAULT_PAGE_ID;
    const url = `${BASE_URL}/wiki/rest/api/content/${pageId}?expand=body.storage`;
    const auth = Buffer.from(`${email}:${token}`).toString('base64');

    let res;
    try {
      res = await fetch(url, {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      return {
        content: [{ type: 'text', text: `ERROR: Network request failed — ${err.message}` }],
        isError: true,
      };
    }

    if (res.status === 401) {
      return {
        content: [{ type: 'text', text: 'ERROR: Authentication failed — check CONFLUENCE_API_TOKEN is valid and not expired.' }],
        isError: true,
      };
    }

    if (res.status === 404) {
      return {
        content: [{ type: 'text', text: `ERROR: Page ID ${pageId} not found in space SC. Verify the page exists at ${BASE_URL}/wiki/spaces/SC.` }],
        isError: true,
      };
    }

    if (!res.ok) {
      return {
        content: [{ type: 'text', text: `ERROR: Confluence API returned HTTP ${res.status}.` }],
        isError: true,
      };
    }

    const data = await res.json();
    const title = data.title || '(untitled)';
    const rawHtml = data.body?.storage?.value || '';
    const content = stripHtml(rawHtml);

    if (!content || content.length === 0) {
      return {
        content: [{ type: 'text', text: `ERROR: Confluence page "${title}" (ID: ${pageId}) exists but has no content. Add the requirement text before running the pipeline.` }],
        isError: true,
      };
    }

    if (content.length < 50) {
      return {
        content: [{ type: 'text', text: `ERROR: Confluence page "${title}" content is too short (${content.length} chars). Minimum 50 characters expected. Add the full requirement text.` }],
        isError: true,
      };
    }

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ title, content }),
      }],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
