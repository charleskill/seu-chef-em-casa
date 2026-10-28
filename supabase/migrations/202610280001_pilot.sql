-- Fundação do piloto. Aplicar uma única vez em projeto Supabase novo.
-- Não inclui ainda endpoint público de pedidos nem integração do frontend.
begin;
create table public.chefs (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  cities text not null default '',
  bio text not null default '',
  whatsapp text not null check (whatsapp ~ '^[1-9][0-9]{9,14}$'),
  instagram text not null default '',
  avatar_url text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.dishes (
  id uuid primary key default gen_random_uuid(),
  chef_id uuid not null references public.chefs(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 150),
  description text not null default '',
  category text not null default 'Pratos Principais',
  price numeric(12,2) check (price >= 0),
  created_at timestamptz not null default now()
);
create index dishes_chef_idx on public.dishes(chef_id);
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  chef_id uuid not null references public.chefs(id) on delete cascade,
  client_name text not null check (char_length(client_name) between 2 and 120),
  client_phone text not null,
  event_date date,
  details jsonb not null check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);
create index quote_requests_chef_idx on public.quote_requests(chef_id);
alter table public.chefs enable row level security;
alter table public.dishes enable row level security;
alter table public.quote_requests enable row level security;
revoke all on public.chefs, public.dishes, public.quote_requests from anon, authenticated;
grant select on public.chefs, public.dishes to anon, authenticated;
grant insert, update, delete on public.chefs, public.dishes to authenticated;
grant select on public.quote_requests to authenticated;
create policy chefs_read on public.chefs for select to anon, authenticated
using (published or id = (select auth.uid()));
create policy chefs_insert on public.chefs for insert to authenticated
with check (id = (select auth.uid()));
create policy chefs_update on public.chefs for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy chefs_delete on public.chefs for delete to authenticated
using (id = (select auth.uid()));
create policy dishes_read on public.dishes for select to anon, authenticated
using (exists(select 1 from public.chefs c where c.id=chef_id and (c.published or c.id=(select auth.uid()))));
create policy dishes_insert on public.dishes for insert to authenticated
with check (chef_id = (select auth.uid()));
create policy dishes_update on public.dishes for update to authenticated
using (chef_id = (select auth.uid())) with check (chef_id = (select auth.uid()));
create policy dishes_delete on public.dishes for delete to authenticated
using (chef_id = (select auth.uid()));
create policy requests_read on public.quote_requests for select to authenticated
using (chef_id = (select auth.uid()));
-- Sem INSERT público: pedidos serão gravados por endpoint validado com limitação
-- de abuso, após validar chef publicado, pratos e campos. Nenhuma chave secret
-- ou service_role pode ir para o HTML. Implementar endpoint antes de ativar fluxo.
commit;
