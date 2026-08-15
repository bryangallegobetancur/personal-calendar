import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createMcpServer } from '../src/server.js'

const API_KEY = process.env.MCP_API_KEY

function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized: invalid API key' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(request) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Server misconfigured: MCP_API_KEY missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const header = request.headers.get('authorization')
  const provided =
    header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : request.headers.get('x-api-key')
  if (!provided || provided !== API_KEY) {
    return unauthorized()
  }

  const method = request.method
  if (!['POST', 'GET', 'DELETE'].includes(method)) {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const server = createMcpServer()
  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
  })

  await server.connect(transport)

  try {
    return await transport.handleRequest(request)
  } catch (err) {
    console.error('MCP handler error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = {
  runtime: 'nodejs',
}
