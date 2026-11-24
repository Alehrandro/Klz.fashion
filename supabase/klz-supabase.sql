-- KLZ Fashion — schema Supabase (rode no SQL Editor)

create table if not exists klz_admins (email text primary key);
insert into klz_admins values ('alehs07@gmail.com') on conflict do nothing;

create table if not exists klz_docs (
  id text primary key,
  kind text not null check (kind in ('product','order','settings')),
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table klz_admins enable row level security;
alter table klz_docs enable row level security;

create or replace function is_klz_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from klz_admins where email = auth.jwt() ->> 'email')
$$;

create policy admins_self on klz_admins for select to authenticated
  using (email = auth.jwt() ->> 'email');

-- clientes (anon) leem só produtos e configurações
create policy docs_read_public on klz_docs for select
  using (kind in ('product','settings'));

-- admin lê e escreve tudo (inclusive pedidos)
create policy docs_admin_all on klz_docs for all to authenticated
  using (is_klz_admin()) with check (is_klz_admin());

-- checkout: valida e baixa o estoque de forma atômica e registra o pedido
create or replace function place_order(p_order jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare it jsonb; cur int; q int;
begin
  if jsonb_typeof(p_order->'it') <> 'array' or jsonb_array_length(p_order->'it') = 0 then
    raise exception 'Pedido vazio';
  end if;
  for it in select * from jsonb_array_elements(p_order->'it') loop
    q := (it->>'q')::int;
    select (data->'st'->>(it->>'s'))::int into cur
      from klz_docs where id = 'p' || (it->>'id') and kind = 'product' for update;
    if cur is null or q < 1 or cur < q then
      raise exception 'Estoque insuficiente para %', it->>'n';
    end if;
    update klz_docs
       set data = jsonb_set(data, array['st', it->>'s'], to_jsonb(cur - q))
     where id = 'p' || (it->>'id');
  end loop;
  insert into klz_docs (id, kind, data) values ('o' || (p_order->>'n'), 'order', p_order);
end $$;

grant execute on function place_order(jsonb) to anon, authenticated;
