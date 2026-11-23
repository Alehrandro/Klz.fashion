/* ============================================================
   Camada de dados Supabase da KLZ Fashion.
   Carregado ANTES de app.js. Se js/config.js estiver vazio, CLOUD=false
   e o app funciona em modo demonstração (localStorage).
   ============================================================ */
const CFG = window.KLZ_CONFIG || {};
const CLOUD = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase);
const sb = CLOUD ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
const BUCKET = 'klz-media';

// ---- mapeamento banco <-> app ----
const rowToP = r => ({ id: r.id, n: r.name, b: r.brand, c: r.category, p: +r.price, o: +r.old_price, s: r.sizes, st: r.stock || {}, new: r.is_new ? 1 : 0, col: r.color || '#1b1b1b', img: r.image_url || '' });
const pToRow = p => ({ name: p.n, brand: p.b, category: p.c, price: p.p, old_price: p.o, is_new: !!p.new, color: p.col, image_url: p.img || null, sizes: p.s, stock: p.st });

// Garante que uma escrita realmente afetou linhas (o RLS devolve 0 linhas, sem erro, quando não há permissão)
async function must(q) {
  const { data, error } = await q.select();
  if (error) throw error;
  if (!data || !data.length) throw new Error('Sem permissão ou item não encontrado. Entre novamente como administrador.');
  return data;
}

// ---- leitura pública ----
async function loadProducts() {
  const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: false }).order('id');
  if (error) throw error;
  P.splice(0, P.length, ...data.map(rowToP));
}
async function loadSettings() {
  const { data, error } = await sb.from('store_settings').select('data').eq('id', 1).maybeSingle();
  if (error) throw error;
  if (data && data.data) {
    const d = { ...data.data };
    if (Array.isArray(d.sl) && d.sl.length) SL.splice(0, SL.length, ...d.sl);
    delete d.sl;
    Object.assign(S, d);
    S.sl = SL;
  }
}
async function checkCoupon(code) {
  const { data, error } = await sb.rpc('validate_coupon', { p_code: code });
  if (error || !data) return null;
  return { t: data.type, v: +data.value, d: data.description, code };
}

// ---- configurações da loja (admin) ----
let _stT;
function persistCloud() {
  clearTimeout(_stT);
  _stT = setTimeout(async () => {
    const { sl, ...rest } = S;
    try { await must(sb.from('store_settings').upsert({ id: 1, data: { ...rest, sl: SL }, updated_at: new Date().toISOString() })); }
    catch (e) { toast('Erro ao salvar: ' + (e.message || e)); }
  }, 400);
}

// ---- cupons (admin) ----
async function loadCoupons() {
  const { data, error } = await sb.from('coupons').select('*');
  if (error) return;
  Object.keys(COUPONS).forEach(k => delete COUPONS[k]);
  data.forEach(c => COUPONS[c.code] = { t: c.type, v: +c.value, d: c.description });
}
async function saveCoupon(k, c) {
  try { await must(sb.from('coupons').upsert({ code: k, type: c.t, value: c.v, description: c.d })); }
  catch (e) { toast('Erro ao salvar cupom: ' + (e.message || e)); }
}
async function delCup(k) {
  if (CLOUD) { try { await must(sb.from('coupons').delete().eq('code', k)); } catch (e) { return toast(e.message || 'Erro ao excluir'); } }
  delete COUPONS[k];
  if (!CLOUD) persist();
  renderAdmin();
}

// ---- pedidos (admin) ----
async function loadOrders() {
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return;
  ORD = data.map(o => ({ id: o.id, n: o.number, d: new Date(o.created_at).toLocaleString('pt-BR'), nome: o.customer_name, email: o.email, pg: o.payment, tot: +o.total, st: o.status, it: o.items }));
}
async function delOrd(i) {
  const o = ORD[i];
  if (CLOUD) { try { await must(sb.from('orders').delete().eq('id', o.id)); } catch (e) { return toast(e.message || 'Erro ao excluir'); } }
  ORD.splice(i, 1);
  if (!CLOUD) persist();
  renderAdmin();
}

// ---- imagens (Supabase Storage) ----
async function uploadImg(dataUrl, folder) {
  if (!CLOUD) return dataUrl; // modo demo: guarda a imagem inline
  const blob = await (await fetch(dataUrl)).blob();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// ---- sessão de administrador ----
async function checkAdmin() {
  const { data } = await sb.rpc('is_admin');
  if (data === true) { setAdm(true); await Promise.all([loadOrders(), loadCoupons()]); return true; }
  return false;
}

// ---- inicialização ----
async function cloudBoot() {
  ['#g-dest', '#g-new'].forEach(s => $(s).innerHTML = '<div class="empty">Carregando…</div>');
  try { await Promise.all([loadProducts(), loadSettings()]); }
  catch (e) {
    console.error(e);
    ['#g-dest', '#g-new'].forEach(s => $(s).innerHTML = '<div class="empty">Não foi possível carregar a loja agora. Tente novamente em instantes.</div>');
    return;
  }
  cart = cart.filter(i => { const p = P.find(x => x.id === i.id); return p && (p.st[i.s] || 0) > 0; });
  save(); applySettings(); hero(); refresh();
  const { data } = await sb.auth.getSession();
  if (data.session) await checkAdmin();
}
