import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase, getUserById } from "../../lib/supabase";
import { OPCIONES, type OpcionContinuar, type ResultadoCierre } from "../../lib/cierre";
import { enviarCorreo, REMITENTE } from "../../lib/correo";

// Cierre del día 21: guarda el resultado y las respuestas (una fila por usuario y ciclo)
// y, cuando la persona pide continuar con un profesional, avisa por correo.

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const AVISO_A = "metodorest@gmail.com";

const RESULTADOS: ResultadoCierre[] = ["logrado", "parcial", "sin_cambio_adherente", "sin_cambio_no_adherente"];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RESULTADO_TEXTO: Record<ResultadoCierre, string> = {
  logrado: "Regulación preservada",
  parcial: "Mejoró, pero sigue con alteraciones",
  sin_cambio_adherente: "No mejoró y cumplió el plan",
  sin_cambio_no_adherente: "No mejoró y no cumplió el plan",
};

function texto(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t || null;
}

function bool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

function entero(v: unknown, min: number, max: number): number | null {
  return typeof v === "number" && Number.isFinite(v) ? Math.max(min, Math.min(max, Math.round(v))) : null;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function siNo(v: boolean | null | undefined): string {
  return v === true ? "Sí" : v === false ? "No" : "—";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const inicioCiclo = typeof body.inicioCiclo === "string" ? body.inicioCiclo : "";
  const resultado = body.resultado as ResultadoCierre;
  if (!UUID.test(userId) || !inicioCiclo || Number.isNaN(new Date(inicioCiclo).getTime()) || !RESULTADOS.includes(resultado)) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  const opcion = typeof body.opcion === "string" && body.opcion in OPCIONES ? (body.opcion as OpcionContinuar) : null;

  let user: Record<string, unknown>;
  try {
    user = await getUserById(userId);
  } catch {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const fila: Record<string, unknown> = {
    user_id: userId,
    inicio_ciclo: new Date(inicioCiclo).toISOString(),
    actualizado: new Date().toISOString(),
    resultado,
    resetq_basal: entero(body.resetqBasal, 0, 64),
    resetq_final: entero(body.resetqFinal, 0, 64),
    adherencia: entero(body.adherencia, 0, 100),
    alerta_respiratoria: body.alertaRespiratoria === true,
  };
  // Solo se escriben las respuestas que vienen, para no borrar las anteriores.
  for (const [campo, clave] of [
    ["signos_fisicos", "signosFisicos"],
    ["signos_digestivos", "signosDigestivos"],
    ["alarma_digestiva", "alarmaDigestiva"],
  ] as const) {
    const v = bool(body[clave]);
    if (v !== null) fila[campo] = v;
  }

  // ¿Ya había una solicitud en este ciclo? Así no se duplica el aviso.
  const { data: previa } = await supabase
    .from("mr_cierres")
    .select("opcion")
    .eq("user_id", userId)
    .eq("inicio_ciclo", fila.inicio_ciclo as string)
    .maybeSingle();

  if (opcion) {
    fila.opcion = opcion;
    fila.ciudad = texto(body.ciudad, 80);
    fila.telefono = texto(body.telefono, 30);
    fila.comentario = texto(body.comentario, 600);
    fila.solicitado_en = new Date().toISOString();
  }

  const { data: guardado, error } = await supabase
    .from("mr_cierres")
    .upsert(fila, { onConflict: "user_id,inicio_ciclo" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: "No pudimos guardar tu respuesta" }, { status: 502 });

  if (opcion && !previa?.opcion && resend) {
    const nombre = String(user.nombre || "").trim() || "(sin nombre)";
    const email = String(user.email || "");
    const g = guardado as Record<string, unknown>;
    const filas: [string, string][] = [
      ["Paciente", `${nombre} · ${email}`],
      ["Quiere", OPCIONES[opcion].titulo],
      ["Ciudad o comuna", (g.ciudad as string) || "—"],
      ["Teléfono", (g.telefono as string) || "—"],
      ["Comentario", (g.comentario as string) || "—"],
      ["Resultado día 21", RESULTADO_TEXTO[resultado]],
      ["RESET-Q", `${g.resetq_basal ?? "—"} → ${g.resetq_final ?? "—"} (de 64)`],
      ["Adherencia al plan", g.adherencia === null || g.adherencia === undefined ? "—" : `${g.adherencia}%`],
      ["Signos físicos", siNo(g.signos_fisicos as boolean | null)],
      ["Signos digestivos", siNo(g.signos_digestivos as boolean | null)],
      ["Señales respiratorias en RESET-Q", g.alerta_respiratoria ? "Sí: revisar derivación médica" : "No"],
    ];
    const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
      <p><strong>Nueva solicitud del cierre del día 21.</strong> Asígnala a un profesional de la Red Método REST y contáctalo para coordinar.</p>
      <table cellpadding="6" style="border-collapse:collapse">${filas
        .map(([k, v]) => `<tr><td style="color:#555;vertical-align:top">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
        .join("")}</table>
      <p style="color:#555">Queda registrada en Supabase, tabla mr_cierres, con estado "pendiente".</p>
    </div>`;
    try {
      await enviarCorreo(resend, {
        from: REMITENTE,
        to: AVISO_A,
        replyTo: email || undefined,
        subject: `Cierre día 21: ${nombre} quiere ${OPCIONES[opcion].titulo}`,
        html,
      });
    } catch {
      // El registro ya quedó guardado; el aviso por correo no bloquea a la persona.
    }
  }

  return NextResponse.json({ ok: true });
}
