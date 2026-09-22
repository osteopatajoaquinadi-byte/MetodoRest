import type { Metadata } from "next";
import Link from "next/link";
import { CortisolNocturno, BalanceAutonomico } from "../components/Diagramas";

export const metadata: Metadata = {
  title: "Insomnio por estrés — Guía completa basada en evidencia",
  description:
    "Todo lo que la ciencia sabe sobre el insomnio por estrés: eje HPA, hiperactivación, HRV, ejercicio y respiración. Con referencias de PubMed.",
  alternates: { canonical: "/sueno-y-estres" },
};

function Tag({ children }: { children: string }) {
  const color =
    children === "EVIDENCIA FIRME"
      ? "text-rest-accent"
      : children === "DEBATIDO"
        ? "text-rest-text-muted"
        : "text-white/70";
  return (
    <span
      className={`inline-block font-[family-name:var(--font-space)] text-[0.65rem] font-semibold tracking-[0.12em] uppercase mr-2 align-middle ${color}`}
    >
      [{children}]
    </span>
  );
}

export default function SuenoYEstresPage() {
  return (
    <div className="min-h-screen bg-rest-bg">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rest-accent text-sm mb-8 hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
          Insomnio por estrés: guía completa basada en evidencia
        </h1>

        <p className="text-rest-text-secondary text-lg leading-relaxed mb-6">
          Cuando el estrés no te deja dormir, no es falta de voluntad ni de
          cansancio. Es tu fisiología funcionando en modo alerta cuando debería
          estar bajando la guardia. Esta guía recorre lo que se sabe sobre por qué
          ocurre y qué intervenciones tienen base para revertirlo. A lo largo del
          texto marcamos cada afirmación según{" "}
          <Link href="/evidencia" className="link-inline">
            su nivel de evidencia
          </Link>
          .
        </p>

        <div className="space-y-10 text-rest-text-secondary text-base leading-relaxed mt-10">
          <section>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mb-3">
              Qué pasa en tu cuerpo cuando el estrés no te deja dormir
            </h2>
            <p>
              <Tag>EVIDENCIA FIRME</Tag>
              El estrés sostenido activa el eje hipotálamo-hipófiso-adrenal (eje
              HPA), que regula la liberación de cortisol. En condiciones normales el
              cortisol sigue un ritmo: alto en la mañana para despertarte, bajo en la
              noche para dejarte dormir. Bajo estrés crónico ese ritmo se aplana y el
              cortisol permanece elevado cuando debería caer, lo que dificulta la
              transición al sueño.
            </p>
            <p className="mt-3">
              <Tag>RAZONAMIENTO MECANICISTA</Tag>
              En paralelo, el sistema nervioso autónomo se desequilibra hacia el
              lado simpático (el de "lucha o huida") y el parasimpático (el del
              descanso) queda relegado. Es coherente con la fisiología que este
              predominio simpático explique la sensación de "cuerpo cansado, mente
              encendida", aunque la cadena causal exacta se sigue estudiando.
            </p>
            <CortisolNocturno />
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mb-3">
              El modelo de hiperactivación: por qué el insomnio dura 24 horas
            </h2>
            <p>
              <Tag>EVIDENCIA FIRME</Tag>
              El modelo de hiperactivación (hyperarousal) es hoy uno de los marcos
              más aceptados para entender el insomnio crónico. Propone que quienes lo
              padecen no solo están activados de noche, sino también de día: mayor
              actividad cognitiva, fisiológica y cortical de forma sostenida. Por eso
              dormir las horas no basta: el sistema no llega a un descanso profundo.
            </p>
            <p className="mt-3">
              Si te reconoces en esto, el artículo{" "}
              <Link
                href="/blog/cansado-pero-no-puedo-dormir"
                className="link-inline"
              >
                cansado pero no puedo dormir
              </Link>{" "}
              entra en detalle sobre la hiperactivación, y{" "}
              <Link
                href="/blog/despertar-3am"
                className="link-inline"
              >
                por qué me despierto a las 3 de la mañana
              </Link>{" "}
              revisa el despertar de madrugada.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mb-3">
              La variabilidad de frecuencia cardíaca (HRV) como ventana al problema
            </h2>
            <p>
              <Tag>EVIDENCIA FIRME</Tag>
              La variabilidad de la frecuencia cardíaca (HRV) mide las pequeñas
              diferencias de tiempo entre latidos y refleja el balance del sistema
              nervioso autónomo. Una HRV más baja se asocia de forma consistente con
              predominio simpático y peor calidad de sueño.
            </p>
            <p className="mt-3">
              <Tag>DEBATIDO</Tag>
              Usar la HRV como herramienta individual de seguimiento del sueño es
              prometedor, pero todavía hay discusión sobre qué tan bien predice la
              respuesta al tratamiento persona a persona, y sobre la fiabilidad de la
              medición con dispositivos de consumo. Puedes profundizar en{" "}
              <Link
                href="/blog/sistema-nervioso-y-sueno"
                className="link-inline"
              >
                sistema nervioso autónomo y sueño
              </Link>
              .
            </p>
            <BalanceAutonomico />
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mb-3">
              Intervenciones con base fisiológica
            </h2>
            <p>
              <Tag>EVIDENCIA FIRME</Tag>
              La terapia cognitivo-conductual para el insomnio (TCC-I) es la
              intervención de primera línea con mayor respaldo, por encima de los
              fármacos en el manejo a largo plazo. Trabaja los pensamientos y hábitos
              que perpetúan la hiperactivación. Lo desarrollamos en{" "}
              <Link
                href="/blog/como-dormir-sin-pastillas"
                className="link-inline"
              >
                cómo dormir sin pastillas
              </Link>
              .
            </p>
            <p className="mt-3">
              <Tag>EVIDENCIA FIRME</Tag>
              El ejercicio, incluido el de fuerza, mejora la calidad del sueño en
              múltiples estudios. Más en{" "}
              <Link
                href="/blog/ejercicio-fuerza-y-sueno"
                className="link-inline"
              >
                ejercicio de fuerza y sueño
              </Link>
              .
            </p>
            <p className="mt-3">
              <Tag>RAZONAMIENTO MECANICISTA</Tag>
              Las técnicas de respiración lenta buscan activar el parasimpático a
              través del nervio vago. La lógica fisiológica es sólida y hay estudios
              pequeños alentadores, aunque falta evidencia de ensayos grandes. Ver{" "}
              <Link
                href="/blog/respiracion-para-dormir"
                className="link-inline"
              >
                respiración para dormir
              </Link>
              .
            </p>
            <p className="mt-4">
              Todas estas intervenciones comparten algo: actúan sobre las vías
              fisiológicas que están desreguladas, no sobre el síntoma. El Método
              R.E.S.T. está construido sobre exactamente estas vías, con cada
              intervención programada y dosificada para optimizar la desregulación
              específica de tu sueño, en un protocolo de 21 días.
            </p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-space)] text-2xl font-semibold text-white mb-3">
              Cuándo consultar a un profesional
            </h2>
            <p>
              Si la dificultad para dormir se mantiene semanas, afecta tu
              funcionamiento diario, o aparecen señales como ronquidos fuertes o
              pausas al respirar, conviene una evaluación médica. Una buena forma de
              empezar a ordenar tu situación es conocer tu perfil:{" "}
              <Link href="/test-sueno" className="link-inline">
                responde la evaluación gratuita de sueño y estrés
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 p-5 rounded-2xl bg-white/[0.03] ring-1 ring-white/10 text-rest-text-muted text-sm leading-relaxed">
          Este contenido tiene fines educativos y no reemplaza la evaluación ni el
          tratamiento de un profesional de salud. Si tienes un trastorno del sueño
          diagnosticado, consulta a tu médico.
        </div>

        <div className="mt-8 flex items-center gap-3 text-sm">
          <span className="text-rest-text-muted">Escrito por</span>
          <Link href="/sobre-mi" className="link-inline font-medium">
            Joaquín Adi — Kinesiólogo y Osteópata
          </Link>
        </div>
      </article>
    </div>
  );
}
