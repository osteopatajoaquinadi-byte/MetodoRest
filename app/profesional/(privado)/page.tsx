import Link from "next/link";
import { cookies } from "next/headers";
import { PRO_COOKIE, verifyProToken } from "../../lib/profesional-session";
import { getAllMaterial } from "../../lib/profesional-material";

export default async function ProfesionalInicio() {
  const session = verifyProToken((await cookies()).get(PRO_COOKIE)?.value);
  const nombre = session?.nombre.split(" ")[0] || "colega";
  const material = getAllMaterial();

  return (
    <div className="max-w-4xl">
      <span className="text-rest-accent text-sm font-medium tracking-[0.15em] uppercase">Red Método REST</span>
      <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mt-2 mb-3">Hola, {nombre}</h1>
      <p className="text-rest-text-secondary text-base leading-relaxed mb-8 max-w-2xl">
        Aquí está la ficha de evaluación de la red y el material que respalda cada decisión. Todos evaluamos igual: mismo orden, mismas
        preguntas, mismos criterios.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link href="/profesional/ficha" className="glass-card p-6 block hover:ring-1 hover:ring-rest-accent/30 transition">
          <span className="text-rest-accent text-xs font-semibold tracking-[0.15em] uppercase">Evaluar</span>
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mt-2 mb-2">Ficha REST</h2>
          <p className="text-rest-text-secondary text-sm leading-relaxed">
            Banderas rojas, fenotipo de sueño, banderas amarillas, examen manual y filtro de seguridad. Entrega la ruta y un resumen para tu
            registro.
          </p>
        </Link>
        <Link href="/profesional/material" className="glass-card p-6 block hover:ring-1 hover:ring-rest-accent/30 transition">
          <span className="text-rest-accent text-xs font-semibold tracking-[0.15em] uppercase">Respaldar</span>
          <h2 className="font-[family-name:var(--font-space)] text-xl font-semibold text-white mt-2 mb-2">Material</h2>
          <p className="text-rest-text-secondary text-sm leading-relaxed">
            {material.length} guías con el nivel de evidencia de cada recomendación y sus fuentes. Iremos sumando más.
          </p>
        </Link>
      </div>

      <div className="rounded-2xl p-5 bg-white/[0.03] ring-1 ring-white/10 text-sm text-rest-text-secondary leading-relaxed">
        <p className="text-white font-medium mb-1">Antes de usar la ficha</p>
        <p>
          Es un protocolo de decisión clínica, no un diagnóstico. Los puntos de corte son provisionales y se calibran con el piloto de
          colegas fundadores. La ficha no se guarda en el servidor: el registro clínico es tuyo.
        </p>
      </div>
    </div>
  );
}
