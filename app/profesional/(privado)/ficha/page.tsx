import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PRO_COOKIE, verifyProToken } from "../../../lib/profesional-session";
import FichaREST from "../../../components/profesional/FichaREST";

export const metadata: Metadata = { title: "Ficha REST" };

export default async function FichaPage() {
  const session = verifyProToken((await cookies()).get(PRO_COOKIE)?.value);
  return (
    <>
      <div className="mb-6 max-w-3xl no-print">
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold text-white mb-2">Ficha REST</h1>
        <p className="text-rest-text-secondary text-sm leading-relaxed">
          Completa los módulos en orden. El resultado se actualiza a medida que respondes.
        </p>
      </div>
      <FichaREST profesional={session?.nombre || "Profesional de la red"} />
    </>
  );
}
