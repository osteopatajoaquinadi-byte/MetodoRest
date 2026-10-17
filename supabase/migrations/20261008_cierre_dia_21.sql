-- Cierre del día 21: resultado de la reevaluación final, respuestas sobre
-- signos persistentes y solicitud de continuar con un profesional.
-- Una fila por usuario y ciclo de 21 días (inicio_ciclo = fecha de inicio del programa).

create table if not exists public.mr_cierres (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.mr_users(id) on delete cascade,
  inicio_ciclo timestamptz not null,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now(),
  resultado text not null check (resultado in ('logrado', 'parcial', 'sin_cambio_adherente', 'sin_cambio_no_adherente')),
  resetq_basal smallint,
  resetq_final smallint,
  adherencia smallint check (adherencia between 0 and 100),
  alerta_respiratoria boolean not null default false,
  signos_fisicos boolean,
  signos_digestivos boolean,
  alarma_digestiva boolean,
  opcion text check (opcion in ('red_presencial', 'rest_acompanado', 'profesional_asociado')),
  ciudad text,
  telefono text,
  comentario text,
  solicitado_en timestamptz,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'contactado', 'agendado', 'cerrado')),
  unique (user_id, inicio_ciclo)
);

create index if not exists mr_cierres_solicitudes_idx on public.mr_cierres (solicitado_en desc) where opcion is not null;

-- Solo el servidor (service role) lee y escribe.
alter table public.mr_cierres enable row level security;

comment on table public.mr_cierres is 'Cierre del día 21 del Método REST: resultado, signos persistentes y solicitud de continuar con un profesional de la red.';
