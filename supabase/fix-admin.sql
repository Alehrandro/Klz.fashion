-- =====================================================================
-- KLZ Fashion — correção do acesso de administrador (alehs07@gmail.com)
-- Supabase > SQL Editor > New query > Run. Seguro rodar de novo.
-- =====================================================================

-- 1) Cada usuário logado pode ler a própria linha em admins
alter table public.admins enable row level security;
drop policy if exists admins_self_read on public.admins;
create policy admins_self_read on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
grant select on public.admins to authenticated;

-- 2) is_admin()
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;

-- 3) Gatilho: quando o usuário alehs07@gmail.com for criado (cadastro no site ou
--    Authentication > Add user), ele vira admin automaticamente.
create or replace function public.auto_admin()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if lower(trim(new.email)) = 'alehs07@gmail.com' then
    insert into public.admins (user_id) values (new.id) on conflict do nothing;
  end if;
  return new;
end;
$$;
drop trigger if exists klz_auto_admin on auth.users;
create trigger klz_auto_admin after insert on auth.users
  for each row execute function public.auto_admin();

-- 4) Se o usuário JÁ existe, cadastra agora (ignora maiúsculas/minúsculas)
insert into public.admins (user_id)
select id from auth.users where lower(trim(email)) = 'alehs07@gmail.com'
on conflict do nothing;

-- 5) Conferência: A) usuário existe?  B) está em admins?
select id, email, email_confirmed_at from auth.users where email ilike '%alehs07%';
select u.email from public.admins a join auth.users u on u.id = a.user_id;
