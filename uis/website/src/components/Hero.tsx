export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-accent-300 mb-6">
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Desde 2011 · Valencia &amp; Miami
          </div>

          {/* Headline */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Talento que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-400">
              transforma
            </span>{" "}
            empresas
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-primary-100 leading-relaxed mb-10 max-w-2xl">
            Nexova Solutions ayuda a medianas empresas a encontrar, desarrollar y
            acompañar el talento que necesitan para crecer. Headhunting, soporte
            externalizado y formación corporativa — con la inteligencia que
            marca la diferencia.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contacto"
              className="px-8 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors text-center"
            >
              Solicitar una consulta
            </a>
            <a
              href="#servicios"
              className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              Ver nuestros servicios
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
