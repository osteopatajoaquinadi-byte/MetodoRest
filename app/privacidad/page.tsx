import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-rest-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-rest-accent text-sm mb-8 hover:underline">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver al inicio
        </Link>

        <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-bold text-white mb-2">Política de Privacidad</h1>
        <p className="text-rest-text-muted text-sm mb-10">Última actualización: 18 de abril de 2026</p>

        <div className="prose-legal space-y-8 text-rest-text-secondary text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Responsable del tratamiento</h2>
            <p>El responsable del tratamiento de los datos personales recabados a través de la plataforma &ldquo;Método R.E.S.T.&rdquo; (en adelante, &ldquo;la Plataforma&rdquo;) es Joaquín Adi A., con domicilio en Chile.</p>
            <p className="mt-2">Correo de contacto: <a href="mailto:metodorest@gmail.com" className="text-rest-accent hover:underline">metodorest@gmail.com</a></p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Datos que recopilamos</h2>
            <p>Recopilamos los siguientes datos personales:</p>

            <h3 className="text-sm font-semibold text-white mt-4 mb-2">2.1 Datos proporcionados por el usuario</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Registro y compra:</strong> nombre, correo electrónico y datos de pago procesados por Hotmart (no almacenamos datos de tarjeta).</li>
              <li><strong className="text-white">Diario de sueño:</strong> registros de calidad de sueño, horas dormidas, puntuaciones de escalas clínicas (SSS, ISI). Estos datos se almacenan localmente en el navegador del usuario.</li>
              <li><strong className="text-white">Progreso del plan:</strong> avance en checklists y tareas completadas. Almacenado localmente.</li>
            </ul>

            <h3 className="text-sm font-semibold text-white mt-4 mb-2">2.2 Datos recopilados automáticamente</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white">Datos de navegación:</strong> dirección IP, tipo de navegador, sistema operativo, páginas visitadas, tiempo de permanencia.</li>
              <li><strong className="text-white">Cookies técnicas:</strong> necesarias para el funcionamiento de la Plataforma (sesión, preferencias de visualización).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Finalidad del tratamiento</h2>
            <p>Los datos personales se utilizan exclusivamente para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Gestionar el acceso a la Plataforma y sus contenidos.</li>
              <li>Proporcionar la experiencia interactiva del plan de 21 días.</li>
              <li>Comunicar actualizaciones del servicio o contenido relevante.</li>
              <li>Atender solicitudes de soporte o reembolso.</li>
              <li>Mejorar la calidad del servicio mediante análisis agregados y anónimos.</li>
            </ul>
            <p className="mt-2"><strong className="text-white">No vendemos, alquilamos ni compartimos datos personales con terceros</strong> con fines comerciales o publicitarios.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. Base legal</h2>
            <p>El tratamiento de datos se fundamenta en:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Ejecución contractual:</strong> necesario para prestar el servicio adquirido.</li>
              <li><strong className="text-white">Consentimiento:</strong> otorgado al aceptar estos términos y al utilizar la Plataforma.</li>
              <li><strong className="text-white">Interés legítimo:</strong> para mejorar el servicio y prevenir fraudes.</li>
            </ul>
            <p className="mt-2">En cumplimiento con la Ley N° 19.628 sobre Protección de la Vida Privada de Chile.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Almacenamiento y seguridad</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Los datos de salud (diario de sueño, puntuaciones) se almacenan <strong className="text-white">exclusivamente en el dispositivo del usuario</strong> (localStorage del navegador). No se transmiten a servidores externos.</li>
              <li>Los datos de cuenta y acceso se procesan a través de servicios seguros con cifrado TLS/SSL.</li>
              <li>La Plataforma está alojada en Vercel, con infraestructura conforme a estándares internacionales de seguridad.</li>
              <li>Implementamos medidas de protección digital (DRM) para el contenido del ebook.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Cookies</h2>
            <p>La Plataforma utiliza cookies estrictamente necesarias para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Cookies de sesión:</strong> mantener la sesión activa del usuario.</li>
              <li><strong className="text-white">Cookies de preferencias:</strong> recordar ajustes de visualización.</li>
              <li><strong className="text-white">Cookies de rendimiento:</strong> análisis anónimo de uso para mejorar la experiencia.</li>
            </ul>
            <p className="mt-2">No utilizamos cookies de publicidad ni de seguimiento de terceros. El usuario puede gestionar las cookies desde la configuración de su navegador.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Derechos del usuario</h2>
            <p>El usuario tiene derecho a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-white">Acceso:</strong> solicitar información sobre los datos personales que tenemos.</li>
              <li><strong className="text-white">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
              <li><strong className="text-white">Cancelación:</strong> solicitar la eliminación de sus datos personales.</li>
              <li><strong className="text-white">Oposición:</strong> oponerse al tratamiento de sus datos en determinados supuestos.</li>
            </ul>
            <p className="mt-2">Para ejercer estos derechos, envíe un correo a <a href="mailto:metodorest@gmail.com" className="text-rest-accent hover:underline">metodorest@gmail.com</a> con el asunto &ldquo;Ejercicio de derechos ARCO&rdquo; indicando su nombre completo, correo asociado a la cuenta y el derecho que desea ejercer. Responderemos en un plazo máximo de 15 días hábiles.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Transferencia internacional de datos</h2>
            <p>Los datos de navegación pueden ser procesados por servicios de infraestructura (Vercel) con servidores ubicados fuera de Chile. Estos proveedores cumplen con estándares internacionales de protección de datos y cuentan con las garantías contractuales adecuadas.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Menores de edad</h2>
            <p>La Plataforma no está dirigida a menores de 18 años. No recopilamos intencionalmente datos de menores. Si detectamos que un menor ha proporcionado datos personales, procederemos a eliminarlos.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Retención de datos</h2>
            <p>Los datos personales se conservarán mientras la cuenta del usuario esté activa o sea necesario para prestar el servicio. Una vez solicitada la cancelación, los datos serán eliminados en un plazo máximo de 30 días, salvo obligación legal de conservación.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Modificaciones</h2>
            <p>Nos reservamos el derecho de actualizar esta Política de Privacidad. Las modificaciones serán publicadas en esta misma página con la fecha de actualización. Recomendamos revisarla periódicamente.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Contacto</h2>
            <p>Para cualquier consulta sobre privacidad o protección de datos:</p>
            <p className="mt-2">
              <a href="mailto:metodorest@gmail.com" className="text-rest-accent hover:underline">metodorest@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
