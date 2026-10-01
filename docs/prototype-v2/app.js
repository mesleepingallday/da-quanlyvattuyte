(function(){
'use strict';
const TODAY=new Date(2026,8,30);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const nf=n=>new Intl.NumberFormat('vi-VN').format(n);
const money=n=>nf(n)+' ₫';
const pad=n=>String(n).padStart(2,'0');
const fd=d=>pad(d.getDate())+'/'+pad(d.getMonth()+1)+'/'+d.getFullYear();
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const days=d=>Math.round((d-TODAY)/864e5);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon=(n,c='')=>`<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;

/* ---------- Data (from docs/ui/sample-data.json + mock slips) ---------- */
const VT=[
 {ma:'VT001',ten:'Bơm tiêm 5ml',dvt:'Cái',nhom:'Tiêm truyền',bq:'Phòng',gia:1150,tonMin:500},
 {ma:'VT002',ten:'Găng tay khám size M',dvt:'Hộp',nhom:'Bảo hộ',bq:'Phòng',gia:68000,tonMin:40},
 {ma:'VT003',ten:'Bông y tế 1kg',dvt:'Gói',nhom:'Băng gạc',bq:'Phòng',gia:145000,tonMin:10},
 {ma:'VT004',ten:'Kim luồn tĩnh mạch 22G',dvt:'Cái',nhom:'Tiêm truyền',bq:'Phòng',gia:9800,tonMin:200},
 {ma:'VT005',ten:'Dây truyền dịch',dvt:'Bộ',nhom:'Tiêm truyền',bq:'Phòng',gia:5200,tonMin:300},
 {ma:'VT006',ten:'Que thử đường huyết',dvt:'Hộp',nhom:'Xét nghiệm',bq:'Mát',gia:210000,tonMin:15},
 {ma:'HC001',ten:'Hóa chất xét nghiệm Glucose',dvt:'Lọ',nhom:'Hóa chất',bq:'Lạnh',gia:1350000,tonMin:4}];
const LOC={VT001:'A1-02',VT002:'A2-01',VT003:'A3-04',VT004:'B1-03',VT005:'B2-01',VT006:'C1-02',HC001:'L1-01'};
const LO=[
 {ma:'VT001',so:'BT2402',hsd:'2026-11-20',sl:800},{ma:'VT001',so:'BT2409',hsd:'2027-08-15',sl:1500},
 {ma:'VT002',so:'GT2310',hsd:'2026-10-12',sl:25},{ma:'VT002',so:'GT2405',hsd:'2027-05-01',sl:60},
 {ma:'VT003',so:'BG2401',hsd:'2027-01-30',sl:18},
 {ma:'VT004',so:'KL2311',hsd:'2026-12-05',sl:150},{ma:'VT004',so:'KL2401',hsd:'2027-03-10',sl:40,q:true},
 {ma:'VT005',so:'DT2406',hsd:'2027-06-30',sl:420},{ma:'VT005',so:'DT2412',hsd:'2027-10-18',sl:600},
 {ma:'VT006',so:'QT2403',hsd:'2026-10-08',sl:12},{ma:'HC001',so:'HC2405',hsd:'2027-02-28',sl:6}];
const vt=m=>VT.find(v=>v.ma===m);
const KHOA=['Khoa Nội','Khoa Cấp cứu','Khoa Ngoại','Khoa Xét nghiệm','Khoa Nhi','Khoa Sản'];
const P={
 lan:{n:'Nguyễn Thị Lan',r:'ĐD khoa',i:'NL',c:'#8FA3BF'},
 binh:{n:'Võ Thanh Bình',r:'Trưởng khoa',i:'VB',c:'#B59A7A'},
 hung:{n:'Trần Văn Hùng',r:'Thủ kho',i:'TH',c:'#7FA895'},
 hanh:{n:'Lê Thị Kim Hạnh',r:'Trưởng P.VTTBYT',i:'LH',c:'#A592BF'},
 tuan:{n:'Phạm Minh Tuấn',r:'Kế toán dược',i:'PT',c:'#C08E8A'}};
const STEPS=['Lập phiếu','Trưởng khoa duyệt','Kho xác nhận','Trưởng P.VTTBYT duyệt','Cấp phát'];
const STEP_P=['lan','binh','hung','hanh','hung'];
const ST={W:'Chờ duyệt',A:'Đã duyệt',D:'Đã cấp phát',R:'Từ chối',N:'Nháp'};
const PILL={W:'p-wait',A:'p-appr',D:'p-done',R:'p-rej',N:'p-draft'};
const overrides={128:'W',127:'A',126:'W',125:'W',124:'A',123:'A',122:'N',121:'W',120:'A',119:'W',118:'A',117:'R',116:'N',110:'R',98:'R',87:'R',61:'R',44:'N'};
const SLIPS=[];
for(let n=128;n>=1;n--){
  const s=(n*7919)%97;
  const st=overrides[n]||'D';
  const dd=new Date(2026,8,30-Math.floor((128-n)*0.98+((128-n)>40?(128-n)*0.4:0)));
  const cnt=2+(s%4), items=[];
  for(let k=0;k<cnt;k++){
    const v=VT[(s+k*3)%VT.length], req=v.gia>100000?2+((s+k)%5):[100,200,50,300,20][(s+k)%5];
    const lots=LO.filter(l=>l.ma===v.ma&&!l.q&&days(pd(l.hsd))>0).sort((a,b)=>a.hsd<b.hsd?-1:1);
    items.push({v,req,lot:lots[0]});
  }
  const t=new Date(dd);
  SLIPS.push({n,no:'PL-2026-'+pad(n).padStart(4,'0'),khoa:KHOA[(s+n)%KHOA.length],date:dd,st,items,
    value:items.reduce((a,i)=>a+i.req*i.v.gia,0),hh:9+(s%8),mm:(s*7)%60});
}
SLIPS.forEach(s=>{const k=s.khoa;s.lan=k==='Khoa Xét nghiệm'?'tuan':'lan'});

/* ---------- State ---------- */
const S={sel:new Set(),q:'',f:'',page:1,per:10,sort:{k:'date',d:-1},open:new Set(),tab:'hsd',cardsAll:false,role:'Thủ kho',tq:'',tOpen:new Set(['VT002','VT006','VT004'])};

/* ---------- Helpers ---------- */
function avatar(p,cls=''){const a=P[p];return `<span class="av ${cls}" style="--c:${a.c}" title="${esc(a.n)} · ${esc(a.r)}">${a.i}</span>`}
function pill(k,label){return `<span class="pill ${PILL[k]||k}">${label||ST[k]}</span>`}
function approvers(s){
  const done={N:[],W:['binh','hung'],A:['binh','hung','hanh'],D:['binh','hung','hanh'],R:['binh','hung']}[s.st];
  if(!done.length)return '<span class="dash">—</span>';
  return `<span class="stack">${done.map(p=>avatar(p)).join('')}</span>`;
}
function barcode(seed,h=40){
  let x=0,r=[...seed].reduce((a,c)=>a*31+c.charCodeAt(0),7),out='',w=0;
  while(w<150){r=(r*1103515245+12345)&0x7fffffff;const bw=1+(r>>8)%3,gap=1+(r>>12)%2;out+=`<rect x="${w}" y="0" width="${bw}" height="${h}"/>`;w+=bw+gap;}
  return `<svg class="barcode" viewBox="0 0 150 ${h}" preserveAspectRatio="none" fill="#ECEDEE" aria-hidden="true">${out}</svg>`;
}
function tone(d){return d<30?'t-red':d<90?'t-amber':'t-ok'}
function toast(msg){const t=document.createElement('div');t.className='toast';t.innerHTML=icon('check')+'<span>'+esc(msg)+'</span>';$('#toasts').append(t);setTimeout(()=>t.remove(),3200)}
function totalLot(ma){return LO.filter(l=>l.ma===ma&&!l.q).reduce((a,l)=>a+l.sl,0)}

/* ---------- Dashboard ---------- */
function cardsData(){
  if(S.tab==='hsd')return LO.filter(l=>!l.q).map(l=>({l,v:vt(l.ma),d:days(pd(l.hsd))})).sort((a,b)=>a.d-b.d).slice(0,5);
  return VT.map(v=>({v,t:totalLot(v.ma),l:LO.filter(l=>l.ma===v.ma&&!l.q).sort((a,b)=>a.hsd<b.hsd?-1:1)[0]})).map(o=>({...o,ratio:o.t/o.v.tonMin})).sort((a,b)=>a.ratio-b.ratio).slice(0,5).map(o=>({...o,d:days(pd(o.l.hsd))}));
}
function sevOf(o){
  if(S.tab==='hsd'){const d=o.d;return d<30?['red','Nghiêm trọng','warn']:d<90?['amber','Cảnh báo','clock']:['blue','Theo dõi','eye']}
  return o.ratio<1?['red','Nghiêm trọng','warn']:o.ratio<2?['amber','Cảnh báo','clock']:['blue','Theo dõi','eye'];
}
function cardHTML(o){
  const {l,v}=o,ha=S.tab==='hsd',[k,lbl,ic]=sevOf(o);
  const big=ha?`${Math.max(o.d,0)}<small>NGÀY</small>`:`${nf(o.t)} / ${nf(v.tonMin)}<small>${esc(v.dvt.toUpperCase())}</small>`;
  const sum=ha?`còn ${o.d} ngày`:`tồn ${nf(o.t)} trên tối thiểu ${nf(v.tonMin)}`;
  return `<button class="card t-${k} ${k==='red'?'crit':''}" data-go="ton-kho" aria-label="${lbl}: ${esc(v.ten)}, ${sum}, lô ${l.so}">
   <span class="c-dot" aria-hidden="true"></span>
   <div class="c-top"><span class="c-num mono">${big}</span><span class="c-sev">${icon(ic)}${lbl}</span></div>
   <div class="c-name" style="color:var(--tx)">${esc(v.ten)}</div><div class="c-meta">HSD ${fd(pd(l.hsd))} · Lô <span class="mono">${l.so}</span></div>
   <div class="c-strip">${barcode(l.so+v.ma,16)}</div></button>`;
}
function cardsBlock(){
  const a=cardsData();
  return `<div class="cards ${S.cardsAll?'all':''}" id="cards">${a.map(cardHTML).join('')}</div><button class="btn btn-secondary c-more" data-cardsall>${S.cardsAll?'Thu gọn':'Xem tất cả '+a.length+' lô'}</button>`;
}
function filtered(){
  const q=S.q.trim().toLowerCase();
  let a=SLIPS.filter(s=>(!S.f||ST[s.st]===S.f)&&(!q||(s.no+' '+s.khoa+' '+ST[s.st]+' '+fd(s.date)).toLowerCase().includes(q)));
  const {k,d}=S.sort;
  a=a.slice().sort((x,y)=>{const v=k==='date'?(x.date-y.date||x.n-y.n):k==='value'?x.value-y.value:k==='items'?x.items.length-y.items.length:x.n-y.n;return v*d});
  return a;
}
function sortBtn(k,label,cls=''){return `<button data-sort="${k}" class="${cls}">${label}${icon('sort')}</button>`}
function slipsHTML(){
  const all=filtered(),pages=Math.max(1,Math.ceil(all.length/S.per));S.page=Math.min(S.page,pages);
  const rows=all.slice((S.page-1)*S.per,S.page*S.per),groups=[];
  rows.forEach(s=>{let g=groups.find(g=>g.k===s.khoa);if(!g)groups.push(g={k:s.khoa,a:[]});g.a.push(s)});
  const body=groups.map(g=>{
    const open=!S.open.has(g.k),ids=g.a.map(s=>s.n),nsel=ids.filter(i=>S.sel.has(i)).length;
    return `<div class="grp"><div class="tr g" data-g="${esc(g.k)}" role="button" tabindex="0" aria-expanded="${open}">
     <div class="name">${icon('right','chev')}<input type="checkbox" class="cb" data-gcb="${esc(g.k)}" aria-label="Chọn cả ${esc(g.k)}" ${nsel===ids.length?'checked':''}><span class="grip" aria-hidden="true">⋮⋮</span><span class="ficon">${icon('pin')}</span><span>${esc(g.k)} <span class="cnt">· ${g.a.length} phiếu</span></span></div>
     <div class="c-mod"></div><div class="c-share"></div><div></div><div class="r mono"></div><div class="r mono">${money(g.a.reduce((a,s)=>a+s.value,0))}</div><span></span></div>
     ${open?`<div class="kids">${g.a.map(slipRow).join('')}</div>`:''}</div>`}).join('');
  const from=all.length?(S.page-1)*S.per+1:0,to=Math.min(S.page*S.per,all.length);
  return `<div class="tbl"><div class="th"><div>${sortBtn('no','Số phiếu / Khoa')}</div><div class="c-mod">${sortBtn('date','Ngày lập')}</div><div class="c-share">Người duyệt</div><div>Trạng thái</div><div class="r">${sortBtn('items','Mặt hàng','r')}</div><div class="r">${sortBtn('value','Giá trị','r')}</div><span></span></div>
   ${body||'<div class="empty">Không có phiếu nào khớp bộ lọc.</div>'}</div>
   <div class="foot"><span>Hiển thị <b class="mono">${from}–${to}</b> trên <b class="mono">${all.length}</b> phiếu</span><div class="pg">${pager(pages)}</div></div>`;
}
function slipRow(s){
  return `<div class="tr s ${S.sel.has(s.n)?'sel':''}" data-n="${s.n}" tabindex="0" role="button" aria-label="Mở ${s.no}">
   <div class="name"><input type="checkbox" class="cb" data-cb="${s.n}" aria-label="Chọn ${s.no}" ${S.sel.has(s.n)?'checked':''}><span class="slipno">${s.no}</span></div>
   <div class="c-mod mono" data-l="Ngày lập">${fd(s.date)}</div><div class="c-share" data-l="Duyệt">${approvers(s)}</div>
   <div data-l="Trạng thái">${pill(s.st)}</div><div class="r mono" data-l="Mặt hàng">${s.items.length}</div><div class="r mono" data-l="Giá trị">${money(s.value)}</div>
   <button class="kebab" aria-label="Thêm thao tác ${s.no}">${icon('dots')}</button></div>`;
}
function pager(n){
  const p=S.page,set=new Set([1,n,p-1,p,p+1]);if(p<=3){set.add(2);set.add(3)}if(p>=n-2){set.add(n-1);set.add(n-2)}
  const l=[...set].filter(x=>x>=1&&x<=n).sort((a,b)=>a-b);let out=`<button data-p="${p-1}" ${p<2?'disabled':''} aria-label="Trang trước">${icon('left')}</button>`,prev=0;
  l.forEach(x=>{if(x-prev>1)out+='<span>…</span>';out+=`<button data-p="${x}" ${x===p?'aria-current="page"':''}>${x}</button>`;prev=x});
  return out+`<button data-p="${p+1}" ${p>=n?'disabled':''} aria-label="Trang sau">${icon('right')}</button>`;
}
function dash(){
  return `<section><div class="sh"><div><h2>Lô cần chú ý</h2><p>Xếp theo FEFO · cập nhật 30/09/2026</p></div><span class="grow"></span>
   <div class="tabs" role="tablist"><button role="tab" data-tab="hsd" aria-selected="${S.tab==='hsd'}">Sắp hết hạn</button><button role="tab" data-tab="min" aria-selected="${S.tab==='min'}">Dưới tồn tối thiểu</button></div></div>
   <div id="cardsWrap">${cardsBlock()}</div></section>
   <section><div class="sh"><div><h2>Phiếu lĩnh</h2><p>Nhóm theo khoa lĩnh</p></div></div>
   <div class="tools"><label class="input">${icon('search')}<input id="q" placeholder="Tìm số phiếu, khoa, trạng thái" value="${esc(S.q)}" aria-label="Tìm phiếu"></label><span class="grow"></span>
    <button class="btn btn-secondary" id="btnExpand">${icon('list')}Thu/mở nhóm</button><button class="btn btn-primary" id="btnNew">${icon('plus')}Lập phiếu lĩnh</button></div>
   <div id="slips">${slipsHTML()}</div></section>`;
}

/* ---------- Tồn kho ---------- */
function lotState(l){const d=days(pd(l.hsd));if(l.q)return ['p-q','Biệt trữ'];if(d<30)return ['p-rej','Cận hạn'];if(d<90)return ['p-wait','Sắp hết hạn'];return ['p-draft','Bình thường']}
function ton(){
  const q=S.tq.trim().toLowerCase();
  const rows=VT.filter(v=>!q||(v.ten+v.ma+LO.filter(l=>l.ma===v.ma).map(l=>l.so).join(' ')).toLowerCase().includes(q)).map(v=>{
    const t=totalLot(v.ma),low=t<v.tonMin,open=S.tOpen.has(v.ma),lots=LO.filter(l=>l.ma===v.ma).sort((a,b)=>a.hsd<b.hsd?-1:1);
    return `<div class="grp"><div class="tr g" data-tg="${v.ma}" role="button" tabindex="0" aria-expanded="${open}">
     <div class="name">${icon('right','chev')}<span class="grip" aria-hidden="true">⋮⋮</span><span class="ficon">${icon('box')}</span><span>${esc(v.ten)} <span class="cnt mono">· ${v.ma}</span></span></div>
     <div style="color:var(--mut)">${v.bq}</div><div style="color:var(--mut);grid-column:span 2">${v.nhom}</div>
     <div>${pill(low?'p-rej':'p-done',low?'Dưới tối thiểu':'Đủ hàng')}</div><div class="r mono"><b>${nf(t)}</b> <span class="cnt">${v.dvt}</span></div><span></span></div>
     ${open?`<div class="kids">${lots.map(l=>{const d=days(pd(l.hsd)),[pc,pt]=lotState(l);
       return `<div class="tr"><div class="name"><span class="lotchip">${l.so}</span></div><div class="mono" style="color:var(--mut)">${LOC[v.ma]}</div><div class="mono">${fd(pd(l.hsd))}</div>
        <div class="mono ${l.q?'t-mut':tone(d)}">còn ${d} ngày</div><div>${pill(pc,pt)}</div><div class="r mono ${l.q?'strike':''}" ${l.q?'title="Không tính vào tổng tồn"':''}>${nf(l.sl)}</div><span></span></div>`}).join('')}</div>`:''}</div>`}).join('');
  return `<section><div class="sh"><div><h2>Tồn kho theo lô</h2><p>${VT.length} vật tư · ${LO.length} lô · lô biệt trữ không tính vào tổng</p></div></div>
   <div class="tools"><label class="input">${icon('search')}<input id="tq" placeholder="Tìm vật tư hoặc số lô" value="${esc(S.tq)}" aria-label="Tìm tồn kho"></label></div>
   <div class="tbl lots"><div class="th"><div>Vật tư / Lô</div><div>Vị trí / BQ</div><div>HSD</div><div>Thời hạn</div><div>Trạng thái</div><div class="r">Số lượng</div><span></span></div>
   ${rows||'<div class="empty">Không tìm thấy vật tư.</div>'}</div>
   <p class="note">Lô được xếp theo FEFO: hết hạn trước, xuất trước.</p></section>`;
}
function soon(t){return `<div class="soon"><div><div class="label"><div class="l-top"><span>ĐANG CHUẨN BỊ</span><b>v2</b></div>${barcode(t,40)}<div class="gtin">(01) 00000000000000</div><div class="lotcode">SẮP CÓ</div></div><h2>${esc(t)}</h2><p>Màn hình này chưa có trong bản mẫu.<br>Hãy xem Tổng quan hoặc Tồn kho theo lô.</p></div></div>`}

/* ---------- Router ---------- */
const TITLES={'tong-quan':'Tổng quan','ton-kho':'Tồn kho theo lô','phieu-linh':'Phiếu lĩnh','cap-phat':'Cấp phát','nhap-kho':'Nhập kho','danh-muc':'Danh mục vật tư','du-tru':'Dự trù tháng','bao-cao':'Báo cáo X-N-T','nhat-ky':'Nhật ký'};
function route(){
  const r=(location.hash||'#tong-quan').slice(1),t=TITLES[r]||TITLES['tong-quan'];
  $('#pageTitle').textContent=t;document.title=t+' · Kho VTYT';
  $$('#nav a').forEach(a=>{const on=a.dataset.r===r||(r==='phieu-linh'&&a.dataset.r==='tong-quan'&&false);a.classList.toggle('on',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
  if(!TITLES[r]){location.hash='#tong-quan';return}
  $('#view').innerHTML=r==='tong-quan'?dash():r==='ton-kho'?ton():soon(t);
  $('#view').scrollTop=0;closeSide();bulk();
}
function rerenderSlips(){const s=$('#slips');if(s){s.innerHTML=slipsHTML()}bulk()}
function bulk(){const n=S.sel.size,b=$('#bulk');b.hidden=!n||!$('#slips');if(n)$('#bulkN').textContent=n+' phiếu đã chọn'}
function bulkBar(){ if(!$('#bulkN')){const b=$('#bulk');const sp=document.createElement('span');sp.id='bulkN';b.prepend(sp)} }

/* ---------- Drawer ---------- */
let cur=null,lastFocus=null;
function openDrawer(n){
  const s=SLIPS.find(x=>x.n===n);if(!s)return;cur=s;lastFocus=document.activeElement;renderDrawer();
  $('#drawer').classList.add('on');$('#drawer').setAttribute('aria-hidden','false');$('#dScrim').classList.add('on');
  setTimeout(()=>$('#dClose')?.focus(),50);
}
function closeDrawer(){$('#drawer').classList.remove('on');$('#drawer').setAttribute('aria-hidden','true');$('#dScrim').classList.remove('on');cur=null;lastFocus&&lastFocus.focus&&lastFocus.focus()}
function renderDrawer(){
  const s=cur,prog={N:0,W:3,A:4,D:5,R:3}[s.st];
  const t=(i)=>{const d=new Date(s.date);d.setDate(d.getDate()+Math.floor(i/2));return fd(d)+' · '+pad(s.hh+i)%24+':'+pad((s.mm+i*9)%60)};
  const hh=i=>pad((s.hh+i)%24)+':'+pad((s.mm+i*9)%60);
  const tl=STEPS.map((st,i)=>{
    const p=P[i===0?s.lan:STEP_P[i]];let c=i<prog?'done':i===prog?(s.st==='R'?'bad':'cur'):'todo';if(s.st==='N'&&i===0)c='cur';
    const when=c==='done'?(()=>{const d=new Date(s.date);d.setDate(d.getDate()+Math.floor(i/2));return fd(d)+' · '+hh(i)})():c==='cur'?'Đang chờ':c==='bad'?'Đã từ chối · '+fd(s.date):'Chưa đến';
    const label=c==='bad'?st+' (từ chối)':st;
    return `<li class="st ${c}"><span class="dot">${c==='done'?icon('check'):c==='bad'?icon('x'):''}</span><div><b>${label}</b><small>${p.n} · ${p.r}<br>${when}</small></div></li>`}).join('');
  const items=s.items.map(it=>{const out=s.st==='D'?it.req:null;return `<tr><td>${esc(it.v.ten)}<br><small style="color:var(--mut)">${it.v.dvt}</small></td><td><span class="lotchip">${it.lot.so}</span></td><td class="mono">${nf(it.req)}</td><td class="mono">${out===null?'<span class="dash">—</span>':nf(out)}</td></tr>`}).join('');
  const act={W:`<button class="btn btn-secondary danger lg" data-act="rej">Từ chối</button><button class="btn btn-primary lg" data-act="appr">Duyệt</button>`,A:`<button class="btn btn-secondary danger lg" data-act="rej">Từ chối</button><button class="btn btn-primary lg" data-act="issue">Cấp phát</button>`}[s.st]||`<button class="btn btn-secondary lg" data-act="close">Đóng</button>`;
  $('#drawer').innerHTML=`<div class="d-head"><div class="t"><small>Chi tiết phiếu · ${esc(s.khoa)}</small><h2>${s.no}</h2>${pill(s.st)}</div><button class="icon-btn" id="dClose" aria-label="Đóng">${icon('x')}</button></div>
   <div class="d-body"><div class="d-meta"><div><small>Ngày lập</small><b class="mono">${fd(s.date)}</b></div><div><small>Số mặt hàng</small><b class="mono">${s.items.length}</b></div><div><small>Giá trị</small><b class="mono">${money(s.value)}</b></div></div>
   <h3>Vật tư</h3><table class="it"><thead><tr><th>Vật tư</th><th>Lô FEFO</th><th>SL yêu cầu</th><th>SL phát</th></tr></thead><tbody>${items}</tbody></table>
   <h3>Tiến trình phê duyệt</h3><ol class="tl" style="list-style:none;padding:0">${tl}</ol></div><div class="d-foot">${act}</div>`;
}
function setStatus(st,msg){cur.st=st;renderDrawer();rerenderSlips();updBadge();toast(msg)}
function updBadge(){$('#badge').textContent=SLIPS.filter(s=>s.st==='W').length||''}

/* ---------- Events ---------- */
function closeSide(){$('#side').classList.remove('on');$('#scrim').classList.remove('on')}
document.addEventListener('click',e=>{
  const t=e.target;
  if(t.closest('#menuBtn')){$('#side').classList.add('on');$('#scrim').classList.add('on');return}
  if(t.closest('#scrim')){closeSide();return}
  if(t.closest('#dScrim')||t.closest('#dClose')){closeDrawer();return}
  const ac=t.closest('[data-act]');
  if(ac&&cur){const a=ac.dataset.act;
    if(a==='appr')setStatus('A','Đã duyệt '+cur.no);else if(a==='rej')setStatus('R','Đã từ chối '+cur.no);else if(a==='issue')setStatus('D','Đã cấp phát '+cur.no);else closeDrawer();return}
  const um=$('#roleMenu'),fm=$('#filterMenu');
  if(t.closest('#userBtn')){um.hidden=!um.hidden;$('#userBtn').setAttribute('aria-expanded',!um.hidden);return}
  const ro=t.closest('#roleMenu li');if(ro){$$('#roleMenu li').forEach(l=>l.removeAttribute('aria-selected'));ro.setAttribute('aria-selected','true');$('#roleLbl').textContent=ro.textContent;um.hidden=true;toast('Đã chuyển vai trò: '+ro.textContent);return}
  if(t.closest('#btnFilter')){fm.hidden=!fm.hidden;return}
  const fo=t.closest('#filterMenu li');if(fo){S.f=fo.dataset.f;S.page=1;fm.hidden=true;$('#btnFilter span').textContent=S.f||'Lọc';rerenderSlips();return}
  if(!t.closest('.dd'))fm.hidden=true;if(!t.closest('.user'))um.hidden=true;
  if(t.closest('#btnScan')){toast('Sẵn sàng quét mã GS1 (mô phỏng)');return}
  if(t.closest('#btnIn')){toast('Mở phiếu nhập kho (mô phỏng)');return}
  if(t.closest('#btnXls')||t.closest('#bulkX')){toast('Đã xuất Excel'+(S.sel.size&&t.closest('#bulkX')?' ('+S.sel.size+' phiếu)':''));return}
  if(t.closest('#btnDuTru')){toast('Đã tạo nháp dự trù tháng 10');return}
  if(t.closest('#btnNew')){toast('Đã tạo nháp phiếu lĩnh mới');return}
  if(t.closest('#bulkClr')){S.sel.clear();rerenderSlips();return}
  if(t.closest('#bulkOk')){let c=0;SLIPS.forEach(s=>{if(S.sel.has(s.n)&&s.st==='W'){s.st='A';c++}});S.sel.clear();rerenderSlips();updBadge();toast(c?'Đã duyệt '+c+' phiếu':'Không có phiếu chờ duyệt trong lựa chọn');return}
  const tab=t.closest('[data-tab]');if(tab){S.tab=tab.dataset.tab;$$('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b===tab));$('#cardsWrap').innerHTML=cardsBlock();return}
  if(t.closest('[data-cardsall]')){S.cardsAll=!S.cardsAll;$('#cardsWrap').innerHTML=cardsBlock();return}
  const cd=t.closest('.card');if(cd){location.hash='#ton-kho';return}
  const pg=t.closest('[data-p]');if(pg&&!pg.disabled){S.page=+pg.dataset.p;rerenderSlips();return}
  const so=t.closest('[data-sort]');if(so){const k=so.dataset.sort;S.sort=S.sort.k===k?{k,d:-S.sort.d}:{k,d:-1};rerenderSlips();return}
  if(t.closest('#btnExpand')){S.open.size?S.open.clear():filtered().forEach(s=>S.open.add(s.khoa));rerenderSlips();return}
  const gcb=t.closest('[data-gcb]');if(gcb){const k=gcb.dataset.gcb;const ids=filtered().slice((S.page-1)*S.per,S.page*S.per).filter(s=>s.khoa===k).map(s=>s.n);ids.forEach(i=>gcb.checked?S.sel.add(i):S.sel.delete(i));rerenderSlips();return}
  const cb=t.closest('[data-cb]');if(cb){const n=+cb.dataset.cb;cb.checked?S.sel.add(n):S.sel.delete(n);rerenderSlips();return}
  if(t.closest('.kebab'))return;
  const row=t.closest('.tr.s');if(row){openDrawer(+row.dataset.n);return}
  const g=t.closest('[data-g]');if(g){const k=g.dataset.g;S.open.has(k)?S.open.delete(k):S.open.add(k);rerenderSlips();return}
  const tg=t.closest('[data-tg]');if(tg){const k=tg.dataset.tg;S.tOpen.has(k)?S.tOpen.delete(k):S.tOpen.add(k);$('#view').innerHTML=ton();return}
});
document.addEventListener('input',e=>{
  if(e.target.id==='q'){S.q=e.target.value;S.page=1;rerenderSlips()}
  if(e.target.id==='tq'){S.tq=e.target.value;const p=e.target.selectionStart;$('#view').innerHTML=ton();const i=$('#tq');i.focus();i.setSelectionRange(p,p)}
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(cur)closeDrawer();else closeSide();$('#roleMenu').hidden=true;$('#filterMenu').hidden=true}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#gsearch').focus()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('.tr[role=button],.menu li')){if(e.target.matches('.menu li')){e.preventDefault();e.target.click();return}if(e.target===document.activeElement){e.preventDefault();e.target.click()}}
});
window.addEventListener('hashchange',route);
bulkBar();updBadge();route();
})();
