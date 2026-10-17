# Método R.E.S.T.

Plataforma interactiva del método de salud del sueño de Joaquín Adi. Presenta un ebook digital de 67 páginas estructurado en 4 pilares: R · E · S · T.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- pdfjs-dist (renderizado del ebook)
- Deploy: Vercel

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
npx vercel --prod
```

## Acceso profesional (`/profesional`)

Área privada para los osteópatas de la Red Método REST: ficha de evaluación REST (algoritmo) y material de respaldo.

- **Clave de sesión:** opcional `PRO_SESSION_SECRET` (mínimo 32 caracteres, aleatoria). Si no está, se deriva de `SUPABASE_SERVICE_ROLE_KEY`, que ya existe en Vercel.
- **Base de datos:** `supabase/migrations/20261008_acceso_profesional.sql` (agrega `mr_users.es_profesional`). Ya aplicada en Supabase "Sakros app".
- **Habilitar a un colega:** debe tener cuenta en la app con contraseña ya migrada a bcrypt, y luego:
  ```sql
  update public.mr_users set es_profesional = true where email = 'colega@correo.cl';
  ```
- **Material:** archivos `.md` en `content/profesional/`. Para sumar uno, crea el archivo (`# Título`, `**Resumen:** …`, `---`, cuerpo) y agrega su slug a `ORDEN_MATERIAL` en `app/lib/profesional-material.ts`.
- **Lógica de la ficha:** `app/lib/ficha-rest.ts`. La ficha no guarda datos del paciente; se copia o se imprime.

---
Desarrollado por [Créalo SpA](https://crealo.cl) · Concón, Chile
