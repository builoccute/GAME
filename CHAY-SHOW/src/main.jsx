import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { EVENT_TYPES, NPCS, VENDORS, INCIDENTS, ACHIEVEMENTS, TASKS } from './data/gameData'
import './styles.css'

const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n))
const money=n=>new Intl.NumberFormat('vi-VN').format(Math.round(n))+'đ'
const uid=()=>crypto.randomUUID?.() || Math.random().toString(36).slice(2)
const playerId=()=>{let id=localStorage.getItem('chayshow_player');if(!id){id=uid();localStorage.setItem('chayshow_player',id)}return id}

function newGame(type){
  return {
    version:1, eventId:type.id, day:1, days:type.days, budget:type.budget, initialBudget:type.budget,
    target:type.target, guests:Math.max(3,Math.round(type.target*.08)), reach:type.baseReach, reputation:55,
    team:65, partner:50, stress:18, phase:'planning', staff:[], vendors:[], completed:[],
    inbox:[{id:uid(),from:'Hệ thống',subject:'Chào mừng đến với CHẠY SHOW',body:`Bạn có ${type.days} ngày để đưa ${type.name} từ ý tưởng thành hiện thực. Mỗi quyết định đều có giá.`,unread:true}],
    history:[], incident:null, finished:false, score:0, ending:'', submitted:false
  }
}

function App(){
  const [screen,setScreen]=useState('home')
  const [game,setGame]=useState(()=>{try{return JSON.parse(localStorage.getItem('chayshow_save'))}catch{return null}})
  const [nickname,setNickname]=useState(localStorage.getItem('chayshow_name')||'')
  const [leaderboard,setLeaderboard]=useState([])
  const [tab,setTab]=useState('desk')
  const [toast,setToast]=useState('')
  const [selectedMail,setSelectedMail]=useState(null)
  const type=useMemo(()=>EVENT_TYPES.find(x=>x.id===game?.eventId),[game])

  useEffect(()=>{if(game&&!game.finished)localStorage.setItem('chayshow_save',JSON.stringify(game))},[game])
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(t)}},[toast])

  const start=(t)=>{const g=newGame(t);setGame(g);setScreen('game');setTab('desk')}
  const resume=()=>{if(game)setScreen(game.finished?'result':'game')}
  const apply=(delta={})=>setGame(g=>({...g,
    budget:g.budget+(delta.budget||0), guests:clamp(g.guests+(delta.guests||0),0,g.target*1.5),
    reach:clamp(g.reach+(delta.reach||0)), reputation:clamp(g.reputation+(delta.reputation||0)),
    team:clamp(g.team+(delta.team||0)), partner:clamp(g.partner+(delta.partner||0)), stress:clamp(g.stress+(delta.stress||0))
  }))

  const doTask=(task)=>{
    if(game.budget<task.cost){setToast('💸 Không đủ ngân sách');return}
    if(game.completed.includes(`${game.day}-${task.id}`)){setToast('Đã làm việc này hôm nay');return}
    setGame(g=>({...g,budget:g.budget-task.cost,completed:[...g.completed,`${g.day}-${task.id}`]}))
    apply(task.effects)
    setToast(`${task.icon} ${task.label} hoàn tất`)
  }

  const hire=(npc)=>{
    if(game.staff.includes(npc.id)) return
    if(game.budget<npc.cost){setToast('Không đủ tiền tuyển người này');return}
    setGame(g=>({...g,budget:g.budget-npc.cost,staff:[...g.staff,npc.id],team:clamp(g.team+Math.round(npc.skill/15)),stress:clamp(g.stress-2)}))
  }
  const bookVendor=(v)=>{
    if(game.vendors.includes(v.id)) return
    if(game.budget<v.price){setToast('Không đủ ngân sách');return}
    setGame(g=>({...g,budget:g.budget-v.price,vendors:[...g.vendors,v.id],partner:clamp(g.partner+Math.round(v.reliability/25)),reputation:clamp(g.reputation+Math.round(v.quality/30))}))
  }

  const nextDay=()=>{
    if(game.incident){setToast('⚠️ Xử lý sự cố trước đã');return}
    const tasksToday=game.completed.filter(x=>x.startsWith(`${game.day}-`)).length
    const staffBonus=game.staff.length*0.8
    const organic=Math.max(1,Math.round((game.reach/18)+staffBonus+(tasksToday*1.5)))
    const nextGuests=clamp(game.guests+organic,0,Math.round(game.target*1.35))
    if(game.day>=game.days){finish({...game,guests:nextGuests});return}
    const incidentChance=Math.min(.82,.35+game.day/game.days*.35)
    const incident=Math.random()<incidentChance?INCIDENTS[Math.floor(Math.random()*INCIDENTS.length)]:null
    const day=game.day+1
    const phase=day>=game.days?'showtime':day>=Math.ceil(game.days*.72)?'production':day>=Math.ceil(game.days*.38)?'promotion':'planning'
    const newMail=incident?{id:uid(),from:incident.category==='partner'?'Đối tác':'Điều phối hiện trường',subject:incident.title,body:incident.body,unread:true}:null
    setGame(g=>({...g,day,phase,guests:nextGuests,stress:clamp(g.stress+Math.max(1,4-Math.floor(g.staff.length/3))),incident,
      inbox:newMail?[newMail,...g.inbox]:g.inbox,
      history:[...g.history,{day:g.day,note:`Kết ngày ${g.day}: ${tasksToday} đầu việc, ${nextGuests} đăng ký.`}]
    }))
  }

  const resolveIncident=(choice)=>{
    apply(choice.delta)
    setGame(g=>({...g,incident:null,history:[...g.history,{day:g.day,note:`Sự cố: ${g.incident?.title} → ${choice.label}`}]}))
    setToast('Đã xử lý sự cố')
  }

  const finish=(base=game)=>{
    const attendance=Math.min(120,(base.guests/base.target)*100)
    const finance=clamp(55+(base.budget/base.initialBudget)*45)
    const people=base.team
    const ops=clamp((base.reputation+base.partner+(100-base.stress))/3)
    const score=Math.max(0,Math.round(attendance*3+finance*2+people*1.5+ops*2+base.reach*1.5))
    let ending='Một show vừa đủ để nhớ'
    if(score>=850) ending='Show bùng nổ — ai cũng hỏi mùa sau khi nào mở'
    else if(score>=700) ending='Chạy mượt — khách vui, BTC còn nguyên đội hình'
    else if(score>=520) ending='Qua được cửa — có lỗi nhưng cứu kịp'
    else if(base.budget<0) ending='Cháy ngân sách — show xong nhưng ví cũng xong'
    else ending='Show hỗn loạn — một bài học trị giá cả thanh xuân'
    const final={...base,finished:true,score,ending,incident:null}
    setGame(final);localStorage.setItem('chayshow_save',JSON.stringify(final));setScreen('result')
  }

  const submitScore=async()=>{
    if(!nickname.trim()){setToast('Nhập biệt danh trước nha');return}
    localStorage.setItem('chayshow_name',nickname.trim())
    try{
      const r=await fetch('/api/runs',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({playerId:playerId(),nickname:nickname.trim(),eventType:type.name,score:game.score,budgetLeft:game.budget,reputation:game.reputation,guests:game.guests,ending:game.ending})})
      if(!r.ok) throw new Error()
      setGame(g=>({...g,submitted:true}));setToast('🏆 Đã lên bảng xếp hạng')
    }catch{setToast('Chưa gửi được điểm — game vẫn lưu trên máy')}
  }
  const loadLeaderboard=async()=>{setScreen('leaderboard');try{const r=await fetch('/api/leaderboard');const j=await r.json();setLeaderboard(j.rows||[])}catch{setLeaderboard([])}}

  if(screen==='home') return <Home game={game} start={start} resume={resume} leaderboard={loadLeaderboard}/>
  if(screen==='leaderboard') return <Leaderboard rows={leaderboard} back={()=>setScreen('home')}/>
  if(screen==='result') return <Result game={game} type={type} nickname={nickname} setNickname={setNickname} submit={submitScore} home={()=>setScreen('home')} restart={()=>start(type)}/>
  return <Game game={game} type={type} tab={tab} setTab={setTab} doTask={doTask} hire={hire} bookVendor={bookVendor} nextDay={nextDay} resolveIncident={resolveIncident} selectedMail={selectedMail} setSelectedMail={setSelectedMail} home={()=>setScreen('home')} toast={toast}/>
}

function Home({game,start,resume,leaderboard}){
  const [choose,setChoose]=useState(false)
  return <main className="landing">
    <div className="noise"/>
    <nav className="topnav"><Brand/><div className="nav-actions"><button className="ghost" onClick={leaderboard}>🏆 BXH</button><span className="version">V1.0</span></div></nav>
    <section className="hero">
      <div className="eyebrow">EVENT MANAGEMENT SIMULATOR</div>
      <h1>CHẠY <span>SHOW</span></h1>
      <p>Bạn có ngân sách, một đội hình chưa chắc đáng tin và deadline đang chạy. Tổ chức được sự kiện trước khi mọi thứ nổ tung không?</p>
      <div className="hero-actions"><button className="primary xl" onClick={()=>setChoose(true)}>🎬 BẮT ĐẦU CHẠY SHOW</button>{game&&<button className="secondary xl" onClick={resume}>↩ Chơi tiếp ngày {game.day}</button>}</div>
      <div className="hero-stats"><div><b>100</b><span>sự cố</span></div><div><b>25</b><span>nhân sự</span></div><div><b>20</b><span>nhà cung cấp</span></div><div><b>5</b><span>loại sự kiện</span></div></div>
    </section>
    <section className="ticker"><span>⚡ DEADLINE</span><span>💸 NGÂN SÁCH</span><span>🎤 MC ĐANG KẸT XE</span><span>🌧️ TRỜI SẮP MƯA</span><span>📣 POSTER SAI NGÀY</span><span>🫠 BTC XIN NGHỈ</span></section>
    {choose&&<div className="modal-back"><div className="chooser"><button className="x" onClick={()=>setChoose(false)}>×</button><div className="eyebrow">CHỌN KÈO ĐẦU TIÊN</div><h2>Hôm nay chạy show gì?</h2><div className="event-grid">{EVENT_TYPES.map(t=><button key={t.id} className="event-card" onClick={()=>start(t)}><span className="event-icon">{t.icon}</span><b>{t.name}</b><small>{t.desc}</small><div><span>{t.days} ngày</span><span>{money(t.budget)}</span><span>{t.difficulty}</span></div></button>)}</div></div></div>}
  </main>
}

function Brand(){return <div className="brand"><div className="brandmark">CS</div><div><b>CHẠY SHOW</b><small>đừng để show chạy bạn</small></div></div>}

function Stat({icon,label,value,sub,tone}){return <div className={`stat ${tone||''}`}><span>{icon}</span><div><small>{label}</small><b>{value}</b>{sub&&<em>{sub}</em>}</div></div>}

function Game({game,type,tab,setTab,doTask,hire,bookVendor,nextDay,resolveIncident,selectedMail,setSelectedMail,home,toast}){
  const phaseNames={planning:'Lên kế hoạch',promotion:'Mở đăng ký',production:'Nước rút',showtime:'Ngày diễn ra'}
  const unread=game.inbox.filter(x=>x.unread).length
  return <div className="app-shell">
    <header className="game-header"><Brand/><div className="event-title"><span>{type.icon}</span><div><small>ĐANG CHẠY</small><b>{type.name}</b></div></div><button className="ghost" onClick={home}>⌂ Trang chủ</button></header>
    <div className="statusbar">
      <Stat icon="📅" label="NGÀY" value={`${game.day}/${game.days}`} sub={phaseNames[game.phase]}/>
      <Stat icon="💰" label="NGÂN SÁCH" value={money(game.budget)} tone={game.budget<game.initialBudget*.2?'danger':''}/>
      <Stat icon="🎟️" label="ĐĂNG KÝ" value={`${Math.round(game.guests)}/${game.target}`} sub={`${Math.round(game.guests/game.target*100)}% mục tiêu`}/>
      <Stat icon="⭐" label="UY TÍN" value={Math.round(game.reputation)}/><Stat icon="🧠" label="STRESS" value={`${Math.round(game.stress)}%`} tone={game.stress>75?'danger':''}/>
    </div>
    <div className="game-layout">
      <aside className="sidebar">
        {[['desk','🎛️','Bàn điều hành'],['team','👥','Nhân sự'],['vendors','📦','Nhà cung cấp'],['inbox','💬',`Tin nhắn ${unread?`(${unread})`:''}`],['timeline','🗓️','Nhật ký']].map(([id,ic,lb])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}><span>{ic}</span>{lb}</button>)}
        <div className="mini-bars"><Meter label="Truyền thông" value={game.reach}/><Meter label="Tinh thần BTC" value={game.team}/><Meter label="Đối tác" value={game.partner}/></div>
      </aside>
      <section className="workspace">
        {tab==='desk'&&<Desk game={game} type={type} doTask={doTask} nextDay={nextDay}/>} 
        {tab==='team'&&<Team game={game} hire={hire}/>} 
        {tab==='vendors'&&<Vendors game={game} book={bookVendor}/>} 
        {tab==='inbox'&&<Inbox game={game} selected={selectedMail} select={setSelectedMail}/>} 
        {tab==='timeline'&&<Timeline game={game}/>} 
      </section>
    </div>
    {game.incident&&<Incident incident={game.incident} resolve={resolveIncident}/>} 
    {toast&&<div className="toast">{toast}</div>}
  </div>
}

function Meter({label,value}){return <div className="meter"><div><span>{label}</span><b>{Math.round(value)}%</b></div><i><u style={{width:`${value}%`}}/></i></div>}

function Desk({game,type,doTask,nextDay}){
  const done=game.completed.filter(x=>x.startsWith(`${game.day}-`)).length
  return <div className="desk">
    <div className="desk-top"><div><div className="eyebrow">BÀN ĐIỀU HÀNH · NGÀY {game.day}</div><h2>{game.day===game.days?'SHOWTIME. Đừng hoảng.':'Hôm nay ưu tiên gì?'}</h2><p>Mỗi đầu việc tốn ngân sách nhưng giúp tăng khả năng sống sót đến ngày diễn ra.</p></div><div className="countdown"><small>CÒN</small><b>{game.days-game.day}</b><span>NGÀY</span></div></div>
    <div className="progress-wrap"><div className="progress-head"><b>Tiến độ đến ngày diễn ra</b><span>{Math.round(game.day/game.days*100)}%</span></div><div className="progress"><i style={{width:`${game.day/game.days*100}%`}}/></div></div>
    <div className="task-grid">{TASKS.map(t=>{const used=game.completed.includes(`${game.day}-${t.id}`);return <button key={t.id} disabled={used} onClick={()=>doTask(t)} className="task-card"><span>{t.icon}</span><div><b>{t.label}</b><small>{money(t.cost)}</small></div><em>{used?'XONG':'LÀM'}</em></button>})}</div>
    <div className="day-footer"><div><b>{done}</b><span>đầu việc hôm nay</span></div><div><b>{game.staff.length}</b><span>người trong BTC</span></div><div><b>{game.vendors.length}</b><span>nhà cung cấp</span></div><button className="primary" onClick={nextDay}>{game.day>=game.days?'🎬 CHẠY SỰ KIỆN':'KẾT THÚC NGÀY →'}</button></div>
  </div>
}

function Team({game,hire}){return <div><PageTitle eyebrow="BTC CỦA BẠN" title={`Đội hình ${game.staff.length}/25`} text="Mỗi người có kỹ năng, độ tin cậy và mức năng lượng khác nhau. Tuyển vừa đủ — lương cũng là tiền."/><div className="people-grid">{NPCS.map(n=><article className={`person ${game.staff.includes(n.id)?'owned':''}`} key={n.id}><div className="avatar">{n.name[0]}</div><div className="person-main"><div><b>{n.name}</b><span>{n.role}</span></div><p>“{n.quirk}”</p><div className="skillrow"><span>Kỹ năng <b>{n.skill}</b></span><span>Tin cậy <b>{n.reliability}</b></span><span>Năng lượng <b>{n.energy}</b></span></div></div><button disabled={game.staff.includes(n.id)} onClick={()=>hire(n)}>{game.staff.includes(n.id)?'ĐÃ TUYỂN':`+ ${money(n.cost)}`}</button></article>)}</div></div>}

function Vendors({game,book}){return <div><PageTitle eyebrow="MARKETPLACE" title="Nhà cung cấp" text="Giá rẻ chưa chắc đáng tin. Chất lượng cao chưa chắc kịp deadline."/><div className="vendor-grid">{VENDORS.map(v=><article className={`vendor ${game.vendors.includes(v.id)?'owned':''}`} key={v.id}><div className="vendor-icon">{['F&B'].includes(v.type)?'🍱':v.type==='Media'?'📸':v.type==='Âm thanh'?'🔊':'📦'}</div><small>{v.type}</small><h3>{v.name}</h3><b>{money(v.price)}</b><div><span>Chất lượng {v.quality}</span><span>Tin cậy {v.reliability}</span></div><button disabled={game.vendors.includes(v.id)} onClick={()=>book(v)}>{game.vendors.includes(v.id)?'ĐÃ CHỐT':'CHỌN ĐƠN VỊ'}</button></article>)}</div></div>}

function Inbox({game,selected,select}){const mail=game.inbox.find(x=>x.id===selected)||game.inbox[0];return <div className="inbox"><div className="mail-list"><PageTitle eyebrow="INBOX" title="Tin nhắn" text="Đừng bỏ lỡ tin nhắn lúc đang chạy show."/>{game.inbox.map(m=><button key={m.id} className={mail?.id===m.id?'active':''} onClick={()=>select(m.id)}><span className={m.unread?'dot':''}/><div><b>{m.from}</b><strong>{m.subject}</strong><small>{m.body.slice(0,62)}…</small></div></button>)}</div><div className="mail-reader">{mail?<><div className="mail-from"><div className="avatar">{mail.from[0]}</div><div><b>{mail.from}</b><small>Gửi tới Ban tổ chức</small></div></div><h2>{mail.subject}</h2><p>{mail.body}</p><div className="fake-reply">Phản hồi được xử lý thông qua quyết định/sự cố trong game.</div></>:<div className="empty">Không có tin nhắn</div>}</div></div>}

function Timeline({game}){return <div><PageTitle eyebrow="NHẬT KÝ SHOW" title="Mọi quyết định đều để lại dấu vết" text="Lúc thắng thì gọi là chiến lược. Lúc thua thì gọi là kinh nghiệm."/><div className="timeline">{[...game.history].reverse().map((h,i)=><div key={i}><span>NGÀY {h.day}</span><p>{h.note}</p></div>)}{!game.history.length&&<div><span>NGÀY 1</span><p>Show vừa được khởi động. Chưa có drama — tận hưởng đi.</p></div>}</div></div>}

function PageTitle({eyebrow,title,text}){return <div className="page-title"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2><p>{text}</p></div>}

function Incident({incident,resolve}){return <div className="modal-back incident-back"><div className="incident"><div className="alarm">⚠️ SỰ CỐ PHÁT SINH</div><div className="incident-icon">💥</div><h2>{incident.title}</h2><p>{incident.body}</p><div className="choices">{incident.choices.map((c,i)=><button key={i} onClick={()=>resolve(c)}><span>{String.fromCharCode(65+i)}</span><div><b>{c.label}</b><small>{effectText(c.delta)}</small></div></button>)}</div><small className="hint">Không có lựa chọn hoàn hảo. Chỉ có lựa chọn ít đau hơn.</small></div></div>}
function effectText(d){return Object.entries(d).map(([k,v])=>`${v>0?'+':''}${v} ${({budget:'ngân sách',reach:'độ phủ',reputation:'uy tín',stress:'stress',team:'tinh thần',partner:'đối tác',guests:'khách'})[k]}`).join(' · ')}

function Result({game,type,nickname,setNickname,submit,home,restart}){
  const metrics=[['🎟️','Khách',`${Math.round(game.guests)}/${game.target}`],['⭐','Uy tín',`${Math.round(game.reputation)}/100`],['📣','Độ phủ',`${Math.round(game.reach)}/100`],['🫶','BTC',`${Math.round(game.team)}/100`],['💰','Còn lại',money(game.budget)],['🧠','Stress',`${Math.round(game.stress)}%`]]
  return <main className="result-page"><div className="result-card"><div className="confetti">✦ ✧ ✦ ✧ ✦</div><div className="eyebrow">SHOW ĐÃ KẾT THÚC</div><div className="result-icon">{type.icon}</div><h1>{game.ending}</h1><p>{type.name} · {game.days} ngày chạy deadline</p><div className="score"><small>ĐIỂM VẬN HÀNH</small><b>{game.score}</b></div><div className="result-metrics">{metrics.map(([i,l,v])=><div key={l}><span>{i}</span><small>{l}</small><b>{v}</b></div>)}</div><div className="rank-submit"><input value={nickname} onChange={e=>setNickname(e.target.value)} maxLength={30} placeholder="Biệt danh trên BXH"/><button className="primary" disabled={game.submitted} onClick={submit}>{game.submitted?'✓ ĐÃ GỬI':'🏆 GỬI ĐIỂM'}</button></div><div className="result-actions"><button className="secondary" onClick={restart}>↻ Chơi lại</button><button className="ghost" onClick={home}>⌂ Trang chủ</button></div></div></main>
}

function Leaderboard({rows,back}){return <main className="leader-page"><nav className="topnav"><Brand/><button className="ghost" onClick={back}>← Trang chủ</button></nav><div className="leader-wrap"><PageTitle eyebrow="GLOBAL" title="Bảng xếp hạng" text="Top những người vẫn còn tỉnh táo sau khi chạy show."/><div className="leader-table"><div className="leader-head"><span>#</span><span>Người chơi</span><span>Sự kiện</span><span>Uy tín</span><span>Điểm</span></div>{rows.length?rows.map((r,i)=><div className="leader-row" key={i}><b>{i+1}</b><span>{r.nickname}</span><span>{r.event_type}</span><span>{r.reputation}</span><strong>{r.score}</strong></div>):<div className="empty">Chưa có điểm nào. Người đầu tiên lên bảng có thể là bạn.</div>}</div></div></main>}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
