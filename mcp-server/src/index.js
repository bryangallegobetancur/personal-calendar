import express from 'express'
import { randomUUID } from 'node:crypto'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpServer } from './server.js'

const API_KEY = process.env.MCP_API_KEY
if (!API_KEY) {
  throw new Error('Missing MCP_API_KEY environment variable')
}

const server = createMcpServer()

// ---- HTTP transport (Streamable HTTP) ----

const app = express()
app.use(express.json())

const transports = new Map()

function apiKeyAuth(req, res, next) {
  const header = req.headers.authorization
  const provided =
    header && header.startsWith('Bearer ') ? header.slice('Bearer '.length) : req.headers['x-api-key']
  if (!provided || provided !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' })
  }
  next()
}

app.post('/mcp', apiKeyAuth, async (req, res) => {
  const sessionId = req.headers['mcp-session-id']
  let transport

  if (sessionId && transports.has(sessionId)) {
    transport = transports.get(sessionId)
  } else {
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (id) => {
        transports.set(id, transport)
      },
      enableJsonResponse: true,
    })
    await server.connect(transport)
  }

  try {
    await transport.handleRequest(req, res, req.body)
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message })
    }
  }
})

app.get('/mcp', apiKeyAuth, async (req, res) => {
  const sessionId = req.headers['mcp-session-id']
  const transport = sessionId ? transports.get(sessionId) : null
  if (!transport) {
    return res.status(404).json({ error: 'Session not found' })
  }
  try {
    await transport.handleRequest(req, res)
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message })
    }
  }
})

app.delete('/mcp', apiKeyAuth, async (req, res) => {
  const sessionId = req.headers['mcp-session-id']
  const transport = sessionId ? transports.get(sessionId) : null
  if (!transport) {
    return res.status(404).json({ error: 'Session not found' })
  }
  try {
    await transport.handleRequest(req, res)
  } finally {
    transports.delete(sessionId)
  }
})

const PORT = Number(process.env.PORT) || 8787
app.listen(PORT, () => {
  console.log(`Personal Calendar MCP server listening on http://localhost:${PORT}/mcp`)
})
