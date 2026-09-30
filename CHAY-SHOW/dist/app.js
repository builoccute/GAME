import { EVENT_TYPES, NPCS, VENDORS, INCIDENTS, TASKS } from './data.js'

const $ = (s, root = document) => root.querySelector(s)
const app = $('#app')
const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number(n) || 0))
const money = n => new Intl.NumberFormat('vi-VN').format(Math.round(Number(n) || 0)) + 'đ'
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
const store = {
  get(key, fallback = null) { try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v) } catch { return fallback } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} },
  text(key, fallback = '') { try { return localStorage.getItem(key) || fallback } catch { return fallback } },
  setText(key, value) { try { localStorage.setItem(key, value) } catch {} }
}

let state = {
  screen: 'home',
  tab: 'desk',
  game: store.get('chayshow_save'),
  choose: false,
  selectedMail: null,
  leaderboard: [],
  nickname: store.text('chayshow_name'),
  toast: ''
}

function playerId() {
  let id = store.text('chayshow_player')
  if (!id) { id = uid(); store.setText('chayshow_player', id) }
  return id
}

function newGame(type) {
  return {
    version: 2, eventId: type.id, day: 1, days: type.days, budget: type.budget, initialBudget: type.budget,
    target: type.target, guests: Math.max(3, Math.round(type.target * .08)), reach: type.baseReach, reputation: 55,
    team: 65, partner: 50, stress: 18, phase: 'planning', staff: [], vendors: [], completed: [],
    inbox: [{ id: uid(), from: 'Hệ thống', subject: 'Chào mừng đến với CHẠY SHOW', body: `Bạn có ${type.days} ngày để đưa ${type.name} từ ý tưởng thành hiện thực. Mỗi quyết định đều có giá.`, unread: true }],
    history: [], incident: null, finished: false, score: 0, ending: '', submitted: false
  }
}

function typeOfGame() { return EVENT_TYPES.find(x => x.id === state.game?.eventId) || EVENT_TYPES[0] }
function saveGame() { if (state.game) store.set('chayshow_save', state.game) }
function toast(message) { state.toast = message; render(); clearTimeout(toast.timer); toast.timer = setTimeout(() => { state.toast = ''; render() }, 2200) }

function brand() { return `<div class="brand"><div class="brandmark">CS</div><div><b>CHẠY SHOW</b><small>đừng để show chạy bạn</small></div></div>` }
function pageTitle(eyebrow, title, text) { return `<div class="page-title"><div class="eyebrow">${esc(eyebrow)}</div><h2>${esc(title)}</h2><p>${esc(text)}</p></div>` }

function render() {
  try {
    if (state.screen === 'game' && !state.game) state.screen = 'home'
    if (state.screen === 'result' && !state.game) state.screen = 'home'
    if (state.screen === 'home') app.innerHTML = homeView()
    else if (state.screen === 'game') app.innerHTML = gameView()
    else if (state.screen === 'result') app.innerHTML = resultView()
    else if (state.screen === 'leaderboard') app.innerHTML = leaderboardView()
    if (state.toast) app.insertAdjacentHTML('beforeend', `<div class="toast">${esc(state.toast)}</div>`)
  } catch (error) {
    console.error(error)
    app.innerHTML = `<main class="fatal"><div><b>CHẠY SHOW</b><h1>Game vừa vấp dây điện 😭</h1><p>${esc(error?.message || error)}</p><button data-action="reset">Khởi động lại</button></div></main>`
  }
}

function homeView() {
  const g = state.game
  return `<main class="landing">
    <nav class="topnav">${brand()}<div class="nav-actions"><button class="ghost" data-action="leaderboard">🏆 BXH</button><span class="version">V1.0.1</span></div></nav>
    <section class="hero">
      <div class="eyebrow">EVENT MANAGEMENT SIMULATOR</div>
      <h1>CHẠY <span>SHOW</span></h1>
      <p>Bạn có ngân sách, một đội hình chưa chắc đáng tin và deadline đang chạy. Tổ chức được sự kiện trước khi mọi thứ nổ tung không?</p>
      <div class="hero-actions"><button class="primary xl" data-action="choose">🎬 BẮT ĐẦU CHẠY SHOW</button>${g ? `<button class="secondary xl" data-action="resume">↩ Chơi tiếp ngày ${esc(g.day)}</button>` : ''}</div>
      <div class="hero-stats"><div><b>100</b><span>sự cố</span></div><div><b>25</b><span>nhân sự</span></div><div><b>20</b><span>nhà cung cấp</span></div><div><b>5</b><span>loại sự kiện</span></div></div>
    </section>
    <section class="ticker"><span>⚡ DEADLINE</span><span>💸 NGÂN SÁCH</span><span>🎤 MC ĐANG KẸT XE</span><span>🌧️ TRỜI SẮP MƯA</span><span>📣 POSTER SAI NGÀY</span><span>🫠 BTC XIN NGHỈ</span></section>
    ${state.choose ? chooserView() : ''}
  </main>`
}

function chooserView() {
  return `<div class="modal-back"><div class="chooser"><button class="x" data-action="close-choose">×</button><div class="eyebrow">CHỌN KÈO ĐẦU TIÊN</div><h2>Hôm nay chạy show gì?</h2><div class="event-grid">${EVENT_TYPES.map(t => `<button class="event-card" data-action="start" data-id="${esc(t.id)}"><span class="event-icon">${t.icon}</span><b>${esc(t.name)}</b><small>${esc(t.desc)}</small><div><span>${t.days} ngày</span><span>${money(t.budget)}</span><span>${esc(t.difficulty)}</span></div></button>`).join('')}</div></div></div>`
}

function stat(icon, label, value, sub = '', danger = false) {
  return `<div class="stat ${danger ? 'danger' : ''}"><span>${icon}</span><div><small>${esc(label)}</small><b>${esc(value)}</b>${sub ? `<em>${esc(sub)}</em>` : ''}</div></div>`
}
function meter(label, value) { return `<div class="meter"><div><span>${esc(label)}</span><b>${Math.round(value)}%</b></div><i><u style="width:${clamp(value)}%"></u></i></div>` }

function gameView() {
  const g = state.game, type = typeOfGame()
  const phases = { planning: 'Lên kế hoạch', promotion: 'Mở đăng ký', production: 'Nước rút', showtime: 'Ngày diễn ra' }
  const unread = g.inbox.filter(x => x.unread).length
  return `<div class="app-shell">
    <header class="game-header">${brand()}<div class="event-title"><span>${type.icon}</span><div><small>ĐANG CHẠY</small><b>${esc(type.name)}</b></div></div><button class="ghost" data-action="home">⌂ Trang chủ</button></header>
    <div class="statusbar">${stat('📅','NGÀY',`${g.day}/${g.days}`,phases[g.phase] || '')}${stat('💰','NGÂN SÁCH',money(g.budget),'',g.budget < g.initialBudget*.2)}${stat('🎟️','ĐĂNG KÝ',`${Math.round(g.guests)}/${g.target}`,`${Math.round(g.guests/g.target*100)}% mục tiêu`)}${stat('⭐','UY TÍN',Math.round(g.reputation))}${stat('🧠','STRESS',`${Math.round(g.stress)}%`,'',g.stress>75)}</div>
    <div class="game-layout"><aside class="sidebar">
      ${[['desk','🎛️','Bàn điều hành'],['team','👥','Nhân sự'],['vendors','📦','Nhà cung cấp'],['inbox','💬',`Tin nhắn ${unread?`(${unread})`:''}`],['timeline','🗓️','Nhật ký']].map(([id,ic,lb]) => `<button class="${state.tab===id?'active':''}" data-action="tab" data-id="${id}"><span>${ic}</span>${esc(lb)}</button>`).join('')}
      <div class="mini-bars">${meter('Truyền thông',g.reach)}${meter('Tinh thần BTC',g.team)}${meter('Đối tác',g.partner)}</div>
    </aside><section class="workspace">${workspaceView()}</section></div>
    ${g.incident ? incidentView(g.incident) : ''}
  </div>`
}

function workspaceView() {
  if (state.tab === 'team') return teamView()
  if (state.tab === 'vendors') return vendorsView()
  if (state.tab === 'inbox') return inboxView()
  if (state.tab === 'timeline') return timelineView()
  return deskView()
}

function deskView() {
  const g = state.game
  const done = g.completed.filter(x => x.startsWith(`${g.day}-`)).length
  return `<div class="desk"><div class="desk-top"><div><div class="eyebrow">BÀN ĐIỀU HÀNH · NGÀY ${g.day}</div><h2>${g.day===g.days?'SHOWTIME. Đừng hoảng.':'Hôm nay ưu tiên gì?'}</h2><p>Mỗi đầu việc tốn ngân sách nhưng giúp tăng khả năng sống sót đến ngày diễn ra.</p></div><div class="countdown"><small>CÒN</small><b>${Math.max(0,g.days-g.day)}</b><span>NGÀY</span></div></div>
    <div class="progress-wrap"><div class="progress-head"><b>Tiến độ đến ngày diễn ra</b><span>${Math.round(g.day/g.days*100)}%</span></div><div class="progress"><i style="width:${clamp(g.day/g.days*100)}%"></i></div></div>
    <div class="task-grid">${TASKS.map(t => { const used=g.completed.includes(`${g.day}-${t.id}`); return `<button class="task-card" data-action="task" data-id="${t.id}" ${used?'disabled':''}><span>${t.icon}</span><div><b>${esc(t.label)}</b><small>${money(t.cost)}</small></div><em>${used?'XONG':'LÀM'}</em></button>` }).join('')}</div>
    <div class="day-footer"><div><b>${done}</b><span>đầu việc hôm nay</span></div><div><b>${g.staff.length}</b><span>người trong BTC</span></div><div><b>${g.vendors.length}</b><span>nhà cung cấp</span></div><button class="primary" data-action="next-day">${g.day>=g.days?'🎬 CHẠY SỰ KIỆN':'KẾT THÚC NGÀY →'}</button></div></div>`
}

function teamView() {
  const g = state.game
  return `${pageTitle('BTC CỦA BẠN',`Đội hình ${g.staff.length}/25`,'Mỗi người có kỹ năng, độ tin cậy và mức năng lượng khác nhau. Tuyển vừa đủ — lương cũng là tiền.')}<div class="people-grid">${NPCS.map(n => { const owned=g.staff.includes(n.id); return `<article class="person ${owned?'owned':''}"><div class="avatar">${esc(n.name[0])}</div><div class="person-main"><div><b>${esc(n.name)}</b><span>${esc(n.role)}</span></div><p>“${esc(n.quirk)}”</p><div class="skillrow"><span>Kỹ năng <b>${n.skill}</b></span><span>Tin cậy <b>${n.reliability}</b></span><span>Năng lượng <b>${n.energy}</b></span></div></div><button data-action="hire" data-id="${n.id}" ${owned?'disabled':''}>${owned?'ĐÃ TUYỂN':`+ ${money(n.cost)}`}</button></article>` }).join('')}</div>`
}

function vendorsView() {
  const g = state.game
  return `${pageTitle('MARKETPLACE','Nhà cung cấp','Giá rẻ chưa chắc đáng tin. Chất lượng cao chưa chắc kịp deadline.')}<div class="vendor-grid">${VENDORS.map(v => { const owned=g.vendors.includes(v.id); const icon=v.type==='F&B'?'🍱':v.type==='Media'?'📸':v.type==='Âm thanh'?'🔊':'📦'; return `<article class="vendor ${owned?'owned':''}"><div class="vendor-icon">${icon}</div><small>${esc(v.type)}</small><h3>${esc(v.name)}</h3><b>${money(v.price)}</b><div><span>Chất lượng ${v.quality}</span><span>Tin cậy ${v.reliability}</span></div><button data-action="vendor" data-id="${v.id}" ${owned?'disabled':''}>${owned?'ĐÃ CHỐT':'CHỌN ĐƠN VỊ'}</button></article>` }).join('')}</div>`
}

function inboxView() {
  const g = state.game
  let mail = g.inbox.find(x => x.id === state.selectedMail) || g.inbox[0]
  return `<div class="inbox"><div class="mail-list">${pageTitle('INBOX','Tin nhắn','Đừng bỏ lỡ tin nhắn lúc đang chạy show.')}${g.inbox.map(m => `<button class="${mail?.id===m.id?'active':''}" data-action="mail" data-id="${esc(m.id)}"><span class="${m.unread?'dot':''}"></span><div><b>${esc(m.from)}</b><strong>${esc(m.subject)}</strong><small>${esc(m.body.slice(0,62))}…</small></div></button>`).join('')}</div><div class="mail-reader">${mail?`<div class="mail-from"><div class="avatar">${esc(mail.from[0])}</div><div><b>${esc(mail.from)}</b><small>Gửi tới Ban tổ chức</small></div></div><h2>${esc(mail.subject)}</h2><p>${esc(mail.body)}</p><div class="fake-reply">Phản hồi được xử lý thông qua quyết định/sự cố trong game.</div>`:'<div class="empty">Không có tin nhắn</div>'}</div></div>`
}

function timelineView() {
  const g = state.game
  const rows = g.history.length ? [...g.history].reverse().map(h => `<div><span>NGÀY ${h.day}</span><p>${esc(h.note)}</p></div>`).join('') : '<div><span>NGÀY 1</span><p>Show vừa được khởi động. Chưa có drama — tận hưởng đi.</p></div>'
  return `${pageTitle('NHẬT KÝ SHOW','Mọi quyết định đều để lại dấu vết','Lúc thắng thì gọi là chiến lược. Lúc thua thì gọi là kinh nghiệm.')}<div class="timeline">${rows}</div>`
}

function effectText(d) {
  const names={budget:'ngân sách',reach:'độ phủ',reputation:'uy tín',stress:'stress',team:'tinh thần',partner:'đối tác',guests:'khách'}
  return Object.entries(d).map(([k,v]) => `${v>0?'+':''}${v} ${names[k]||k}`).join(' · ')
}
function incidentView(incident) {
  return `<div class="modal-back incident-back"><div class="incident"><div class="alarm">⚠️ SỰ CỐ PHÁT SINH</div><div class="incident-icon">💥</div><h2>${esc(incident.title)}</h2><p>${esc(incident.body)}</p><div class="choices">${incident.choices.map((c,i)=>`<button data-action="resolve" data-index="${i}"><span>${String.fromCharCode(65+i)}</span><div><b>${esc(c.label)}</b><small>${esc(effectText(c.delta))}</small></div></button>`).join('')}</div><small class="hint">Không có lựa chọn hoàn hảo. Chỉ có lựa chọn ít đau hơn.</small></div></div>`
}

function resultView() {
  const g=state.game, type=typeOfGame()
  const metrics=[['🎟️','Khách',`${Math.round(g.guests)}/${g.target}`],['⭐','Uy tín',`${Math.round(g.reputation)}/100`],['📣','Độ phủ',`${Math.round(g.reach)}/100`],['🫶','BTC',`${Math.round(g.team)}/100`],['💰','Còn lại',money(g.budget)],['🧠','Stress',`${Math.round(g.stress)}%`]]
  return `<main class="result-page"><div class="result-card"><div class="confetti">✦ ✧ ✦ ✧ ✦</div><div class="eyebrow">SHOW ĐÃ KẾT THÚC</div><div class="result-icon">${type.icon}</div><h1>${esc(g.ending)}</h1><p>${esc(type.name)} · ${g.days} ngày chạy deadline</p><div class="score"><small>ĐIỂM VẬN HÀNH</small><b>${g.score}</b></div><div class="result-metrics">${metrics.map(([i,l,v])=>`<div><span>${i}</span><small>${esc(l)}</small><b>${esc(v)}</b></div>`).join('')}</div><div class="rank-submit"><input id="nickname" maxlength="30" value="${esc(state.nickname)}" placeholder="Biệt danh trên BXH"><button class="primary" data-action="submit-score" ${g.submitted?'disabled':''}>${g.submitted?'✓ ĐÃ GỬI':'🏆 GỬI ĐIỂM'}</button></div><div class="result-actions"><button class="secondary" data-action="restart">↻ Chơi lại</button><button class="ghost" data-action="home">⌂ Trang chủ</button></div></div></main>`
}

function leaderboardView() {
  const rows=state.leaderboard
  return `<main class="leader-page"><nav class="topnav">${brand()}<button class="ghost" data-action="home">← Trang chủ</button></nav><div class="leader-wrap">${pageTitle('GLOBAL','Bảng xếp hạng','Top những người vẫn còn tỉnh táo sau khi chạy show.')}<div class="leader-table"><div class="leader-head"><span>#</span><span>Người chơi</span><span>Sự kiện</span><span>Uy tín</span><span>Điểm</span></div>${rows.length?rows.map((r,i)=>`<div class="leader-row"><b>${i+1}</b><span>${esc(r.nickname)}</span><span>${esc(r.event_type)}</span><span>${esc(r.reputation)}</span><strong>${esc(r.score)}</strong></div>`).join(''):'<div class="empty">Chưa có điểm nào hoặc D1 chưa chạy migration.</div>'}</div></div></main>`
}

function apply(delta={}) {
  const g=state.game
  g.budget += delta.budget || 0
  g.guests = clamp(g.guests+(delta.guests||0),0,g.target*1.5)
  g.reach = clamp(g.reach+(delta.reach||0)); g.reputation=clamp(g.reputation+(delta.reputation||0))
  g.team=clamp(g.team+(delta.team||0)); g.partner=clamp(g.partner+(delta.partner||0)); g.stress=clamp(g.stress+(delta.stress||0))
}

function finish() {
  const g=state.game
  const attendance=Math.min(120,(g.guests/g.target)*100), finance=clamp(55+(g.budget/g.initialBudget)*45), ops=clamp((g.reputation+g.partner+(100-g.stress))/3)
  const score=Math.max(0,Math.round(attendance*3+finance*2+g.team*1.5+ops*2+g.reach*1.5))
  let ending='Một show vừa đủ để nhớ'
  if(score>=850) ending='Show bùng nổ — ai cũng hỏi mùa sau khi nào mở'
  else if(score>=700) ending='Chạy mượt — khách vui, BTC còn nguyên đội hình'
  else if(score>=520) ending='Qua được cửa — có lỗi nhưng cứu kịp'
  else if(g.budget<0) ending='Cháy ngân sách — show xong nhưng ví cũng xong'
  else ending='Show hỗn loạn — một bài học trị giá cả thanh xuân'
  Object.assign(g,{finished:true,score,ending,incident:null}); saveGame(); state.screen='result'; render()
}

async function loadLeaderboard() {
  state.screen='leaderboard'; state.leaderboard=[]; render()
  try { const r=await fetch('/api/leaderboard'); const j=await r.json(); state.leaderboard=Array.isArray(j.rows)?j.rows:[] } catch { state.leaderboard=[] }
  render()
}

async function submitScore() {
  const input=$('#nickname'); state.nickname=(input?.value||'').trim()
  if(!state.nickname) return toast('Nhập biệt danh trước nha')
  store.setText('chayshow_name',state.nickname)
  const g=state.game, type=typeOfGame()
  try {
    const r=await fetch('/api/runs',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({playerId:playerId(),nickname:state.nickname,eventType:type.name,score:g.score,budgetLeft:g.budget,reputation:g.reputation,guests:g.guests,ending:g.ending})})
    if(!r.ok) throw new Error('D1 chưa sẵn sàng')
    g.submitted=true; saveGame(); toast('🏆 Đã lên bảng xếp hạng')
  } catch { toast('Chưa gửi được điểm — chạy migration D1 rồi thử lại') }
}

app.addEventListener('click', event => {
  const el=event.target.closest('[data-action]'); if(!el) return
  const action=el.dataset.action, id=el.dataset.id
  if(action==='choose'){state.choose=true;render()}
  else if(action==='close-choose'){state.choose=false;render()}
  else if(action==='home'){state.screen='home';state.choose=false;render()}
  else if(action==='resume'){state.screen=state.game?.finished?'result':'game';render()}
  else if(action==='leaderboard') loadLeaderboard()
  else if(action==='start') { const t=EVENT_TYPES.find(x=>x.id===id); if(t){state.game=newGame(t);state.screen='game';state.tab='desk';state.choose=false;saveGame();render()} }
  else if(action==='tab'){state.tab=id;render()}
  else if(action==='task') {
    const t=TASKS.find(x=>x.id===id), g=state.game; if(!t)return
    if(g.budget<t.cost)return toast('💸 Không đủ ngân sách')
    if(g.completed.includes(`${g.day}-${t.id}`))return toast('Đã làm việc này hôm nay')
    g.budget-=t.cost; g.completed.push(`${g.day}-${t.id}`); apply(t.effects); saveGame(); toast(`${t.icon} ${t.label} hoàn tất`)
  }
  else if(action==='hire') {
    const n=NPCS.find(x=>x.id===id),g=state.game;if(!n||g.staff.includes(id))return
    if(g.budget<n.cost)return toast('Không đủ tiền tuyển người này')
    g.budget-=n.cost;g.staff.push(id);g.team=clamp(g.team+Math.round(n.skill/15));g.stress=clamp(g.stress-2);saveGame();render()
  }
  else if(action==='vendor') {
    const v=VENDORS.find(x=>x.id===id),g=state.game;if(!v||g.vendors.includes(id))return
    if(g.budget<v.price)return toast('Không đủ ngân sách')
    g.budget-=v.price;g.vendors.push(id);g.partner=clamp(g.partner+Math.round(v.reliability/25));g.reputation=clamp(g.reputation+Math.round(v.quality/30));saveGame();render()
  }
  else if(action==='mail'){state.selectedMail=id;const m=state.game.inbox.find(x=>x.id===id);if(m)m.unread=false;saveGame();render()}
  else if(action==='next-day') {
    const g=state.game;if(g.incident)return toast('⚠️ Xử lý sự cố trước đã')
    const tasksToday=g.completed.filter(x=>x.startsWith(`${g.day}-`)).length, organic=Math.max(1,Math.round((g.reach/18)+(g.staff.length*.8)+(tasksToday*1.5)))
    g.guests=clamp(g.guests+organic,0,Math.round(g.target*1.35))
    if(g.day>=g.days)return finish()
    const chance=Math.min(.82,.35+g.day/g.days*.35), incident=Math.random()<chance?INCIDENTS[Math.floor(Math.random()*INCIDENTS.length)]:null
    g.history.push({day:g.day,note:`Kết ngày ${g.day}: ${tasksToday} đầu việc, ${Math.round(g.guests)} đăng ký.`});g.day++
    g.phase=g.day>=g.days?'showtime':g.day>=Math.ceil(g.days*.72)?'production':g.day>=Math.ceil(g.days*.38)?'promotion':'planning'
    g.stress=clamp(g.stress+Math.max(1,4-Math.floor(g.staff.length/3)));g.incident=incident
    if(incident)g.inbox.unshift({id:uid(),from:incident.category==='partner'?'Đối tác':'Điều phối hiện trường',subject:incident.title,body:incident.body,unread:true})
    saveGame();render()
  }
  else if(action==='resolve') {
    const g=state.game, incident=g.incident, choice=incident?.choices?.[Number(el.dataset.index)];if(!choice)return
    const title=incident.title;apply(choice.delta);g.incident=null;g.history.push({day:g.day,note:`Sự cố: ${title} → ${choice.label}`});saveGame();toast('Đã xử lý sự cố')
  }
  else if(action==='submit-score') submitScore()
  else if(action==='restart'){const t=typeOfGame();state.game=newGame(t);state.screen='game';state.tab='desk';saveGame();render()}
  else if(action==='reset'){try{localStorage.removeItem('chayshow_save')}catch{};state.game=null;state.screen='home';render()}
})

window.addEventListener('error', e => console.error('CHAY SHOW runtime error:', e.error || e.message))
window.addEventListener('unhandledrejection', e => console.error('CHAY SHOW promise error:', e.reason))
render()
