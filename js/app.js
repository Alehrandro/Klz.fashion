// ===== DADOS (prontos para trocar por Supabase/API) =====
const CATS=[{id:'camisetas',n:'Camisetas',g:'roupas'},{id:'calcas',n:'Calças',g:'roupas'},{id:'jaquetas',n:'Jaquetas',g:'roupas'},{id:'tenis',n:'Tênis',g:'calcados'},{id:'acessorios',n:'Acessórios',g:'acessorios'}];
const SR=['P','M','G','GG'],SN=['38','39','40','41','42','43'],SU=['Único'];
const P=[
{id:1,n:'Camiseta Dri-FIT Essential',b:'Nike',c:'camisetas',p:59.9,o:89.9,s:SR,new:0,col:'#1b1b1b'},
{id:2,n:'Moletom Club Fleece',b:'Nike',c:'jaquetas',p:199.9,o:299.9,s:SR,new:0,col:'#161616'},
{id:3,n:'Tênis Grand Court',b:'Adidas',c:'tenis',p:299.9,o:499.9,s:SN,new:0,col:'#111'},
{id:4,n:'Boné 9FORTY New York',b:'New Era',c:'acessorios',p:89.9,o:149.9,s:SU,new:0,col:'#181818'},
{id:5,n:'Calça Jogger Tech',b:'Nike',c:'calcas',p:179.9,o:239.9,s:SR,new:1,col:'#1a1a1a'},
{id:6,n:'Jaqueta Corta-Vento Trail',b:'Puma',c:'jaquetas',p:259.9,o:349.9,s:SR,new:1,col:'#232a30'},
{id:7,n:'Tênis Court Vision Low',b:'Nike',c:'tenis',p:349.9,o:399.9,s:SN,new:1,col:'#e9e9e9'},
{id:8,n:'Camiseta Oversized KLZ',b:'KLZ',c:'camisetas',p:79.9,o:79.9,s:SR,new:1,col:'#d8d2c4'},
{id:9,n:'Calça Cargo Urban',b:'Adidas',c:'calcas',p:219.9,o:329.9,s:SR,new:0,col:'#3a3a32'},
{id:10,n:'Boné Dad Hat Gold',b:'KLZ',c:'acessorios',p:69.9,o:69.9,s:SU,new:1,col:'#2a2a2a'},
{id:11,n:'Tênis Runner Air',b:'Puma',c:'tenis',p:399.9,o:599.9,s:SN,new:0,col:'#2b2b2b'},
{id:12,n:'Camiseta Polo Piquet',b:'Puma',c:'camisetas',p:99.9,o:149.9,s:SR,new:0,col:'#14233a'}];
const BR=['Nike','Adidas','Puma','New Era','KLZ'];
const COUPONS={KLZ10:{t:'pct',v:.10,d:'10% off'},BEMVINDO:{t:'pct',v:.05,d:'5% off'},FRETEGRATIS:{t:'ship',v:0,d:'Frete grátis'}};
const S={tel:'(11) 98765-4321',email:'contato@klzfashion.com.br',hor:'Seg a Sex: 8h às 18h',frete:299,parc:12,pix:5,jur:1.99,soc:[{n:'Instagram',u:'https://instagram.com/klzfashion'},{n:'TikTok',u:'https://tiktok.com/@klzfashion'},{n:'YouTube',u:'https://youtube.com/@klzfashion'}]};
const SZ={camisetas:SR,calcas:SR,jaquetas:SR,tenis:SN,acessorios:SU};
let ORD=[];
P.forEach((p,i)=>p.st=Object.fromEntries(p.s.map(s=>[s,4+(p.id*3+i)%9])));
if(!CLOUD)try{const d=JSON.parse(localStorage.getItem('klzD')||'null');if(d){P.splice(0,P.length,...d.P);Object.assign(S,d.S);Object.keys(COUPONS).forEach(k=>delete COUPONS[k]);Object.assign(COUPONS,d.C);ORD=d.O||[]}}catch(e){}
if(CLOUD){P.length=0;Object.keys(COUPONS).forEach(k=>delete COUPONS[k])}
const persist=()=>{if(CLOUD)return persistCloud();try{localStorage.setItem('klzD',JSON.stringify({P,S,C:COUPONS,O:ORD}))}catch(e){toast('Sem espaço para salvar. Use fotos menores.')}};
const tot=p=>Object.values(p.st).reduce((a,b)=>a+b,0);
const stl=p=>{const t=tot(p);return t===0?'<span class="par" style="color:#e5594f">Esgotado</span>':t<=5?`<span class="par gold">Restam ${t} unidades</span>`:''};
const esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const pmt=v=>{const n=S.parc,i=S.jur/100;return i?v*i/(1-Math.pow(1+i,-n)):v/n};

// ===== UTIL / ARTE (SVG inline, sem imagens externas) =====
const $=s=>document.querySelector(s),fmt=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const art=(c,col)=>{const sh=`stroke="#ffffff22" stroke-width="1.5"`,g=`<ellipse cx="100" cy="182" rx="62" ry="6" fill="#000" opacity=".5"/>`,mark=`<path d="M84 72q10 10 32-8q-14 22-32 8z" fill="#fff" opacity=".85"/>`;
const d={
camisetas:`<path d="M62 38L90 28Q100 46 110 28L138 38L176 70L156 92L140 80V168H60V80L44 92L24 70Z" fill="${col}" ${sh}/><path d="M90 28Q100 46 110 28" fill="none" stroke="#ffffff33" stroke-width="3"/>${mark}`,
calcas:`<path d="M62 22H138L146 176H110L100 84L90 176H54Z" fill="${col}" ${sh}/><path d="M62 38H138" stroke="#ffffff33" stroke-width="3"/><path d="M100 38V84" stroke="#ffffff22"/>`,
jaquetas:`<path d="M60 40Q100 14 140 40L178 122L154 130L142 94V170H58V94L46 130L22 122Z" fill="${col}" ${sh}/><path d="M78 36Q100 62 122 36" fill="none" stroke="#ffffff33" stroke-width="3"/><path d="M100 62V120M76 130H124L120 156H80Z" fill="none" stroke="#ffffff22" stroke-width="2"/>${mark.replace('84 72','88 90')}`,
tenis:`<path d="M20 126Q20 100 44 96L68 92Q80 76 96 82L112 102Q152 108 176 126Q184 142 170 150H30Q18 150 20 126Z" fill="${col}" ${sh}/><path d="M18 150H178L176 164H22Z" fill="#f2f2f2"/><path d="M96 96L112 120M108 100L124 122M120 104L136 124" stroke="#fff" stroke-width="5" opacity=".9"/><path d="M70 94L96 82" stroke="#fff3" stroke-width="3"/>`,
acessorios:`<path d="M44 112Q46 50 104 48Q162 50 160 112Z" fill="${col}" ${sh}/><path d="M118 108Q186 108 190 128Q150 120 116 120Z" fill="${col}" stroke="#ffffff33" stroke-width="1.5"/><path d="M104 48V112" stroke="#ffffff1a"/><path d="M80 64l6 40 6-40M96 64l-6 40 18-40 6 40" fill="none" stroke="#fff" stroke-width="4" opacity=".85"/>`};
return `<svg viewBox="0 0 200 200" role="img" aria-hidden="true">${g}${d[c]}</svg>`};
const pimg=p=>p.img?`<img src="${esc(p.img)}" alt="" style="width:100%;height:100%;object-fit:cover;display:block">`:art(p.c,p.col);
const disc=p=>p.o>p.p?Math.round((1-p.p/p.o)*100):0;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2200)};
const ico={bag:'<svg class="ic" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M3 4h3l2.5 11h9L20 7H7"/><circle cx="10" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg>',heart:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/></svg>'};

// ===== ESTADO =====
let cart=[],favs=new Set(),pick={},coupon=null,ship=null;
try{cart=JSON.parse(localStorage.getItem('klzcart')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('klzcart',JSON.stringify(cart))}catch(e){}};
let F={group:'',cat:'',size:'',max:700,brand:[],sort:'rel',q:'',only:''};

// ===== CARDS =====
function card(p){const d=disc(p),sel=pick[p.id];
return `<article class="pc">${d?`<span class="off">-${d}%</span>`:''}${p.new?`<span class="off nw">NOVO</span>`:''}
<button class="fav ${favs.has(p.id)?'on':''}" aria-label="Favoritar" onclick="fav(${p.id},this)">${ico.heart}</button>
<a class="img" onclick="openProd(${p.id})">${pimg(p)}</a>
<div class="in"><span class="par">${esc(p.b)}</span><span class="pn" onclick="openProd(${p.id})">${esc(p.n)}</span>${d?`<span class="old">${fmt(p.o)}</span>`:''}<span class="pr">${fmt(p.p)}</span><span class="par">ou ${S.parc}x de ${fmt(pmt(p.p))} com juros</span>${stl(p)}</div>
<button class="add" ${tot(p)?'':'disabled'} onclick="addCard(${p.id})">${tot(p)?ico.bag+' Adicionar ao carrinho':'Esgotado'}</button>
<div class="szs">${p.s.map(s=>`<button class="sz ${sel===s?'on':''}" ${p.st[s]>0?'':'disabled'} onclick="selSize(${p.id},'${s}',this)">${s}</button>`).join('')}</div></article>`}
function selSize(id,s,el){pick[id]=s;el.parentNode.querySelectorAll('.sz').forEach(b=>b.classList.toggle('on',b===el))}
function fav(id,el){favs.has(id)?favs.delete(id):favs.add(id);el.classList.toggle('on');toast(favs.has(id)?'Adicionado aos favoritos':'Removido dos favoritos')}
function addCard(id){const p=P.find(x=>x.id===id);let s=pick[id];if(!s&&p.s.length===1)s=p.s[0];if(!s)return toast('Selecione um tamanho');add(id,s)}
function add(id,s,q=1){const p=P.find(x=>x.id===id),av=p.st[s]||0,k=cart.find(i=>i.id===id&&i.s===s);if((k?k.q:0)+q>av)return toast(av?`Só há ${av} em estoque neste tamanho`:'Tamanho esgotado');k?k.q+=q:cart.push({id,s,q});save();upd();toast('Adicionado ao carrinho');}

// ===== NAVEGAÇÃO =====
function go(v,f){closeAll();document.querySelectorAll('.view').forEach(e=>e.classList.remove('on'));$('#v-'+v).classList.add('on');$('nav').classList.remove('on');
if(v==='cat'){F={group:'',cat:'',size:'',max:700,brand:[],sort:'rel',q:'',only:'',...f};$('#sort').value=F.sort;renderFlt();renderCat()}
if(v==='co')renderCo();
let n=v==='home'?'home':F.only==='novos'?'novos':F.only==='ofertas'?'ofertas':F.group==='roupas'?'roupas':F.group==='calcados'?'calcados':'';if(v!=='cat'&&v!=='home')n='';
document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('on',a.dataset.n===n));scrollTo({top:0,behavior:'smooth'})}

// ===== CATÁLOGO =====
function renderFlt(){const sizes=[...SR,...SN,'Único'];
$('#flt').innerHTML=`<h4>Categoria</h4><label><input type="radio" name="fc" ${!F.cat?'checked':''} onchange="F.cat='';F.group='';renderCat()">Todas</label>${CATS.map(c=>`<label><input type="radio" name="fc" ${F.cat===c.id?'checked':''} onchange="F.cat='${c.id}';F.group='';renderCat()">${c.n}</label>`).join('')}
<h4>Tamanho</h4><div class="chips">${sizes.filter(s=>s!=='Único').map(s=>`<button class="sz ${F.size===s?'on':''}" onclick="F.size=F.size==='${s}'?'':'${s}';renderFlt();renderCat()">${s}</button>`).join('')}</div>
<h4>Preço até <span class="gold" id="pv">${fmt(F.max)}</span></h4><input type="range" min="50" max="700" step="10" value="${F.max}" oninput="F.max=+this.value;$('#pv').textContent=fmt(F.max);renderCat()">
<h4>Marca</h4>${BR.map(b=>`<label><input type="checkbox" ${F.brand.includes(b)?'checked':''} onchange="F.brand=this.checked?[...F.brand,'${b}']:F.brand.filter(x=>x!=='${b}');renderCat()">${b}</label>`).join('')}
<button class="rm" style="margin-top:18px" onclick="go('cat',{})">Limpar filtros</button>`}
function renderCat(){let l=P.filter(p=>(!F.cat||p.c===F.cat)&&(!F.group||CATS.find(c=>c.id===p.c).g===F.group)&&(!F.size||p.s.includes(F.size))&&p.p<=F.max&&(!F.brand.length||F.brand.includes(p.b))&&(!F.q||(p.n+p.b+p.c).toLowerCase().includes(F.q.toLowerCase()))&&(F.only!=='novos'||p.new)&&(F.only!=='ofertas'||disc(p)>=25));
if(F.sort==='asc')l.sort((a,b)=>a.p-b.p);if(F.sort==='desc')l.sort((a,b)=>b.p-a.p);if(F.sort==='new')l.sort((a,b)=>b.new-a.new||b.id-a.id);
$('#ctitle').textContent=F.only==='novos'?'Lançamentos':F.only==='ofertas'?'Ofertas':F.q?'Busca: '+F.q:F.group==='roupas'?'Roupas':F.group==='calcados'?'Calçados':F.cat?CATS.find(c=>c.id===F.cat).n:'Coleção';
$('#ccount').textContent=l.length+' produtos';$('#g-cat').innerHTML=l.length?l.map(card).join(''):'<div class="empty">Nenhum produto encontrado. Ajuste os filtros ou <a class="gold" style="cursor:pointer" onclick="go(\'cat\',{})">limpe a busca</a>.</div>'}

// ===== PRODUTO =====
function openProd(id){const p=P.find(x=>x.id===id),d=disc(p);pick[id]=pick[id]||(p.s.length===1?p.s[0]:'');
$('#mProdB').innerHTML=`<button class="ib x" onclick="closeAll()" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><div class="img">${pimg(p)}</div><div class="info"><span class="par">${p.b} · ${CATS.find(c=>c.id===p.c).n}</span><h3 class="hd" style="font-size:38px">${p.n}</h3>${d?`<span class="old">${fmt(p.o)} · <b class="gold">-${d}%</b></span>`:''}<span class="pr" style="font-size:30px">${fmt(p.p)}</span><span class="par">ou ${S.parc}x de ${fmt(pmt(p.p))} com juros · ${fmt(p.p*(1-S.pix/100))} no Pix</span><p style="color:#bbb;margin:8px 0">Peça masculina com acabamento premium, caimento confortável e visual atemporal. Troca grátis em até 30 dias.</p><b style="font-size:13px">Tamanho</b><div class="szs" style="justify-content:flex-start;padding:0" id="mSz">${p.s.map(s=>`<button class="sz ${pick[id]===s?'on':''}" ${p.st[s]>0?'':'disabled'} onclick="selSize(${id},'${s}',this)">${s}</button>`).join('')}</div><button class="btn solid" style="justify-content:center;margin-top:12px" onclick="addCard(${id})">Adicionar ao carrinho</button></div>`;openMod('mProd')}
function openMod(id){closeAll(true);$('#'+id).classList.add('on');$('#ov').classList.add('on')}
function info(t,x){$('#iT').textContent=t;$('#iX').textContent=x;openMod('mInfo')}
function closeAll(keep){document.querySelectorAll('.mod,.dr').forEach(e=>e.classList.remove('on'));if(!keep)$('#ov').classList.remove('on')}

// ===== CARRINHO =====
const sub=()=>cart.reduce((a,i)=>a+P.find(p=>p.id===i.id).p*i.q,0);
const disco=()=>coupon&&coupon.t==='pct'?sub()*coupon.v:0;
const frete=()=>ship===null?0:(coupon&&coupon.t==='ship'||sub()-disco()>=S.frete)?0:ship;
const total=()=>sub()-disco()+frete();
function upd(){const n=cart.reduce((a,i)=>a+i.q,0),c=$('#cnt');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');c.textContent=n;$('#cnt2').textContent=n;renderCart()}
function openCart(){renderCart();closeAll(true);$('#dr').classList.add('on');$('#ov').classList.add('on')}
function qty(k,d){const p=P.find(x=>x.id===cart[k].id);if(d>0&&cart[k].q>=(p.st[cart[k].s]||0))return toast('Limite do estoque atingido');cart[k].q+=d;if(cart[k].q<1)cart.splice(k,1);save();upd();if($('#v-co').classList.contains('on'))renderCo()}
function chSize(k,s){const o=cart[k],m=cart.findIndex((i,j)=>j!==k&&i.id===o.id&&i.s===s);if(m>-1){cart[m].q+=o.q;cart.splice(k,1)}else o.s=s;save();upd()}
function renderCart(){$('#cb').innerHTML=cart.length?cart.map((i,k)=>{const p=P.find(x=>x.id===i.id);return `<div class="ci"><div class="img">${pimg(p)}</div><div><div style="font-size:14px">${p.n}</div><select onchange="chSize(${k},this.value)" style="padding:4px 8px;margin-top:4px;font-size:12px" aria-label="Tamanho">${p.s.map(s=>`<option ${s===i.s?'selected':''}>${s}</option>`).join('')}</select><div class="q"><button onclick="qty(${k},-1)" aria-label="Menos">−</button><span>${i.q}</span><button onclick="qty(${k},1)" aria-label="Mais">+</button></div></div><div style="text-align:right"><b>${fmt(p.p*i.q)}</b><br><button class="rm" onclick="cart.splice(${k},1);save();upd()">Remover</button></div></div>`}).join(''):'<div class="empty">Seu carrinho está vazio.<br><br><a class="btn" onclick="go(\'cat\',{})">Explorar coleção</a></div>';
$('#cf').innerHTML=cart.length?`${calcBox()}<button class="btn solid" style="justify-content:center" onclick="go('co')">Finalizar compra</button>`:''}
function calcBox(){return `<div style="display:flex;gap:8px"><input class="field" id="cep" placeholder="CEP (só números)" maxlength="9" value="${window._cep||''}"><button class="btn" onclick="calcShip($('#cep').value)">Frete</button></div>
<div style="display:flex;gap:8px"><input class="field" id="cup" placeholder="Cupom (ex.: KLZ10)"><button class="btn" onclick="applyCup($('#cup').value)">Aplicar</button></div>
<div class="par">${coupon?`Cupom ativo: <b class="gold">${coupon.d}</b> <button class="rm" onclick="coupon=null;upd()">remover</button>`:''}</div>
<div class="row"><span>Subtotal</span><span>${fmt(sub())}</span></div>${disco()?`<div class="row gold"><span>Desconto</span><span>−${fmt(disco())}</span></div>`:''}
<div class="row"><span>Frete</span><span>${ship===null?'Calcule acima':frete()?fmt(frete()):'Grátis'}</span></div><div class="row tot"><span>Total</span><span>${fmt(total())}</span></div>`}
function calcShip(c){c=(c||'').replace(/\D/g,'');if(c.length!==8)return toast('Digite um CEP com 8 dígitos');window._cep=c;const r=+c[0];ship=[24.9,19.9,21.9,29.9,34.9,39.9,44.9,49.9,54.9,59.9][r];upd();toast('Frete calculado')}
async function applyCup(c){c=(c||'').trim().toUpperCase();const k=CLOUD?await checkCoupon(c):COUPONS[c];if(!k)return toast('Cupom inválido');coupon=k;upd();if($('#v-co').classList.contains('on'))renderCo();toast('Cupom aplicado: '+coupon.d)}

// ===== CHECKOUT =====
function renderCo(){if(!cart.length){go('home');return toast('Seu carrinho está vazio')}
$('#coSum').innerHTML=`<h3>Resumo do pedido</h3>${cart.map(i=>{const p=P.find(x=>x.id===i.id);return `<div class="row" style="padding:6px 0;font-size:14px"><span>${i.q}× ${p.n} <span class="par">(${i.s})</span></span><span>${fmt(p.p*i.q)}</span></div>`}).join('')}<hr style="border:0;border-top:1px solid var(--line);margin:12px 0"><div style="display:grid;gap:10px">${calcBox()}</div>`;
$('#cb').innerHTML=$('#cb').innerHTML}
async function placeOrder(e){e.preventDefault();if(ship===null){const c=$('#coCep').value;calcShip(c);if(ship===null)return}
if(CLOUD){const form=e.target,f=new FormData(form),pg=f.get('pg'),btn=form.querySelector('button.btn');btn.disabled=true;
const {data,error}=await sb.rpc('place_order',{p_customer:{nome:f.get('nome'),email:f.get('email'),tel:f.get('tel'),cep:f.get('cep'),num:f.get('num'),end:f.get('end'),bai:f.get('bai'),cid:f.get('cid')},p_items:cart.map(i=>({id:i.id,s:i.s,q:i.q})),p_coupon:coupon&&coupon.code||null,p_payment:pg});
btn.disabled=false;
if(error){try{await loadProducts()}catch(x){}cart=cart.filter(i=>{const p=P.find(x=>x.id===i.id);return p&&(p.st[i.s]||0)>0});save();refresh();return toast(error.message||'Não foi possível concluir o pedido')}
$('#doneTx').textContent=`Pedido ${data.number} · ${fmt(+data.total)} via ${pg}. Enviamos os detalhes para ${f.get('email')}.`;
cart=[];coupon=null;ship=null;save();try{await loadProducts()}catch(x){}refresh();go('done');return}
const bad=cart.find(i=>{const p=P.find(x=>x.id===i.id);return !p||(p.st[i.s]||0)<i.q});if(bad)return toast('Estoque insuficiente. Revise o carrinho.');
const f=new FormData(e.target),n='KLZ'+Math.floor(100000+Math.random()*900000);
$('#doneTx').textContent=`Pedido ${n} · ${fmt(total()*(f.get('pg')==='Pix'?1-S.pix/100:1))} via ${f.get('pg')}. Enviamos os detalhes para ${f.get('email')}.`;
ORD.unshift({n,d:new Date().toLocaleString('pt-BR'),nome:f.get('nome'),email:f.get('email'),pg:f.get('pg'),tot:total()*(f.get('pg')==='Pix'?1-S.pix/100:1),st:'Novo',it:cart.map(i=>{const p=P.find(x=>x.id===i.id);p.st[i.s]-=i.q;return {id:i.id,n:p.n,s:i.s,q:i.q}})});persist();
cart=[];coupon=null;ship=null;save();refresh();go('done')}

// ===== HERO =====
const SL=[{t:['Seu estilo.','Sua identidade.'],p:'Roupas e calçados masculinos com qualidade, conforto e atitude.',c:'camisetas',col:'#1b1b1b',bg:'bg1',a:{}},{t:['Nova coleção.','Rua sem pressa.'],p:'Jaquetas, moletons e calças para o dia a dia da cidade.',c:'jaquetas',col:'#2a2a2a',bg:'bg2',a:{group:'roupas'}},{t:['Pisada firme.','Cada passo conta.'],p:'Tênis clássicos e lançamentos com até 50% off.',c:'tenis',col:'#141414',bg:'bg3',a:{group:'calcados'}}];
if(S.sl)SL.splice(0,SL.length,...S.sl);S.sl=SL;
let si=0,st;
function hero(){$('#hero').innerHTML=SL.map((s,i)=>`<div class="sl ${s.bg} ${i===si?'on':''}"><div class="ghost">KLZ</div><div class="wrap"><div><div class="tag">KLZ FASHION<i class="ln"></i></div><h1 class="hd"><span class="l1">${s.t[0]}</span><span class="l2 gold">${s.t[1]}</span></h1><p>${s.p}</p><a class="btn" onclick='go("cat",${JSON.stringify(s.a)})'>${s.b||'Explorar coleção'} <svg class="ic" viewBox="0 0 24 24" style="width:16px;height:16px"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a></div>${s.img?`<svg class="big" viewBox="0 0 200 200"><image href="${s.img}" width="200" height="200" preserveAspectRatio="xMidYMid meet"/></svg>`:art(s.c,s.col).replace('<svg','<svg class="big"')}</div></div>`).join('')+`<button class="arr" style="left:14px" onclick="slide(-1)" aria-label="Anterior"><svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><button class="arr" style="right:14px" onclick="slide(1)" aria-label="Próximo"><svg class="ic" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button><div class="dots">${SL.map((_,i)=>`<i class="${i===si?'on':''}" onclick="si=${i};hero()"></i>`).join('')}</div>`;clearInterval(st);st=setInterval(()=>slide(1),6000)}
function slide(d){si=(si+d+SL.length)%SL.length;hero()}

// ===== INIT =====
$('#cats').innerHTML=CATS.map(c=>`<div class="cat" role="button" tabindex="0" onclick="go('cat',{cat:'${c.id}'})" onkeydown="if(event.key==='Enter')this.click()">${art(c.id,{camisetas:'#1d1d1d',calcas:'#1a1a1a',jaquetas:'#202020',tenis:'#111',acessorios:'#1a1a1a'}[c.id]).replace('<svg','<svg class="p"')}<span>${c.n}</span></div>`).join('');
$('#g-dest').innerHTML=P.slice(0,4).map(card).join('');$('#g-new').innerHTML=P.filter(p=>p.new).slice(0,4).map(card).join('');
$('#pshoe').innerHTML=art('tenis','#111');$('#pshoe2').innerHTML=art('tenis','#e9e9e9');
$('#pshoe').removeAttribute('role');
if(!CLOUD)cart=cart.filter(i=>{const p=P.find(x=>x.id===i.id);return p&&(p.st[i.s]||0)>0});applySettings();hero();upd();
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAll()});
const _go=go;go=function(v,f){if(v==='admin'&&!adm)return openMod('mAdmLogin');_go(v,f);if(v==='admin')renderAdmin();const a=document.querySelector('nav a.on');document.querySelectorAll('.bn [data-n]').forEach(b=>b.classList.toggle('on',!!a&&b.dataset.n===a.dataset.n))};
document.querySelector('.bn [data-n=home]').classList.add('on');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
function reveal(){document.querySelectorAll('.pc,.cat,.sec,.promo').forEach(e=>{if(!e.dataset.r){e.dataset.r=1;e.classList.add('rv');e.style.setProperty('--d',([...e.parentNode.children].indexOf(e)%4)*70+'ms');io.observe(e)}})}
new MutationObserver(()=>{clearTimeout(reveal._t);reveal._t=setTimeout(reveal,20)}).observe(document.querySelector('main'),{childList:true,subtree:true});reveal();

// ===== ADMIN =====
let adm=false,AT='prod';try{adm=!CLOUD&&sessionStorage.getItem('klzadm')==='1'}catch(e){}
const AH='b2ae5be0670b46e428d48f023ec05d7199bb4be20a38e69307bf7974d530eaaa';
const H=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');
async function admLogin(e){e.preventDefault();const f=e.target;let h='';try{h=await H(f.em.value.trim().toLowerCase()+':'+f.pw.value)}catch(x){}if(h!==AH)return toast('E-mail ou senha incorretos');adm=true;try{sessionStorage.setItem('klzadm','1')}catch(x){}f.reset();closeAll();go('admin')}
function logout(){adm=false;try{sessionStorage.removeItem('klzadm')}catch(x){}go('home')}
function refresh(){$('#g-dest').innerHTML=P.slice(0,4).map(card).join('');$('#g-new').innerHTML=P.filter(p=>p.new).slice(0,4).map(card).join('');if($('#v-cat').classList.contains('on'))renderCat();upd()}
function applySettings(){const t=[`Frete grátis acima de ${fmt(S.frete)}`,`Parcele em até ${S.parc}x no cartão`,'Compra segura'];document.querySelectorAll('.trk span').forEach((e,i)=>e.textContent=t[i%3]);$('#fTel').textContent=S.tel;$('#fEm').textContent=S.email;$('#fHr').textContent=S.hor;fsoc()}
function cf(b,fn){if(b.dataset.c)return fn();b.dataset.c=1;b.textContent='Confirmar?';setTimeout(()=>{delete b.dataset.c;b.textContent='Excluir'},3000)}
function renderAdmin(){if(!adm)return;$('#atabs').innerHTML=[['prod','Produtos'],['est','Estoque'],['ped','Pedidos'],['cfg','Loja'],['ban','Banners'],['soc','Redes']].map(([k,n])=>`<button class="sz ${AT===k?'on':''}" style="height:36px;padding:0 16px;font-size:13px" onclick="AT='${k}';renderAdmin()">${n}${k==='ped'?` (${ORD.length})`:''}</button>`).join('');$('#abody').innerHTML=({prod:aProd,est:aEst,ped:aPed,cfg:aCfg,ban:aBan,soc:aSoc})[AT]()}
const aProd=()=>`<div class="bar"><span class="par">${P.length} produtos</span><button class="btn solid" onclick="pform()">+ Novo produto</button></div>`+P.map(p=>`<div class="ar"><div class="img" style="width:56px;flex:none;cursor:default">${pimg(p)}</div><div style="flex:1;min-width:140px"><b>${esc(p.n)}</b><div class="par">${esc(p.b)} · ${p.c} · ${fmt(p.p)}${p.o>p.p?` (de ${fmt(p.o)})`:''}${p.new?' · Novo':''}</div></div><span class="${tot(p)<=3?'gold':''}">${tot(p)} un.</span><button class="btn" style="padding:7px 14px" onclick="pform(${p.id})">Editar</button><button class="btn" style="padding:7px 14px;border-color:#a33" onclick="cf(this,()=>delP(${p.id}))">Excluir</button></div>`).join('');
const aEst=()=>{const u=P.reduce((a,p)=>a+tot(p),0),z=P.filter(p=>!tot(p)).length,l=P.filter(p=>tot(p)>0&&tot(p)<=5).length;return `<div class="kp"><div><b>${u}</b><span>unidades</span></div><div><b>${z}</b><span>esgotados</span></div><div><b>${l}</b><span>estoque baixo</span></div></div>`+P.map(p=>`<div class="ar"><b style="flex:1;min-width:150px">${esc(p.n)}</b>${p.s.map(s=>`<label class="par" style="text-align:center">${s}<br><input type="number" min="0" class="field" style="width:64px;padding:6px" value="${p.st[s]||0}" onchange="setSt(${p.id},'${s}',this.value)"></label>`).join('')}</div>`).join('')};
async function setSt(id,s,v){const p=P.find(p=>p.id===id);p.st[s]=Math.max(0,parseInt(v)||0);if(CLOUD){try{await must(sb.from('products').update({stock:p.st}).eq('id',id))}catch(e){toast(e.message||'Erro ao salvar estoque');try{await loadProducts()}catch(x){}refresh();renderAdmin();return}}else persist();refresh();renderAdmin();toast('Estoque atualizado')}
const aPed=()=>ORD.length?ORD.map((o,i)=>`<div class="ar" style="align-items:flex-start"><div style="flex:1;min-width:200px"><b>${o.n}</b> <span class="par">${o.d}</span><div class="par">${esc(o.nome)} · ${esc(o.email)} · ${o.pg}</div><div style="font-size:13px">${o.it.map(x=>`${x.q}× ${esc(x.n)} (${x.s})`).join('<br>')}</div></div><b>${fmt(o.tot)}</b><select onchange="setOS(${i},this.value)">${['Novo','Pago','Enviado','Entregue','Cancelado'].map(s=>`<option ${o.st===s?'selected':''}>${s}</option>`).join('')}</select><button class="rm" onclick="cf(this,()=>delOrd(${i}))">Excluir</button></div>`).join(''):'<div class="empty">Nenhum pedido ainda.</div>';
async function setOS(i,v){const o=ORD[i],was=o.st==='Cancelado';if(CLOUD){const {error}=await sb.rpc('set_order_status',{p_id:o.id,p_status:v});if(error){toast(error.message);return renderAdmin()}await Promise.all([loadProducts(),loadOrders()]);refresh();renderAdmin();return toast(v==='Cancelado'&&!was?'Pedido cancelado e estoque devolvido':'Status atualizado')}
const d=(v==='Cancelado')-(was?1:0);o.it.forEach(x=>{const p=P.find(p=>p.id===x.id);if(p&&d)p.st[x.s]=Math.max(0,(p.st[x.s]||0)+d*x.q)});o.st=v;persist();refresh();renderAdmin();toast(d>0?'Pedido cancelado e estoque devolvido':'Status atualizado')}
const aCfg=()=>`<form class="box" onsubmit="saveCfg(event)"><h3>Informações da loja</h3><div class="f2"><input class="field" name="tel" value="${esc(S.tel)}" placeholder="Telefone"><input class="field" name="email" value="${esc(S.email)}" placeholder="E-mail"><input class="field full" name="hor" value="${esc(S.hor)}" placeholder="Horário"><label class="par">Frete grátis a partir de (R$)<input class="field" type="number" min="0" name="frete" value="${S.frete}"></label><label class="par">Máximo de parcelas<input class="field" type="number" min="1" max="12" name="parc" value="${S.parc}"></label><label class="par">Juros ao mês (%)<input class="field" type="number" step="0.01" min="0" name="jur" value="${S.jur}"></label><label class="par">Desconto no Pix (%)<input class="field" type="number" min="0" max="50" name="pix" value="${S.pix}"></label></div><button class="btn solid" style="margin-top:14px">Salvar informações</button></form><div class="box"><h3>Cupons</h3>${Object.entries(COUPONS).map(([k,c])=>`<div class="row" style="padding:6px 0"><span><b>${esc(k)}</b> · ${c.d}</span><button class="rm" onclick="delCup('${k}')">Excluir</button></div>`).join('')}<form class="f2" style="margin-top:12px" onsubmit="addC(event)"><input class="field" name="k" required placeholder="Código"><select name="t" style="width:100%"><option value="pct">% de desconto</option><option value="ship">Frete grátis</option></select><input class="field" name="v" type="number" min="1" max="90" placeholder="% (se desconto)"><button class="btn">Adicionar cupom</button></form></div>`;
function saveCfg(e){e.preventDefault();const f=new FormData(e.target);S.tel=f.get('tel');S.email=f.get('email');S.hor=f.get('hor');S.frete=+f.get('frete')||0;S.parc=Math.min(12,Math.max(1,+f.get('parc')||1));S.pix=Math.min(50,Math.max(0,+f.get('pix')||0));S.jur=Math.max(0,+f.get('jur')||0);persist();applySettings();refresh();toast('Informações salvas')}
function addC(e){e.preventDefault();const f=new FormData(e.target),k=f.get('k').trim().toUpperCase().replace(/\W/g,''),t=f.get('t'),v=(+f.get('v')||0)/100;if(!k||(t==='pct'&&!v))return toast('Informe código e porcentagem');COUPONS[k]=t==='ship'?{t,v:0,d:'Frete grátis'}:{t,v,d:Math.round(v*100)+'% off'};CLOUD?saveCoupon(k,COUPONS[k]):persist();renderAdmin();toast('Cupom criado')}
function pform(id){const p=id?P.find(x=>x.id===id):{n:'',b:'',c:'camisetas',p:'',o:'',new:0,col:'#1b1b1b',st:{}};window._pst=p.st;$('#mPFB').innerHTML=`<button class="ib x" onclick="closeAll()" aria-label="Fechar"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button><h3 class="hd">${id?'Editar':'Novo'} produto</h3><form onsubmit="saveP(event,${id||0})"><input class="field" name="n" required placeholder="Nome" value="${esc(p.n)}" style="margin-bottom:10px"><div class="f2"><input class="field" name="b" required placeholder="Marca" value="${esc(p.b)}"><select name="c" style="width:100%" onchange="pszs(this.value)">${CATS.map(c=>`<option value="${c.id}" ${p.c===c.id?'selected':''}>${c.n}</option>`).join('')}</select><input class="field" name="p" type="number" step="0.01" min="0" required placeholder="Preço (R$)" value="${p.p}"><input class="field" name="o" type="number" step="0.01" min="0" placeholder="Preço original" value="${p.o||''}"></div><div class="par" style="margin:10px 0 6px">Estoque por tamanho</div><div id="pszs" class="chips"></div><label style="display:flex;gap:8px;margin:12px 0"><input type="checkbox" name="new" ${p.new?'checked':''}> Marcar como lançamento</label><div class="f2"><label class="par">Cor da ilustração<input class="field" type="color" name="col" value="${p.col}" style="padding:2px;height:40px"></label><label class="par">Foto (opcional)<input class="field" type="file" name="img" accept="image/*"></label></div><button class="btn solid" style="width:100%;justify-content:center;margin-top:14px">Salvar produto</button></form>`;pszs(p.c);openMod('mPForm')}
function pszs(c){$('#pszs').innerHTML=SZ[c].map(s=>`<label class="par" style="text-align:center">${s}<br><input class="field" type="number" min="0" name="st_${s}" value="${window._pst[s]??0}" style="width:64px;padding:6px"></label>`).join('')}
const rs=(f,m=600)=>new Promise(r=>{const fr=new FileReader;fr.onload=()=>{const i=new Image;i.onload=()=>{const k=Math.min(1,m/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.75))};i.src=fr.result};fr.readAsDataURL(f)});
async function saveP(e,id){e.preventDefault();const fd=new FormData(e.target),c=fd.get('c'),st={};SZ[c].forEach(s=>st[s]=Math.max(0,parseInt(fd.get('st_'+s))||0));const pr=+fd.get('p'),o=+fd.get('o')||pr,old=id?P.find(x=>x.id===id):null;const d={id:id||Math.max(0,...P.map(x=>x.id))+1,n:fd.get('n').trim(),b:fd.get('b').trim(),c,p:pr,o:Math.max(o,pr),s:SZ[c],st,new:fd.get('new')?1:0,col:fd.get('col'),img:old&&old.img};const file=fd.get('img');try{if(file&&file.size)d.img=await uploadImg(await rs(file),'produtos');if(CLOUD){const row=pToRow(d);if(id)await must(sb.from('products').update(row).eq('id',id));else{const r=await must(sb.from('products').insert(row));d.id=r[0].id}}}catch(err){return toast('Erro ao salvar: '+(err.message||err))}if(id)P[P.findIndex(x=>x.id===id)]=d;else P.unshift(d);cart=cart.filter(i=>{const p=P.find(x=>x.id===i.id);return p&&p.s.includes(i.s)&&(p.st[i.s]||0)>0});cart.forEach(i=>{i.q=Math.min(i.q,P.find(x=>x.id===i.id).st[i.s])});if(!CLOUD)persist();save();refresh();closeAll();renderAdmin();toast('Produto salvo')}
async function delP(id){if(CLOUD){try{await must(sb.from('products').delete().eq('id',id))}catch(e){return toast(e.message||'Erro ao excluir')}}P.splice(P.findIndex(x=>x.id===id),1);cart=cart.filter(i=>i.id!==id);if(!CLOUD)persist();save();refresh();renderAdmin();toast('Produto excluído')}

// ===== v3: login oculto, banners, redes =====
function setAdm(v){adm=v;try{v?sessionStorage.setItem('klzadm','1'):sessionStorage.removeItem('klzadm')}catch(x){}document.body.classList.toggle('isadm',v)}
async function userLogin(e){e.preventDefault();const f=e.target;
if(CLOUD){const em=f[0].value.trim(),pw=f[1].value;const {error}=await sb.auth.signInWithPassword({email:em,password:pw});if(error){const m=error.message||'';return toast(/invalid login/i.test(m)?'E-mail ou senha incorretos, ou o usuário ainda não existe no Supabase':/not confirmed/i.test(m)?'E-mail não confirmado. No Supabase, confirme o usuário (Auto Confirm)':/fetch|network/i.test(m)?'Não foi possível conectar ao Supabase. Confira a URL e a chave em js/config.js':'Erro ao entrar: '+m)}f.reset();closeAll();if(await checkAdmin())return go('admin');return toast('Bem-vindo à KLZ!')}
let h='';try{h=await H(f[0].value.trim().toLowerCase()+':'+f[1].value)}catch(x){}f.reset();closeAll();if(h===AH){setAdm(true);go('admin')}else toast('Bem-vindo à KLZ!')}
function logout(){if(CLOUD)sb.auth.signOut();setAdm(false);go('home')}
setAdm(adm);
function sico(n){n=String(n).toLowerCase();const p=n.includes('insta')?'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>':n.includes('tiktok')?'<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 3 2.2 4.5 5 4.8"/>':n.includes('youtube')?'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor"/>':n.includes('face')?'<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z"/>':n.includes('whats')?'<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9c0 3 3 6 6 6l1-2-2-1-1 .8c-1-.5-1.8-1.3-2.3-2.3L11 10l-1-2z"/>':(n==='x'||n.includes('twitter'))?'<path d="M4 4l16 16M20 4L4 20"/>':'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>';return `<svg class="ic" viewBox="0 0 24 24">${p}</svg>`}
function fsoc(){$('#fSoc').innerHTML=S.soc.map(x=>{const u=/^https?:\/\//i.test(x.u)?x.u:'#';return `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(x.n)}" title="${esc(x.n)}">${sico(x.n)}</a>`}).join('')}
const aSoc=()=>`<div class="box"><h3>Redes sociais</h3>${S.soc.map((x,i)=>`<div class="ar"><span style="width:28px">${sico(x.n)}</span><input class="field" style="flex:1;min-width:110px;width:auto" value="${esc(x.n)}" onchange="S.soc[${i}].n=this.value;persist();fsoc();renderAdmin()"><input class="field" style="flex:2;min-width:160px;width:auto" value="${esc(x.u)}" placeholder="https://" onchange="S.soc[${i}].u=this.value;persist();fsoc();toast('Rede atualizada')"><button class="rm" onclick="S.soc.splice(${i},1);persist();fsoc();renderAdmin()">Remover</button></div>`).join('')}<form class="f2" style="margin-top:12px" onsubmit="addSoc(event)"><input class="field" name="n" required placeholder="Nome (ex.: Facebook, WhatsApp)"><input class="field" name="u" required placeholder="Link (https://...)"><button class="btn full">Adicionar rede</button></form></div>`;
function addSoc(e){e.preventDefault();const f=new FormData(e.target);let u=f.get('u').trim();if(!/^https?:\/\//i.test(u))u='https://'+u;S.soc.push({n:f.get('n').trim(),u});persist();fsoc();renderAdmin();toast('Rede adicionada')}
const DST={all:{},roupas:{group:'roupas'},calcados:{group:'calcados'},novos:{only:'novos',sort:'new'},ofertas:{only:'ofertas',sort:'asc'}};
const dst=s=>Object.keys(DST).find(k=>JSON.stringify(DST[k])===JSON.stringify(s.a))||'all';
const aBan=()=>`<div class="bar"><span class="par">${SL.length} slides do banner</span><button class="btn solid" onclick="addSl()">+ Novo slide</button></div>`+SL.map((s,i)=>`<div class="box"><div class="bar" style="margin-bottom:10px"><b>Slide ${i+1}</b><button class="rm" onclick="cf(this,()=>delSl(${i}))">Excluir</button></div><div class="f2"><input class="field" value="${esc(s.t[0])}" placeholder="Linha 1 do título" onchange="setSl(${i},'t0',this.value)"><input class="field" value="${esc(s.t[1])}" placeholder="Linha 2 (dourada)" onchange="setSl(${i},'t1',this.value)"><input class="field full" value="${esc(s.p)}" placeholder="Texto de apoio" onchange="setSl(${i},'p',this.value)"><input class="field" value="${esc(s.b||'')}" placeholder="Texto do botão" onchange="setSl(${i},'b',this.value)"><select style="width:100%" onchange="setSl(${i},'a',this.value)">${[['all','Toda a coleção'],['roupas','Roupas'],['calcados','Calçados'],['novos','Lançamentos'],['ofertas','Ofertas']].map(([k,n])=>`<option value="${k}" ${dst(s)===k?'selected':''}>Botão abre: ${n}</option>`).join('')}</select><select style="width:100%" onchange="setSl(${i},'bg',this.value)">${[['bg1','Fundo grafite'],['bg2','Fundo dourado'],['bg3','Fundo azulado']].map(([k,n])=>`<option value="${k}" ${s.bg===k?'selected':''}>${n}</option>`).join('')}</select><select style="width:100%" onchange="setSl(${i},'c',this.value)">${CATS.map(c=>`<option value="${c.id}" ${s.c===c.id?'selected':''}>Arte: ${c.n}</option>`).join('')}</select><input class="field" type="color" value="${s.col}" style="height:42px;padding:2px" onchange="setSl(${i},'col',this.value)"><label class="par full">Foto do banner (substitui a arte)<input class="field" type="file" accept="image/*" onchange="slImg(${i},this.files[0])"></label>${s.img?`<button class="rm" onclick="setSl(${i},'img','')">Remover foto</button>`:''}</div></div>`).join('');
function setSl(i,k,v){const s=SL[i];if(k==='t0')s.t[0]=v;else if(k==='t1')s.t[1]=v;else if(k==='a')s.a=DST[v];else s[k]=v;S.sl=SL;persist();si=i;hero();if(k==='img')renderAdmin();toast('Banner atualizado')}
async function slImg(i,f){if(f){try{setSl(i,'img',await uploadImg(await rs(f,900),'banners'))}catch(e){toast('Erro no upload: '+(e.message||e))}}}
function addSl(){SL.push({t:['Novo título.','Segunda linha.'],p:'Texto de apoio',b:'Explorar coleção',c:'camisetas',col:'#1b1b1b',bg:'bg1',a:{}});S.sl=SL;persist();si=SL.length-1;hero();renderAdmin()}
function delSl(i){if(SL.length<2)return toast('Mantenha ao menos um slide');SL.splice(i,1);S.sl=SL;persist();si=0;hero();renderAdmin()}

// ===== Conta do cliente: cadastro / entrar / sair =====
let lgSignup=false;
function lgMode(force){lgSignup=force===undefined?!lgSignup:force;$('#lgForm').style.display=lgSignup?'none':'';$('#suForm').style.display=lgSignup?'':'none';$('#lgT').textContent=lgSignup?'Criar conta':'Entrar';$('#lgSw').textContent=lgSignup?'Já tem conta? Entrar':'Não tem conta? Cadastre-se'}
async function openAccount(){if(adm)return go('admin');let u=null;if(CLOUD){const {data}=await sb.auth.getSession();u=data.session&&data.session.user}
$('#lgAcc').style.display=u?'':'none';$('#lgSwP').style.display=u?'none':'';
if(u){$('#lgEm').textContent='Conectado como '+u.email;$('#lgForm').style.display='none';$('#suForm').style.display='none';$('#lgT').textContent='Minha conta'}else lgMode(false);openMod('mLogin')}
async function custLogout(){if(CLOUD)await sb.auth.signOut();setAdm(false);closeAll();toast('Você saiu da conta')}
async function userSignup(e){e.preventDefault();const f=e.target,nome=f.nome.value.trim(),em=f.email.value.trim(),pw=f.pw.value;
if(!CLOUD)return toast('O cadastro funciona quando o Supabase estiver configurado');
if(pw.length<8)return toast('A senha deve ter pelo menos 8 caracteres');
if(pw!==f.pw2.value)return toast('As senhas não conferem');
const {data,error}=await sb.auth.signUp({email:em,password:pw,options:{data:{nome},emailRedirectTo:location.origin+location.pathname}});
if(error){const m=error.message||'';return toast(/already|registered/i.test(m)?'Este e-mail já está cadastrado':/rate|too many/i.test(m)?'Muitas tentativas. Tente de novo em alguns minutos':'Erro ao cadastrar: '+m)}
f.reset();closeAll();toast(data.session?'Conta criada! Bem-vindo à KLZ':'Conta criada! Confirme seu e-mail para entrar')}

// ===== Supabase: carrega os dados reais =====
if(CLOUD)cloudBoot();
