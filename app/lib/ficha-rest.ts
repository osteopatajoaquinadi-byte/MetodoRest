/* ═══════════════════════════════════════════════════════════════
   Ficha de evaluación REST — lógica del algoritmo
   Protocolo de decisión clínica para la Red Método REST.
   No es una herramienta diagnóstica. Puntos de corte provisionales.
   ═══════════════════════════════════════════════════════════════ */

export type Puntaje = 0 | 1 | 2;

/* ── Módulo 0 · Banderas rojas ── */

export const BANDERAS_ROJAS = [
  { id: "apnea", texto: "Ronquido fuerte, pausas respiratorias observadas, despertares con ahogo o somnolencia marcada al conducir", destino: "Estudio de sueño (sospecha de apnea)" },
  { id: "piernas", texto: "Piernas inquietas al acostarse, que alivian al moverlas", destino: "Médico (estudio de piernas inquietas y hierro)" },
  { id: "conductas", texto: "Conductas violentas o peligrosas durante el sueño", destino: "Neurología o medicina del sueño" },
  { id: "suicidio", texto: "Ideación suicida o de autolesión", destino: "Salud mental de forma inmediata (en Chile, línea *4141)" },
  { id: "sangre", texto: "Sangre en la deposición", destino: "Médico" },
  { id: "peso", texto: "Baja de peso sin explicación", destino: "Médico" },
  { id: "diarreaNocturna", texto: "Diarrea que despierta en la noche", destino: "Médico" },
  { id: "grasosa", texto: "Deposición grasosa o aceitosa, que mancha el inodoro o cuesta tirar", destino: "Médico (descartar malabsorción)" },
  { id: "anemia", texto: "Anemia", destino: "Médico" },
  { id: "inicio50", texto: "Inicio de síntomas digestivos después de los 50 años", destino: "Médico" },
  { id: "antecedentes", texto: "Antecedentes familiares de cáncer colorrectal, celiaquía o enfermedad inflamatoria intestinal", destino: "Médico" },
] as const;

export type BanderaRojaId = (typeof BANDERAS_ROJAS)[number]["id"];

export const PHQ4 = [
  { id: "ans1", texto: "Sentirse nervioso, ansioso o con los nervios de punta", sub: "ansiedad" },
  { id: "ans2", texto: "No poder dejar de preocuparse o no poder controlar la preocupación", sub: "ansiedad" },
  { id: "dep1", texto: "Poco interés o placer en hacer las cosas", sub: "animo" },
  { id: "dep2", texto: "Sentirse decaído, deprimido o sin esperanza", sub: "animo" },
] as const;

export const PHQ4_OPCIONES = ["Nunca", "Varios días", "Más de la mitad de los días", "Casi todos los días"] as const;

/* ── Módulo 1 · Ejes de sueño ── */

export const EJES = [
  {
    id: "circadiano",
    nombre: "Circadiano",
    preguntas: [
      "Duerme más de 2 horas más tarde en días libres que en días laborales",
      "No logra dormirse antes de la 1:00, o despierta muy temprano sin poder volver a dormir",
      "Recibe poca luz natural en la primera hora del día, o trabaja en turnos",
    ],
    enfasis: "Hora fija de despertar todos los días, luz natural en la primera hora, oscuridad y menos pantallas en la noche, horario regular de comidas.",
  },
  {
    id: "presion",
    nombre: "Presión de sueño",
    preguntas: [
      "Pasa más de 1 hora despierto en la cama por noche",
      "Duerme siesta",
      "Hace poca actividad física, o toma café después de las 14:00",
    ],
    enfasis: "Reducir el tiempo en cama, eliminar siestas, actividad física y fuerza durante el día.",
  },
  {
    id: "ultradiano",
    nombre: "Ultradiano",
    preguntas: [
      "Despierta a la misma hora casi todas las noches",
      "Despierta con alarma con mucha inercia, como \"drogado\"",
      "Tiene bajones de energía regulares durante el día",
    ],
    enfasis: "Ajustar la hora de despertar a ciclos de unos 90 minutos y hacer pausas breves durante el día (evidencia débil: usar como ajuste fino).",
  },
  {
    id: "hiperactivacion",
    nombre: "Hiperactivación",
    preguntas: [
      "Mente acelerada o rumiación al acostarse",
      "Tensión física o sensación de alerta en la cama",
      "Se siente \"cansado pero activado\" en la noche",
    ],
    enfasis: "Regulación autonómica, respiración lenta, trabajo manual y descarga cognitiva antes de dormir.",
  },
] as const;

export type EjeId = (typeof EJES)[number]["id"];

export const UMBRAL_EJE_ACTIVO = 4; // provisional, de 0 a 6

/* ── Módulo 2 · Banderas amarillas ── */

export const SOCIOECONOMICAS = [
  { id: "turnos", texto: "Turnos o trabajo nocturno" },
  { id: "ingresos", texto: "Inseguridad laboral o de ingresos" },
  { id: "cuidador", texto: "Rol de cuidador de otra persona" },
  { id: "entorno", texto: "Ruido o pieza compartida para dormir" },
] as const;

export type SocioId = (typeof SOCIOECONOMICAS)[number]["id"];

/* ── Módulo 3 · Examen manual ── */

export const HALLAZGOS_MANUALES = [
  { id: "toracicoAlto", texto: "Patrón respiratorio torácico alto", intervencion: "Reeducación respiratoria lenta y diafragmática" },
  { id: "expansion", texto: "Expansión costal inferior reducida o asimétrica", intervencion: "Técnicas diafragmáticas y costales" },
  { id: "cervical", texto: "Cervical alta: limitación de rotación o dolor a la provocación", intervencion: "Técnicas cervicales y suboccipitales" },
  { id: "toracica", texto: "Torácica: limitación clara de rotación o extensión", intervencion: "Movilización torácica" },
  { id: "abdomen", texto: "Abdomen: dolor a la palpación profunda o distensión después de comer", intervencion: "Trabajo visceral y reeducación diafragmática" },
] as const;

export type HallazgoId = (typeof HALLAZGOS_MANUALES)[number]["id"];

/* ── Módulo 4 · Filtro de seguridad ── */

export const SEGURIDAD = [
  { id: "embarazo", texto: "Embarazo o lactancia" },
  { id: "renal", texto: "Enfermedad renal" },
  { id: "hepatica", texto: "Enfermedad hepática" },
  { id: "tiroides", texto: "Enfermedad tiroidea o uso de levotiroxina" },
  { id: "autoinmune", texto: "Enfermedad autoinmune o uso de inmunosupresores" },
  { id: "psicofarmacos", texto: "Hipnóticos, benzodiacepinas, antidepresivos u otros psicofármacos" },
  { id: "interacciones", texto: "Bisfosfonatos o antibióticos (quinolonas, tetraciclinas) en uso" },
] as const;

export type SeguridadId = (typeof SEGURIDAD)[number]["id"];

/* ── Estado de la ficha ── */

export interface FichaInput {
  codigo: string;
  edad: string;
  fecha: string;
  consentimiento: boolean;
  rojas: Partial<Record<BanderaRojaId, boolean>>;
  phq: (number | null)[]; // 4 ítems, 0–3
  ejes: Record<EjeId, (Puntaje | null)[]>; // 3 ítems por eje
  resetqHiperactivacion: string;
  socio: Partial<Record<SocioId, boolean>>;
  estresSostenido: boolean; // estrés percibido > 3 meses
  digestivo: {
    hinchazon: boolean; // ≥ 3 días/semana durante ≥ 3 meses
    bristol: number | null; // tipo predominante 1–7
    flota: boolean;
    gases: boolean;
    distension: boolean;
    postInfeccion: boolean;
  };
  dolorCronico: boolean; // > 3 meses
  frecuenciaRespiratoria: string;
  manual: Partial<Record<HallazgoId, boolean>>;
  seguridad: Partial<Record<SeguridadId, boolean>>;
  magnesio: { usa: boolean; ingesta: "" | "baja" | "media" | "alta" };
}

export function fichaVacia(): FichaInput {
  return {
    codigo: "",
    edad: "",
    fecha: new Date().toISOString().slice(0, 10),
    consentimiento: false,
    rojas: {},
    phq: [null, null, null, null],
    ejes: {
      circadiano: [null, null, null],
      presion: [null, null, null],
      ultradiano: [null, null, null],
      hiperactivacion: [null, null, null],
    },
    resetqHiperactivacion: "",
    socio: {},
    estresSostenido: false,
    digestivo: { hinchazon: false, bristol: null, flota: false, gases: false, distension: false, postInfeccion: false },
    dolorCronico: false,
    frecuenciaRespiratoria: "",
    manual: {},
    seguridad: {},
    magnesio: { usa: false, ingesta: "" },
  };
}

/* ── Resultado ── */

export type EstadoSugerencia = "sugerido" | "condicionado" | "no";

export interface Sugerencia {
  nombre: string;
  estado: EstadoSugerencia;
  detalle: string[];
}

export interface ResultadoEje {
  id: EjeId;
  nombre: string;
  puntaje: number;
  completo: boolean;
  activo: boolean;
  enfasis: string;
}

export interface ResultadoAmarilla {
  id: "socio" | "estres" | "digestiva" | "dolor";
  nombre: string;
  activa: boolean;
  motivo: string;
}

export interface Resultado {
  phqTotal: number | null;
  phqBanda: "normal" | "leve" | "moderado" | "severo" | null;
  derivaciones: { motivo: string; destino: string }[];
  coordinar: string[];
  ejes: ResultadoEje[];
  dominantes: ResultadoEje[];
  amarillas: ResultadoAmarilla[];
  hallazgos: { texto: string; intervencion: string }[];
  suplementos: Sugerencia[];
  digestivo: string[];
  ruta: string;
  presencial: boolean;
  completitud: number; // 0–100
}

function bandaPHQ(total: number): Resultado["phqBanda"] {
  if (total >= 9) return "severo";
  if (total >= 6) return "moderado";
  if (total >= 3) return "leve";
  return "normal";
}

export function calcular(f: FichaInput): Resultado {
  /* PHQ-4 */
  const phqCompleto = f.phq.every((v) => v !== null);
  const phqTotal = phqCompleto ? f.phq.reduce<number>((a, v) => a + (v ?? 0), 0) : null;
  const phqBanda = phqTotal === null ? null : bandaPHQ(phqTotal);

  /* Banderas rojas */
  const derivaciones: Resultado["derivaciones"] = BANDERAS_ROJAS.filter((b) => f.rojas[b.id]).map((b) => ({
    motivo: b.texto,
    destino: b.destino,
  }));
  if (phqBanda === "severo") {
    derivaciones.push({ motivo: `PHQ-4 en rango severo (${phqTotal} de 12)`, destino: "Salud mental antes de iniciar" });
  }
  const hayRoja = derivaciones.length > 0;
  const alarmaDigestiva = (["sangre", "peso", "diarreaNocturna", "grasosa", "anemia", "inicio50", "antecedentes"] as const).some(
    (id) => f.rojas[id],
  );

  const coordinar: string[] = [];
  if (phqBanda === "moderado") coordinar.push(`PHQ-4 en rango moderado (${phqTotal} de 12): coordinar con su médico o psicólogo antes de iniciar.`);
  if (f.seguridad.psicofarmacos) coordinar.push("Usa psicofármacos o hipnóticos: no se suspenden ni se modifican; cualquier suplemento requiere el visto bueno de quien los indicó.");

  /* Ejes */
  const ejes: ResultadoEje[] = EJES.map((e) => {
    const items = f.ejes[e.id];
    const puntaje = items.reduce<number>((a, v) => a + (v ?? 0), 0);
    return {
      id: e.id,
      nombre: e.nombre,
      puntaje,
      completo: items.every((v) => v !== null),
      activo: puntaje >= UMBRAL_EJE_ACTIVO,
      enfasis: e.enfasis,
    };
  });
  const max = Math.max(...ejes.map((e) => e.puntaje));
  const dominantes = max > 0 ? ejes.filter((e) => e.puntaje === max) : [];
  const hiper = ejes.find((e) => e.id === "hiperactivacion")!;

  /* Banderas amarillas */
  const socioActiva = SOCIOECONOMICAS.some((s) => f.socio[s.id]);
  const phqEnRango = phqTotal !== null && phqTotal >= 3 && phqTotal <= 8;
  const estresActiva = f.estresSostenido && (phqEnRango || hiper.puntaje >= UMBRAL_EJE_ACTIVO);
  const d = f.digestivo;
  const bristolFuncional = d.bristol !== null && d.bristol >= 5 && d.bristol <= 7;
  const digestivaActiva = !alarmaDigestiva && (d.hinchazon || bristolFuncional || d.gases || d.distension);

  const amarillas: ResultadoAmarilla[] = [
    {
      id: "socio",
      nombre: "Socioeconómica",
      activa: socioActiva,
      motivo: socioActiva
        ? SOCIOECONOMICAS.filter((s) => f.socio[s.id]).map((s) => s.texto).join("; ")
        : "Sin factores registrados",
    },
    {
      id: "estres",
      nombre: "Estrés persistente",
      activa: estresActiva,
      motivo: estresActiva
        ? "Estrés sostenido por más de 3 meses, con PHQ-4 entre 3 y 8 o hiperactivación alta"
        : f.estresSostenido
          ? "Estrés sostenido, pero sin PHQ-4 entre 3 y 8 ni hiperactivación alta"
          : "Sin estrés sostenido por más de 3 meses",
    },
    {
      id: "digestiva",
      nombre: "Digestiva funcional",
      activa: digestivaActiva,
      motivo: alarmaDigestiva
        ? "Hay banderas rojas digestivas: primero la derivación"
        : digestivaActiva
          ? [
              d.hinchazon && "hinchazón persistente",
              bristolFuncional && `Bristol ${d.bristol} predominante`,
              d.gases && "gases molestos",
              d.distension && "distensión después de comer",
            ]
              .filter(Boolean)
              .join(", ")
          : d.flota
            ? "Deposición que flota sin otros síntomas: normal"
            : "Sin síntomas digestivos funcionales",
    },
    {
      id: "dolor",
      nombre: "Dolor o tensión persistente",
      activa: f.dolorCronico,
      motivo: f.dolorCronico ? "Dolor musculoesquelético por más de 3 meses" : "Sin dolor persistente",
    },
  ];

  /* Examen manual */
  const hallazgos = HALLAZGOS_MANUALES.filter((h) => f.manual[h.id]).map((h) => ({ texto: h.texto, intervencion: h.intervencion }));

  /* Suplementación (Módulo 4) */
  const s = f.seguridad;
  const condicionadoPorFarmacos = !!s.psicofarmacos;
  const suplementos: Sugerencia[] = [];

  if (hayRoja) {
    const motivo = "Primero la derivación: no se sugieren suplementos mientras haya banderas rojas.";
    suplementos.push(
      { nombre: "Magnesio bisglicinato", estado: "no", detalle: [motivo] },
      { nombre: "Ashwagandha", estado: "no", detalle: [motivo] },
      { nombre: "Glutamina", estado: "no", detalle: [motivo] },
    );
  } else {
    /* Magnesio */
    if (s.embarazo) {
      suplementos.push({ nombre: "Magnesio bisglicinato", estado: "no", detalle: ["Embarazo o lactancia: sin suplementos."] });
    } else if (s.renal) {
      suplementos.push({ nombre: "Magnesio bisglicinato", estado: "no", detalle: ["Enfermedad renal: riesgo de acumulación de magnesio."] });
    } else if (f.magnesio.usa) {
      suplementos.push({
        nombre: "Magnesio bisglicinato",
        estado: condicionadoPorFarmacos ? "condicionado" : "sugerido",
        detalle: [
          "Ya lo usa: verificar que su dosis aporte entre 85 y 250 mg de magnesio elemental en la noche, sin superar 350 mg al día.",
          ...(s.interacciones ? ["Separar 4 horas de bisfosfonatos y antibióticos (quinolonas, tetraciclinas)."] : []),
        ],
      });
    } else {
      const detalle = [
        "Mínimo 600 mg del compuesto en la noche (unos 85 mg de magnesio elemental).",
        "Se puede subir hasta unos 1,8 g del compuesto (250 mg elementales), la dosis estudiada. Nunca más de 350 mg de magnesio elemental al día.",
        "Revisar en la etiqueta cuánto magnesio elemental aporta el producto.",
      ];
      if (s.tiroides) detalle.push("Separar 4 horas de la levotiroxina.");
      if (s.interacciones) detalle.push("Separar 4 horas de bisfosfonatos y antibióticos (quinolonas, tetraciclinas).");
      if (f.magnesio.ingesta === "baja") detalle.push("Ingesta baja de magnesio en la dieta: posible mejor respuesta (dato exploratorio).");
      suplementos.push({ nombre: "Magnesio bisglicinato", estado: condicionadoPorFarmacos ? "condicionado" : "sugerido", detalle });
    }

    /* Ashwagandha */
    const contraAshwa = [
      s.embarazo && "embarazo o lactancia",
      s.hepatica && "enfermedad hepática",
      s.tiroides && "enfermedad tiroidea o levotiroxina",
      s.autoinmune && "enfermedad autoinmune o inmunosupresores",
      s.psicofarmacos && "psicofármacos o hipnóticos",
    ].filter(Boolean) as string[];
    if (!estresActiva) {
      suplementos.push({ nombre: "Ashwagandha", estado: "no", detalle: ["Sin bandera amarilla de estrés persistente."] });
    } else if (contraAshwa.length > 0) {
      suplementos.push({ nombre: "Ashwagandha", estado: "no", detalle: [`Contraindicada: ${contraAshwa.join(", ")}.`] });
    } else {
      suplementos.push({
        nombre: "Ashwagandha",
        estado: "sugerido",
        detalle: [
          "600 mg al día de extracto estandarizado de raíz durante 8 semanas; luego reevaluar.",
          "Suspender de inmediato y derivar si aparece piel u ojos amarillos, picazón generalizada u orina oscura.",
        ],
      });
    }

    /* Glutamina */
    const perfilGlutamina = digestivaActiva && d.hinchazon && bristolFuncional;
    if (!perfilGlutamina) {
      suplementos.push({
        nombre: "Glutamina",
        estado: "no",
        detalle: ["Requiere hinchazón persistente con Bristol 5 a 7 predominante y sin banderas rojas digestivas."],
      });
    } else if (s.embarazo || s.hepatica || s.renal) {
      suplementos.push({
        nombre: "Glutamina",
        estado: "no",
        detalle: [`Contraindicada: ${[s.embarazo && "embarazo o lactancia", s.hepatica && "enfermedad hepática", s.renal && "enfermedad renal"].filter(Boolean).join(", ")}.`],
      });
    } else {
      suplementos.push({
        nombre: "Glutamina",
        estado: condicionadoPorFarmacos ? "condicionado" : "sugerido",
        detalle: [
          "5 g antes de cada comida, 3 veces al día, durante 8 semanas.",
          d.postInfeccion
            ? "Inicio después de una infección intestinal: es el perfil donde hay ensayo clínico."
            : "Sin inicio posinfeccioso: la evidencia es una extrapolación (debatido).",
        ],
      });
    }
  }

  /* Recomendaciones digestivas */
  const digestivo: string[] = [];
  if (!alarmaDigestiva) {
    if (digestivaActiva) {
      if (d.distension || f.manual.abdomen) digestivo.push("Reeducación diafragmática para la distensión después de comer.");
      digestivo.push("Caminar 10 a 15 minutos después de las comidas principales.");
      digestivo.push("Comer lento; evitar bebidas con gas, chicle y endulzantes como sorbitol, xilitol o maltitol.");
      digestivo.push("Si los lácteos empeoran los síntomas, probar 2 semanas con menos lactosa.");
      if (d.hinchazon) digestivo.push("Si la hinchazón persiste con estas medidas, derivar a nutricionista para dieta baja en FODMAP con reintroducción guiada.");
    } else if (d.flota) {
      digestivo.push("Deposición que flota sin otros síntomas: es normal y no requiere intervención.");
    }
  }

  /* Ruta */
  const presencial = !hayRoja && (f.dolorCronico || hallazgos.length > 0);
  let ruta: string;
  if (hayRoja) {
    ruta = "Derivar primero. El Método REST queda, como máximo, como complemento autorizado por el médico tratante.";
  } else {
    const nombres = dominantes.map((e) => e.nombre.toLowerCase()).join(" y ");
    const enfasis =
      dominantes.length === 1 ? ` con énfasis en el eje ${nombres}` : dominantes.length > 1 ? ` con énfasis en los ejes ${nombres}` : "";
    ruta = `Método REST completo${enfasis}.`;
    if (presencial) ruta += " Considerar consulta presencial con un profesional de la red para los hallazgos manuales.";
  }

  /* Completitud: PHQ-4 + 12 ítems de ejes + consentimiento */
  const respondidos =
    f.phq.filter((v) => v !== null).length +
    EJES.reduce((a, e) => a + f.ejes[e.id].filter((v) => v !== null).length, 0) +
    (f.consentimiento ? 1 : 0);
  const completitud = Math.round((respondidos / 17) * 100);

  return {
    phqTotal,
    phqBanda,
    derivaciones,
    coordinar,
    ejes,
    dominantes,
    amarillas,
    hallazgos,
    suplementos,
    digestivo,
    ruta,
    presencial,
    completitud,
  };
}

/* ── Resumen en texto para copiar a la ficha clínica ── */

export function resumenTexto(f: FichaInput, r: Resultado, profesional: string): string {
  const L: string[] = [];
  L.push("FICHA REST · Red Método REST");
  L.push(`Paciente: ${f.codigo || "(sin código)"}${f.edad ? ` · ${f.edad} años` : ""} · Fecha: ${f.fecha}`);
  L.push(`Profesional: ${profesional}`);
  L.push(`Consentimiento: ${f.consentimiento ? "sí" : "NO REGISTRADO"}`);
  L.push("");
  L.push(`RUTA: ${r.ruta}`);
  if (r.derivaciones.length) {
    L.push("");
    L.push("Derivaciones:");
    r.derivaciones.forEach((d) => L.push(`- ${d.motivo} → ${d.destino}`));
  }
  if (r.coordinar.length) {
    L.push("");
    L.push("Coordinar:");
    r.coordinar.forEach((c) => L.push(`- ${c}`));
  }
  L.push("");
  L.push(`PHQ-4: ${r.phqTotal === null ? "incompleto" : `${r.phqTotal}/12 (${r.phqBanda})`}`);
  L.push(`Ejes de sueño: ${r.ejes.map((e) => `${e.nombre} ${e.puntaje}/6${e.activo ? " (activo)" : ""}`).join(" · ")}`);
  if (f.resetqHiperactivacion) L.push(`RESET-Q, subescala de hiperactivación: ${f.resetqHiperactivacion}`);
  if (r.dominantes.length) {
    L.push("Énfasis del plan:");
    r.dominantes.forEach((e) => L.push(`- ${e.nombre}: ${e.enfasis}`));
  }
  L.push("");
  L.push("Banderas amarillas:");
  r.amarillas.forEach((a) => L.push(`- ${a.nombre}: ${a.activa ? "ACTIVA" : "no"} (${a.motivo})`));
  L.push("");
  if (f.frecuenciaRespiratoria) L.push(`Frecuencia respiratoria en reposo: ${f.frecuenciaRespiratoria} rpm`);
  if (r.hallazgos.length) {
    L.push("Hallazgos manuales:");
    r.hallazgos.forEach((h) => L.push(`- ${h.texto} → ${h.intervencion}`));
  } else {
    L.push("Hallazgos manuales: ninguno registrado");
  }
  L.push("");
  L.push("Suplementación (sugerencias generales, no prescripción):");
  r.suplementos.forEach((s) => {
    const estado = s.estado === "sugerido" ? "SUGERIDO" : s.estado === "condicionado" ? "CONDICIONADO al visto bueno médico" : "no";
    L.push(`- ${s.nombre}: ${estado}`);
    s.detalle.forEach((d) => L.push(`    ${d}`));
  });
  if (r.digestivo.length) {
    L.push("");
    L.push("Recomendaciones digestivas:");
    r.digestivo.forEach((d) => L.push(`- ${d}`));
  }
  L.push("");
  L.push("Protocolo de decisión clínica, no diagnóstico. Puntos de corte provisionales.");
  return L.join("\n");
}
