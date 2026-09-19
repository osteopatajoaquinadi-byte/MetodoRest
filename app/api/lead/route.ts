import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { Resend } from "resend";
import { DOMINIOS_INTERP, interpretacionB } from "../../lib/resetq-interpretacion";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

const PHENO_EMAIL: Record<string, { title: string; desc: string }> = {
  "SR-1": { title: "Tu mente no se apaga", desc: "Tu sistema nervioso sigue en alerta cuando deberías descansar." },
  "SR-2": { title: "Tu cuerpo está tenso", desc: "Señales de un cuerpo que no logra bajar la guardia, ni al dormir." },
  "SR-3": { title: "Tu energía está desregulada", desc: "Tu ritmo interno está alterado: subidas, bajadas y agotamiento." },
  "SR-4": { title: "Desgaste silencioso", desc: "Tu cuerpo acumula desgaste que termina afectando tu descanso." },
  "SR-5": { title: "Tu descanso está bastante bien", desc: "Sin señales importantes de desregulación." },
  SAFETY: { title: "Vale la pena una revisión médica", desc: "Posibles signos de un trastorno respiratorio del sueño." },
};

function barColor(score: number, max: number): string {
  const pct = score / max;
  if (pct >= 0.69) return "#e0894a";
  if (pct >= 0.38) return "#d4a94a";
  return "#00E5A0";
}

// Construye el bloque HTML de un dominio con su barra e interpretación
function dominioHTML(label: string, score: number, max: number, texto: string): string {
  const pct = Math.round((score / max) * 100);
  const color = barColor(score, max);
  return `<div style="margin-bottom:22px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
      <span style="color:#E8F0F0;font-size:15px;font-weight:600">${label}</span>
      <span style="color:${color};font-size:14px;font-weight:600">${score}/${max}</span>
    </div>
    <div style="width:100%;height:7px;background:#0A1E1E;border-radius:20px;overflow:hidden;margin-bottom:10px">
      <div style="width:${pct}%;height:7px;background:${color};border-radius:20px"></div>
    </div>
    <p style="color:#9BAABD;font-size:14px;line-height:1.55;margin:0">${texto}</p>
  </div>`;
}

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { email, phenotype, global, scores } = body;
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  const { error: insertError } = await supabase.from("mr_leads").insert({
    email,
    phenotype: phenotype || null,
    global_score: global ?? null,
    scores: scores || null,
    source: "landing_resetq",
  });
  if (insertError) {
    console.error("mr_leads insert error:", insertError.message);
  }

  const info = PHENO_EMAIL[phenotype] || PHENO_EMAIL["SR-3"];
  const isSafety = phenotype === "SAFETY";

  // Desglose por dominio (si vienen los scores)
  let desgloseHTML = "";
  if (scores && typeof scores === "object") {
    const sH = scores.sH ?? 0, sA = scores.sA ?? 0, sR = scores.sR ?? 0, sI = scores.sI ?? 0, sB = scores.sB ?? 0;
    const b = interpretacionB(sB);
    const bColor = b.nivel === "derivacion" ? "#e0894a" : b.nivel === "warning" ? "#d4a94a" : "#00E5A0";
    desgloseHTML = `
      <p style="color:#00E5A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 18px">Tu desglose por área</p>
      ${dominioHTML(DOMINIOS_INTERP.H.label, sH, 16, DOMINIOS_INTERP.H.texto(sH))}
      ${dominioHTML(DOMINIOS_INTERP.A.label, sA, 16, DOMINIOS_INTERP.A.texto(sA))}
      ${dominioHTML(DOMINIOS_INTERP.R.label, sR, 16, DOMINIOS_INTERP.R.texto(sR))}
      ${dominioHTML(DOMINIOS_INTERP.I.label, sI, 16, DOMINIOS_INTERP.I.texto(sI))}
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <span style="color:#E8F0F0;font-size:15px;font-weight:600">Señales respiratorias</span>
          <span style="color:${bColor};font-size:14px;font-weight:600">${sB}/5</span>
        </div>
        <p style="color:#9BAABD;font-size:14px;line-height:1.55;margin:0">${b.texto}</p>
      </div>`;
  }

  if (resend) {
    try {
      await resend.emails.send({
        from: "Método R.E.S.T. <no-reply@metodorest.cl>",
        replyTo: "metodorest@gmail.com",
        to: email,
        subject: `Tu perfil de sueño: ${info.title}`,
        html: `<div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#060E0E;color:#E0E6EB;border-radius:16px">
          <img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:44px;margin-bottom:24px" />
          <p style="color:#00E5A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Tu perfil de sueño</p>
          <h2 style="color:#fff;margin:0 0 12px;font-size:24px">${info.title}</h2>
          <p style="color:#9BAABD;line-height:1.6;margin:0 0 8px">${info.desc}</p>
          ${global != null && !isSafety ? `<p style="color:#00E5A0;font-size:14px;margin:0 0 28px">Tu nivel general: <strong>${global}/64</strong></p>` : '<div style="margin-bottom:28px"></div>'}
          <div style="height:1px;background:rgba(94,155,143,0.15);margin:0 0 28px"></div>
          ${desgloseHTML}
          <div style="height:1px;background:rgba(94,155,143,0.15);margin:28px 0"></div>
          <div style="padding:20px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15);margin-bottom:24px">
            <p style="color:#9BAABD;font-size:14px;line-height:1.6;margin:0">Recuerda: esto es un punto de partida, no un diagnóstico. Lo importante es que ahora entiendes un poco mejor qué está pasando dentro de ti, y eso ya es el primer paso.</p>
          </div>
          <p style="color:#E0E6EB;font-size:15px;line-height:1.6;margin:0 0 20px">Si quieres trabajar en esto de forma guiada, el Método R.E.S.T. tiene un plan de 21 días diseñado exactamente para tu patrón.</p>
          <a href="${BASE_URL}/#precio" style="display:inline-block;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ver el Método R.E.S.T.</a>
          <p style="color:#506070;font-size:11px;line-height:1.5;margin-top:28px">RESET-Q está en fase de validación. Los resultados son orientativos y no constituyen un diagnóstico ni reemplazan una evaluación clínica profesional.</p>
        </div>`,
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ ok: true });
}
