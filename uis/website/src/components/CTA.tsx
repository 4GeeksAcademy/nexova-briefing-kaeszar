export default function CTA() {
  return (
    <section
      id="contacto"
      className="py-20 lg:py-28 bg-gradient-to-br from-primary-700 to-primary-900 text-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold mb-6">
          ¿Listo para transformar tu gestión de talento?
        </h2>
        <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
          Cuéntanos tu desafío y te mostramos cómo Nexova puede ayudarte.
          Primera consulta sin compromiso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:info@nexovasolutions.com"
            className="px-8 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            ✉️ info@nexovasolutions.com
          </a>
          <a
            href="tel:+34960123456"
            className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            📞 +34 960 123 456
          </a>
        </div>
        <p className="mt-8 text-sm text-primary-200">
          📍 Valencia, España · Miami, Florida
        </p>
      </div>
    </section>
  );
}
