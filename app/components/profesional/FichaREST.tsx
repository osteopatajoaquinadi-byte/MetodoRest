"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  BANDERAS_ROJAS,
  EJES,
  HALLAZGOS_MANUALES,
  PHQ4,
  PHQ4_OPCIONES,
  SEGURIDAD,
  SOCIOECONOMICAS,
  UMBRAL_EJE_ACTIVO,
  calcular,
  fichaVacia,
  resumenTexto,
  type EjeId,
  type FichaInput,
  type Puntaje,
} from "../../lib/ficha-rest";

/* ── Piezas de interfaz ── */

function Modulo({
  numero,
  titulo,
  ayuda,
  material,
  children,
}: {
  numero: string;
  titulo: string;
  ayuda: string;
  material?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section className="glass-card p-5 sm:p-6">
      <header className="mb-4">
        <span className="text-rest-accent text-xs font-semibold tracking-[0.15em] uppercase">Módulo {numero}</span>
        <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mt-1">{titulo}</h2>
        <p className="text-rest-text-secondary text-sm mt-1 leading-relaxed">
          {ayuda}
          {material && (
            <>
              {" "}
              <Link href={material.href} className="link-inline">
                {material.label}
              </Link>
            </>
          )}
        </p>
      </header>
      <div className="space-y-1">{children}</div>
    </section>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label
      className={`flex items-start gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
        checked ? "bg-rest-accent/[0.08] ring-1 ring-rest-accent/25" : "hover:bg-white/[0.03]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-rest-accent"
      />
      <span className="text-sm text-rest-text leading-snug">{children}</span>
    </label>
  );
}

function Opciones<T extends string | number>({
  etiqueta,
  opciones,
  valor,
  onChange,
}: {
  etiqueta: string;
  opciones: { valor: T; label: string }[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="px-3 py-2.5">
      <legend className="text-sm text-rest-text leading-snug mb-2">{etiqueta}</legend>
      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => {
          const activo = valor === o.valor;
          return (
            <button
              key={String(o.valor)}
              type="button"
              aria-pressed={activo}
              onClick={() => onChange(o.valor)}
              className={`min-h-[44px] px-3.5 rounded-xl text-sm font-medium transition-colors ${
                activo
                  ? "bg-rest-accent text-rest-bg"
                  : "bg-white/[0.04] text-rest-text-secondary ring-1 ring-white/10 hover:text-rest-text hover:ring-rest-accent/30"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const OPC_EJE: { valor: Puntaje; label: string }[] = [
  { valor: 0, label: "No" },
  { valor: 1, label: "A veces" },
  { valor: 2, label: "Sí" },
];

const inputClase =
  "w-full px-3.5 py-2.5 bg-white/[0.03] rounded-xl text-rest-text placeholder:text-rest-text-muted ring-1 ring-white/10 focus:outline-none focus:ring-rest-accent/50 transition";

/* ── Ficha ── */

export default function FichaREST({ profesional }: { profesional: string }) {
  const [f, setF] = useState<FichaInput>(fichaVacia);
  const [copiado, setCopiado] = useState(false);
  const r = useMemo(() => calcular(f), [f]);

  const set = (patch: Partial<FichaInput>) => setF((prev) => ({ ...prev, ...patch }));

  const setEje = (id: EjeId, i: number, v: Puntaje) =>
    setF((prev) => {
      const items = [...prev.ejes[id]];
      items[i] = v;
      return { ...prev, ejes: { ...prev.ejes, [id]: items } };
    });

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(resumenTexto(f, r, profesional));
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  };

  const reiniciar = () => {
    if (window.confirm("¿Empezar una ficha nueva? Se borrarán los datos de esta evaluación.")) {
      setF(fichaVacia());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const hayRoja = r.derivaciones.length > 0;

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
      {/* ───────── Formulario ───────── */}
      <div className="space-y-5 no-print">
        <section className="glass-card p-5 sm:p-6">
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mb-1">Datos de la evaluación</h2>
          <p className="text-rest-text-secondary text-sm mb-4">
            Usa un código de paciente, no el nombre. Esta ficha no se guarda en el servidor: copia o imprime el resumen para tu registro.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mb-3">
            <label className="block">
              <span className="block text-xs text-rest-text-secondary mb-1">Código de paciente</span>
              <input className={inputClase} value={f.codigo} onChange={(e) => set({ codigo: e.target.value })} placeholder="Ej.: JA-014" />
            </label>
            <label className="block">
              <span className="block text-xs text-rest-text-secondary mb-1">Edad</span>
              <input className={inputClase} inputMode="numeric" value={f.edad} onChange={(e) => set({ edad: e.target.value.replace(/\D/g, "").slice(0, 3) })} />
            </label>
            <label className="block">
              <span className="block text-xs text-rest-text-secondary mb-1">Fecha</span>
              <input type="date" className={inputClase} value={f.fecha} onChange={(e) => set({ fecha: e.target.value })} />
            </label>
          </div>
          <Check checked={f.consentimiento} onChange={(v) => set({ consentimiento: v })}>
            El paciente autorizó el registro de esta evaluación en su ficha clínica.
          </Check>
        </section>

        <Modulo
          numero="0"
          titulo="Banderas rojas"
          ayuda="Si marcas alguna, la ficha indica derivar primero."
          material={{ href: "/profesional/material/banderas-rojas", label: "Ver guía de derivación" }}
        >
          {BANDERAS_ROJAS.map((b) => (
            <Check key={b.id} checked={!!f.rojas[b.id]} onChange={(v) => set({ rojas: { ...f.rojas, [b.id]: v } })}>
              {b.texto}
            </Check>
          ))}
          <div className="pt-3 mt-2 border-t border-white/[0.06]">
            <p className="text-sm font-semibold text-white px-3 mb-1">PHQ-4 · En las últimas 2 semanas, ¿con qué frecuencia le ha molestado…?</p>
            {PHQ4.map((p, i) => (
              <Opciones
                key={p.id}
                etiqueta={p.texto}
                opciones={PHQ4_OPCIONES.map((label, valor) => ({ valor, label }))}
                valor={f.phq[i]}
                onChange={(v) => {
                  const phq = [...f.phq];
                  phq[i] = v;
                  set({ phq });
                }}
              />
            ))}
          </div>
        </Modulo>

        <Modulo
          numero="1"
          titulo="Fenotipo de sueño"
          ayuda={`Cada pregunta puntúa 0, 1 o 2. Un eje con ${UMBRAL_EJE_ACTIVO} o más se considera activo (punto de corte provisional).`}
          material={{ href: "/profesional/material/fenotipos-de-sueno", label: "Ver los cuatro ejes" }}
        >
          {EJES.map((e) => (
            <div key={e.id} className="pt-2 first:pt-0">
              <p className="text-xs font-semibold tracking-[0.12em] uppercase text-rest-accent px-3 pt-2">{e.nombre}</p>
              {e.preguntas.map((q, i) => (
                <Opciones key={q} etiqueta={q} opciones={OPC_EJE} valor={f.ejes[e.id][i]} onChange={(v) => setEje(e.id, i, v)} />
              ))}
            </div>
          ))}
          <label className="block px-3 pt-3">
            <span className="block text-sm text-rest-text mb-1">RESET-Q, subescala de hiperactivación (opcional)</span>
            <input className={`${inputClase} max-w-[160px]`} inputMode="decimal" value={f.resetqHiperactivacion} onChange={(e) => set({ resetqHiperactivacion: e.target.value.slice(0, 6) })} />
          </label>
        </Modulo>

        <Modulo
          numero="2"
          titulo="Banderas amarillas"
          ayuda="No obligan a derivar, pero cambian el plan."
          material={{ href: "/profesional/material/banderas-amarillas", label: "Ver criterios" }}
        >
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-rest-accent px-3 pt-1">Socioeconómica</p>
          {SOCIOECONOMICAS.map((s) => (
            <Check key={s.id} checked={!!f.socio[s.id]} onChange={(v) => set({ socio: { ...f.socio, [s.id]: v } })}>
              {s.texto}
            </Check>
          ))}

          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-rest-accent px-3 pt-4">Estrés</p>
          <Check checked={f.estresSostenido} onChange={(v) => set({ estresSostenido: v })}>
            Estrés percibido sostenido por más de 3 meses
          </Check>

          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-rest-accent px-3 pt-4">Digestivo</p>
          <Check checked={f.digestivo.hinchazon} onChange={(v) => set({ digestivo: { ...f.digestivo, hinchazon: v } })}>
            Hinchazón 3 o más días por semana, durante 3 meses o más
          </Check>
          <Check checked={f.digestivo.gases} onChange={(v) => set({ digestivo: { ...f.digestivo, gases: v } })}>
            Gases molestos
          </Check>
          <Check checked={f.digestivo.distension} onChange={(v) => set({ digestivo: { ...f.digestivo, distension: v } })}>
            Distensión abdominal visible después de comer
          </Check>
          <Check checked={f.digestivo.flota} onChange={(v) => set({ digestivo: { ...f.digestivo, flota: v } })}>
            Deposición que flota
          </Check>
          <Check checked={f.digestivo.postInfeccion} onChange={(v) => set({ digestivo: { ...f.digestivo, postInfeccion: v } })}>
            Los síntomas empezaron después de una infección intestinal
          </Check>
          <Opciones
            etiqueta="Tipo de Bristol predominante"
            opciones={[1, 2, 3, 4, 5, 6, 7].map((n) => ({ valor: n, label: String(n) }))}
            valor={f.digestivo.bristol}
            onChange={(v) => set({ digestivo: { ...f.digestivo, bristol: f.digestivo.bristol === v ? null : v } })}
          />

          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-rest-accent px-3 pt-4">Dolor</p>
          <Check checked={f.dolorCronico} onChange={(v) => set({ dolorCronico: v })}>
            Dolor musculoesquelético por más de 3 meses
          </Check>
        </Modulo>

        <Modulo
          numero="3"
          titulo="Examen manual"
          ayuda="Solo hallazgos con criterio definido. Deciden qué tratar, no la ruta."
          material={{ href: "/profesional/material/examen-manual", label: "Ver criterios de cada hallazgo" }}
        >
          <label className="block px-3 pb-2">
            <span className="block text-sm text-rest-text mb-1">Frecuencia respiratoria en reposo (respiraciones por minuto, contadas 60 s)</span>
            <input className={`${inputClase} max-w-[160px]`} inputMode="numeric" value={f.frecuenciaRespiratoria} onChange={(e) => set({ frecuenciaRespiratoria: e.target.value.replace(/\D/g, "").slice(0, 2) })} />
          </label>
          {HALLAZGOS_MANUALES.map((h) => (
            <Check key={h.id} checked={!!f.manual[h.id]} onChange={(v) => set({ manual: { ...f.manual, [h.id]: v } })}>
              {h.texto}
            </Check>
          ))}
        </Modulo>

        <Modulo
          numero="4"
          titulo="Filtro de seguridad"
          ayuda="Antes de cualquier sugerencia de suplementación."
          material={{ href: "/profesional/material/suplementacion", label: "Ver guía de suplementación" }}
        >
          {SEGURIDAD.map((s) => (
            <Check key={s.id} checked={!!f.seguridad[s.id]} onChange={(v) => set({ seguridad: { ...f.seguridad, [s.id]: v } })}>
              {s.texto}
            </Check>
          ))}
          <div className="pt-3 mt-2 border-t border-white/[0.06]">
            <Check checked={f.magnesio.usa} onChange={(v) => set({ magnesio: { ...f.magnesio, usa: v } })}>
              Ya usa magnesio
            </Check>
            <Opciones
              etiqueta="Ingesta de magnesio en la dieta (frutos secos, legumbres, verduras verdes)"
              opciones={[
                { valor: "baja" as const, label: "Baja" },
                { valor: "media" as const, label: "Media" },
                { valor: "alta" as const, label: "Alta" },
              ]}
              valor={f.magnesio.ingesta || null}
              onChange={(v) => set({ magnesio: { ...f.magnesio, ingesta: v } })}
            />
          </div>
        </Modulo>
      </div>

      {/* ───────── Resultado ───────── */}
      <aside
        className="pro-print lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 space-y-4"
        aria-live="polite"
        aria-label="Resultado de la ficha"
      >
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[family-name:var(--font-space)] text-lg font-semibold text-white">Resultado</h2>
            <span className="text-xs text-rest-text-muted no-print">Ficha completa al {r.completitud}%</span>
          </div>
          <p className="hidden print:block text-sm mb-2">
            Paciente {f.codigo || "(sin código)"} · {f.fecha} · Profesional: {profesional}
          </p>

          <div
            className={`rounded-xl p-4 text-sm leading-relaxed ${
              hayRoja ? "bg-rest-danger/10 ring-1 ring-rest-danger/40 text-white" : "bg-rest-accent/[0.08] ring-1 ring-rest-accent/25 text-white"
            }`}
          >
            <span className={`block text-xs font-semibold tracking-[0.12em] uppercase mb-1 ${hayRoja ? "text-rest-danger" : "text-rest-accent"}`}>
              Ruta
            </span>
            {r.ruta}
          </div>

          {r.derivaciones.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {r.derivaciones.map((d) => (
                <li key={d.motivo} className="text-rest-text">
                  <span className="text-rest-danger font-semibold">Derivar:</span> {d.destino}
                  <span className="block text-rest-text-muted text-xs">{d.motivo}</span>
                </li>
              ))}
            </ul>
          )}

          {r.coordinar.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {r.coordinar.map((c) => (
                <li key={c} className="text-rest-text">
                  <span className="text-rest-warning font-semibold">Coordinar:</span> {c}
                </li>
              ))}
            </ul>
          )}

          {!f.consentimiento && <p className="mt-3 text-xs text-rest-warning">Falta registrar el consentimiento del paciente.</p>}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">
            Ejes de sueño
            {r.phqTotal !== null && <span className="font-normal text-rest-text-muted"> · PHQ-4 {r.phqTotal}/12 ({r.phqBanda})</span>}
          </h3>
          <div className="space-y-2.5">
            {r.ejes.map((e) => (
              <div key={e.id}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={e.activo ? "text-white font-medium" : "text-rest-text-secondary"}>{e.nombre}</span>
                  <span className={e.activo ? "text-rest-accent font-semibold" : "text-rest-text-muted"}>
                    {e.puntaje}/6{e.activo ? " · activo" : ""}
                    {!e.completo ? " · incompleto" : ""}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-full rounded-full ${e.activo ? "bg-rest-accent" : "bg-white/25"}`} style={{ width: `${(e.puntaje / 6) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          {r.dominantes.length > 0 && !hayRoja && (
            <div className="mt-4 space-y-2">
              {r.dominantes.map((e) => (
                <p key={e.id} className="text-sm text-rest-text leading-relaxed">
                  <span className="text-rest-accent font-semibold">Énfasis {e.nombre.toLowerCase()}:</span> {e.enfasis}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Banderas amarillas</h3>
          <ul className="space-y-2">
            {r.amarillas.map((a) => (
              <li key={a.id} className="text-sm">
                <span className={a.activa ? "text-rest-warning font-semibold" : "text-rest-text-secondary"}>
                  {a.nombre}: {a.activa ? "activa" : "no"}
                </span>
                <span className="block text-xs text-rest-text-muted">{a.motivo}</span>
              </li>
            ))}
          </ul>
        </div>

        {(r.hallazgos.length > 0 || f.frecuenciaRespiratoria) && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Examen manual</h3>
            {f.frecuenciaRespiratoria && (
              <p className="text-sm text-rest-text mb-2">Frecuencia respiratoria en reposo: {f.frecuenciaRespiratoria} rpm</p>
            )}
            <ul className="space-y-2">
              {r.hallazgos.map((h) => (
                <li key={h.texto} className="text-sm text-rest-text">
                  {h.intervencion}
                  <span className="block text-xs text-rest-text-muted">{h.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-1">Suplementación</h3>
          <p className="text-xs text-rest-text-muted mb-3">Sugerencias generales, no prescripciones.</p>
          <div className="space-y-3">
            {r.suplementos.map((s) => (
              <div key={s.nombre}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{s.nombre}</span>
                  <span
                    className={`text-[10px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full ${
                      s.estado === "sugerido"
                        ? "bg-rest-accent/15 text-rest-accent"
                        : s.estado === "condicionado"
                          ? "bg-rest-warning/15 text-rest-warning"
                          : "bg-white/[0.06] text-rest-text-muted"
                    }`}
                  >
                    {s.estado === "sugerido" ? "Sugerido" : s.estado === "condicionado" ? "Con visto bueno médico" : "No"}
                  </span>
                </div>
                <ul className="space-y-1">
                  {s.detalle.map((d) => (
                    <li key={d} className="text-xs text-rest-text-secondary leading-relaxed">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {r.digestivo.length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Recomendaciones digestivas</h3>
            <ul className="list-disc pl-4 space-y-1.5">
              {r.digestivo.map((d) => (
                <li key={d} className="text-sm text-rest-text leading-relaxed">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2 no-print">
          <button
            type="button"
            onClick={copiar}
            className="flex-1 min-h-[44px] px-4 rounded-xl bg-rest-accent text-rest-bg text-sm font-semibold hover:bg-rest-accent-dark transition-colors"
          >
            {copiado ? "Resumen copiado" : "Copiar resumen"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 min-h-[44px] px-4 rounded-xl bg-white/[0.05] ring-1 ring-white/10 text-rest-text text-sm font-medium hover:ring-rest-accent/30 transition"
          >
            Imprimir o guardar PDF
          </button>
          <button
            type="button"
            onClick={reiniciar}
            className="w-full min-h-[44px] px-4 rounded-xl text-rest-text-muted text-sm hover:text-rest-text transition"
          >
            Nueva ficha
          </button>
        </div>
        <p className="text-[11px] text-rest-text-muted leading-relaxed">
          Protocolo de decisión clínica, no diagnóstico. Puntos de corte provisionales, en calibración durante el piloto.
        </p>
      </aside>
    </div>
  );
}
