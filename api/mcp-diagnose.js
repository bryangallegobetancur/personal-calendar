import { createHash } from 'node:crypto'

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

  const hash = (v) => createHash('sha256').update(v || '').digest('hex')

  sendJson(res, 200, {
    env_configured: Boolean(apiKey),
    env_length: apiKey.length,
    env_sha256: hash(apiKey),
    provided_sha256: hash(provided),
    match: Boolean(apiKey) && provided === apiKey,
  })
}

export const config = {
  runtime: 'nodejs',
}
