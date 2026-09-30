const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n));
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));

const CAREERS = [
  // 50 nghề đại chúng
  ['tra-sua','🧋','Quán trà sữa','Ăn uống','serve',['Trà sữa','Trân châu','Kem cheese','Đào'],['🧋','⚫','🧀','🍑']],
  ['ca-phe','☕','Quán cà phê','Ăn uống','serve',['Espresso','Sữa','Đá','Caramel'],['☕','🥛','🧊','🍯']],
  ['xoi','🍚','Gánh xôi','Ăn uống','timing',['Xôi nóng','Đậu xanh','Chả','Hành phi'],['🍚','🫘','🥓','🧅']],
  ['banh-mi','🥖','Tiệm bánh mì','Ăn uống','serve',['Bánh mì','Pate','Thịt','Rau'],['🥖','🥫','🥩','🥬']],
  ['pho','🍜','Quán phở','Ăn uống','timing',['Nước dùng','Bánh phở','Thịt','Rau'],['🥣','🍜','🥩','🌿']],
  ['banh-ngot','🧁','Tiệm bánh ngọt','Ăn uống','memory',['Bột','Kem','Dâu','Chocolate'],['🌾','🍦','🍓','🍫']],
  ['nha-hang','🍽️','Nhà hàng','Ăn uống','serve',['Khai vị','Món chính','Nước','Tráng miệng'],['🥗','🍲','🥤','🍰']],
  ['tien-loi','🏪','Cửa hàng tiện lợi','Bán lẻ','sort',['Đồ uống','Đồ ăn','Gia dụng','Khác'],['🥤','🍱','🧻','📦']],
  ['sieu-thi','🛒','Siêu thị','Bán lẻ','sort',['Thực phẩm','Đồ lạnh','Gia dụng','Điện tử'],['🥦','🧊','🧹','🎧']],
  ['thoi-trang','👗','Shop thời trang','Bán lẻ','choice',['Street','Minimal','Formal','Y2K'],['🧢','🤍','👔','✨']],
  ['giay','👟','Tiệm giày','Bán lẻ','memory',['Sneaker','Boot','Sandal','Running'],['👟','🥾','🩴','🏃']],
  ['my-pham','💄','Shop mỹ phẩm','Bán lẻ','choice',['Dưỡng da','Son','Nền','Nước hoa'],['🧴','💄','🪞','🌸']],
  ['spa','🧖','Spa','Làm đẹp','timing',['Làm sạch','Massage','Mask','Dưỡng'],['🫧','💆','🎭','✨']],
  ['salon','💇','Salon tóc','Làm đẹp','timing',['Cắt','Uốn','Nhuộm','Sấy'],['✂️','🌀','🎨','💨']],
  ['nail','💅','Nail Studio','Làm đẹp','pattern',['Sơn nền','Vẽ nét','Đính đá','Top coat'],['🎨','🖌️','💎','✨']],
  ['makeup','🪞','Makeup Artist','Làm đẹp','choice',['Clean girl','Glam','Korean','Editorial'],['🌿','✨','🌸','🎭']],
  ['photographer','📷','Photographer','Sáng tạo','timing',['Góc máy','Ánh sáng','Khoảnh khắc','Focus'],['📐','💡','⚡','🎯']],
  ['studio','🎞️','Studio ảnh','Sáng tạo','pattern',['Backdrop','Light','Pose','Retouch'],['🖼️','💡','🕺','🪄']],
  ['creator','🎬','Content Creator','Sáng tạo','rhythm',['Hook','Quay','Cut','Caption'],['🪝','🎥','✂️','💬']],
  ['livestream','📱','Livestream Seller','Sáng tạo','rhythm',['Chào khách','Demo','Chốt đơn','Deal'],['👋','📦','🛍️','🔥']],
  ['streamer','🎮','Streamer','Sáng tạo','rhythm',['Gameplay','Chat','Highlight','Raid'],['🕹️','💬','⭐','🚀']],
  ['shipper','🛵','Shipper','Vận chuyển','route',['Nhận đơn','Chọn tuyến','Giao hàng','Xác nhận'],['📦','🗺️','🛵','✅']],
  ['logistics','🚚','Logistics','Vận chuyển','route',['Kho','Phân tuyến','Xe tải','Điểm giao'],['🏭','🗺️','🚚','📍']],
  ['warehouse','📦','Kho hàng','Vận chuyển','sort',['Dễ vỡ','Đông lạnh','Nhanh','Thường'],['🥚','❄️','⚡','📦']],
  ['driver','🚕','Tài xế công nghệ','Vận chuyển','route',['Đón khách','Tuyến ngắn','Tuyến nhanh','Trả khách'],['🙋','↗️','⚡','🏁']],
  ['garage','🔧','Gara sửa xe','Kỹ thuật','memory',['Máy','Lốp','Phanh','Điện'],['⚙️','🛞','🛑','🔋']],
  ['carwash','🚿','Rửa xe','Kỹ thuật','rhythm',['Xịt','Bọt','Chà','Sấy'],['💦','🫧','🧽','💨']],
  ['factory','🏭','Xưởng sản xuất','Kỹ thuật','sequence',['Nguyên liệu','Gia công','QC','Đóng gói'],['🧱','⚙️','🔍','📦']],
  ['farm','🌾','Nông trại','Nông nghiệp','timing',['Gieo','Tưới','Thu hoạch','Bán'],['🌱','💧','🌾','🪙']],
  ['petshop','🐶','Pet Shop','Thú cưng','choice',['Thức ăn','Đồ chơi','Tắm','Phụ kiện'],['🦴','🎾','🫧','🎀']],
  ['vet','🐾','Phòng khám thú y','Thú cưng','memory',['Khám','Xét nghiệm','Điều trị','Theo dõi'],['🩺','🔬','💊','📋']],
  ['pharmacy','💊','Nhà thuốc mô phỏng','Dịch vụ','sort',['Chăm sóc','Sơ cứu','Vật tư','Tư vấn'],['🧴','🩹','📦','💬']],
  ['teacher','🧑‍🏫','Giáo viên','Giáo dục','quiz',['Toán','Văn','Anh','Khoa học'],['➗','📖','🔤','🔬']],
  ['language','🗣️','Trung tâm ngoại ngữ','Giáo dục','memory',['Từ vựng','Nghe','Nói','Phản xạ'],['🔤','🎧','🗣️','⚡']],
  ['tutor','📚','Gia sư','Giáo dục','quiz',['Giải thích','Ví dụ','Bài tập','Chữa bài'],['💡','🧩','📝','✅']],
  ['developer','💻','Lập trình viên','Công nghệ','sequence',['Code','Test','Fix','Deploy'],['⌨️','🧪','🔧','🚀']],
  ['gamedev','👾','Game Developer','Công nghệ','pattern',['Gameplay','Art','Sound','Polish'],['🕹️','🎨','🎵','✨']],
  ['designer','🎨','Designer','Sáng tạo','pattern',['Layout','Type','Color','Export'],['📐','🔠','🎨','📤']],
  ['office','🏢','Văn phòng','Kinh doanh','sequence',['Inbox','Họp','Task','Deadline'],['📨','👥','✅','⏰']],
  ['hr','🧑‍💼','Tuyển dụng / HR','Kinh doanh','choice',['CV','Phỏng vấn','Offer','Onboard'],['📄','🎙️','✉️','🤝']],
  ['realestate','🏠','Bất động sản','Kinh doanh','choice',['Căn hộ','Nhà phố','Studio','Mặt bằng'],['🏙️','🏡','🛋️','🏬']],
  ['hotel','🏨','Khách sạn','Du lịch','serve',['Check-in','Phòng','Dịch vụ','Check-out'],['🪪','🛏️','🛎️','🧾']],
  ['homestay','🛖','Homestay','Du lịch','choice',['Decor','Đón khách','Trải nghiệm','Review'],['🪴','👋','🗺️','⭐']],
  ['travel','🧳','Công ty du lịch','Du lịch','route',['Điểm đến','Lịch trình','Di chuyển','Trải nghiệm'],['📍','🗓️','🚌','📸']],
  ['airport','✈️','Sân bay','Vận hành','sort',['Check-in','Hành lý','Gate','Boarding'],['🎫','🧳','🚪','✈️']],
  ['event','🎪','Tổ chức sự kiện','Giải trí','sequence',['Concept','Setup','Check-in','Showtime'],['💡','🛠️','🎟️','🎉']],
  ['wedding','💍','Wedding Planner','Giải trí','pattern',['Concept','Hoa','Bàn tiệc','Nghi lễ'],['💡','💐','🍽️','💍']],
  ['cinema','🎬','Rạp phim','Giải trí','serve',['Vé','Bắp','Nước','Phòng chiếu'],['🎟️','🍿','🥤','🎞️']],
  ['themepark','🎡','Công viên giải trí','Giải trí','timing',['Vé','Trò chơi','An toàn','Quà'],['🎟️','🎢','🛡️','🎁']],
  ['idol','🎤','Quản lý nghệ sĩ','Giải trí','rhythm',['Lịch','Tập luyện','Sân khấu','Fan'],['🗓️','💃','🎤','💗']],
  // 10 lĩnh vực cộng đồng
  ['volunteer','🤝','Điều phối Tình nguyện viên','Cộng đồng','route',['Tập hợp','Chia đội','Phân ca','Báo cáo'],['📣','👥','🗓️','📋']],
  ['freeclass','🏫','Lớp học 0đ','Cộng đồng','quiz',['Điểm danh','Bài học','Thực hành','Hỗ trợ'],['✅','📖','✍️','💬']],
  ['exam-support','🧃','Tiếp sức Mùa thi','Cộng đồng','serve',['Nước','Chỉ đường','Bút','Hỗ trợ'],['🧃','🗺️','🖊️','🤝']],
  ['green','🌱','Chiến dịch Môi trường','Cộng đồng','sort',['Tái chế','Hữu cơ','Rác khác','Trồng cây'],['♻️','🍂','🗑️','🌱']],
  ['relief','📦','Cứu trợ Khẩn cấp','Cộng đồng','route',['Nhu yếu phẩm','Đóng gói','Tuyến đi','Phân phối'],['🥫','📦','🗺️','🤲']],
  ['community-kitchen','🍲','Bếp Cộng đồng','Cộng đồng','serve',['Cơm','Món mặn','Rau','Đóng suất'],['🍚','🍗','🥬','🍱']],
  ['fundraising','💚','Gây quỹ Cộng đồng','Cộng đồng','rhythm',['Ý tưởng','Truyền thông','Gây quỹ','Công khai'],['💡','📣','💚','📊']],
  ['project','🧩','Dự án Cộng đồng','Cộng đồng','sequence',['Khảo sát','Kế hoạch','Triển khai','Đánh giá'],['🔎','📝','🚀','📈']],
  ['volunteer-day','🎉','Ngày hội Tình nguyện','Cộng đồng','pattern',['Booth','Sân khấu','Trải nghiệm','Điều phối'],['⛺','🎤','🎯','👥']],
  ['volunteer-center','🏛️','Trung tâm Tình nguyện','Cộng đồng','sequence',['Nhân sự','Dự án','Kho','Đối tác'],['👥','🧩','📦','🤝']]
].map((x,i)=>({id:x[0],icon:x[1],name:x[2],category:x[3],mechanic:x[4],steps:x[5],stepIcons:x[6],index:i,community:i>=50}));

const NAMES_A=['An','Anh','Bảo','Chi','Duy','Giang','Hà','Hân','Huy','Khánh','Khoa','Lam','Linh','Minh','My','Nam','Ngân','Nhi','Phúc','Quân','Quỳnh','Sơn','Thảo','Trang','Trâm','Tú','Uyên','Vi','Vy'];
const NAMES_B=['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Võ','Phan','Vũ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương'];
const MOODS=['vui vẻ','vội vàng','tò mò','khó tính','thân thiện','trầm tính','năng động','hay quên'];
const NPC_JOBS=CAREERS.map(c=>c.name);
const COLORS=['#ff7a9e','#ffd36a','#65e4ff','#8c86ff','#8dff91','#ff9e65','#5ad7b5','#d88cff'];

function hashString(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rnd(seed){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}
function npcFromId(id){const s=hashString(String(id));const r=(n)=>rnd(s+n*7919);return {id:String(id),name:`${NAMES_B[Math.floor(r(1)*NAMES_B.length)]} ${NAMES_A[Math.floor(r(2)*NAMES_A.length)]}`,mood:MOODS[Math.floor(r(3)*MOODS.length)],job:NPC_JOBS[Math.floor(r(4)*NPC_JOBS.length)],budget:30000+Math.floor(r(5)*1970000),patience:35+Math.floor(r(6)*65),skin:['#ffd0b5','#e8b18f','#b97855','#8f5c43'][Math.floor(r(7)*4)],shirt:COLORS[Math.floor(r(8)*COLORS.length)],hair:['#241b18','#5a3825','#10141c','#7a4c2b'][Math.floor(r(9)*4)],face:['🙂','😄','😎','🤓','😊','🫡'][Math.floor(r(10)*6)]}}

const defaultSave={money:150000,level:1,xp:0,reputation:0,day:1,minutes:450,careersPlayed:0,played:{},achievements:{},nextNpcId:String(Date.now()*1000),playerName:'Người chơi',giftAt:Date.now()+45000};
let save={...defaultSave,...JSON.parse(localStorage.getItem('vannghe.save')||'{}')};
let soundOn=true, activeCareer=null, run=null, panelType=null;
const playerId=localStorage.getItem('vannghe.player')||crypto.randomUUID();localStorage.setItem('vannghe.player',playerId);

function persist(){localStorage.setItem('vannghe.save',JSON.stringify(save));updateHUD();}
function addXP(v){save.xp+=v;while(save.xp>=save.level*120){save.xp-=save.level*120;save.level++;toast(`LEVEL UP! Bạn đã lên cấp ${save.level} 🎉`,'good');burstSound(720)}persist()}
function updateHUD(){
  $('#moneyText').textContent=fmt(save.money)+'đ';$('#levelText').textContent=save.level;$('#repText').textContent=save.reputation;
  $('#xpBar').style.width=`${clamp(save.xp/(save.level*120)*100,0,100)}%`;
  $('#dayText').textContent=`NGÀY ${save.day}`;const h=Math.floor(save.minutes/60)%24,m=save.minutes%60;$('#timeText').textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  $('#weatherIcon').textContent=h<6||h>18?'🌙':h>15?'🌤️':'☀️';
  $('#questProgress').textContent=`${Math.min(save.careersPlayed,1)}/1`;
}
function toast(msg,type=''){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=msg;$('#toastLayer').append(el);setTimeout(()=>el.remove(),2600)}
function burstSound(freq=520){if(!soundOn)return;try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=freq;o.type='sine';g.gain.setValueAtTime(.05,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.12);o.start();o.stop(a.currentTime+.13)}catch{}}

// ===== CITY WORLD =====
const canvas=$('#world'),ctx=canvas.getContext('2d');let dpr=1,W=0,H=0;
const world={w:2400,h:1700,camX:1200,camY:850,zoom:.72,drag:false,lastX:0,lastY:0,startX:0,startY:0,npcs:[],spawnCounter:0};
const districts=['Phố Khởi Nghiệp','Khu Sáng Tạo','Phố Dịch Vụ','Khu Công Nghệ','Khu Giải Trí','Khu Cộng Đồng'];
const districtColors=['#45d7ff','#9a82ff','#ffb45c','#59f0c4','#ff73bd','#83f77f'];
const buildings=CAREERS.map((c,i)=>{const col=i%10,row=Math.floor(i/10);return {...c,x:180+col*220,y:170+row*245,w:150,h:120,district:row}});
function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);world.zoom=clamp(world.zoom,.48,1.25);ensureNPCs()}
addEventListener('resize',resize);
function worldToScreen(x,y){return {x:(x-world.camX)*world.zoom+W/2,y:(y-world.camY)*world.zoom+H/2}}
function screenToWorld(x,y){return {x:(x-W/2)/world.zoom+world.camX,y:(y-H/2)/world.zoom+world.camY}}
function roundRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
function drawCity(){
  ctx.clearRect(0,0,W,H);const hour=(save.minutes/60)%24;const night=hour<6||hour>18;
  const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,night?'#071321':'#12384a');grad.addColorStop(1,night?'#071018':'#0a202b');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  ctx.save();ctx.translate(W/2-world.camX*world.zoom,H/2-world.camY*world.zoom);ctx.scale(world.zoom,world.zoom);
  // ground
  ctx.fillStyle=night?'#0b1b24':'#173943';ctx.fillRect(0,0,world.w,world.h);
  // parks / district glows
  for(let r=0;r<6;r++){ctx.fillStyle=hexAlpha(districtColors[r],night?.045:.075);ctx.fillRect(20,45+r*245,world.w-40,205)}
  // roads
  ctx.fillStyle=night?'#101c25':'#253b42';for(let x=75;x<world.w;x+=220)ctx.fillRect(x,0,72,world.h);for(let y=80;y<world.h;y+=245)ctx.fillRect(0,y,world.w,72);
  ctx.strokeStyle=night?'#29343b':'#65767a';ctx.lineWidth=2;ctx.setLineDash([18,18]);for(let x=111;x<world.w;x+=220){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,world.h);ctx.stroke()}for(let y=116;y<world.h;y+=245){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(world.w,y);ctx.stroke()}ctx.setLineDash([]);
  // trees
  for(let i=0;i<85;i++){const x=(i*271)%world.w,y=(i*163+70)%world.h;if((x%220)<80||(y%245)<80)continue;ctx.fillStyle=night?'#174834':'#2c7650';ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#5a4938';ctx.fillRect(x-2,y+7,4,8)}
  // buildings
  for(const b of buildings) drawBuilding(b,night);
  // NPCs
  for(const n of world.npcs) drawNPC(n);
  ctx.restore();
}
function hexAlpha(hex,a){const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`}
function drawBuilding(b,night){const p={x:b.x,y:b.y},c=districtColors[b.district]||'#5be1ff';ctx.save();ctx.translate(p.x,p.y);
  ctx.fillStyle='rgba(0,0,0,.24)';roundRect(ctx,10,14,b.w,b.h,18);ctx.fill();
  const g=ctx.createLinearGradient(0,0,b.w,b.h);g.addColorStop(0,night?hexAlpha(c,.42):hexAlpha(c,.72));g.addColorStop(1,night?'#10202b':'#e8f5f4');ctx.fillStyle=g;roundRect(ctx,0,0,b.w,b.h,18);ctx.fill();
  ctx.fillStyle=night?'rgba(255,242,160,.35)':'rgba(255,255,255,.46)';for(let wx=18;wx<b.w-18;wx+=34)for(let wy=48;wy<b.h-18;wy+=28){roundRect(ctx,wx,wy,15,12,3);ctx.fill()}
  ctx.fillStyle='rgba(3,13,20,.72)';roundRect(ctx,10,9,b.w-20,32,10);ctx.fill();ctx.font='22px sans-serif';ctx.fillText(b.icon,18,33);ctx.fillStyle='#f4fbff';ctx.font='700 11px "Be Vietnam Pro",sans-serif';let name=b.name.length>19?b.name.slice(0,18)+'…':b.name;ctx.fillText(name,48,29);
  if(b.community){ctx.fillStyle='#78ff9a';ctx.beginPath();ctx.arc(b.w-13,14,5,0,Math.PI*2);ctx.fill()}
  ctx.restore()}
function drawNPC(n){const p=worldToScreen(0,0);void p;ctx.save();ctx.translate(n.x,n.y);ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(0,13,10,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=n.data.shirt;roundRect(ctx,-8,0,16,18,6);ctx.fill();ctx.fillStyle=n.data.skin;ctx.beginPath();ctx.arc(0,-6,8,0,Math.PI*2);ctx.fill();ctx.fillStyle=n.data.hair;ctx.beginPath();ctx.arc(0,-9,8,Math.PI,Math.PI*2);ctx.fill();ctx.restore()}
function ensureNPCs(){const target=W<700?55:Math.min(180,90+Math.floor(W/20));while(world.npcs.length<target)spawnNPC();while(world.npcs.length>target)world.npcs.pop()}
function spawnNPC(){let id;try{id=(BigInt(save.nextNpcId||'1')+1n).toString()}catch{id=String(Date.now()+world.spawnCounter)}save.nextNpcId=id;const data=npcFromId(id);const roadVertical=Math.random()>.5;const x=roadVertical?111+220*Math.floor(Math.random()*11):Math.random()*world.w;const y=roadVertical?Math.random()*world.h:116+245*Math.floor(Math.random()*7);world.npcs.push({id,data,x,y,tx:x+(Math.random()-.5)*500,ty:y+(Math.random()-.5)*500,speed:22+Math.random()*35})}
function updateNPCs(dt){for(let i=world.npcs.length-1;i>=0;i--){const n=world.npcs[i],dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);if(d<8||n.x<0||n.y<0||n.x>world.w||n.y>world.h){world.npcs.splice(i,1);spawnNPC();continue}n.x+=dx/d*n.speed*dt;n.y+=dy/d*n.speed*dt}}
let last=performance.now();function loop(t){const dt=Math.min(.05,(t-last)/1000);last=t;updateNPCs(dt);drawCity();const di=clamp(Math.floor((world.camY-45)/245),0,5);const dl=$('#districtLabel b');if(dl)dl.textContent=districts[di];requestAnimationFrame(loop)}
function pointerDown(e){world.drag=true;world.lastX=e.clientX;world.lastY=e.clientY;world.startX=e.clientX;world.startY=e.clientY;canvas.setPointerCapture?.(e.pointerId)}
function pointerMove(e){if(!world.drag)return;const dx=e.clientX-world.lastX,dy=e.clientY-world.lastY;world.camX-=dx/world.zoom;world.camY-=dy/world.zoom;world.camX=clamp(world.camX,0,world.w);world.camY=clamp(world.camY,0,world.h);world.lastX=e.clientX;world.lastY=e.clientY}
function pointerUp(e){if(!world.drag)return;const moved=Math.hypot(e.clientX-world.startX,e.clientY-world.startY);world.drag=false;if(moved<8){const p=screenToWorld(e.clientX,e.clientY);const b=buildings.find(b=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h);if(b)openCareer(b)}}
canvas.addEventListener('pointerdown',pointerDown);canvas.addEventListener('pointermove',pointerMove);canvas.addEventListener('pointerup',pointerUp);canvas.addEventListener('wheel',e=>{e.preventDefault();world.zoom=clamp(world.zoom*(e.deltaY>0?.9:1.1),.45,1.35)},{passive:false});

// ===== PANELS =====
function showPanel(type){panelType=type;const p=$('#panel');p.classList.remove('hidden');$$('.dock button').forEach(b=>b.classList.toggle('active',b.dataset.panel===type));
  if(type==='jobs')p.innerHTML=`<div class="panel-head"><h2>60 nghề để thử</h2><button class="close">✕</button></div><div class="section-label">50 NGHỀ ĐẠI CHÚNG</div><div class="job-grid">${CAREERS.slice(0,50).map(jobCard).join('')}</div><div class="section-label">10 LĨNH VỰC CỘNG ĐỒNG</div><div class="job-grid">${CAREERS.slice(50).map(jobCard).join('')}</div>`;
  if(type==='collection')p.innerHTML=collectionHTML();
  if(type==='phone')p.innerHTML=phoneHTML();
  if(type==='profile')p.innerHTML=profileHTML();
  p.querySelector('.close')?.addEventListener('click',closePanel);p.querySelectorAll('[data-career]').forEach(x=>x.addEventListener('click',()=>openCareer(CAREERS.find(c=>c.id===x.dataset.career))));
}
function jobCard(c){const played=save.played[c.id]?.runs||0;return `<button class="job-card ${c.community?'community':''}" data-career="${c.id}"><span class="emoji">${c.icon}</span><b>${c.name}</b><small>${c.category} · ${played?`${played} ca đã chơi`:'Chưa thử'}</small></button>`}
function closePanel(){$('#panel').classList.add('hidden');panelType=null;$$('.dock button').forEach(b=>b.classList.toggle('active',b.dataset.panel==='map'))}
function profileHTML(){return `<div class="panel-head"><h2>Hồ sơ thành phố</h2><button class="close">✕</button></div><div class="profile-card"><span style="font-size:42px">🙂</span><h3>${save.playerName}</h3><small>Công dân Vạn Nghề · Level ${save.level}</small><div class="stats-row"><div class="mini-stat"><small>TÀI SẢN</small><b>${fmt(save.money)}đ</b></div><div class="mini-stat"><small>NGHỀ ĐÃ THỬ</small><b>${Object.keys(save.played).length}/60</b></div><div class="mini-stat"><small>UY TÍN</small><b>${save.reputation}</b></div></div></div><div class="section-label">THẾ GIỚI CỦA BẠN</div><p style="font-size:11px;color:#9bb0be;line-height:1.7">NPC được sinh theo ID/seed và có thể tiếp tục xuất hiện không giới hạn. Thành phố chỉ render một lượng phù hợp với thiết bị để giữ FPS.</p>`}
function collectionHTML(){const a=[['🏁','Ca làm đầu tiên',save.careersPlayed>=1],['🧭','Nhà thám hiểm nghề nghiệp',Object.keys(save.played).length>=10],['🌆','Biết cả thành phố',Object.keys(save.played).length>=30],['👑','Vạn Nghề',Object.keys(save.played).length>=60],['💸','Triệu phú',save.money>=1000000],['💚','Công dân tử tế',Object.keys(save.played).some(id=>CAREERS.find(c=>c.id===id)?.community)]];return `<div class="panel-head"><h2>Bộ sưu tập</h2><button class="close">✕</button></div>${a.map(x=>`<div class="achievement ${x[2]?'':'locked'}"><span>${x[0]}</span><div><b>${x[1]}</b><small>${x[2]?'Đã mở khóa':'Chưa mở khóa'}</small></div></div>`).join('')}`}
function phoneHTML(){return `<div class="panel-head"><h2>Điện thoại</h2><button class="close">✕</button></div><div class="phone-msg"><b>📍 Thành phố</b><p>Hôm nay có ${world.npcs.length} NPC đang được render quanh bạn. Dân số procedural không có trần cố định.</p></div><div class="phone-msg"><b>🔥 Trending</b><p>${CAREERS[(save.day*7)%CAREERS.length].name} đang đông khách. Thưởng ca làm +20%.</p></div><div class="phone-msg"><b>💬 Người lạ</b><p>“Tui vừa thấy một chỗ mới mở ở phía Đông thành phố á 👀”</p></div><div class="phone-msg"><b>🎁 Quà ngày</b><p>Đi dạo thành phố và nhận quà đường phố khi đồng hồ về 0.</p></div>`}
$$('.dock button').forEach(b=>b.addEventListener('click',()=>b.dataset.panel==='map'?closePanel():showPanel(b.dataset.panel)));$('#profileBtn').addEventListener('click',()=>showPanel('profile'));

// ===== CAREER MINI-GAMES =====
function openCareer(c){activeCareer=c;closePanel();$('#game').classList.add('hidden');$('#careerGame').classList.remove('hidden');$('#careerIcon').textContent=c.icon;$('#careerName').textContent=c.name;$('#careerCategory').textContent=c.community?'HOẠT ĐỘNG CỘNG ĐỒNG':c.category.toUpperCase();$('#careerGoal').textContent=goalFor(c);$('#careerEarn').textContent='0';$('#careerCombo').textContent='x1';$('#careerTime').textContent='60';$('#runProgress').style.width='0%';$('#careerAction').textContent='BẮT ĐẦU CA LÀM';$('#careerAction').disabled=false;renderCareerIntro(c)}
function goalFor(c){return ({serve:'Phục vụ đúng yêu cầu trước khi khách hết kiên nhẫn',timing:'Canh đúng thời điểm để đạt Perfect',sort:'Phân loại thật nhanh và chính xác',memory:'Ghi nhớ chuỗi và làm lại không sai',choice:'Đọc khách và chọn phương án phù hợp',pattern:'Hoàn thiện sản phẩm theo mẫu',rhythm:'Giữ nhịp công việc để tăng combo',route:'Chọn tuyến tối ưu trước khi hết giờ',sequence:'Hoàn thành quy trình đúng thứ tự',quiz:'Trả lời nhanh để giữ chuỗi điểm'})[c.mechanic]||'Hoàn thành càng nhiều nhiệm vụ càng tốt'}
function renderCareerIntro(c){const npc=npcFromId(save.nextNpcId);$('#careerStage').innerHTML=`<div class="mini-scene"><div class="customer-row"><div class="customer"><div class="face" style="background:${npc.data?.skin||npc.skin}">${npc.face}</div><small>${npc.name}</small></div></div><h2>${c.icon} ${c.name}</h2><p>Mỗi ca là một minigame riêng. Làm nhanh, giữ combo, kiếm tiền và mở thành phố.</p><div class="workbench"><div style="text-align:center"><div style="font-size:46px">${c.stepIcons.join(' ')}</div><p style="font-size:11px;color:#9fb5c4">${c.steps.join(' → ')}</p></div></div></div>`}
function startRun(){if(run?.timer)return;run={score:0,earn:0,combo:1,seconds:60,started:Date.now(),round:0,timer:null,sub:null};$('#careerAction').textContent='ĐANG LÀM...';$('#careerAction').disabled=true;nextRound();run.timer=setInterval(()=>{run.seconds--;save.minutes+=2;if(save.minutes>=1440){save.minutes-=1440;save.day++}$('#careerTime').textContent=run.seconds;$('#runProgress').style.width=`${(60-run.seconds)/60*100}%`;updateHUD();if(run.seconds<=0)finishRun()},1000)}
function nextRound(){if(!run||run.seconds<=0)return;run.round++;clearTimeout(run.sub);const m=activeCareer.mechanic;if(m==='serve')renderServe();else if(m==='timing')renderTiming();else if(m==='sort')renderSort();else if(m==='memory')renderMemory();else if(m==='choice')renderChoice();else if(m==='pattern')renderPattern();else if(m==='rhythm')renderRhythm();else if(m==='route')renderRoute();else if(m==='sequence')renderSequence();else renderQuiz()}
function customerHTML(){const n=npcFromId(save.nextNpcId=(BigInt(save.nextNpcId)+1n).toString());return `<div class="customer waiting"><div class="face" style="background:${n.skin}">${n.face}</div><small>${n.name}</small></div>`}
function sceneShell(title,sub,inside){$('#careerStage').innerHTML=`<div class="mini-scene"><div class="customer-row">${customerHTML()}${Math.random()>.55?customerHTML():''}</div><h2>${title}</h2><p>${sub}</p><div class="workbench">${inside}</div></div>`}
function reward(ok,base=7000){if(!run)return;if(ok){const gain=Math.round(base*run.combo*(activeCareer.community?.85:1));run.earn+=gain;run.score+=10*run.combo;run.combo=Math.min(8,run.combo+.25);$('#careerEarn').textContent=fmt(run.earn);$('#careerCombo').textContent='x'+run.combo.toFixed(run.combo%1?1:0);burstSound(650+run.combo*25);floatMoney(gain)}else{run.combo=1;$('#careerCombo').textContent='x1';burstSound(160)}setTimeout(nextRound,ok?420:650)}
function floatMoney(gain){const e=document.createElement('div');e.className='float-money';e.textContent=`+${fmt(gain)}đ`;e.style.left=(45+Math.random()*10)+'%';e.style.top='55%';$('#careerStage').append(e);setTimeout(()=>e.remove(),950)}
function renderServe(){const c=activeCareer,target=Math.floor(Math.random()*c.steps.length);sceneShell('Khách gọi món!','Chọn đúng thứ khách đang cần.',`<div class="order">Yêu cầu: <b>${c.stepIcons[target]} ${c.steps[target]}</b></div><div class="action-grid">${c.steps.map((s,i)=>`<button class="game-action" data-i="${i}"><span>${c.stepIcons[i]}</span>${s}</button>`).join('')}</div>`);$$('.game-action').forEach(b=>b.onclick=()=>{const ok=+b.dataset.i===target;b.classList.add(ok?'correct':'wrong');reward(ok,6500)})}
function renderTiming(){sceneShell('Canh PERFECT!','Chạm đúng lúc vạch trắng đi qua vùng xanh.',`<div class="timing-track"><div class="timing-zone"></div><div class="timing-marker"></div></div><button class="big-tap">⚡</button>`);const marker=$('.timing-marker');let x=0,dir=1,raf;const go=()=>{x+=dir*1.7;if(x>98||x<0)dir*=-1;marker.style.left=x+'%';raf=requestAnimationFrame(go)};go();$('.big-tap').onclick=()=>{cancelAnimationFrame(raf);reward(x>=42&&x<=58,8000)}}
function renderSort(){const cats=activeCareer.steps.slice(0,3),items=Array.from({length:5},(_,i)=>({cat:i%3,icon:activeCareer.stepIcons[i%activeCareer.stepIcons.length]})).sort(()=>Math.random()-.5);let selected=null,done=0;sceneShell('Phân loại tốc độ','Chọn món rồi chọn đúng khu.',`<div class="sort-items">${items.map((it,i)=>`<button class="sort-item" data-item="${i}" data-cat="${it.cat}">${it.icon}</button>`).join('')}</div><div class="bins">${cats.map((x,i)=>`<button class="bin" data-bin="${i}">${x}</button>`).join('')}</div>`);$$('.sort-item').forEach(b=>b.onclick=()=>{selected=b;b.style.outline='2px solid #58e5ff'});$$('.bin').forEach(b=>b.onclick=()=>{if(!selected)return;const ok=selected.dataset.cat===b.dataset.bin;if(ok){selected.remove();done++;selected=null;if(done===items.length)reward(true,9500)}else{selected.style.outline='2px solid #ff667d';run.combo=1;$('#careerCombo').textContent='x1'}})}
function renderMemory(){const len=3+Math.min(3,Math.floor(run.round/4)),seq=Array.from({length:len},()=>Math.floor(Math.random()*4));let input=[];sceneShell('Nhớ thật nhanh','Nhìn chuỗi sáng lên rồi lặp lại.',`<div class="sequence">${activeCareer.stepIcons.slice(0,4).map((x,i)=>`<button class="seq-dot" data-i="${i}">${x}</button>`).join('')}</div><div class="order">Chuỗi dài: <b>${len}</b></div>`);$$('.seq-dot').forEach(b=>b.disabled=true);let k=0;const flash=()=>{if(k>=seq.length){$$('.seq-dot').forEach(b=>b.disabled=false);return}const b=$(`.seq-dot[data-i="${seq[k]}"]`);b.classList.add('flash');setTimeout(()=>b.classList.remove('flash'),300);k++;setTimeout(flash,520)};setTimeout(flash,500);$$('.seq-dot').forEach(b=>b.onclick=()=>{input.push(+b.dataset.i);const pos=input.length-1;if(input[pos]!==seq[pos])return reward(false);if(input.length===seq.length)reward(true,9000)})}
function renderChoice(){const c=activeCareer,n=npcFromId(save.nextNpcId),correct=Math.floor(Math.random()*4);sceneShell(`${n.face} ${n.mood}`,'Đọc tình huống và chọn phương án hợp nhất.',`<div class="order">Khách có ngân sách <b>${fmt(n.budget)}đ</b>, tính cách <b>${n.mood}</b>.</div><div class="choice-stack">${c.steps.map((x,i)=>`<button data-i="${i}"><b>${c.stepIcons[i]} ${x}</b><br><small>${i===correct?'Phù hợp tình huống':'Một lựa chọn khác'}</small></button>`).join('')}</div>`);$$('.choice-stack button').forEach(b=>b.onclick=()=>reward(+b.dataset.i===correct,8500))}
function renderPattern(){const target=[0,1,2].sort(()=>Math.random()-.5),picked=[];sceneShell('Làm theo mẫu','Chạm đúng thứ tự để hoàn thiện sản phẩm.',`<div class="order">Mẫu: <b>${target.map(i=>activeCareer.stepIcons[i]).join(' → ')}</b></div><div class="action-grid">${activeCareer.steps.slice(0,3).map((x,i)=>`<button class="game-action" data-i="${i}"><span>${activeCareer.stepIcons[i]}</span>${x}</button>`).join('')}</div>`);$$('.game-action').forEach(b=>b.onclick=()=>{picked.push(+b.dataset.i);const pos=picked.length-1;if(picked[pos]!==target[pos])return reward(false);b.disabled=true;b.style.opacity=.4;if(picked.length===target.length)reward(true,10000)})}
function renderRhythm(){let hits=0,beat=0;sceneShell('Giữ nhịp!','Chạm khi vòng sáng co vào tâm.',`<div style="position:relative;width:150px;height:150px;display:grid;place-items:center"><div id="pulse" style="position:absolute;inset:0;border:4px solid #5deaff;border-radius:50%"></div><button class="big-tap" style="margin:0;width:80px;height:80px">🎵</button></div><div class="order">Perfect liên tiếp: <b id="hits">0</b>/4</div>`);const pulse=$('#pulse');let scale=1.8,dir=-1,raf;const anim=()=>{scale+=dir*.018;if(scale<.85){scale=1.8;beat++}pulse.style.transform=`scale(${scale})`;pulse.style.opacity=String(2-scale);raf=requestAnimationFrame(anim)};anim();$('.big-tap').onclick=()=>{const ok=scale>.92&&scale<1.12;if(ok){hits++;$('#hits').textContent=hits;scale=1.8;if(hits>=4){cancelAnimationFrame(raf);reward(true,10500)}}else{hits=0;$('#hits').textContent=0;run.combo=1}}}
function renderRoute(){const options=[{n:'Đường tắt',t:2},{n:'Đại lộ',t:3},{n:'Đường vòng',t:5},{n:'Hẻm nhỏ',t:4}].sort(()=>Math.random()-.5),best=Math.min(...options.map(x=>x.t));sceneShell('Chọn tuyến ngay!','Tắc đường đang thay đổi. Chọn đường có thời gian thấp nhất.',`<div class="choice-stack">${options.map((o,i)=>`<button data-t="${o.t}"><b>🛣️ ${o.n}</b><br><small>${o.t} phút · ${['thoáng','đông','mưa nhẹ'][Math.floor(Math.random()*3)]}</small></button>`).join('')}</div>`);$$('.choice-stack button').forEach(b=>b.onclick=()=>reward(+b.dataset.t===best,9000))}
function renderSequence(){const order=[0,1,2,3],mixed=[...order].sort(()=>Math.random()-.5),picked=[];sceneShell('Quy trình đang chạy','Chạm các bước theo đúng thứ tự.',`<div class="action-grid">${mixed.map(i=>`<button class="game-action" data-i="${i}"><span>${activeCareer.stepIcons[i]}</span>${activeCareer.steps[i]}</button>`).join('')}</div>`);$$('.game-action').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i!==order[picked.length])return reward(false);picked.push(i);b.disabled=true;b.style.opacity=.4;if(picked.length===4)reward(true,10000)})}
function renderQuiz(){const a=Math.floor(Math.random()*9)+2,b=Math.floor(Math.random()*9)+2,ans=a+b,opts=[ans,ans+1,ans-1,ans+2].sort(()=>Math.random()-.5);sceneShell('Phản xạ nhanh','Một câu ngắn — chọn trước khi mất combo.',`<div class="order">${activeCareer.name}: <b>${a} + ${b} = ?</b></div><div class="action-grid">${opts.map(x=>`<button class="game-action" data-v="${x}"><span>🧠</span>${x}</button>`).join('')}</div>`);$$('.game-action').forEach(b=>b.onclick=()=>reward(+b.dataset.v===ans,7500))}
function finishRun(){if(!run)return;clearInterval(run.timer);clearTimeout(run.sub);const r={...run};run=null;save.money+=r.earn;save.reputation+=Math.max(1,Math.floor(r.score/80));save.careersPlayed++;save.played[activeCareer.id]??={runs:0,best:0};save.played[activeCareer.id].runs++;save.played[activeCareer.id].best=Math.max(save.played[activeCareer.id].best,r.score);addXP(Math.max(20,Math.floor(r.score/4)));persist();const stars=r.score>280?3:r.score>140?2:1;$('#resultCard').innerHTML=`<div class="trophy">${stars===3?'🏆':stars===2?'🥈':'⭐'}</div><small>CA LÀM HOÀN TẤT</small><h2>${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</h2><p>${activeCareer.icon} ${activeCareer.name} · Bạn vừa để lại thêm một câu chuyện trong thành phố.</p><div class="result-stats"><div><small>THU NHẬP</small><b>+${fmt(r.earn)}đ</b></div><div><small>ĐIỂM</small><b>${r.score}</b></div><div><small>UY TÍN</small><b>+${Math.max(1,Math.floor(r.score/80))}</b></div></div><div class="modal-actions"><button class="secondary" id="backCity">Về thành phố</button><button class="primary" id="again">Chơi lại</button></div>`;$('#resultModal').classList.remove('hidden');$('#backCity').onclick=exitCareer;$('#again').onclick=()=>{$('#resultModal').classList.add('hidden');openCareer(activeCareer)}}
function exitCareer(){if(run){clearInterval(run.timer);clearTimeout(run.sub);run=null}$('#resultModal').classList.add('hidden');$('#careerGame').classList.add('hidden');$('#game').classList.remove('hidden');persist()}
$('#careerAction').addEventListener('click',startRun);$('#exitCareer').addEventListener('click',exitCareer);

// ===== AMBIENT / GIFT / CLOUD SAVE =====
$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇'};
$('#eventPill').onclick=()=>{if(Date.now()<save.giftAt)return toast('Quà chưa xuất hiện đâu 👀');const gain=25000+Math.floor(Math.random()*50000);save.money+=gain;save.giftAt=Date.now()+90000;persist();toast(`Nhặt được +${fmt(gain)}đ 🎁`,'good');burstSound(800)};
setInterval(()=>{const left=Math.max(0,save.giftAt-Date.now());$('#giftTimer').textContent=left?`${String(Math.floor(left/60000)).padStart(2,'0')}:${String(Math.floor(left/1000)%60).padStart(2,'0')}`:'NHẬN!';},500);
setInterval(()=>{if(!activeCareer&&!$('#game').classList.contains('hidden')){save.minutes+=1;if(save.minutes>=1440){save.minutes=0;save.day++}updateHUD()}},4000);
async function cloudSave(){try{await fetch('/api/save',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({playerId,save})})}catch{}}
setInterval(()=>{persist();cloudSave()},30000);

$('#playBtn').addEventListener('click',()=>{$('#boot').classList.add('hidden');$('#game').classList.remove('hidden');resize();ensureNPCs();requestAnimationFrame(loop);updateHUD();toast('Chào mừng tới Vạn Nghề 🌆','good')},{once:true});

// Intro preview starts only after click to save battery.
updateHUD();
