import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://metodorest.cl";

const PHENO_EMAIL: Record<string, { title: string; desc: string }> = {
  "SR-1": { title: "Tu mente no se apaga", desc: "Tu sistema nervioso sigue en alerta cuando deberías descansar." },
  "SR-2": { title: "Tu cuerpo está tenso", desc: "Señales de un cuerpo que no logra bajar la guardia, ni al dormir." },
  "SR-3": { title: "Tu energía está desregulada", desc: "Tu ritmo interno está alterado: subidas, bajadas y agotamiento." },
  "SR-4": { title: "Desgaste silencioso", desc: "Tu cuerpo acumula desgaste que termina afectando tu descanso." },
  "SR-5": { title: "Tu descanso está bastante bien", desc: "Sin señales importantes de desregulación." },
  SAFETY: { title: "Conviene una revisión médica", desc: "Posibles signos de un trastorno respiratorio del sueño." },
};

export async function POST(req: NextRequest) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }
  const { email, phenotype, global, scores } = body;
  if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 });

  // Guardado del lead en Supabase
  const { error: insertError } = await supabase.from("mr_leads").insert({
    email,
    phenotype: phenotype || null,
    global_score: global ?? null,
    scores: scores || null,
    source: "landing_resetq",
  });
  if (insertError) {
    console.error("mr_leads insert error:", insertError.message);
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 200 });
  }

  const info = PHENO_EMAIL[phenotype] || PHENO_EMAIL["SR-3"];
  if (resend) {
    try {
      await resend.emails.send({
        from: "Método R.E.S.T. <no-reply@metodorest.cl>",
        replyTo: "metodorest@gmail.com",
        to: email,
        subject: `Tu perfil de sueño: ${info.title}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#060E0E;color:#E0E6EB;border-radius:16px"><img src="${BASE_URL}/logo.svg" alt="Método R.E.S.T." style="height:44px;margin-bottom:24px" /><p style="color:#00E5A0;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px">Tu perfil de sueño</p><h2 style="color:#fff;margin:0 0 12px;font-size:22px">${info.title}</h2><p style="color:#9BAABD;line-height:1.6;margin:0 0 20px">${info.desc}</p><div style="padding:20px;background:#0A1E1E;border-radius:12px;border:1px solid rgba(0,229,160,0.15);margin-bottom:24px"><p style="color:#9BAABD;font-size:14px;line-height:1.6;margin:0">El Método R.E.S.T. tiene un plan de 21 días diseñado para regular exactamente este patrón. Respiraciones guiadas, plan nutricional nocturno, seguimiento de tu progreso y acompañamiento paso a paso.</p></div><a href="${BASE_URL}/#precio" style="display:inline-block;padding:14px 32px;background:#00E5A0;color:#060E0E;text-decoration:none;border-radius:12px;font-weight:600">Ver el Método R.E.S.T.</a><p style="color:#506070;font-size:11px;line-height:1.5;margin-top:24px">RESET-Q está en fase de validación. Los resultados son orientativos y no constituyen un diagnóstico ni reemplazan una evaluación clínica profesional.</p></div>`,
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ ok: true });
}
