const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
})

const safeText = (v, max = 80) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max)

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/api/health') {
        return json({ ok: true, game: env.GAME_NAME || 'CHẠY SHOW', version: env.GAME_VERSION || '1.0.1' })
      }

      if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
        const rows = await env.DB.prepare(`
          SELECT nickname, event_type, score, budget_left, reputation, guests, ending, created_at
          FROM runs ORDER BY score DESC, created_at DESC LIMIT 20
        `).all()
        return json({ ok: true, rows: rows.results ?? [] })
      }

      if (url.pathname === '/api/runs' && request.method === 'POST') {
        const body = await request.json().catch(() => null)
        if (!body) return json({ ok: false, error: 'INVALID_JSON' }, 400)
        const playerId = safeText(body.playerId, 64)
        if (!playerId) return json({ ok: false, error: 'PLAYER_REQUIRED' }, 400)
        const id = crypto.randomUUID()
        await env.DB.prepare(`
          INSERT INTO runs (id, player_id, nickname, event_type, score, budget_left, reputation, guests, ending)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
          id,
          playerId,
          safeText(body.nickname || 'Ẩn danh', 30),
          safeText(body.eventType, 60),
          Math.max(0, Math.min(999999, Number(body.score) || 0)),
          Math.max(-999999999, Math.min(999999999, Number(body.budgetLeft) || 0)),
          Math.max(0, Math.min(100, Number(body.reputation) || 0)),
          Math.max(0, Math.min(100000, Number(body.guests) || 0)),
          safeText(body.ending, 140)
        ).run()
        return json({ ok: true, id })
      }

      if (url.pathname.startsWith('/media/') && request.method === 'GET') {
        const key = decodeURIComponent(url.pathname.slice('/media/'.length))
        if (!key || key.includes('..')) return new Response('Not found', { status: 404 })
        const object = await env.ASSETS.get(key)
        if (!object) return new Response('Not found', { status: 404 })
        const headers = new Headers()
        object.writeHttpMetadata(headers)
        headers.set('etag', object.httpEtag)
        headers.set('cache-control', 'public, max-age=86400')
        return new Response(object.body, { headers })
      }

      return env.STATIC.fetch(request)
    } catch (error) {
      if (url.pathname.startsWith('/api/')) {
        return json({ ok: false, error: 'SERVER_ERROR', message: String(error?.message || error) }, 500)
      }
      return env.STATIC.fetch(request)
    }
  }
}
