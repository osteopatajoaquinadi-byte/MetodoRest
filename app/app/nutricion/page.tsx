"use client";

import { useState } from "react";

const meals = [
  { protein: "Pavo", side: "Espinaca + zapallo italiano (vapor)", fat: "Aceite de oliva + semillas de zapallo", goal: "Estimular síntesis de melatonina", tags: ["Triptófano", "Magnesio"] },
  { protein: "Salmón / sardinas", side: "Brócoli + coliflor asados", fat: "Palta", goal: "Antiinflamatorio + apoyo GABA", tags: ["Omega-3", "Antiinflamatorio"] },
  { protein: "Pollo", side: "Caldo de huesos + verduras cocidas", fat: "Grasa natural del caldo", goal: "Reparación intestinal", tags: ["Glutamina", "Zinc"] },
  { protein: "Huevos (2-3)", side: "Espárragos salteados", fat: "Aceite de coco u oliva", goal: "Relajación del sistema nervioso", tags: ["Colina", "Magnesio"] },
  { protein: "Carne magra (lomo)", side: "Puré de coliflor", fat: "Ghee o aceite de oliva", goal: "Estabilidad glucémica nocturna", tags: ["Hierro", "B12"] },
  { protein: "Tofu / tempeh", side: "Verduras salteadas (pak choi, zapallo)", fat: "Aceite de sésamo", goal: "Opción vegetal calmante", tags: ["Vegetal", "Magnesio"] },
  { protein: "Pescado blanco (reineta)", side: "Espinaca cocida + champiñones", fat: "Aceite de oliva + nueces", goal: "Cena liviana, sueño profundo", tags: ["Liviano", "Triptófano"] },
];

const nutrients = [
  {
    name: "Triptófano + Magnesio",
    func: "Promueven la relajación y la producción de serotonina, precursora de la melatonina.",
    foods: ["Pavo", "Plátano", "Huevos", "Espinacas", "Almendras", "Semillas de calabaza"],
    color: "from-rest-accent to-emerald-400",
  },
  {
    name: "Glutamina + Zinc",
    func: "Contribuyen a la reparación de la barrera intestinal y al equilibrio del sistema nervioso.",
    foods: ["Caldo de huesos", "Espinacas", "Semillas de calabaza", "Carne de res"],
    color: "from-teal-400 to-cyan-400",
  },
  {
    name: "Fibra Prebiótica",
    func: "Alimenta las bacterias beneficiosas del intestino, favoreciendo una microbiota equilibrada.",
    foods: ["Ajo", "Cebolla", "Espárragos", "Plátano verde", "Avena"],
    color: "from-cyan-400 to-blue-400",
  },
];

const preparations = [
  {
    name: "Salmón al horno con brócoli",
    time: "25 min",
    ingredients: ["1 filete de salmón", "1 taza de brócoli", "½ palta", "Aceite de oliva", "Limón", "Sal y pimienta"],
    steps: ["Precalienta el horno a 200°C.", "Coloca el salmón en una bandeja con papel. Sazona con sal, pimienta y limón.", "Rodea con los floretes de brócoli rociados con aceite de oliva.", "Hornea 18-20 min hasta que el salmón esté cocido.", "Sirve con medio palta laminada."],
    tag: "Omega-3 · Antiinflamatorio",
  },
  {
    name: "Bowl de pavo con espinaca y zapallo",
    time: "20 min",
    ingredients: ["150g pechuga de pavo", "2 tazas de espinaca", "1 taza zapallo italiano", "Semillas de zapallo", "Aceite de oliva"],
    steps: ["Corta el zapallo en medias lunas finas. Saltea en aceite de oliva 5 min.", "Agrega el pavo cortado en tiras. Cocina 6-8 min.", "Incorpora la espinaca y cocina 2 min hasta que se reduzca.", "Sirve en un bowl y decora con semillas de zapallo."],
    tag: "Triptófano · Melatonina",
  },
  {
    name: "Caldo de huesos con verduras",
    time: "15 min (caldo pre-hecho)",
    ingredients: ["2 tazas de caldo de huesos", "½ taza zanahoria picada", "½ taza apio picado", "1 diente de ajo", "Jengibre rallado", "Sal"],
    steps: ["Calienta el caldo de huesos a fuego medio.", "Agrega zanahoria, apio, ajo picado y jengibre.", "Cocina 10-12 min hasta que las verduras estén tiernas.", "Sirve caliente. Puedes agregar pollo desmenuzado."],
    tag: "Glutamina · Reparación intestinal",
  },
  {
    name: "Huevos revueltos con espárragos",
    time: "10 min",
    ingredients: ["2-3 huevos", "6 espárragos", "Aceite de coco", "Sal y pimienta", "Cúrcuma (opcional)"],
    steps: ["Corta los espárragos en trozos de 3 cm, descartando la base dura.", "Saltea en aceite de coco a fuego medio 3-4 min.", "Bate los huevos con sal, pimienta y cúrcuma.", "Vierte sobre los espárragos y revuelve suavemente hasta cuajar.", "Sirve inmediatamente."],
    tag: "Colina · Relajación nerviosa",
  },
  {
    name: "Puré de coliflor con lomo",
    time: "30 min",
    ingredients: ["1 coliflor pequeña", "150g lomo de res", "Ghee o aceite de oliva", "Sal, pimienta, ajo en polvo", "Caldo (para el puré)"],
    steps: ["Hierve la coliflor en trozos 15 min hasta que esté muy blanda.", "Escurre y procesa con un poco de caldo, ghee, sal y ajo en polvo.", "Mientras, sazona el lomo y cocínalo en sartén caliente 3-4 min por lado.", "Deja reposar 5 min y corta en láminas.", "Sirve sobre el puré."],
    tag: "Hierro · B12 · Glucemia estable",
  },
  {
    name: "Salteado de tofu con pak choi",
    time: "15 min",
    ingredients: ["200g tofu firme", "2 pak choi", "½ zapallo italiano", "Aceite de sésamo", "Salsa de soya (baja en sodio)", "Jengibre"],
    steps: ["Corta el tofu en cubos y seca con papel absorbente.", "Calienta aceite de sésamo. Dora el tofu 4-5 min por lado.", "Agrega pak choi cortado, zapallo en medias lunas y jengibre rallado.", "Saltea 3-4 min. Termina con un chorrito de salsa de soya.", "Sirve caliente."],
    tag: "Vegetal · Magnesio",
  },
  {
    name: "Reineta al vapor con espinaca y champiñones",
    time: "20 min",
    ingredients: ["1 filete de reineta", "1 taza champiñones", "2 tazas espinaca", "Aceite de oliva", "Nueces picadas", "Limón"],
    steps: ["Cocina la reineta al vapor 12-15 min (o envuelta en papel aluminio al horno).", "Saltea los champiñones laminados en aceite de oliva 4 min.", "Agrega la espinaca y cocina 1-2 min.", "Sirve la reineta sobre la base de verduras.", "Corona con nueces picadas y un chorrito de limón."],
    tag: "Liviano · Sueño profundo",
  },
];

const avoidList = [
  { item: "Azúcar y Edulcorantes", reason: "Alteran la microbiota y son proinflamatorios" },
  { item: "Aceites vegetales refinados", reason: "Altos en Omega-6 proinflamatorio" },
  { item: "Ultraprocesados", reason: "Emulsionantes y aditivos dañan la barrera intestinal" },
  { item: "Exceso de alcohol", reason: "Permeabiliza el intestino y destruye la arquitectura del sueño" },
  { item: "Carbohidratos refinados en la noche", reason: "La insulina alta disminuye la secreción de melatonina" },
];

export default function NutricionPage() {
  const [tab, setTab] = useState<"nutrientes" | "cenas" | "preparaciones" | "evitar">("evitar");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Plan nutricional nocturno</h1>
        <p className="text-rest-text-muted mt-1">Cenas que no sabotean tu descanso</p>
      </div>

      {/* Tabs */}
      <div className="relative flex p-1.5 rounded-2xl bg-rest-card backdrop-blur-xl">
        {/* Sliding indicator */}
        {(() => {
          const tabs = ["evitar", "cenas", "preparaciones", "nutrientes"];
          const idx = tabs.indexOf(tab);
          return (
            <div
              className="absolute top-1.5 bottom-1.5 rounded-xl bg-black/40 shadow-[0_2px_6px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out"
              style={{
                width: `calc((100% - 12px) / ${tabs.length})`,
                left: `calc(${idx} * (100% - 12px) / ${tabs.length} + 6px)`,
              }}
            />
          );
        })()}
        {[
          { key: "evitar", label: "Evitar" },
          { key: "cenas", label: "Cenas" },
          { key: "preparaciones", label: "Recetas" },
          { key: "nutrientes", label: "Nutrientes" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`relative z-10 flex-1 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-200 ${
              tab === t.key
                ? "text-white/80"
                : "text-rest-text-muted hover:text-rest-text-secondary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Intro */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-rest-accent/10 to-rest-accent/5">
        <p className="text-sm text-rest-text-secondary leading-relaxed">
          <span className="font-medium text-rest-text">La mejor cena no es la más &ldquo;perfecta&rdquo;.</span>{" "}
          Es la que tu cuerpo tolera bien y no interfiere con tu descanso. Busca cenas que te dejen satisfecho, no pesado; nutrido, no sobrecargado.
        </p>
      </div>

      {tab === "cenas" && (
        <div className="space-y-4">
          {meals.map((m, i) => (
            <div key={i} className="p-5 rounded-2xl glass-card transition">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-rest-accent to-emerald-400 flex items-center justify-center">
                  <span className="text-rest-bg font-bold text-base">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <h3 className="font-bold text-lg text-white">{m.protein}</h3>
                    {m.tags.map((tag, j) => (
                      <span key={j} className="text-[10px] px-2.5 py-1 rounded-full bg-[#0a1e1e] shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-rest-accent font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2 text-sm">
                    <div className="p-3 rounded-lg bg-black/25">
                      <p className="text-rest-text-muted text-[10px] mb-1 uppercase tracking-wide">Acompañamiento</p>
                      <p className="text-rest-text-secondary text-sm font-medium">{m.side}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/20">
                      <p className="text-rest-text-muted text-[10px] mb-1 uppercase tracking-wide">Grasa funcional</p>
                      <p className="text-rest-text-secondary text-sm font-medium">{m.fat}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#00E5A0]/10 shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                      <p className="text-[#00E5A0]/50 text-xs mb-1">Objetivo</p>
                      <p className="text-[#00E5A0] text-sm font-semibold">{m.goal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "nutrientes" && (
        <div className="space-y-4">
          {nutrients.map((n, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${n.color} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 text-white">{n.name}</h3>
                  <p className="text-rest-text-muted text-sm mb-3">{n.func}</p>
                  <div className="flex flex-wrap gap-2">
                    {n.foods.map((f, j) => (
                      <span key={j} className="text-xs px-3 py-1.5 rounded-lg bg-rest-bg shadow-[0_1px_4px_rgba(0,0,0,0.15)] text-rest-text-secondary">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "preparaciones" && (
        <div className="space-y-4">
          {preparations.map((p, i) => (
            <details key={i} className="group rounded-2xl glass-card overflow-hidden">
              <summary className="flex items-center gap-4 p-5 cursor-pointer list-none">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-rest-accent to-emerald-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-rest-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white">{p.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rest-accent/10 text-rest-accent font-medium">{p.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a1e1e] text-rest-text-muted">{p.tag}</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-rest-text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 space-y-4">
                <div>
                  <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">Ingredientes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.ingredients.map((ing, j) => (
                      <span key={j} className="text-xs px-2.5 py-1 rounded-lg bg-black/25 text-rest-text-secondary">{ing}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-rest-text-muted text-[10px] uppercase tracking-wide mb-2">Preparación</p>
                  <ol className="space-y-2">
                    {p.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-rest-accent/10 text-rest-accent text-[10px] font-bold flex items-center justify-center mt-0.5">{j + 1}</span>
                        <span className="text-sm text-rest-text-secondary">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {tab === "evitar" && (
        <div className="space-y-3">
          {avoidList.map((a, i) => (
            <div key={i} className="p-4 rounded-xl glass-card flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-rest-danger/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-rest-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm">{a.item}</p>
                <p className="text-rest-text-muted text-xs mt-0.5">{a.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
