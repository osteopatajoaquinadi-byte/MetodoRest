# Método R.E.S.T.

## Stack
- Framework: Next.js 16.2.3 + React 19.2.4 + TypeScript
- DB: N/A (contenido estático / ebook)
- CSS: Tailwind CSS 4.0
- Deploy: Vercel

## Contexto
Plataforma/ebook digital del método de sueño R.E.S.T. de Joaquín Adi.
67 páginas, 4 pilares: R - E - S - T.

## Comandos
- `npm run dev` — servidor de desarrollo
- `npm run build` — verificar antes de deploy
- `npm run lint` — linting TypeScript

## Reglas
- Variables de entorno en `.env.local`, nunca en código
- Antes de deploy: `npm run build` debe pasar sin errores de TypeScript
- IMPORTANTE: Esta versión de Next.js puede tener APIs distintas al training — leer `node_modules/next/dist/docs/` ante dudas
- Respetar la estructura de los 4 pilares al agregar contenido
- No alterar el flujo narrativo del ebook sin consultar al cliente

## Cliente
- Joaquín Adi (método de sueño R.E.S.T.)

## Equipo Micelia OS

Agentes disponibles para este proyecto:

| Agente | Skill | Uso |
|--------|-------|-----|
| Manuel | `/manuel` | Construir features, escribir código |
| Fidel | `/fidel` | Diseñar arquitectura antes de construir |
| Vee | `/vee` `/lint` | QA pre-deploy, verificar tipos y lint |
| Guillermito | `/guillermito` `/deps` | Auditoría de seguridad y dependencias |
| J | `/propuesta` | Propuesta comercial y cotización |
| Sofía | `/nps` | Encuesta de satisfacción del cliente |
| Camila | `/costos metodo-rest` `/rentabilidad metodo-rest` | Costos y rentabilidad |
| Kaizen | `/kaizen` | Detectar mejoras y optimizaciones |

Atajos: `/ask [pregunta]` (Router) · `/active` (dashboard) · `/startup` (arranque)
