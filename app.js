const CATS=()=>[["Tudo",D.ae||"🛍️"],...D.cats];
const DESC="Produto novo, lacrado, com nota fiscal e garantia de 12 meses.\nEnvio rápido para todo o Brasil.";
const SEED=[["Fone Bluetooth sem fio com cancelamento de ruído","Celulares","🎧",249.9,24],["Smartphone 128GB 6GB RAM Tela 6.7\"","Celulares","📱",1599,19],["Notebook 15.6\" Intel i5 8GB 256GB SSD","Informática","💻",3499,17],["Kit Botão Reset Power Painel PC","Informática","🔘",61.8,9],["Cadeira Gamer Ergonômica Reclinável","Games","🪑",899.9,24],["Sofá Retrátil 3 Lugares Cinza","Casa","🛋️",1899,23],["Tênis Esportivo Masculino Running","Moda","👟",229.9,30],["Perfume Feminino 100ml Eau de Parfum","Beleza","🧴",159.9,25],["Controle sem fio para Console","Games","🎮",319,22],["Câmera de Segurança Wi-Fi 1080p","Casa","📷",139.9,29]];
let D={};try{D=JSON.parse(localStorage.getItem("ml5"))||{}}catch(e){}
D.p=D.p||SEED.map((s,i)=>({id:i+1,n:s[0],c:s[1],e:s[2],o:s[3],d:s[4],desc:DESC,imgs:[]}));D.logo=D.logo||null;D.cats=D.cats||[["Celulares","📱"],["Informática","💻"],["Casa","🛋️"],["Moda","👕"],["Beleza","💄"],["Veículos","🚗"],["Games","🎮"]];D.color=D.color||null;D.cart=D.cart||[];D.users=D.users||[];D.orders=D.orders||[];D.me=D.me||null;D.rev=D.rev||{};D.pix=D.pix??5;D.fs=D.fs??79;D.fee=D.fee??19.9;D.brand=D.brand||"Minha Loja";D.p.forEach(p=>{if(p.st==null)p.st=10});D.cart.forEach(c=>{c.k=c.k||c.id+"||"});D.ct=D.ct||{wa:"",waImg:null,ig:"",igImg:null};D.b=D.b||[null,null,null];
const save=()=>{try{localStorage.setItem("ml5",JSON.stringify(D))}catch(e){toast("Sem espaço para salvar: use imagens menores")}};
const S={cat:"Tudo",q:"",favs:new Set(),cart:0,onlyFavs:false};let NI=[];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const brl=v=>{const [i,d]=v.toFixed(2).split(".");return [i.replace(/\B(?=(\d{3})+(?!\d))/g,"."),d]};
const fin=p=>p.o*(1-p.d/100),fm=v=>brl(v).join(","),inst=f=>f>=1000?12:f>=300?10:0;
const pixV=v=>v*(1-D.pix/100),shipF=u=>u>=D.fs?0:D.fee,avg=id=>{const r=D.rev[id]||[];return r.length?r.reduce((a,x)=>a+x.s,0)/r.length:0},starS=n=>"★".repeat(Math.round(n))+"☆".repeat(5-Math.round(n));let RS=5;
const pic=(p,i=0)=>p.imgs[i]?`<img src="${p.imgs[i]}" alt="">`:p.e;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("on"),2000)}
function rd(f,max=900){return new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);r(c.toDataURL("image/jpeg",.8))};im.src=fr.result};fr.readAsDataURL(f)})}

function renderCats(){
  $("#cats").innerHTML=CATS().map(([n,e])=>`<button class="cat ${n===S.cat?"on":""}" data-c="${n}"><span class="c">${e}</span>${n}</button>`).join("");
}
function renderGrid(){
  const q=S.q.trim().toLowerCase();
  const list=D.p.filter(p=>(S.cat==="Tudo"||p.c===S.cat)&&(!q||p.n.toLowerCase().includes(q))&&(!S.onlyFavs||S.favs.has(p.id)));
  $("#ttl").textContent=S.onlyFavs?"Seus favoritos":q?`Resultados para “${S.q}”`:"Produtos recomendados para você";
  $("#grid").innerHTML=list.length?list.map((p,k)=>{
    const f=fin(p),[a,b]=brl(f),x=inst(f);
    return `<article class="p" data-o="${p.id}"><div class="img">${pic(p)}</div>
    <button class="fav" data-f="${p.id}" aria-label="Favoritar">${S.favs.has(p.id)?"♥":"♡"}</button>
    <div class="pb">${k%3===0?'<span class="tag">MAIS VENDIDO</span>':""}
    <div class="nm">${esc(p.n)}</div>
    ${p.d?`<div class="old">R$ ${fm(p.o)}</div>`:""}
    <div class="pr"><span>R$ ${a}<sup>${b}</sup></span>${p.d?`<span class="off">${p.d}% OFF</span>`:""}</div>
    ${x?`<div class="inst">em ${x}x R$ ${fm(f/x)} sem juros</div>`:""}
    ${D.pix?`<div class="pixl">R$ ${fm(pixV(f))} no Pix</div>`:""}${avg(p.id)?`<div class="cstar">${starS(avg(p.id))} <span class="meta">(${D.rev[p.id].length})</span></div>`:""}<div class="meta">${stK(p)}</div>${f>=D.fs?`<div class="ship">Frete grátis ⚡ FULL</div>`:`<div class="meta">Frete grátis acima de R$ ${fm(D.fs)}</div>`}
    <button class="add" data-a="${p.id}" ${p.st<1?"disabled":""}>Adicionar ao carrinho</button></div></article>`}).join(""):`<div class="empty">Nenhum produto encontrado.<br>Tente outra palavra ou categoria.</div>`;
  $("#favN").textContent=S.favs.size||"";
}
function openP(id,keep){if(!keep){RS=5;RM=[];SZ="";CL=""}
  const p=D.p.find(x=>x.id===id);if(!p)return;const f=fin(p),[a,b]=brl(f),x=inst(f),n=Math.max(p.imgs.length,1);
  $("#pd").innerHTML=`<div class="dh"><button class="bk" data-x="pd" aria-label="Voltar">‹</button><div class="search">Buscar no ${esc(D.brand)}</div><button class="hb" data-cart aria-label="Carrinho"><svg class="ico" viewBox="0 0 24 24"><path d="M2 3h3l3 12h11l2-8H7"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg></button></div>
  <div class="gal"><div class="gsl" id="gsl">${Array.from({length:n},(_,i)=>`<div class="gs">${pic(p,i)}</div>`).join("")}</div><span class="cnt" id="cnt">1/${n}</span><button class="fav" data-f="${p.id}">${S.favs.has(p.id)?"♥":"♡"}</button></div>
  <div class="db"><div class="meta">Novo | +50 vendidos</div><h1>${esc(p.n)}</h1><div class="stars">${avg(p.id)?`${starS(avg(p.id))} <span>${avg(p.id).toFixed(1).replace(".",",")} (${D.rev[p.id].length} ${D.rev[p.id].length>1?"avaliações":"avaliação"})</span>`:`<span>Sem avaliações ainda</span>`}</div>
  ${p.d?`<div class="old">R$ ${fm(p.o)}</div>`:""}
  <div class="big"><span>R$ ${a}<sup>${b}</sup></span>${p.d?`<span class="off">${p.d}% OFF</span>`:""}</div>
  ${x?`<div class="inst">em ${x}x R$ ${fm(f/x)} sem juros</div>`:""}
  ${D.pix?`<div class="pixl"><b>R$ ${fm(pixV(f))}</b> no Pix (${D.pix}% OFF)</div>`:""}<div class="ship2">${f>=D.fs?"<b>Frete Grátis</b>":`Frete a partir de R$ ${fm(D.fee)}<br><small>Frete grátis em compras acima de R$ ${fm(D.fs)}</small>`}</div>
  ${lst(p.sz).length?`<div class="meta">Tamanho</div><div class="chips">${lst(p.sz).map(x=>`<button class="chip${SZ===x?" on":""}" data-sz="${esc(x)}">${esc(x)}</button>`).join("")}</div>`:""}${lst(p.cl).length?`<div class="meta">Cor</div><div class="chips">${lst(p.cl).map(x=>`<button class="chip${CL===x?" on":""}" data-cl="${esc(x)}">${esc(x)}</button>`).join("")}</div>`:""}<div class="stock"><b>${stK(p)}</b></div>
  <button class="buy" data-buy="${p.id}" ${p.st<1?"disabled":""}>Comprar agora</button><button class="add2" data-a="${p.id}" ${p.st<1?"disabled":""}>Adicionar ao carrinho</button>
  <h3>Descrição</h3><p class="desc">${esc(p.desc||"Sem descrição.")}</p>${REV(p)}</div>`;
  $("#pd").classList.add("on");if(!keep)$("#pd").scrollTop=0;
  const g=$("#gsl");g.onscroll=()=>{$("#cnt").textContent=(Math.round(g.scrollLeft/g.clientWidth)+1)+"/"+n};clearInterval(GI);if(n>1){GI=setInterval(()=>{if(!$("#pd").classList.contains("on"))return clearInterval(GI);const i=Math.round(g.scrollLeft/g.clientWidth);g.scrollTo({left:((i+1)%n)*g.clientWidth,behavior:"smooth"})},3000);g.addEventListener("touchstart",()=>clearInterval(GI),{passive:true})}
}
function openAd(){
  const bl=[0,1,2].map(i=>`<div class="row"><label style="flex:1">Banner ${i+1}${D.b[i]?" (personalizado)":""}<input type="file" accept="image/*" data-bn="${i}"></label>${D.b[i]?`<button class="sm" data-rb="${i}">Restaurar</button>`:""}</div>`).join("");
  $("#ad").innerHTML=`<div class="dh"><button class="bk" data-x="ad" aria-label="Voltar">‹</button><b>Painel Admin</b></div><div class="ab"><div class="row" style="margin-bottom:10px">${[["loja","Loja"],["ped",`Compras em aberto (${D.orders.filter(x=>x.s==="aberto").length})`]].map(([k,l])=>`<button class="sm${AT===k?" on":""}" data-at="${k}">${l}</button>`).join("")}</div>${AT==="ped"?ORD():""}<div ${AT==="ped"?"hidden":""}>
  <section><h2>Categorias</h2><div class="li"><input value="${esc(CATS()[0][1])}" data-ae style="max-width:56px;text-align:center"><span>Tudo (todas as categorias)</span></div>${D.cats.map((c,i)=>`<div class="li"><input value="${esc(c[1])}" data-ce="${i}" style="max-width:56px;text-align:center"><input value="${esc(c[0])}" data-cn="${i}"><button class="sm del" data-dc="${i}">Excluir</button></div>`).join("")}<div class="row"><input id="ce" placeholder="Emoji" style="max-width:80px"><input id="cn" placeholder="Nome da categoria"></div><button class="sm" data-ac>Adicionar categoria</button></section>
  <section><h2>Configurações da loja</h2><label>Nome do aplicativo (aparece na busca)<input id="brd" value="${esc(D.brand)}"></label><label>Desconto no Pix (%)<input id="pixd" type="number" min="0" max="50" value="${D.pix}" inputmode="decimal"></label><label>Frete grátis a partir de (R$)<input id="fsv" type="number" min="0" step="0.01" value="${D.fs}" inputmode="decimal"></label><label>Valor do frete abaixo disso (R$)<input id="fee" type="number" min="0" step="0.01" value="${D.fee}" inputmode="decimal"></label></section>
  <section><h2>Contato com o vendedor</h2><label>Link do WhatsApp<input id="cwa" type="url" value="${esc(D.ct.wa||"")}" placeholder="https://wa.me/5538999999999"></label><label>Link do Instagram<input id="cig" type="url" value="${esc(D.ct.ig||"")}" placeholder="https://instagram.com/seuusuario"></label></section>
  <section><h2>Cor do cabeçalho</h2><div class="row"><input type="color" id="clr" value="${D.color||"#FFE600"}" style="width:70px;height:44px;padding:2px"><button class="sm" data-rc>Restaurar amarelo</button></div></section>
  <section><h2>Logotipo (imagem de todo o cabeçalho)</h2><div class="row">${D.logo?`<img class="prev" src="${D.logo}" alt="">`:""}<label style="flex:1">Nova imagem<input type="file" accept="image/*" id="lg"></label>${D.logo?`<button class="sm" data-rl>Restaurar</button>`:""}</div></section>
  <section><h2>Banners do carrossel</h2>${bl}</section>
  ${PF()}
  <section><h2>Produtos (${D.p.length})</h2>${D.p.map(p=>`<div class="li"><div class="t">${pic(p)}</div><span>${esc(p.n)}<br><b>R$ ${fm(fin(p))}</b><br>${stK(p)}</span><button class="sm" data-ed="${p.id}">Editar</button><button class="sm del" data-del="${p.id}">Excluir</button></div>`).join("")}</section></div></div>`;
  $("#ad").classList.add("on");
}
function setLogo(){const h=$("header");h.style.backgroundImage=D.logo?`url(${D.logo})`:"";h.classList.toggle("img",!!D.logo)}
function renderB(){[...sl.children].forEach((s,i)=>{const u=D.b[i];s.style.backgroundImage=u?`url(${u})`:"";s.classList.toggle("ib",!!u)})}
function setCat(c){S.cat=c;S.onlyFavs=false;setNav("home");renderCats();renderGrid()}
function setNav(t){document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on",b.dataset.t===t))}

document.addEventListener("click",e=>{
  const T=e.target,g=k=>T.closest(`[data-${k}]`);let m;
  if(m=g("x"))return $("#"+m.dataset.x).classList.remove("on");
  if(g("adm")){openSheet(false);if(isAdmin())return openAd();AFTER=()=>isAdmin()?openAd():toast("Esta conta não é de administrador");return openAu("Acesso restrito: entre com a conta do administrador")}
  if(m=g("c"))return setCat(m.dataset.c);
  if(m=g("f")){const i=+m.dataset.f;S.favs.has(i)?S.favs.delete(i):(S.favs.add(i),toast("Adicionado aos favoritos"));m.textContent=S.favs.has(i)?"♥":"♡";return renderGrid()}
  if(m=g("a")){const p=D.p.find(x=>x.id==m.dataset.a),inD=!!m.closest("#pd");if(!inD&&(lst(p.sz).length||lst(p.cl).length))return openP(p.id);if(inD){const w=opt(p);if(w)return toast(w)}if(addCart(p.id,inD?SZ:"",inD?CL:""))toast("Produto adicionado ao carrinho");return}
  if(m=g("sz")){SZ=m.dataset.sz;m.parentNode.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b===m));return}
  if(m=g("cl")){CL=m.dataset.cl;m.parentNode.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b===m));return}
  
  if(m=g("buy")){const id=+m.dataset.buy,w=opt(D.p.find(x=>x.id===id));if(w)return toast(w);return need(()=>openCo([{id,q:1,sz:SZ,cl:CL}],false))}
  if(g("cart"))return openCart();
  if(m=g("qp")){const c=D.cart.find(c=>c.k==m.dataset.qp),p=D.p.find(p=>p.id==c.id);if(D.cart.filter(x=>x.id==c.id).reduce((a,x)=>a+x.q,0)<p.st)c.q++;else toast("Estoque máximo atingido");save();updBadge();return openCart()}
  if(m=g("qm")){const c=D.cart.find(c=>c.k==m.dataset.qm);if(--c.q<1)D.cart=D.cart.filter(x=>x!==c);save();updBadge();return openCart()}
  if(m=g("rm")){D.cart=D.cart.filter(c=>c.k!=m.dataset.rm);save();updBadge();return openCart()}
  if(g("ck"))return need(()=>openCo(D.cart.map(c=>({...c})),true));
  if(g("acc"))return openAu();
  if(m=g("am")){AM=m.dataset.am;return openAu()}
  if(g("auth"))return auth();
  if(g("out")){D.me=null;save();openAu();return toast("Você saiu da conta")}
  if(m=g("at")){AT=m.dataset.at;return openAd()}
  if(m=g("done")){const o=D.orders.find(x=>x.id==m.dataset.done);o.s="fechado";save();openAd();return toast("Compra concluída")}
  if(g("rc")){D.color=null;save();setColor();return openAd()}
  if(m=g("rs")){RS=+m.dataset.rs;[...$("#sb2").children].forEach((b,i)=>b.textContent=i<RS?"★":"☆");return}
  if(m=g("rv")){const id=+m.dataset.rv,t=$("#rvt").value.trim(),md=RM.slice();return need(()=>{const a=D.rev[id]=D.rev[id]||[],x=a.find(y=>y.e===D.me);x?(x.s=RS,x.t=t,x.k=Date.now(),md.length&&(x.m=md)):a.push({e:D.me,s:RS,t,m:md,k:Date.now()});RM=[];save();renderGrid();openP(id,true);toast("Avaliação enviada")})}
  if(g("conf"))return confirmar();
  if(m=g("dc")){const i=+m.dataset.dc;if(!m.dataset.sure){m.dataset.sure=1;m.textContent="Confirmar";return}const c=D.cats[i];D.cats.splice(i,1);if(S.cat===c[0])S.cat="Tudo";save();renderCats();renderGrid();return openAd()}
  if(g("ac")){const n=$("#cn").value.trim(),e=$("#ce").value.trim()||"🏷️";if(!n||CATS().some(c=>c[0].toLowerCase()===n.toLowerCase()))return toast("Informe um nome novo");D.cats.push([n,e]);save();renderCats();openAd();return toast("Categoria criada")}
  if(m=g("del")){if(!m.dataset.sure){m.dataset.sure=1;m.textContent="Confirmar";return}D.p=D.p.filter(p=>p.id!=m.dataset.del);D.cart=D.cart.filter(c=>c.id!=m.dataset.del);save();updBadge();renderGrid();openAd();return toast("Produto excluído")}
  if(g("rl")){D.logo=null;save();setLogo();return openAd()}
  if(m=g("rb")){D.b[+m.dataset.rb]=null;save();renderB();return openAd()}
  if(g("save")){const n=$("#nn").value.trim(),o=parseFloat($("#no").value),d=Math.min(90,Math.max(0,parseInt($("#nd").value)||0)),c=$("#nc").value,st=Math.max(0,parseInt($("#nst").value)||0),sz=$("#nsz").value.trim(),cl=$("#ncl").value.trim(),desc=$("#ndsc").value.trim(),e=(D.cats.find(x=>x[0]===c)||["","🛍️"])[1];
    if(!n||!(o>0))return toast("Informe o nome e o preço");
    const E=ED&&D.p.find(x=>x.id===ED);
    if(E){Object.assign(E,{n,c,o,d,st,desc,e,sz,cl});if(NI.length)E.imgs=NI;ED=null;NI=[];save();renderGrid();openAd();return toast("Produto atualizado")}
    D.p.unshift({id:Date.now(),n,c,e,o,d,st,desc,sz,cl,imgs:NI});NI=[];save();renderGrid();openAd();return toast("Produto criado")}
  if(m=g("ed")){ED=+m.dataset.ed;NI=[];AT="loja";openAd();return $("#nn").scrollIntoView({behavior:"smooth"})}
  if(g("ced")){ED=null;NI=[];return openAd()}
  if(m=g("dr")){if(!m.dataset.sure){m.dataset.sure=1;m.textContent="Confirmar";return}const[i,k]=m.dataset.dr.split("|");D.rev[i]=D.rev[i].filter(x=>String(x.k)!==k);save();renderGrid();openP(+i,true);return toast("Avaliação apagada")}
  if(m=g("o"))openP(+m.dataset.o);
});
document.addEventListener("change",async e=>{
  const T=e.target;if(T.type!=="file"||!T.files.length)return;
  if(T.id==="lg"){D.logo=await rd(T.files[0],1200);save();setLogo();openAd();toast("Logotipo atualizado")}
  else if(T.dataset.bn!==undefined){D.b[+T.dataset.bn]=await rd(T.files[0],1200);save();renderB();openAd();toast("Banner atualizado")}
  else if(T.id==="rvf"){await addRM(T.files);T.value=""}else if(T.id==="ni"){NI=await Promise.all([...T.files].map(f=>rd(f)));$("#nic").textContent=NI.length+" imagem(ns) selecionada(s)"}
});
$("#q").addEventListener("input",e=>{S.q=e.target.value;S.onlyFavs=false;renderGrid()});
$("#cartBtn").onclick=openCart;
$("#cmp").onclick=()=>{const b=$("#sb");b.hidden=!b.hidden;if(!b.hidden)$("#q").focus()};
$("#nav").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;const t=b.dataset.t;
  if(t==="menu")return openSheet(true);
  setNav(t);
  if(t==="home"){S.onlyFavs=false;S.cat="Tudo";S.q="";$("#q").value="";renderCats();renderGrid();scrollTo({top:0,behavior:"smooth"})}
  if(t==="search"){scrollTo({top:0,behavior:"smooth"});$("#sb").hidden=false;$("#q").focus()}
  if(t==="orders")toast("Você ainda não tem compras");
  if(t==="favs"){S.onlyFavs=true;renderGrid();$("#ttl").scrollIntoView({behavior:"smooth"})}
});
function openSheet(o){$("#sheet").classList.toggle("on",o);$("#bg").classList.toggle("on",o)}
$("#menuBtn").onclick=()=>openSheet(true);$("#bg").onclick=()=>openSheet(false);
$("#theme").onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).colorScheme==="dark";r.dataset.theme=d?"light":"dark";openSheet(false)};

const sl=$("#slides"),dots=$("#dots");let cur=0;
dots.innerHTML=[...sl.children].map(()=>"<i></i>").join("");
function mark(){cur=Math.round(sl.scrollLeft/sl.clientWidth);[...dots.children].forEach((d,i)=>d.classList.toggle("on",i===cur))}
sl.addEventListener("scroll",mark,{passive:true});mark();
setInterval(()=>{sl.scrollTo({left:((cur+1)%sl.children.length)*sl.clientWidth,behavior:"smooth"})},4000);
const cartN=()=>D.cart.reduce((a,c)=>a+c.q,0);
function updBadge(){$("#cartN").textContent=cartN()||""}
function addCart(id,sz="",cl=""){const p=D.p.find(x=>x.id==id),k=id+"|"+sz+"|"+cl,c=D.cart.find(x=>x.k==k),q=D.cart.filter(x=>x.id==id).reduce((a,x)=>a+x.q,0);if(!p||q+1>p.st){toast("Estoque insuficiente");return false}c?c.q++:D.cart.push({id:+id,q:1,sz,cl,k});save();updBadge();return true}
function openCart(){
  D.cart=D.cart.filter(c=>D.p.some(p=>p.id==c.id));
  const it=D.cart.map(c=>({c,p:D.p.find(p=>p.id==c.id)})),tot=it.reduce((a,{c,p})=>a+fin(p)*c.q,0);
  $("#ct").innerHTML=`<div class="dh"><button class="bk" data-x="ct" aria-label="Voltar">‹</button><b>Carrinho</b></div>`+(it.length?`<div class="ab"><section><h2>Produtos</h2>${it.map(({c,p})=>`<div class="ci"><div class="t">${pic(p)}</div><div class="cb"><div class="nm">${esc(p.n)}</div>${c.sz||c.cl?`<div class="meta">${[c.sz,c.cl].filter(Boolean).map(esc).join(" – ")}</div>`:""}<div class="ship">Frete grátis</div><div><b>R$ ${fm(fin(p))}</b>${p.d?` <span class="off">${p.d}% OFF</span>`:""}</div><div class="row"><div class="qty"><button data-qm="${c.k}" aria-label="Diminuir">−</button><span>${c.q}</span><button data-qp="${c.k}" aria-label="Aumentar">+</button></div><button class="sm" data-rm="${c.k}">Excluir</button></div></div></div>`).join("")}</section>
  <section><h2>Resumo da compra</h2><div class="row"><span style="flex:1">Produtos (${cartN()})</span><span>R$ ${fm(tot)}</span></div><div class="row"><span style="flex:1">Frete</span>${shipF(tot)?`<span>R$ ${fm(shipF(tot))}</span>`:`<span class="ship">Grátis</span>`}</div>${shipF(tot)?`<div class="meta">Falta R$ ${fm(D.fs-tot)} para frete grátis</div>`:""}<div class="row tt"><b style="flex:1">Você pagará</b><b>R$ ${fm(tot+shipF(tot))}</b></div>${D.pix?`<div class="pixl">ou R$ ${fm(pixV(tot)+shipF(tot))} no Pix</div>`:""}<button class="buy" data-ck>Continuar a compra</button></section></div>`:`<div class="empty" style="padding:60px 20px"><div style="font-size:56px">🛒</div><h2>Seu carrinho está vazio</h2><p style="margin:8px 0 16px">Adicione produtos para ver o resumo da compra.</p><button class="buy" style="padding:12px 24px" data-x="ct">Descobrir produtos</button></div>`);
  $("#ct").classList.add("on")}
document.addEventListener("change",e=>{const T=e.target;if(T.id==="clr")save();if(T.id==="cwa"){D.ct.wa=T.value.trim();save();setCt()}if(T.id==="cig"){D.ct.ig=T.value.trim();save();setCt()}if(T.id==="brd"){D.brand=T.value.trim()||"Minha Loja";save();setBrand()}if(T.id==="pixd"){D.pix=Math.min(50,Math.max(0,+T.value||0));save();renderGrid()}if(T.id==="fsv"){D.fs=Math.max(0,+T.value||0);save();renderGrid()}if(T.id==="fee"){D.fee=Math.max(0,+T.value||0);save()}if(T.dataset.ae!==undefined){D.ae=T.value.trim()||"🛍️";save();renderCats()}
  if(T.dataset.cn!==undefined){const c=D.cats[+T.dataset.cn],n=T.value.trim();if(!n)return;D.p.forEach(p=>{if(p.c===c[0])p.c=n});if(S.cat===c[0])S.cat=n;c[0]=n;save();renderCats();renderGrid()}
  if(T.dataset.ce!==undefined){D.cats[+T.dataset.ce][1]=T.value.trim()||"🏷️";save();renderCats()}});
const AH="7e44a87f1c03881726598d524bc405cbfb22c8cc482b32490fb30b13fafb3f46",AE="karlloz07@gmail.com";let AM="in",AT="loja",AFTER=null,COI=[],COC=false;
const sha=async t=>[...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,"0")).join("");
const isAdmin=()=>D.me===AE;
const need=fn=>{if(D.me)fn();else{AFTER=fn;openAu("Entre ou cadastre-se para continuar")}};
function setColor(){const r=document.documentElement.style;if(D.color){r.setProperty("--ybar",D.color);const n=parseInt(D.color.slice(1),16),l=.299*(n>>16)+.587*((n>>8)&255)+.114*(n&255);r.setProperty("--hx",l<150?"#fff":"#333")}else{r.removeProperty("--ybar");r.removeProperty("--hx")}}
document.addEventListener("input",e=>{if(e.target.id==="clr"){D.color=e.target.value;setColor()}});
function openAu(msg){openSheet(false);const me=D.me;
  $("#au").innerHTML=`<div class="dh"><button class="bk" data-x="au" aria-label="Voltar">‹</button><b>Minha conta</b></div><div class="ab">`+(me?`<section><h2>Conectado</h2><div>${esc(me)}${isAdmin()?" (administrador)":""}</div><button class="buy" data-out>Sair</button></section>`:`<section><div class="row"><button class="sm${AM==="in"?" on":""}" data-am="in" style="flex:1">Entrar</button><button class="sm${AM==="up"?" on":""}" data-am="up" style="flex:1">Cadastrar</button></div>${msg?`<div class="meta">${msg}</div>`:""}<label>E-mail (Gmail)<input id="ae" type="email" autocomplete="email" placeholder="seunome@gmail.com"></label><label>Senha<input id="ap" type="password" autocomplete="${AM==="in"?"current-password":"new-password"}"></label>${AM==="up"?`<label>Confirmar senha<input id="ap2" type="password" autocomplete="new-password"></label>`:""}<button class="buy" data-auth>${AM==="in"?"Entrar":"Criar conta"}</button></section>`)+`</div>`;
  $("#au").classList.add("on")}
async function auth(){const e=$("#ae").value.trim().toLowerCase(),p=$("#ap").value,h=await sha(p);
  if(AM==="in"){if(!((e===AE&&h===AH)||D.users.some(u=>u.e===e&&u.h===h)))return toast("E-mail ou senha incorretos")}
  else{if(!/^[^@\s]+@gmail\.com$/.test(e))return toast("Use um e-mail @gmail.com");if(p.length<6)return toast("A senha precisa ter 6 ou mais caracteres");if(p!==$("#ap2").value)return toast("As senhas não conferem");if(e===AE||D.users.some(u=>u.e===e))return toast("Este e-mail já está cadastrado");D.users.push({e,h})}
  D.me=e;save();$("#au").classList.remove("on");toast(AM==="in"?"Você entrou na conta":"Conta criada");const a=AFTER;AFTER=null;if(a)a()}
function openCo(items,fromCart){COI=items;COC=fromCart;
  const L=items.map(c=>({c,p:D.p.find(p=>p.id==c.id)})).filter(x=>x.p),sub=L.reduce((a,{c,p})=>a+fin(p)*c.q,0),sh=shipF(sub),tc=sub+sh,tp=pixV(sub)+sh;
  const I=(id,l,x="")=>`<label>${l}</label><input id="${id}" ${x}>`,R="width:20px;height:20px";
  $("#co").innerHTML=`<div class="dh"><button class="bk" data-x="co" aria-label="Voltar">‹</button><b>Finalizar compra</b></div><div class="ab"><section><h2>Endereço de entrega</h2>
  ${I("cuf","Estado",'autocomplete="address-level1"')}${I("ccd","Cidade",'autocomplete="address-level2"')}${I("cbr","Bairro")}${I("ccp","CEP",'inputmode="numeric" maxlength="9" placeholder="00000-000" autocomplete="postal-code"')}${I("crua","Rua / Avenida",'autocomplete="address-line1"')}
  <label>Número</label><div class="row"><input id="cnu" inputmode="numeric"><span class="row" style="white-space:nowrap;gap:6px"><input type="checkbox" id="csn" style="${R}"><label for="csn">Sem número</label></span></div>
  ${I("ccm","Complemento (opcional)")}<label>Referência (opcional)</label><textarea id="cref" maxlength="128"></textarea><div class="meta" id="rcn" style="text-align:right">0 / 128</div></section>
  <section><h2>Dados de quem vai receber</h2><div class="meta">Ligaremos se houver algum problema com a entrega.</div>${I("cnm","Nome completo",'autocomplete="name"')}<label>Telefone de contato</label><div class="row"><span class="sm" style="padding:12px">🇧🇷 +55</span><input id="ctel" type="tel" inputmode="tel" placeholder="(00) 00000-0000" autocomplete="tel-national"></div></section>
  <section><h2>Forma de pagamento</h2><label class="row"><input type="radio" name="pg" value="pix" checked style="${R}"><span>Pix – R$ ${fm(tp)}${D.pix?` (${D.pix}% OFF)`:""}</span></label><label class="row"><input type="radio" name="pg" value="cartao" style="${R}"><span>Cartão de crédito – R$ ${fm(tc)}</span></label></section>
  <section><h2>Resumo</h2>${L.map(({c,p})=>`<div class="row"><span style="flex:1">${c.q}x ${esc(p.n)}${c.sz||c.cl?` (${[c.sz,c.cl].filter(Boolean).map(esc).join(", ")})`:""}</span><span>R$ ${fm(fin(p)*c.q)}</span></div>`).join("")}<div class="row"><span style="flex:1">Frete</span>${sh?`<span>R$ ${fm(sh)}</span>`:`<span class="ship">Grátis</span>`}</div><button class="buy" data-conf>Confirmar compra</button></section></div>`;
  $("#co").classList.add("on")}
document.addEventListener("input",e=>{if(e.target.id==="cref")$("#rcn").textContent=e.target.value.length+" / 128"});
document.addEventListener("change",e=>{if(e.target.id==="csn")$("#cnu").disabled=e.target.checked});
function confirmar(){const v=i=>$("#"+i).value.trim(),sn=$("#csn").checked,o={id:Date.now(),s:"aberto",mail:D.me,uf:v("cuf"),cid:v("ccd"),bai:v("cbr"),cep:v("ccp"),rua:v("crua"),num:sn?"S/N":v("cnu"),comp:v("ccm"),ref:v("cref"),nome:v("cnm"),tel:v("ctel"),pg:document.querySelector("input[name=pg]:checked").value};
  if(!o.uf||!o.cid||!o.bai||!o.rua||!o.num||!o.nome)return toast("Preencha todos os campos obrigatórios");
  if(!/^\d{5}-?\d{3}$/.test(o.cep))return toast("Informe um CEP válido");
  if(o.tel.replace(/\D/g,"").length<10)return toast("Informe um telefone válido");
  const L=COI.map(c=>({c,p:D.p.find(p=>p.id==c.id)})).filter(x=>x.p);if(!L.length)return toast("Nenhum item para comprar");if(L.some(({c,p})=>L.filter(y=>y.c.id==c.id).reduce((a,y)=>a+y.c.q,0)>p.st))return toast("Alguns itens não têm estoque suficiente");
  const sub=L.reduce((a,{c,p})=>a+fin(p)*c.q,0);o.sh=shipF(sub);o.it=L.map(({c,p})=>({n:p.n,q:c.q,u:fin(p),sz:c.sz,cl:c.cl}));o.t=(o.pg==="pix"?pixV(sub):sub)+o.sh;D.orders.unshift(o);L.forEach(({c,p})=>p.st-=c.q);
  if(COC){D.cart=[];updBadge()}save();renderGrid();["co","ct","pd"].forEach(i=>$("#"+i).classList.remove("on"));toast("Compra realizada! O pedido foi enviado ao vendedor")}
const REV=p=>{const r=D.rev[p.id]||[];return `<h3>Avaliações</h3>${r.length?`<div class="big" style="font-size:30px">${avg(p.id).toFixed(1).replace(".",",")} <span class="stars">${starS(avg(p.id))}</span></div>`:`<div class="meta">Seja o primeiro a avaliar.</div>`}<div class="sb2" id="sb2">${[1,2,3,4,5].map(i=>`<button data-rs="${i}" aria-label="${i} estrelas">${i<=RS?"★":"☆"}</button>`).join("")}</div><textarea id="rvt" placeholder="Conte o que achou do produto (opcional)" style="width:100%;font:inherit;padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--chip);color:var(--tx);min-height:70px"></textarea><label class="meta">Fotos ou vídeos (opcional)<input type="file" accept="image/*,video/*" multiple id="rvf" style="width:100%;margin-top:4px"></label><div class="meta" id="rvc">${RM.length?RM.length+" arquivo(s) anexado(s)":""}</div><button class="add2" data-rv="${p.id}">Enviar avaliação</button>${r.slice().reverse().map(x=>`<div class="rv"><span class="stars">${starS(x.s)}</span> <b>${esc(x.e.split("@")[0])}</b>${isAdmin()&&x.k?` <button class="sm del" data-dr="${p.id}|${x.k}">Apagar</button>`:""}<div>${esc(x.t||"")}</div>${(x.m||[]).map(m=>m.t==="v"?`<video src="${m.u}" controls playsinline style="width:100%;max-height:220px;border-radius:6px;margin-top:6px"></video>`:`<img src="${m.u}" alt="" style="width:96px;height:96px;object-fit:cover;border-radius:6px;margin:6px 6px 0 0">`).join("")}</div>`).join("")}`};
const ORD=()=>{const o=D.orders.filter(x=>x.s==="aberto");return o.length?o.map(x=>`<section><h2>Pedido #${String(x.id).slice(-5)}</h2><div class="meta">${new Date(x.id).toLocaleString("pt-BR")}</div><div><b>${esc(x.nome)}</b> – ${esc(x.tel||"")}<br>${esc(x.mail)}</div><div>${esc(x.rua)}, ${esc(x.num)}${x.comp?" – "+esc(x.comp):""}<br>${esc(x.bai||"")}, ${esc(x.cid)} – ${esc(x.uf||"")}<br>CEP ${esc(x.cep)}${x.ref?`<br>Ref.: ${esc(x.ref)}`:""}</div><div>${x.it.map(i=>`${i.q}x ${esc(i.n)}${i.sz||i.cl?" ("+[i.sz,i.cl].filter(Boolean).map(esc).join(", ")+")":""}`).join("<br>")}</div><div class="meta">Pagamento: ${x.pg==="pix"?"Pix":"Cartão"} – Frete: ${x.sh?"R$ "+fm(x.sh):"Grátis"}</div><b>Total: R$ ${fm(x.t)}</b><button class="sm" data-done="${x.id}">Marcar como concluída</button></section>`).join(""):`<section><div class="empty">Nenhuma compra em aberto.</div></section>`};
let ED=null,RM=[],SZ="",CL="",GI;
const lst=t=>(t||"").split(",").map(x=>x.trim()).filter(Boolean),opt=p=>lst(p.sz).length&&!SZ?"Escolha um tamanho":lst(p.cl).length&&!CL?"Escolha uma cor":"";
function setCt(){const c=D.ct,lk=v=>/^https?:\/\//.test(v)?v:"https://"+v,w=(c.wa||"").trim(),i=(c.ig||"").trim(),a=$("#wal"),b=$("#igl");
  a.hidden=!w;b.hidden=!i;
  if(w)a.href=/^[\d\s()+-]+$/.test(w)?"https://wa.me/"+(d=>d.length<=11?"55"+d:d)(w.replace(/\D/g,"")):lk(w);
  if(i)b.href=/^https?:\/\//.test(i)||i.includes(".")?lk(i):"https://instagram.com/"+i.replace(/^@/,"")}
const stC=n=>n>=2?"var(--green)":n===1?"#e6a700":"#F23D4F",stK=p=>`<span style="color:${stC(p.st)}">● ${p.st>=2?p.st+" unidades em estoque":p.st===1?"Última unidade":"Esgotado"}</span>`;
async function addRM(fl){for(const f of fl){if(RM.length>=4)return toast("Máximo de 4 arquivos");if(f.type.startsWith("video/")){if(f.size>3e6){toast("Vídeo muito grande (máx. 3 MB)");continue}RM.push({t:"v",u:await new Promise(r=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.readAsDataURL(f)})})}else RM.push({t:"i",u:await rd(f,700)})}$("#rvc").textContent=RM.length+" arquivo(s) anexado(s)"}
const PF=()=>{const E=ED&&D.p.find(x=>x.id===ED)||{};return `<section><h2>${E.id?"Editar produto":"Novo produto"}</h2><label>Nome<input id="nn" value="${esc(E.n||"")}"></label><label>Categoria<select id="nc">${D.cats.map(c=>`<option${c[0]===E.c?" selected":""}>${esc(c[0])}</option>`).join("")}</select></label><div class="row"><label style="flex:1">Preço (R$)<input id="no" type="number" step="0.01" min="0" inputmode="decimal" value="${E.o||""}"></label><label style="flex:1">Desconto (%)<input id="nd" type="number" min="0" max="90" value="${E.d||0}" inputmode="numeric"></label><label style="flex:1">Estoque<input id="nst" type="number" min="0" step="1" value="${E.st??1}" inputmode="numeric"></label></div><label>Tamanhos (separe por vírgula)<input id="nsz" value="${esc(E.sz||"")}" placeholder="P, M, G, GG"></label><label>Cores (separe por vírgula)<input id="ncl" value="${esc(E.cl||"")}" placeholder="Preto, Branco"></label><label>Descrição<textarea id="ndsc">${esc(E.desc||"")}</textarea></label><label>Imagens do carrossel${E.id?" (envie novas para substituir)":""}<input type="file" accept="image/*" multiple id="ni"></label><div class="meta" id="nic">${NI.length?NI.length+" imagem(ns) selecionada(s)":E.id?E.imgs.length+" imagem(ns) atual(is)":"Nenhuma imagem selecionada"}</div><button class="buy" data-save>${E.id?"Salvar alterações":"Criar produto"}</button>${E.id?`<button class="add2" data-ced>Cancelar edição</button>`:""}</section>`};
function setBrand(){$("#q").placeholder="Buscar no "+D.brand}
setLogo();setColor();setBrand();setCt();updBadge();renderB();renderCats();renderGrid();
