"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeroBackground from "./components/HeroBackground";
import ChatbotWidget from "./components/ChatbotWidget";

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
          <a href="#pilares" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Pilares</a>

          <a href="#testimonios" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Testimonios</a>
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
          El Método R.E.S.T. combina técnicas de respiración científicamente
          validadas, hábitos de sueño y herramientas prácticas para transformar
          tu descanso en 21 días.
        </p>

        <div className="animate-fade-in-up delay-500 flex flex-row items-center justify-center gap-3">
          <a
            href="#precio"
            className="px-6 py-2.5 bg-rest-accent hover:bg-[#00B880] text-rest-bg text-sm font-semibold uppercase tracking-wider rounded-xl transition-colors shadow-[0_0_16px_rgba(0,229,160,0.3)]"
          >
            Comenzar ahora
          </a>
          <Link
            href="/login"
            className="px-6 py-2.5 bg-rest-accent/[0.03] hover:bg-rest-accent/[0.08] text-rest-text text-sm font-medium uppercase tracking-wider rounded-xl transition-colors shadow-[inset_0_0_0_1px_rgba(0,229,160,0.1)] hover:shadow-[inset_0_0_0_1px_rgba(0,229,160,0.3)]"
          >
            Ya tengo acceso
          </Link>
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
            Tu insomnio no es el problema. Es la consecuencia de un sistema nervioso desregulado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Sistema nervioso en alerta", desc: "Tu cuerpo se acuesta pero tu sistema nervioso no. El estrés crónico mantiene activo el modo supervivencia incluso de noche." },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Reloj biológico desincronizado", desc: "Horarios irregulares, pantallas nocturnas y falta de luz matinal desorganizan tu ritmo circadiano." },
            { icon: "M7 8c0 2 1 3 3 3s3 1 3 3-1 3-3 3m4-9c0 2-1 3-3 3s-3 1-3 3 1 3 3 3M12 4v1m0 14v1", title: "Intestino desregulado", desc: "La microbiota alterada envía señales de alerta al cerebro a través del nervio vago: \"no es seguro relajarse\"." },
            { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "Fatiga sin reparación", desc: "Sin sueño profundo no hay reparación muscular, limpieza cerebral ni regulación hormonal." },
          ].map((item, i) => (
            <div key={i} className="card-glow group p-6 sm:p-8 rounded-3xl glass-card">
              <div className="w-12 h-12 rounded-xl bg-rest-accent/10 flex items-center justify-center mb-4 group-hover:bg-rest-accent/20 transition-colors">
                <svg className="w-6 h-6 text-rest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
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
                  <h3 className="text-lg font-semibold">{p.name}</h3>
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
    { name: "Cristina Caballero", role: "Diagnóstico: Estrés Crónico", text: "El conocimiento integral del funcionamiento del cuerpo, su estructura, funcionalidad y sobre todo de los procesos que pueden estar afectando su normal desempeño, me ha llevado a recomendarlos una y otra vez a todos los que amo y conozco. La combinación de dieta, respiraciones, vitaminas, ejercicios y movimientos hacen despertar el cuerpo, devolviéndolo a su estado original.", stars: 5 },
    { name: "María Fernanda Rojas", role: "Diagnóstico: Dolor y Estrés Crónico", text: "Cuando comencé a acompañarme terapéuticamente con Joaquín tenía un estado de alerta permanente, muchas contracturas por estrés crónico, alteraciones del sueño y molestias digestivas. Con los protocolos indicados he mejorado en todos los aspectos y he aprendido a reconocer cuando mi cuerpo envía señales y a actuar para volver a calmar mi sistema nervioso.", stars: 5 },
    { name: "Alicia Aramburú Fernández", role: "Diagnóstico: Fibromialgia", text: "Hubo un tiempo en que el dolor, la fatiga y el mal dormir controlaban cada uno de mis días. Dormir 3-4 horas no es normal ni sano. Hoy duermo más de 6,5 horas, el dolor ya no define mi vida y volví a disfrutar de cosas que creía perdidas. Sanar no fue un milagro, fue un proceso.", stars: 5 },
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
    "Ebook completo",
    "Plataforma interactiva con progreso",
    "Respiraciones guiadas con temporizador",
    "Plan de 21 días con checklists",
    "Guía nutricional nocturna",
    "Diario de sueño + escalas clínicas",
    "Relajación progresiva guiada",
    "Acceso de por vida",
    "Actualizaciones futuras",
  ];

  return (
    <section id="precio" className="py-20 sm:py-28 bg-rest-bg-alt relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rest-bg via-transparent to-rest-bg" />
      <div className="relative z-10 max-w-lg mx-auto px-4 sm:px-6 text-center">
        <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Acceso</span>
        <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-semibold mt-3 mb-4">Invierte en tu descanso</h2>
        <p className="text-rest-text-secondary text-sm mb-10 max-w-xl mx-auto">
          Acceso de por vida a la plataforma interactiva y todas las actualizaciones futuras.
        </p>

        <div className="relative p-8 sm:p-10 rounded-2xl glass-card text-left card-glow glow-accent-sm">
          <div className="mb-5 text-center">
            <h3 className="font-semibold text-xl text-white">Método R.E.S.T.</h3>
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
      <Testimonios />
      <ElProblema />
      <Autor />
      <Pilares />

      <Precio />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
