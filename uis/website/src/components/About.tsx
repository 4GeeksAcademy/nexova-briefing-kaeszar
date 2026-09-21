export default function About() {
  return (
    <section id="nosotros" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div>
            <span className="inline-block px-4 py-1 bg-accent-50 text-accent-600 text-sm font-semibold rounded-full mb-4">
              Sobre Nexova
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-6">
              12 años construyendo la experiencia que otros están empezando a
              buscar
            </h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                Nexova Solutions nació en 2011 en Valencia como una consultora
                de dos personas. Hoy somos una firma de 120 profesionales que
                opera en España y Estados Unidos, atendiendo a medianas empresas
                del sector tecnológico, retail y servicios financieros.
              </p>
              <p>
                Nuestros clientes nos eligen porque encontrar, formar y
                mantener comprometidas a las personas adecuadas es difícil — y
                nosotros llevamos doce años construyendo la experiencia para
                hacerlo bien.
              </p>
              <p>
                Ahora, con inteligencia artificial en el núcleo de nuestras
                operaciones, hacemos lo que siempre hemos hecho — pero más
                rápido, a mayor escala y con mucho menos esfuerzo manual.
              </p>
            </div>
          </div>

          {/* Visual / values */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🧠", title: "Experiencia", desc: "12 años en el mercado" },
              { icon: "🌍", title: "Alcance", desc: "España & Estados Unidos" },
              { icon: "⚡", title: "Velocidad", desc: "Procesos optimizados con IA" },
              { icon: "📊", title: "Datos", desc: "Decisiones basadas en evidencia" },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 bg-neutral-50 rounded-xl border border-neutral-100"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="font-heading font-bold text-neutral-900 mb-1">
                  {item.title}
                </div>
                <div className="text-sm text-neutral-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
