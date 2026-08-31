import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-rest-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-rest-accent text-sm mb-8 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver al inicio
        </Link>

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-2">Términos y Condiciones</h1>
        <p className="text-rest-text-muted text-sm mb-10">Última actualización: 18 de abril de 2026</p>

        <div className="prose-legal space-y-8 text-rest-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Identificación del prestador</h2>
            <p>El presente sitio web y la plataforma digital &ldquo;Método R.E.S.T.&rdquo; (en adelante, &ldquo;la Plataforma&rdquo;) es propiedad y está operada por Joaquín Adi A., profesional independiente con domicilio en Chile. La Plataforma ofrece contenido educativo digital relacionado con la mejora del sueño y el bienestar.</p>
            <p className="mt-2">Desarrollo tecnológico: <a href="https://micelia.cl" target="_blank" rel="noopener noreferrer" className="text-rest-accent hover:underline">Micelia</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Aceptación de los términos</h2>
            <p>Al acceder, navegar o utilizar la Plataforma, el usuario acepta de manera expresa e inequívoca estos Términos y Condiciones. Si no está de acuerdo con alguna disposición, debe abstenerse de utilizar la Plataforma.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Descripción del servicio</h2>
            <p>La Plataforma proporciona:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Un ebook digital de 67 páginas sobre el Método R.E.S.T.</li>
              <li>Herramientas interactivas: respiraciones guiadas, plan de 21 días, diario de sueño, guía nutricional y relajación progresiva.</li>
              <li>Acceso mediante credenciales personales e intransferibles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Naturaleza educativa del contenido</h2>
            <p>Todo el contenido ofrecido en la Plataforma tiene carácter <strong className="text-white">exclusivamente educativo e informativo</strong>. No constituye diagnóstico médico, tratamiento clínico ni reemplaza la consulta con un profesional de salud. El usuario es responsable de consultar a su médico antes de modificar hábitos de sueño, alimentación o actividad física.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Registro y cuenta de usuario</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>El acceso requiere la compra del producto a través de la pasarela de pago autorizada (Hotmart).</li>
              <li>Cada licencia es personal e intransferible, vinculada a un único correo electrónico.</li>
              <li>El usuario se compromete a no compartir sus credenciales de acceso con terceros.</li>
              <li>El titular se reserva el derecho de suspender cuentas que evidencien uso compartido o fraudulento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Propiedad intelectual</h2>
            <p>Todo el contenido de la Plataforma —incluyendo textos, imágenes, diseño, código, ebook, guías, ejercicios y material audiovisual— está protegido por derechos de autor y propiedad intelectual a favor de Joaquín Adi A.</p>
            <p className="mt-2">Queda <strong className="text-white">estrictamente prohibido</strong>:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Reproducir, copiar, distribuir o compartir el contenido total o parcialmente.</li>
              <li>Capturar pantallas, grabar la pantalla o extraer contenido del ebook.</li>
              <li>Realizar ingeniería inversa, descompilar o modificar el código de la Plataforma.</li>
              <li>Utilizar el contenido con fines comerciales sin autorización escrita.</li>
            </ul>
            <p className="mt-2">La Plataforma implementa medidas técnicas de protección digital (DRM) para resguardar el contenido.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Política de reembolso</h2>
            <p>Se ofrece una <strong className="text-white">garantía condicionada de 21 días</strong>: si el usuario demuestra haber seguido el protocolo completo durante 21 días consecutivos y su puntuación ISI (Índice de Severidad del Insomnio) no muestra mejoría, podrá solicitar la devolución total del monto pagado.</p>
            <p className="mt-2">Para solicitar el reembolso, el usuario deberá enviar evidencia del cumplimiento del plan a <a href="mailto:metodorest@gmail.com" className="text-rest-accent hover:underline">metodorest@gmail.com</a> dentro de los 30 días posteriores a la compra.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Limitación de responsabilidad</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>El titular no garantiza resultados específicos, ya que estos dependen de la adherencia individual al protocolo y las condiciones de salud previas de cada usuario.</li>
              <li>La Plataforma se proporciona &ldquo;tal cual&rdquo;, sin garantías implícitas de idoneidad para un fin particular.</li>
              <li>El titular no será responsable por daños directos, indirectos, incidentales o consecuentes derivados del uso de la Plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Disponibilidad del servicio</h2>
            <p>El titular se compromete a mantener la Plataforma disponible de manera razonable, pero no garantiza un servicio ininterrumpido. Podrán realizarse mantenimientos, actualizaciones o modificaciones que impliquen una interrupción temporal.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Modificaciones</h2>
            <p>El titular se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán comunicadas a través de la Plataforma y entrarán en vigor desde su publicación. El uso continuado del servicio tras la publicación de cambios implica la aceptación de los mismos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Legislación aplicable</h2>
            <p>Estos Términos se rigen por la legislación vigente de la República de Chile. Para la resolución de cualquier controversia, las partes se someten a los tribunales ordinarios de justicia de la ciudad de Santiago, Chile.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contacto</h2>
            <p>Para consultas relacionadas con estos términos, puede escribir a: <a href="mailto:metodorest@gmail.com" className="text-rest-accent hover:underline">metodorest@gmail.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
