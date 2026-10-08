"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getAllDailyHabits,
  getProfile,
  setProgramStart,
  type BasalEvaluation,
  type PeriodicEvaluation,
} from "../lib/storage";
import { CHECKLIST_KEY, CHECKLIST_TOTAL } from "../lib/plan-21-dias";
import {
  OPCIONES,
  calcularAdherencia,
  clasificarCierre,
  getEstadoCierre,
  UMBRAL_MEJORA,
  setEstadoCierre,
  type EstadoCierre,
  type OpcionContinuar,
} from "../lib/cierre";

interface Props {
  basal: BasalEvaluation | null;
  final: PeriodicEvaluation;
  inicioCiclo: string;
  onCerrar: () => void;
  onRepetir: () => void;
}

const BTN = "w-full py-3 bg-rest-accent hover:bg-[#00B880] text-rest-bg font-semibold rounded-xl transition-all shadow-[0_0_16px_rgba(0,229,160,0.3)] disabled:opacity-40 disabled:cursor-not-allowed";
const BTN_2 = "w-full py-3 bg-white/[0.04] hover:bg-rest-accent/10 text-rest-text-secondary hover:text-rest-accent rounded-xl transition-all text-sm font-medium";

function leerChecklist(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(CHECKLIST_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function CierreDia21({ basal, final, inicioCiclo, onCerrar, onRepetir }: Props) {
  const [estado, setEstado] = useState<EstadoCierre>({ inicioCiclo });
  const [adherencia, setAdherencia] = useState<number | null>(null);
  const registrado = useRef(false);

  useEffect(() => {
    setEstado(getEstadoCierre(inicioCiclo));
    setAdherencia(calcularAdherencia(leerChecklist(), CHECKLIST_TOTAL, getAllDailyHabits(), inicioCiclo).total);
  }, [inicioCiclo]);

  const b = basal?.resetq.global ?? null;
  const f = final.resetq.global;
  const resultado = useMemo(() => (adherencia === null ? null : clasificarCierre(b, f, adherencia)), [b, f, adherencia]);
  const alertaRespiratoria = final.resetq.phenotype === "SAFETY" || final.resetq.scoreB >= 3;

  const registrar = (extra: Record<string, unknown> = {}) => {
    const userId = localStorage.getItem("rest-user-id");
    if (!userId || !resultado) return Promise.resolve(false);
    return fetch("/api/cierre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        inicioCiclo,
        resultado,
        resetqBasal: b,
        resetqFinal: f,
        adherencia,
        alertaRespiratoria,
        ...extra,
      }),
    })
      .then((r) => r.ok)
      .catch(() => false);
  };

  // Se registra el resultado una vez por apertura.
  useEffect(() => {
    if (resultado && !registrado.current) {
      registrado.current = true;
      registrar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultado]);

  const actualizar = (cambios: Partial<EstadoCierre>, enviar = true) => {
    const nuevo = { ...estado, ...cambios };
    setEstado(nuevo);
    setEstadoCierre(nuevo);
    if (enviar) {
      registrar({
        signosFisicos: nuevo.signosFisicos,
        signosDigestivos: nuevo.signosDigestivos,
        alarmaDigestiva: nuevo.alarmaDigestiva,
      });
    }
  };

  if (!resultado) return null;

  const diff = b === null ? null : b - f;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <button onClick={onCerrar} className="text-rest-text-muted text-sm hover:text-white transition mb-3 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>
        <p className="text-rest-accent text-xs font-semibold tracking-[0.15em] uppercase">Cierre del día 21</p>
      </div>

      {/* Comparación con la basal */}
      <div className="p-5 rounded-2xl glass-card">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          <div>
            <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">Al inicio</p>
            <p className="text-3xl font-bold text-white">{b ?? "—"}<span className="text-sm text-rest-text-muted">/64</span></p>
          </div>
          <svg className="w-6 h-6 text-rest-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" /></svg>
          <div>
            <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-1">Día 21</p>
            <p className="text-3xl font-bold text-white">{f}<span className="text-sm text-rest-text-muted">/64</span></p>
          </div>
        </div>
        {diff !== null && (
          <p className={`text-center text-sm mt-3 ${diff >= UMBRAL_MEJORA ? "text-rest-accent" : "text-rest-text-secondary"}`}>
            {diff > 0 ? `Bajó ${diff} ${diff === 1 ? "punto" : "puntos"}` : diff < 0 ? `Subió ${-diff} ${diff === -1 ? "punto" : "puntos"}` : "Se mantuvo igual"}
            <span className="text-rest-text-muted"> · RESET-Q, menos es mejor</span>
          </p>
        )}
      </div>

      {alertaRespiratoria && (
        <div className="p-5 rounded-2xl bg-rest-danger/10 ring-1 ring-rest-danger/30">
          <p className="font-semibold text-white">Antes de seguir: revisa tu respiración al dormir</p>
          <p className="text-rest-text-secondary text-sm mt-1 leading-relaxed">
            Algunas respuestas, como ronquidos fuertes o pausas al respirar, sugieren una revisión médica. Si todavía no lo hiciste, agendar con tu médico es la prioridad.
          </p>
        </div>
      )}

      {resultado === "logrado" && (
        <Bloque titulo="Lo lograste">
          <p>
            Tu sistema nervioso está en <strong className="text-white">regulación preservada</strong>. Lo que hiciste estos 21 días funciona: ahora se trata de sostenerlo.
          </p>
          <p>La plataforma sigue abierta para ti, sin fecha de término. Vuelve a medirte cuando quieras.</p>
          <button onClick={onCerrar} className={BTN}>Volver a Mide tu sueño</button>
        </Bloque>
      )}

      {resultado === "parcial" && (
        <Parcial estado={estado} actualizar={actualizar} registrar={registrar} onCerrar={onCerrar} mejoro={b !== null} />
      )}

      {resultado === "sin_cambio_adherente" && (
        <Bloque titulo="Hiciste el trabajo. Ahora toca mirar más de cerca">
          <p>
            Cumpliste el plan ({adherencia}%) y tu evaluación se mantuvo. No es falta de esfuerzo: cuando los hábitos no alcanzan, suele haber algo más que conviene evaluar en persona.
          </p>
          <p>Te proponemos ver a un profesional de la Red Método REST para continuar con tratamiento manual.</p>
          <Solicitud
            opciones={["red_presencial", "profesional_asociado"]}
            estado={estado}
            actualizar={actualizar}
            registrar={registrar}
          />
        </Bloque>
      )}

      {resultado === "sin_cambio_no_adherente" && (
        <Repetir
          adherencia={adherencia ?? 0}
          inicioCiclo={inicioCiclo}
          estado={estado}
          actualizar={actualizar}
          registrar={registrar}
          onRepetir={onRepetir}
        />
      )}
    </div>
  );
}

/* ── Piezas ── */

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl glass-card space-y-4">
      <h1 className="text-2xl font-bold text-white leading-tight">{titulo}</h1>
      <div className="space-y-4 text-rest-text-secondary text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function SiNo({ pregunta, ayuda, valor, onChange }: { pregunta: string; ayuda: string; valor: boolean | undefined; onChange: (v: boolean) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-semibold text-white">{pregunta}</legend>
      <p className="text-rest-text-muted text-sm">{ayuda}</p>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[true, false].map((v) => (
          <button
            key={String(v)}
            type="button"
            aria-pressed={valor === v}
            onClick={() => onChange(v)}
            className={`min-h-[44px] rounded-xl text-sm font-medium transition ${
              valor === v ? "bg-rest-accent text-rest-bg" : "bg-white/[0.04] text-rest-text-secondary hover:bg-rest-accent/10"
            }`}
          >
            {v ? "Sí" : "No"}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

type Actualizar = (cambios: Partial<EstadoCierre>, enviar?: boolean) => void;
type Registrar = (extra?: Record<string, unknown>) => Promise<boolean>;

function Parcial({ estado, actualizar, registrar, onCerrar, mejoro }: { estado: EstadoCierre; actualizar: Actualizar; registrar: Registrar; onCerrar: () => void; mejoro: boolean }) {
  const { signosFisicos: fis, signosDigestivos: dig, alarmaDigestiva: alarma } = estado;
  const respondido = fis !== undefined && dig !== undefined && (dig === false || alarma !== undefined);
  const conSignos = fis === true || dig === true;

  return (
    <Bloque titulo={mejoro ? "Vimos que tu evaluación mejoró, pero todavía tienes algunas alteraciones" : "Todavía tienes algunas alteraciones"}>
      <p>Para saber cómo seguir, cuéntanos:</p>
      <SiNo
        pregunta="¿Tienes signos físicos?"
        ayuda="Tensión o dolor en cuello, espalda o mandíbula, respiración alta o corta, o el cuerpo apretado aunque estés descansando."
        valor={fis}
        onChange={(v) => actualizar({ signosFisicos: v })}
      />
      <SiNo
        pregunta="¿Tienes signos digestivos?"
        ayuda="Hinchazón, gases molestos o cambios en la deposición."
        valor={dig}
        onChange={(v) => actualizar({ signosDigestivos: v, alarmaDigestiva: v ? estado.alarmaDigestiva : undefined })}
      />
      {dig === true && (
        <SiNo
          pregunta="¿Tienes alguno de estos?"
          ayuda="Sangre en la deposición, baja de peso sin explicación o diarrea que te despierta en la noche."
          valor={alarma}
          onChange={(v) => actualizar({ alarmaDigestiva: v })}
        />
      )}

      {respondido && alarma === true && (
        <div className="p-4 rounded-xl bg-rest-danger/10 ring-1 ring-rest-danger/30 space-y-2">
          <p className="font-semibold text-white">Esto hay que verlo primero con un médico</p>
          <p className="text-sm">
            Sangre en la deposición, baja de peso sin explicación o diarrea nocturna no se tratan con hábitos ni con terapia manual antes de descartar una causa médica. Agenda con tu médico y cuéntale lo que marcaste.
          </p>
        </div>
      )}

      {respondido && alarma !== true && conSignos && (
        <>
          <p className="text-white font-medium pt-2">Te proponemos continuar con un tratamiento manual. Elige cómo:</p>
          <Solicitud opciones={["red_presencial", "rest_acompanado", "profesional_asociado"]} estado={estado} actualizar={actualizar} registrar={registrar} />
        </>
      )}

      {respondido && !conSignos && !estado.quiereProfesional && (
        <div className="space-y-3 pt-2">
          <p>
            Sin signos físicos ni digestivos, lo que falta suele ceder sosteniendo los hábitos. Sigue con la plataforma, que queda abierta para ti, y vuelve a medirte en 2 o 3 semanas.
          </p>
          <button onClick={onCerrar} className={BTN}>Seguir con la plataforma</button>
          <button onClick={() => actualizar({ quiereProfesional: true }, false)} className={BTN_2}>Igual quiero hablar con un profesional</button>
        </div>
      )}

      {respondido && !conSignos && estado.quiereProfesional && (
        <Solicitud opciones={["red_presencial", "rest_acompanado", "profesional_asociado"]} estado={estado} actualizar={actualizar} registrar={registrar} />
      )}
    </Bloque>
  );
}

function Repetir({ adherencia, inicioCiclo, estado, actualizar, registrar, onRepetir }: { adherencia: number; inicioCiclo: string; estado: EstadoCierre; actualizar: Actualizar; registrar: Registrar; onRepetir: () => void }) {
  const [confirmar, setConfirmar] = useState(false);
  const [acompanado, setAcompanado] = useState(!!estado.solicitud);

  const empezar = () => {
    const ahora = new Date().toISOString();
    // El checklist del ciclo anterior se archiva y el nuevo parte en blanco.
    try {
      const anterior = localStorage.getItem(CHECKLIST_KEY);
      if (anterior) localStorage.setItem(`${CHECKLIST_KEY}:${inicioCiclo}`, anterior);
      localStorage.removeItem(CHECKLIST_KEY);
    } catch { /* sin acceso a localStorage */ }
    setProgramStart(ahora);
    const userId = localStorage.getItem("rest-user-id");
    if (userId) {
      fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fields: { fecha_inicio_programa: ahora } }),
      }).catch(() => {});
    }
    onRepetir();
  };

  return (
    <Bloque titulo="Tu cuerpo todavía no tuvo sus 21 días">
      <p>
        Tu evaluación se mantuvo y el plan quedó en {adherencia}%. Eso no es un fracaso: es información. El sistema nervioso aprende por repetición, y lo que necesita son días seguidos, no días perfectos.
      </p>
      <p>
        Te proponemos partir de nuevo: <strong className="text-white">21 días más</strong>, y al final volvemos a medir y comparamos con tu inicio.
      </p>
      <ul className="space-y-2 text-sm">
        {[
          "Elige 2 o 3 hábitos del checklist que sí puedas hacer todos los días.",
          "Márcalos en la app cada día: eso es lo que te muestra tu avance.",
          "Si una noche falla, retoma al día siguiente. Lo que cuenta es la semana.",
        ].map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-rest-accent shrink-0" aria-hidden="true">●</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {!confirmar ? (
        <button onClick={() => setConfirmar(true)} className={BTN}>Empezar mis nuevos 21 días</button>
      ) : (
        <div className="p-4 rounded-xl bg-black/20 space-y-3">
          <p className="text-sm">Vuelves al día 1 y el checklist semanal parte en blanco. Tus evaluaciones anteriores se guardan.</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setConfirmar(false)} className={BTN_2}>Cancelar</button>
            <button onClick={empezar} className={BTN}>Confirmar</button>
          </div>
        </div>
      )}

      {!acompanado ? (
        <button onClick={() => setAcompanado(true)} className={BTN_2}>Prefiero hacerlo acompañado</button>
      ) : (
        <Solicitud opciones={["rest_acompanado"]} estado={estado} actualizar={actualizar} registrar={registrar} />
      )}
    </Bloque>
  );
}

function Solicitud({ opciones, estado, actualizar, registrar }: { opciones: OpcionContinuar[]; estado: EstadoCierre; actualizar: Actualizar; registrar: Registrar }) {
  const [opcion, setOpcion] = useState<OpcionContinuar>(opciones[0]);
  const [ciudad, setCiudad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  if (estado.solicitud) {
    const email = getProfile()?.email;
    return (
      <div className="p-4 rounded-xl bg-rest-accent/10 ring-1 ring-rest-accent/25 space-y-1" role="status">
        <p className="font-semibold text-white">Listo, recibimos tu solicitud</p>
        <p className="text-sm">
          Pediste: {OPCIONES[estado.solicitud.opcion].titulo}. Te vamos a escribir{email ? ` a ${email}` : ""} para coordinar.
        </p>
      </div>
    );
  }

  const pideCiudad = opcion === "red_presencial";
  const valido = !pideCiudad || ciudad.trim().length >= 2;

  const enviar = async () => {
    setEnviando(true);
    setError("");
    const ok = await registrar({
      signosFisicos: estado.signosFisicos,
      signosDigestivos: estado.signosDigestivos,
      alarmaDigestiva: estado.alarmaDigestiva,
      opcion,
      ciudad,
      telefono,
      comentario,
    });
    setEnviando(false);
    if (ok) actualizar({ solicitud: { opcion, en: new Date().toISOString() } }, false);
    else setError("No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo.");
  };

  return (
    <div className="space-y-4">
      {opciones.length > 1 && (
        <div className="space-y-2" role="radiogroup" aria-label="Cómo quieres continuar">
          {opciones.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={opcion === o}
              onClick={() => setOpcion(o)}
              className={`w-full text-left p-4 rounded-xl transition ${
                opcion === o ? "bg-rest-accent/10 ring-1 ring-rest-accent/50" : "bg-white/[0.03] hover:bg-rest-accent/[0.05]"
              }`}
            >
              <span className={`block font-semibold text-sm ${opcion === o ? "text-rest-accent" : "text-white"}`}>{OPCIONES[o].titulo}</span>
              <span className="block text-rest-text-muted text-sm mt-0.5">{OPCIONES[o].detalle}</span>
            </button>
          ))}
        </div>
      )}
      {opciones.length === 1 && (
        <div className="p-4 rounded-xl bg-white/[0.03]">
          <p className="font-semibold text-sm text-white">{OPCIONES[opcion].titulo}</p>
          <p className="text-rest-text-muted text-sm mt-0.5">{OPCIONES[opcion].detalle}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="text-sm text-rest-text-secondary">Ciudad o comuna{pideCiudad ? "" : " (opcional)"}</span>
          <input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            maxLength={80}
            autoComplete="address-level2"
            className="mt-1 w-full min-h-[44px] px-3 rounded-xl bg-black/30 text-white placeholder:text-rest-text-muted outline-none focus:ring-2 focus:ring-rest-accent/50"
            placeholder="Ej: Viña del Mar"
          />
        </label>
        <label className="block">
          <span className="text-sm text-rest-text-secondary">WhatsApp (opcional)</span>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            maxLength={30}
            inputMode="tel"
            autoComplete="tel"
            className="mt-1 w-full min-h-[44px] px-3 rounded-xl bg-black/30 text-white placeholder:text-rest-text-muted outline-none focus:ring-2 focus:ring-rest-accent/50"
            placeholder="+56 9 …"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-rest-text-secondary">¿Algo que quieras contarnos? (opcional)</span>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={600}
          rows={3}
          className="mt-1 w-full px-3 py-2 rounded-xl bg-black/30 text-white placeholder:text-rest-text-muted outline-none focus:ring-2 focus:ring-rest-accent/50"
          placeholder="Ej: el dolor de cuello aparece en la noche"
        />
      </label>
      <p className="text-rest-text-muted text-xs">La consulta con el profesional se paga aparte del método.</p>
      {error && <p className="text-rest-danger text-sm" role="alert">{error}</p>}
      <button onClick={enviar} disabled={!valido || enviando} className={BTN}>
        {enviando ? "Enviando…" : "Quiero que me contacten"}
      </button>
    </div>
  );
}
