import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from '../src/server.js'

function sendJson(res, status, body) {
  if (res.headersSent) return
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default async function handler(req, res) {
  const apiKey = process.env.MCP_API_KEY
  const header = req.headers.authorization
  const provided =
    header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : req.headers['x-api-key']

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
