import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from '../src/server.js'

const API_KEY = process.env.MCP_API_KEY

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(request) {
  if (!API_KEY) {
    return json(500, { error: 'Server misconfigured: MCP_API_KEY missing' })
  }

  const header = request.headers.get('authorization')
  const provided =
    header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : request.headers.get('x-api-key')
  if (!provided || provided !== API_KEY) {
    return json(401, { error: 'Unauthorized: invalid API key' })
  }

  if (!['POST', 'GET', 'DELETE'].includes(request.method)) {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
  })

  const server = createMcpServer()
  await server.connect(transport)

  try {
    return await transport.handleRequest(request)
  } catch (err) {
    console.error('MCP handler error:', err)
    return json(500, { error: err.message })
  }
}

export const config = {
  runtime: 'nodejs',
}
