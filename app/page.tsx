"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeroBackground from "./components/HeroBackground";
import ChatbotWidget from "./components/ChatbotWidget";
import EvaluacionLanding from "./components/EvaluacionLanding";

function NavBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-rest-bg/70 backdrop-blur-lg transition-transform duration-300 will-change-transform ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-center">
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="#metodo" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">El Método</a>
          <a href="#evaluacion" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Evaluación</a>
          <a href="#pilares" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Pilares</a>

          <a href="#testimonios" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Testimonios</a>
          <Link href="/login" className="text-xs sm:text-sm text-rest-accent hover:text-rest-accent-light transition-colors font-medium">Ya tengo mi acceso</Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-12 sm:pb-20">
      <HeroBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div className="animate-fade-in-up mb-2 sm:mb-3">
          <img src="/logo.svg" alt="Método R.E.S.T." className="h-32 sm:h-40 mx-auto" width={320} height={160} />
        </div>

        <h1 className="animate-fade-in-up delay-200 font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-7xl font-semibold leading-[1.1] mb-6">
          El sueño no se fuerza.
          <br />
          <span className="text-gradient-green">Aparece cuando te sientes seguro.</span>
        </h1>

        <p className="animate-fade-in-up delay-400 text-rest-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Si das vueltas en la cama, te despiertas a las 3 de la madrugada o
          amaneces sin energía por más que duermas, no es falta de voluntad:
          es tu sistema nervioso en alerta. El Método R.E.S.T. te enseña a
          calmarlo en 21 días, sin pastillas.
        </p>

        <div id="evaluacion" className="animate-fade-in-up delay-500 max-w-lg mx-auto scroll-mt-24">
          <EvaluacionLanding />
        </div>

        <div className="animate-fade-in-up delay-700 mt-16 flex flex-row items-center justify-center gap-3 sm:gap-10 text-rest-text-muted text-[10px] sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-rest-accent shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <span>Basado en ciencia</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-rest-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Plan de 21 días</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-rest-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>Osteópata clínico</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ElProblema() {
  return (
    <section id="metodo" className="py-20 sm:py-28 relative" style={{ backgroundColor: "#0A1E1E" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">El problema</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            ¿Por qué no puedes dormir?
          </h2>
          <p className="text-rest-text-secondary mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            No es que no sepas dormir. Es que tu cuerpo olvidó cómo bajar la guardia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Tu mente no se apaga", desc: "Te acuestas agotado, pero apenas apoyas la cabeza se enciende: pendientes, conversaciones, preocupaciones. Tu cuerpo pide descanso, pero por dentro sigues en alerta." },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Te despiertas a las 3 de la madrugada", desc: "Logras dormirte, pero de madrugada abres los ojos y ya no puedes volver. Das vueltas mirando el reloj, calculando cuántas horas te quedan." },
            { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "Amaneces sin haber descansado", desc: "Dormiste las horas, pero despiertas como si te hubiera pasado un camión por encima. Necesitas café solo para arrancar el día." },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Vives con el motor acelerado", desc: "Irritabilidad, tensión en el cuello, antojos de azúcar, la sensación de que no puedes bajar el ritmo ni cuando quieres. Tu cuerpo no encuentra el freno." },
          ].map((item, i) => (
            <div key={i} className="card-glow group p-6 sm:p-8 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-xl bg-rest-accent/10 flex items-center justify-center mb-4 group-hover:bg-rest-accent/20 transition-colors">
                <svg className="w-6 h-6 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-space)] text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-rest-text-secondary text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Banner CTA: reemplaza la cita duplicada del hero e invita a la compra */}
        <div className="mt-12 relative overflow-hidden rounded-3xl border border-rest-accent/20 glow-accent-sm" style={{ backgroundColor: "#0C2626" }}>
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-rest-accent/10 blur-3xl" />
          <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-rest-accent/10 text-rest-accent rounded-lg mb-3">
                Precio de lanzamiento · $39.990 CLP
              </span>
              <h3 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-semibold leading-snug">
                Deja de pelear con tu insomnio.
              </h3>
              <p className="text-rest-text-secondary text-sm sm:text-base mt-2 max-w-md">
                Empieza hoy el plan de 21 días y recupera un sueño que sí repara.
              </p>
            </div>
            <a
              href="#precio"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-rest-accent text-rest-bg font-semibold text-base transition-all hover:scale-105 shadow-[0_4px_24px_rgba(0,229,160,0.3)] hover:shadow-[0_4px_32px_rgba(0,229,160,0.5)]"
            >
              Quiero mi acceso
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CostoDeNoResolver() {
  const costos = [
    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", title: "El dinero que gastas sin resultado", desc: "Café, melatonina, infusiones, magnesio, suplementos que compras mes a mes y no resuelven el fondo del problema." },
    { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Las horas de productividad perdidas", desc: "La niebla mental del día siguiente te hace rendir a la mitad. Tareas que deberían tomar una hora te toman tres." },
    { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "El desgaste en tu ánimo y tus vínculos", desc: "Irritabilidad, poca paciencia, sentir que no eres tú. El mal sueño no se queda en la noche: se filtra en todo tu día." },
    { icon: "M4.5 12.75l6 6 9-13.5", title: "El deterioro que se acumula en tu salud", desc: "Dormir mal de forma sostenida afecta tu presión, tu peso, tu memoria y tu sistema inmune. El costo no es solo hoy." },
  ];
  return (
    <section className="py-20 sm:py-28 relative" style={{ backgroundColor: "#081818" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">El costo real</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            Cada noche sin dormir bien <span className="text-gradient-green">te cuesta más de lo que crees</span>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {costos.map((c, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-2xl glass-card">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-rest-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={c.icon} /></svg>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-space)] text-base font-semibold mb-1">{c.title}</h3>
                <p className="text-rest-text-secondary text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-rest-text-secondary text-base sm:text-lg mt-12 max-w-2xl mx-auto">
          El Método R.E.S.T. cuesta menos que <span className="text-white font-medium">un mes de suplementos que no funcionan</span>.
        </p>
      </div>
    </section>
  );
}

function ParaQuien() {
  const noEs = [
    "Buscas una pastilla mágica que te duerma sin cambiar nada.",
    "No estás dispuesto a dedicar 10 a 15 minutos al día durante 3 semanas.",
    "Tu problema viene de una condición que necesita atención médica primero, como apnea del sueño, síndrome de piernas inquietas, hipertiroidismo, o un trastorno de ansiedad o depresión en fase aguda. En esos casos, consulta con tu médico antes de empezar.",
  ];
  const siEs = [
    "Ya probaste de todo y sigues durmiendo mal.",
    "Quieres entender qué le pasa a tu cuerpo, no solo tapar el síntoma.",
    "Estás listo para un método paso a paso que sí puedes sostener.",
  ];
  return (
    <section className="py-20 sm:py-28 relative" style={{ backgroundColor: "#0A1E1E" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Seamos honestos</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            ¿Es el Método R.E.S.T. para ti?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-3xl glass-card">
            <h3 className="font-[family-name:var(--font-space)] text-lg font-semibold mb-5 flex items-center gap-2 text-rest-text-secondary">
              <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-rest-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </span>
              No es para ti si...
            </h3>
            <ul className="space-y-4">
              {noEs.map((t, i) => (
                <li key={i} className="text-rest-text-secondary text-sm leading-relaxed pl-8 relative">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-white/20" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-rest-accent/20">
            <h3 className="font-[family-name:var(--font-space)] text-lg font-semibold mb-5 flex items-center gap-2 text-rest-accent">
              <span className="w-6 h-6 rounded-full bg-rest-accent/15 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </span>
              Es para ti si...
            </h3>
            <ul className="space-y-4">
              {siEs.map((t, i) => (
                <li key={i} className="text-rest-text-secondary text-sm leading-relaxed pl-8 relative">
                  <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-rest-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pilares() {
  const pilares = [
    { letter: "R", name: "Ritmo Circadiano + Sleep Drive", iconGradient: "from-rest-accent to-teal-400" },
    { letter: "E", name: "Eje Intestino-Cerebro", iconGradient: "from-emerald-400 to-teal-400" },
    { letter: "S", name: "Sistema Nervioso", iconGradient: "from-rest-luna to-indigo-300" },
    { letter: "T", name: "Timing + Ritmos Ultradianos", iconGradient: "from-blue-300 to-cyan-300" },
  ];

  return (
    <section id="pilares" className="py-20 sm:py-28 relative" style={{ backgroundColor: "#091A1A" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-rest-bg via-transparent to-rest-bg opacity-40" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Los 4 Pilares</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            El Método <span className="text-gradient-green">R.E.S.T.</span>
          </h2>
          <p className="text-rest-text-secondary mt-4 max-w-2xl mx-auto">
            No interviene síntomas sueltos. Regula el sistema nervioso completo a través de 4 pilares integrados.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {pilares.map((p, i) => (
            <div key={i} className="group relative p-6 sm:p-8 rounded-3xl glass-card transition-colors">
              <div className="flex items-center gap-4">
                <div className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${p.iconGradient} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-rest-bg font-[family-name:var(--font-space)]">{p.letter}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-space)] text-lg font-semibold">{p.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Testimonios() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const reviews = [
    { name: "Cristina Caballero", role: "Estrés crónico · Recuperó su descanso", text: "El conocimiento integral del funcionamiento del cuerpo, su estructura, funcionalidad y sobre todo de los procesos que pueden estar afectando su normal desempeño, me ha llevado a recomendarlos una y otra vez a todos los que amo y conozco. La combinación de dieta, respiraciones, vitaminas, ejercicios y movimientos hacen despertar el cuerpo, devolviéndolo a su estado original.", stars: 5 },
    { name: "María Fernanda Rojas", role: "Dolor y estrés crónico · De la alerta constante a dormir en calma", text: "Cuando comencé a acompañarme terapéuticamente con Joaquín tenía un estado de alerta permanente, muchas contracturas por estrés crónico, alteraciones del sueño y molestias digestivas. Con los protocolos indicados he mejorado en todos los aspectos y he aprendido a reconocer cuando mi cuerpo envía señales y a actuar para volver a calmar mi sistema nervioso.", stars: 5 },
    { name: "Alicia Aramburú Fernández", role: "Fibromialgia · Antes 3-4h, hoy +6,5h de sueño", text: "Hubo un tiempo en que el dolor, la fatiga y el mal dormir controlaban cada uno de mis días. Dormir 3-4 horas no es normal ni sano. Hoy duermo más de 6,5 horas, el dolor ya no define mi vida y volví a disfrutar de cosas que creía perdidas. Sanar no fue un milagro, fue un proceso.", stars: 5 },
  ];

  return (
    <section id="testimonios" className="py-20 sm:py-28 relative" style={{ clipPath: "inset(0)" }}>
      <div className="fixed inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          src="/sueno.mp4"
          className="w-full h-full object-cover"
          preload="auto"
        />
        <div className="absolute inset-0 bg-rest-bg/60" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Resultados reales</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Lo que dicen quienes ya lo aplican</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="card-glow p-6 rounded-3xl glass-card">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-rest-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-rest-text-secondary text-sm leading-relaxed mb-4 italic font-[family-name:var(--font-space)] text-base">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-rest-text-muted text-xs">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Autor() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/autor-bg.png" alt="Joaquín Adi" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-black/30 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Tu guía</span>
            <h3 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-semibold mt-1 mb-3 text-white">Joaquín Adi A.</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {["Osteópata", "Kinesiólogo", "Magíster Terapia Manual", "PNI Clínica"].map((t, i) => (
                <span key={i} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#0a1e1e] shadow-[0_1px_4px_rgba(0,0,0,0.15)] text-rest-accent font-medium">{t}</span>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Tras años de atención clínica, descubrió que sus pacientes consultaban por migrañas, ansiedad, fatiga y dolor crónico,
              pero el origen común era siempre el mismo: un sueño no reparador. Esa experiencia, sumada a su propia batalla
              con el insomnio tras ser diagnosticado con diabetes, lo llevó a crear el Método R.E.S.T.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Precio() {
  const features = [
    "El ebook completo del Método R.E.S.T., para entender qué le pasa a tu cuerpo y por qué",
    "Una plataforma que te guía día a día y lleva tu progreso, para que nunca te pierdas ni te sientas solo",
    "Respiraciones guiadas paso a paso que calman tu sistema nervioso en minutos",
    "Un plan de 21 días dividido en pasos simples: solo sigues la checklist de cada día",
    "Qué cenar (y qué evitar) para no sabotear tu sueño sin darte cuenta",
    "Herramientas para medir tu sueño y ver, con números, cómo mejora semana a semana",
    "Sesiones de relajación guiada para soltar la tensión del día antes de dormir",
    "Acceso de por vida: entras las veces que quieras, para siempre",
    "Todas las actualizaciones futuras incluidas, sin pagar de nuevo",
  ];

  return (
    <section id="precio" className="py-20 sm:py-28 bg-rest-bg-alt relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rest-bg via-transparent to-rest-bg" />
      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 text-center">
        <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Acceso</span>
        <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-semibold mt-3 mb-4">Empieza esta noche</h2>
        <p className="text-rest-text-secondary text-sm mb-10 max-w-xl mx-auto">
          Un solo pago. Acceso de por vida a todo el método y a cada actualización futura.
        </p>

        <div className="relative p-8 sm:p-10 rounded-2xl glass-card text-left card-glow glow-accent-sm">
          <div className="mb-5 text-center">
            <h3 className="font-[family-name:var(--font-space)] font-semibold text-xl text-white">Método R.E.S.T.</h3>
            <p className="text-rest-text-muted text-sm mt-1">Ebook + plataforma interactiva completa</p>
          </div>
          <div className="mb-8 text-center">
            <span className="text-rest-text-muted text-sm line-through">$59.990</span>
            <div className="flex items-baseline gap-1.5 mt-1 justify-center">
              <span className="text-4xl font-bold font-[family-name:var(--font-space)] text-gradient-green">$39.990</span>
              <span className="text-rest-text-muted text-sm">CLP</span>
            </div>
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-rest-accent/10 text-rest-accent rounded-lg">Precio de lanzamiento</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5 text-sm">
                <svg className="w-4 h-4 text-rest-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-rest-text-secondary">{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://pay.hotmart.com/L105253165X"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 text-center text-sm bg-rest-accent hover:bg-[#00B880] active:bg-[#009960] active:scale-[0.97] text-rest-bg shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.5)] cursor-pointer"
          >
            Obtener acceso
          </a>
          <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-rest-accent/[0.06]">
            <svg className="w-5 h-5 text-rest-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <p className="text-rest-text-secondary text-xs leading-relaxed text-left">
              <span className="text-white font-medium">7 días de garantía.</span> Si empiezas el método y sientes que no es para ti, escríbenos dentro de los primeros 7 días y te devolvemos tu dinero. Sin preguntas.
            </p>
          </div>
        </div>
        <p className="text-rest-text-muted text-xs mt-6">Pago seguro a través de Hotmart. Acceso inmediato.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden py-10" style={{ boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.4)" }}>
      <HeroBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center">
          <img src="/logo.svg" alt="Método R.E.S.T." className="h-24 sm:h-28 mb-2" />
          <span className="text-rest-text-muted text-sm">por Osteópata Joaquín Adi</span>
        </div>
        <div className="section-divider my-4" />
        <div className="flex items-center justify-center gap-6 text-rest-text-muted text-sm mb-3">
          <Link href="/terminos" className="hover:text-rest-accent transition-colors">Términos</Link>
          <Link href="/privacidad" className="hover:text-rest-accent transition-colors">Privacidad</Link>
          <a href="mailto:metodorest@gmail.com" className="hover:text-rest-accent transition-colors">Contacto</a>
        </div>
        <p className="text-center text-rest-text-muted text-xs px-2">Este material es educativo y no reemplaza una evaluación médica profesional.</p>
        <p className="text-center text-rest-text-muted/30 text-[10px] mt-3">
          Creado con cariño por <a href="https://crealostudio.cl" target="_blank" rel="noopener noreferrer" className="text-rest-accent/40 hover:text-rest-accent/70 transition-colors font-medium">Créalo SpA</a>
        </p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main>
      <NavBar />
      <Hero />
      <ElProblema />
      <CostoDeNoResolver />
      <Testimonios />
      <Autor />
      <Pilares />
      <ParaQuien />
      <Precio />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
