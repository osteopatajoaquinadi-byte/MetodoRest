-- Acceso profesional (Red Método REST)
-- Habilita cuentas de la plataforma como profesionales de la red.
-- Aplicar en el proyecto Supabase "Sakros app" antes de activar el acceso.

alter table public.mr_users
  add column if not exists es_profesional boolean not null default false;

comment on column public.mr_users.es_profesional is
  'true = profesional de la Red Método REST con acceso a /profesional (ficha y material)';

-- Para habilitar a un colega (su cuenta debe existir y tener contraseña):
-- update public.mr_users set es_profesional = true, nivel_acceso = 'completo' where email = 'colega@ejemplo.cl';
