const json = (data, init = {}) => new Response(JSON.stringify(data), {
  ...init,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...(init.headers || {}) }
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.STATIC.fetch(request);

    try {
      if (url.pathname === '/api/health') {
        return json({ ok: true, game: env.GAME_NAME || 'Game', version: env.GAME_VERSION || '4.0.0' });
      }

      if (url.pathname === '/api/save' && request.method === 'GET') {
        const id = (url.searchParams.get('player') || '').slice(0, 96);
        if (!id) return json({ ok: false, error: 'missing_player' }, { status: 400 });
        const row = await env.DB.prepare('SELECT payload, updated_at FROM player_saves WHERE player_id = ?').bind(id).first();
        return json({ ok: true, save: row ? JSON.parse(row.payload) : null, updatedAt: row?.updated_at || null });
      }

      if (url.pathname === '/api/save' && request.method === 'POST') {
        const body = await request.json();
        const id = String(body.playerId || '').slice(0, 96);
        if (!id || !body.save) return json({ ok: false, error: 'invalid_payload' }, { status: 400 });
        const payload = JSON.stringify(body.save).slice(0, 250000);
        await env.DB.prepare(`INSERT INTO player_saves(player_id,payload,updated_at) VALUES(?,?,unixepoch())
          ON CONFLICT(player_id) DO UPDATE SET payload=excluded.payload, updated_at=unixepoch()`)
          .bind(id, payload).run();
        const s = body.save;
        await env.DB.prepare(`INSERT INTO leaderboard(player_id,display_name,level,money,careers_played,reputation,updated_at)
          VALUES(?,?,?,?,?,?,unixepoch()) ON CONFLICT(player_id) DO UPDATE SET
          display_name=excluded.display_name, level=excluded.level, money=excluded.money,
          careers_played=excluded.careers_played, reputation=excluded.reputation, updated_at=unixepoch()`)
          .bind(id, String(s.playerName || 'Người chơi').slice(0, 30), Number(s.level || 1), Number(s.money || 0), Number(s.careersPlayed || 0), Number(s.reputation || 0)).run();
        return json({ ok: true });
      }

      if (url.pathname === '/api/leaderboard' && request.method === 'GET') {
        const { results = [] } = await env.DB.prepare('SELECT display_name,level,money,careers_played,reputation FROM leaderboard ORDER BY level DESC,money DESC,reputation DESC LIMIT 50').all();
        return json({ ok: true, rows: results });
      }

      return json({ ok: false, error: 'not_found' }, { status: 404 });
    } catch (error) {
      return json({ ok: false, error: 'server_error', message: String(error?.message || error) }, { status: 500 });
    }
  }
};
