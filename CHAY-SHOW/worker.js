const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  }
})

function safeText(v, max = 80) {
  return String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return json({ ok: true, game: env.GAME_NAME, version: env.GAME_VERSION })
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
      const id = crypto.randomUUID()
      const playerId = safeText(body.playerId, 64)
      if (!playerId) return json({ ok: false, error: 'PLAYER_REQUIRED' }, 400)
      const nickname = safeText(body.nickname || 'Ẩn danh', 30)
      const eventType = safeText(body.eventType, 40)
      const ending = safeText(body.ending, 120)
      const score = Math.max(0, Math.min(999999, Number(body.score) || 0))
      const budgetLeft = Math.max(-999999999, Math.min(999999999, Number(body.budgetLeft) || 0))
      const reputation = Math.max(0, Math.min(100, Number(body.reputation) || 0))
      const guests = Math.max(0, Math.min(100000, Number(body.guests) || 0))
      await env.DB.prepare(`
        INSERT INTO runs (id, player_id, nickname, event_type, score, budget_left, reputation, guests, ending)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(id, playerId, nickname, eventType, score, budgetLeft, reputation, guests, ending).run()
      return json({ ok: true, id })
    }

    if (url.pathname.startsWith('/api/save/') && request.method === 'GET') {
      const playerId = safeText(decodeURIComponent(url.pathname.slice('/api/save/'.length)), 64)
      const row = await env.DB.prepare('SELECT save_json, updated_at FROM cloud_saves WHERE player_id = ?').bind(playerId).first()
      if (!row) return json({ ok: true, save: null })
      return json({ ok: true, save: JSON.parse(row.save_json), updatedAt: row.updated_at })
    }

    if (url.pathname === '/api/save' && request.method === 'PUT') {
      const body = await request.json().catch(() => null)
      const playerId = safeText(body?.playerId, 64)
      if (!playerId || !body?.save) return json({ ok: false, error: 'INVALID_SAVE' }, 400)
      const saveJson = JSON.stringify(body.save)
      if (saveJson.length > 150000) return json({ ok: false, error: 'SAVE_TOO_LARGE' }, 413)
      await env.DB.prepare(`
        INSERT INTO cloud_saves(player_id, save_json, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(player_id) DO UPDATE SET save_json = excluded.save_json, updated_at = CURRENT_TIMESTAMP
      `).bind(playerId, saveJson).run()
      return json({ ok: true })
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
  }
}
