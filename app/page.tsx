"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import HeroBackground from "./components/HeroBackground";
import ChatbotWidget from "./components/ChatbotWidget";
import EvaluacionLanding from "./components/EvaluacionLanding";
import FAQ from "./components/FAQ";
import ProductMockup from "./components/ProductMockup";

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
          <a href="#como-funciona" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">El Método</a>
          <a href="#evaluacion" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Test</a>
          <Link href="/blog" className="text-xs sm:text-sm text-rest-text-secondary hover:text-rest-accent transition-colors">Blog</Link>

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-20 sm:pt-24">
        <div className="animate-fade-in-up mb-2">
          <img src="/logo.svg" alt="Método R.E.S.T. — protocolo de 21 días para dormir mejor" className="h-16 sm:h-20 mx-auto" width={160} height={80} />
        </div>

        <h1 className="animate-fade-in-up delay-100 font-[family-name:var(--font-space)] text-sm sm:text-base font-medium text-rest-accent tracking-[0.02em] mb-4">
          Método R.E.S.T.: un protocolo de 21 días para dormir mejor
        </h1>

        <p className="animate-fade-in-up delay-200 font-[family-name:var(--font-space)] text-3xl sm:text-5xl md:text-6xl font-semibold leading-[1.1] mb-6">
          ¿Despiertas a las 3 a.m.
          <br />
          <span className="text-gradient-green">y ya no vuelves a dormir?</span>
        </p>

        <p className="animate-fade-in-up delay-300 text-rest-text-secondary text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          No es falta de voluntad: es tu sistema nervioso, que no sabe apagarse.
          Un plan de <span className="text-white font-medium">10 a 15 minutos al día durante 21 días</span> para
          enseñarle a hacerlo.
        </p>

        <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <a
            href="#evaluacion"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-rest-accent text-rest-bg font-semibold text-base transition-all hover:scale-105 shadow-[0_4px_24px_rgba(0,229,160,0.3)] hover:shadow-[0_4px_32px_rgba(0,229,160,0.5)]"
          >
            Haz el test gratis · 3 min
          </a>
          <a
            href="#precio"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white font-medium text-base transition-all shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
          >
            Ver el plan · $39.990
          </a>
        </div>

        <p className="animate-fade-in-up delay-500 text-rest-text-muted text-sm max-w-xl mx-auto mb-10">
          Creado por{" "}
          <a href="/sobre-mi" className="link-inline font-medium">
            Joaquín Adi
          </a>
          , kinesiólogo y osteópata, que también pasó por el insomnio.
        </p>

        <div className="animate-fade-in-up delay-600 max-w-2xl mx-auto">
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(94,155,143,0.15)" }}>
            <iframe
              src="https://www.youtube.com/embed/_ouz4nLmT7w?rel=0&modestbranding=1&autoplay=1&mute=1&playsinline=1&vq=hd1080"
              title="Método R.E.S.T."
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            />
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
            No es que no quieras dormir. Es que tu cuerpo está agotado, pero por dentro no logra bajar la guardia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Tu mente no se apaga", desc: "Tu cuerpo está agotado, pero la mente parece despertar justo cuando apagas la luz. Aparecen los pendientes, las conversaciones, la sensación de que 'algo no está bien'. No es que no quieras dormir: es que tu mente no te deja." },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Te despiertas a las 3 de la madrugada", desc: "Logras dormirte, pero a las 3 de la madrugada abres los ojos como si alguien hubiera encendido una alarma, y ya no puedes volver. Te quedas despierto mientras el resto de la casa duerme, calculando cuántas horas te quedan." },
            { icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", title: "Amaneces sin haber descansado", desc: "Dormiste las horas, pero despiertas como si te hubiera pasado un camión por encima. Necesitas café solo para arrancar el día." },
            { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Vives con el motor acelerado", desc: "Irritabilidad, tensión en el cuello, antojos de azúcar, la sensación de que no puedes bajar el ritmo ni cuando quieres. Tu sistema nervioso no encuentra el freno." },
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

        <p className="text-center text-rest-text-secondary text-base sm:text-lg mt-12 max-w-2xl mx-auto">
          Si te reconociste en al menos una, no estás solo. Y probablemente ya probaste de todo.
        </p>
      </div>
    </section>
  );
}

function PorQueNoFunciono() {
  const intentos = [
    { title: "Melatonina", desc: "Regula tu reloj interno, no el sistema nervioso en alerta. Si tu problema es que la mente no se apaga, la melatonina está resolviendo otra cosa." },
    { title: "Café para arrancar", desc: "Te saca del paso en la mañana, pero si lo tomas tarde sigue activo cuando intentas dormir. Es parte del círculo, no la salida." },
    { title: "Suplementos e infusiones", desc: "Magnesio, valeriana, tés. Pueden ayudar algo, pero ninguno le enseña a tu cuerpo a bajar la guardia por sí solo." },
  ];
  return (
    <section id="por-que" className="py-20 sm:py-28 relative" style={{ backgroundColor: "#081818" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Por qué no te ha funcionado</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            Estabas tratando <span className="text-gradient-green">el síntoma equivocado</span>
          </h2>
          <p className="text-rest-text-secondary mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            La causa más común del insomnio por estrés es un sistema nervioso que se quedó en modo alerta.
            Casi todo lo que se vende para dormir apunta a otra parte.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {intentos.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl glass-card">
              <h3 className="font-[family-name:var(--font-space)] text-base font-semibold mb-2">{c.title}</h3>
              <p className="text-rest-text-secondary text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-rest-text-secondary text-base sm:text-lg mt-12 max-w-2xl mx-auto">
          El Método R.E.S.T. trabaja sobre esa otra vía: <span className="text-white font-medium">enseñarle a tu cuerpo a sentirse seguro para dormir</span>.
        </p>
        <p className="text-center text-rest-text-muted text-xs mt-4 max-w-xl mx-auto">
          No reemplaza tu medicación. Si tomas algún fármaco para dormir, no lo modifiques sin hablar con tu médico.
        </p>
      </div>
    </section>
  );
}

function Test() {
  return (
    <section id="evaluacion" className="py-20 sm:py-28 relative scroll-mt-16" style={{ backgroundColor: "#081818" }}>
      <div className="max-w-lg mx-auto px-4 text-center">
        <EvaluacionLanding />
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

function ComoFunciona() {
  const pilares = [
    { letter: "R", name: "Ritmo", desc: "Que tu reloj interno vuelva a marcar cuándo es hora de dormir y cuándo de despertar.", iconGradient: "from-rest-accent to-teal-400" },
    { letter: "E", name: "Eje intestino-cerebro", desc: "Dejar de sabotear tu sueño sin darte cuenta con lo que comes.", iconGradient: "from-emerald-400 to-teal-400" },
    { letter: "S", name: "Sistema nervioso", desc: "Que tu cuerpo salga del modo alerta cuando llega la noche.", iconGradient: "from-rest-luna to-indigo-300" },
    { letter: "T", name: "Timing", desc: "Llegar a la noche sin el motor acelerado.", iconGradient: "from-blue-300 to-cyan-300" },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 relative scroll-mt-16" style={{ backgroundColor: "#091A1A" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-rest-bg via-transparent to-rest-bg opacity-40" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div id="pilares" className="text-center mb-14">
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Cómo funciona</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">
            Los 4 pilares del Método <span className="text-gradient-green">R.E.S.T.</span>
          </h2>
          <p className="text-rest-text-secondary mt-4 max-w-2xl mx-auto">
            Durante 21 días, la plataforma te guía paso a paso. Cada semana se suma un pilar nuevo.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {pilares.map((p) => (
            <div key={p.letter} className="p-6 rounded-3xl glass-card flex items-start gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${p.iconGradient} flex items-center justify-center shadow-lg`}>
                <span className="text-xl font-bold text-rest-bg font-[family-name:var(--font-space)]">{p.letter}</span>
              </div>
              <div>
                <h4 className="font-[family-name:var(--font-space)] text-base font-semibold">{p.name}</h4>
                <p className="text-rest-text-secondary text-sm leading-relaxed mt-1">{p.desc}</p>
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
    { name: "Alicia Aramburú Fernández", role: "Fibromialgia · Antes 3-4h, hoy +6,5h de sueño", text: "Hubo un tiempo en que el dolor, la fatiga y el mal dormir controlaban cada uno de mis días. Dormir 3-4 horas no es normal ni sano. Hoy duermo más de 6,5 horas, el dolor ya no define mi vida y volví a disfrutar de cosas que creía perdidas. Sanar no fue un milagro, fue un proceso.", stars: 5 },
    { name: "María Fernanda Rojas", role: "Dolor y estrés crónico · De la alerta constante a dormir en calma", text: "Cuando comencé a acompañarme terapéuticamente con Joaquín tenía un estado de alerta permanente, muchas contracturas por estrés crónico, alteraciones del sueño y molestias digestivas. Con los protocolos indicados he mejorado en todos los aspectos y he aprendido a reconocer cuando mi cuerpo envía señales y a actuar para volver a calmar mi sistema nervioso.", stars: 5 },
    { name: "Cristina Caballero", role: "Estrés crónico · Recuperó su descanso", text: "El conocimiento integral del funcionamiento del cuerpo, su estructura, funcionalidad y sobre todo de los procesos que pueden estar afectando su normal desempeño, me ha llevado a recomendarlos una y otra vez a todos los que amo y conozco. La combinación de dieta, respiraciones, vitaminas, ejercicios y movimientos hacen despertar el cuerpo, devolviéndolo a su estado original.", stars: 5 },
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
          <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Testimonios</span>
          <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-semibold mt-3">Personas que trabajaron este enfoque con Joaquín</h2>
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
        <Image src="/autor-bg-sin-rostro.png" alt="Joaquín Adi meditando" fill sizes="100vw" className="object-cover object-top" />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-black/30 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
            <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Quién soy</span>
            <h3 className="font-[family-name:var(--font-space)] text-2xl sm:text-3xl font-semibold mt-1 mb-3 text-white">Joaquín Adi A.</h3>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {["Osteópata", "Kinesiólogo", "Magíster Terapia Manual", "Máster en Psiconeuroinmunología Clínica"].map((t, i) => (
                <span key={i} className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#0a1e1e] shadow-[0_1px_4px_rgba(0,0,0,0.15)] text-rest-accent font-medium">{t}</span>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Cuando me diagnosticaron diabetes, empecé a dormir mal. Conozco las noches dando vueltas y las mañanas
              sin energía porque las viví.
            </p>
            <p className="text-white/70 text-sm leading-relaxed mt-3">
              En mi consulta veía lo mismo una y otra vez: pacientes que llegaban por migrañas, ansiedad, fatiga o dolor
              crónico, y que tenían en común un sueño que no reparaba. De esas dos experiencias nació el Método R.E.S.T.
            </p>
            <blockquote className="mt-6 pt-6 border-t border-white/10">
              <p className="font-[family-name:var(--font-space)] text-xl sm:text-2xl font-semibold leading-snug text-white">
                &ldquo;El sueño no se fuerza.
                <br />
                <span className="text-gradient-green">Aparece cuando te sientes seguro.&rdquo;</span>
              </p>
              <footer className="mt-3 text-rest-text-muted text-xs">— Joaquín Adi</footer>
            </blockquote>
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
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Acceso</span>
        <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-semibold mt-3 mb-4">Empieza esta noche</h2>
        <p className="text-rest-text-secondary text-sm mb-10 max-w-xl mx-auto">
          Un solo pago, acceso de por vida y 7 días de garantía. Cuesta menos que un mes de suplementos que no funcionan.
        </p>

        <ProductMockup className="w-full max-w-md mx-auto h-auto mb-12" />

        <div className="grid md:grid-cols-2 gap-6 items-start text-left">
          {/* Ebook solo */}
          <div className="relative p-7 sm:p-8 rounded-2xl glass-card">
            <div className="mb-5">
              <h3 className="font-[family-name:var(--font-space)] font-semibold text-lg text-white">Solo el Ebook</h3>
              <p className="text-rest-text-muted text-sm mt-1">Para entender tu problema y empezar</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-[family-name:var(--font-space)] text-white">$14.990</span>
                <span className="text-rest-text-muted text-sm">CLP</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "El ebook completo del Método R.E.S.T. en tu plataforma",
                "Entiende qué le pasa a tu cuerpo y por qué no duermes",
                "Las bases del método para empezar a aplicar hoy",
                "Acceso de por vida al ebook",
              ].map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-rest-text-muted shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-rest-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://pay.hotmart.com/N107478696O?off=1xspnyoc"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 text-center text-sm bg-white/[0.06] hover:bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              Obtener ebook
            </a>
          </div>

          {/* Metodo completo */}
          <div className="relative order-first md:order-none p-7 sm:p-8 rounded-2xl glass-card card-glow glow-accent-sm border border-rest-accent/20">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-rest-accent text-rest-bg text-[10px] font-bold uppercase tracking-wider rounded-full">Recomendado</div>
            <div className="mb-5">
              <h3 className="font-[family-name:var(--font-space)] font-semibold text-lg text-white">Método Completo</h3>
              <p className="text-rest-text-muted text-sm mt-1">Ebook + plataforma interactiva completa</p>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold font-[family-name:var(--font-space)] text-gradient-green">$39.990</span>
                <span className="text-rest-text-muted text-sm">CLP</span>
              </div>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-rest-accent/10 text-rest-accent rounded-lg">Precio de lanzamiento</span>
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
              href="https://pay.hotmart.com/L105253165X?off=z03q3xpq"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 text-center text-sm bg-rest-accent hover:bg-[#00B880] active:bg-[#009960] active:scale-[0.97] text-rest-bg shadow-[0_0_16px_rgba(0,229,160,0.3)] hover:shadow-[0_0_24px_rgba(0,229,160,0.5)] cursor-pointer"
            >
              Obtener acceso completo
            </a>
            <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-rest-accent/[0.06]">
              <svg className="w-5 h-5 text-rest-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="text-rest-text-secondary text-xs leading-relaxed text-left">
                <span className="text-white font-medium">7 días de garantía.</span> Si sientes que no es para ti, te devolvemos tu dinero. Sin preguntas.
              </p>
            </div>
          </div>
        </div>
        <p className="text-rest-text-muted text-xs mt-8">Pago seguro a través de Hotmart. Acceso inmediato.</p>
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
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-rest-text-muted text-sm mb-3">
          <Link href="/sobre-mi" className="link-nav">Sobre mí</Link>
          <Link href="/sueno-y-estres" className="link-nav">Sueño y estrés</Link>
          <Link href="/blog" className="link-nav">Blog</Link>
          <Link href="/test-sueno" className="link-nav">Test de sueño</Link>
          <Link href="/evidencia" className="link-nav">Evidencia</Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-rest-text-muted text-sm mb-3">
          <Link href="/terminos" className="link-nav">Términos</Link>
          <Link href="/privacidad" className="link-nav">Privacidad</Link>
          <a href="mailto:metodorest@gmail.com" className="link-nav">Contacto</a>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Método R.E.S.T.",
            description:
              "Protocolo de 21 días para mejorar el sueño, basado en fisiología del sueño y regulación del estrés.",
            brand: { "@type": "Brand", name: "Método R.E.S.T." },
            offers: {
              "@type": "Offer",
              price: "39990",
              priceCurrency: "CLP",
              availability: "https://schema.org/InStock",
              url: "https://metodorest.cl",
            },
          }),
        }}
      />
      <NavBar />
      <Hero />
      <ElProblema />
      <PorQueNoFunciono />
      <ComoFunciona />
      <Test />
      <Autor />
      <Testimonios />
      <ParaQuien />
      <Precio />
      <FAQ />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
