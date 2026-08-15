import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from '../src/server.js'

function sendJson(res, status, body) {
  if (res.headersSent) return
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .replace(/^Bearer\s+/i, '')
    .replace(/^(['"])(.*)\1$/, '$2')
    .trim()
}

export default async function handler(req, res) {
  const apiKey = normalizeKey(process.env.MCP_API_KEY)
  const header = req.headers.authorization
  const provided =
    header && /^Bearer\s+/i.test(header)
      ? normalizeKey(header)
      : normalizeKey(req.headers['x-api-key'])

  if (!apiKey) {
    return sendJson(res, 500, { error: 'Server misconfigured: MCP_API_KEY missing' })
  }

  if (!provided || provided !== apiKey) {
    return sendJson(res, 401, { error: 'Unauthorized: invalid API key' })
  }

  if (!['POST', 'GET', 'DELETE'].includes(req.method)) {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }

  try {
    const server = createMcpServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    })

    await server.connect(transport)
    await transport.handleRequest(req, res, req.body)
  } catch (err) {
    console.error('MCP handler error:', err)
    sendJson(res, 500, { error: err instanceof Error ? err.message : String(err) })
  }
}

export const config = {
  runtime: 'nodejs',
}
