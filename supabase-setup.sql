-- Execute no Supabase: SQL Editor > New query > Run
-- E-mail do administrador (troque em dois lugares se mudar: aqui e em AE no js/app.js)

create table if not exists app_state(id int primary key, data jsonb not null default '{}', updated_at timestamptz default now());
create table if not exists reviews(k bigint primary key, pid bigint not null, mail text not null, s int not null check (s between 1 and 5), t text, m jsonb default '[]', unique(pid,mail));
create table if not exists orders(id bigint primary key, mail text not null, data jsonb not null, created_at timestamptz default now());

create or replace function is_admin() returns boolean language sql stable as $$
  select lower(coalesce(auth.jwt()->>'email',''))='karlloz07@gmail.com'
$$;

alter table app_state enable row level security;
alter table reviews enable row level security;
alter table orders enable row level security;

create policy "ler loja" on app_state for select using (true);
create policy "admin grava loja" on app_state for all using (is_admin()) with check (is_admin());

create policy "ler avaliacoes" on reviews for select using (true);
create policy "criar avaliacao" on reviews for insert to authenticated with check (lower(mail)=lower(auth.jwt()->>'email'));
create policy "editar propria avaliacao" on reviews for update to authenticated using (lower(mail)=lower(auth.jwt()->>'email')) with check (lower(mail)=lower(auth.jwt()->>'email'));
create policy "admin apaga avaliacao" on reviews for delete using (is_admin());

create policy "ver pedidos" on orders for select to authenticated using (is_admin() or lower(mail)=lower(auth.jwt()->>'email'));
create policy "admin atualiza pedidos" on orders for update to authenticated using (is_admin()) with check (is_admin());

-- Compra: grava o pedido e baixa o estoque com segurança
create or replace function place_order(o jsonb) returns void language plpgsql security definer set search_path=public as $$
declare it jsonb;
begin
  if auth.jwt()->>'email' is null then raise exception 'Faça login'; end if;
  insert into orders(id,mail,data) values ((o->>'id')::bigint, lower(auth.jwt()->>'email'), o);
  for it in select * from jsonb_array_elements(o->'it') loop
    update app_state set data=jsonb_set(data,'{p}',(
      select jsonb_agg(case when e->>'id'=it->>'pid'
        then jsonb_set(e,'{st}',to_jsonb(greatest(0,coalesce((e->>'st')::int,0)-(it->>'q')::int))) else e end)
      from jsonb_array_elements(data->'p') e)) where id=1;
  end loop;
end $$;
grant execute on function place_order(jsonb) to authenticated;

-- Imagens e vídeos
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
create policy "midia publica" on storage.objects for select using (bucket_id='media');
create policy "upload logado" on storage.objects for insert to authenticated with check (bucket_id='media');
create policy "admin apaga midia" on storage.objects for delete using (bucket_id='media' and is_admin());
