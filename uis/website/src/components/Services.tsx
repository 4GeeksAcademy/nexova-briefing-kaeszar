import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: "🎯",
    title: "Headhunting & Selección",
    description:
      "Encontramos a los perfiles que tu empresa necesita — mandos medios, directivos y especialistas — con un proceso riguroso y basado en datos.",
    features: [
      "Búsqueda activa de candidatos cualificados",
      "Scoring y ranking con inteligencia artificial",
      "Seguimiento del proceso en tiempo real",
      "Garantía de reemplazo incluida",
    ],
  },
  {
    icon: "🤝",
    title: "Soporte Externalizado",
    description:
      "Ponemos a tu disposición equipos de atención al cliente dedicados, gestionados por Nexova, que garantizan el cumplimiento de tus SLAs.",
    features: [
      "Agentes especializados por sector",
      "Base de conocimiento con RAG",
      "Dashboard de métricas en tiempo real",
      "Escalabilidad según tu demanda",
    ],
  },
  {
    icon: "📚",
    title: "Formación Corporativa",
    description:
      "Programas de desarrollo de habilidades blandas, liderazgo y gestión de equipos, diseñados a medida para cada cliente.",
    features: [
      "Catálogo de +50 programas formativos",
      "Recomendación personalizada por IA",
      "Seguimiento de progreso del alumno",
      "Cursos, talleres y webinars",
    ],
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1 bg-primary-50 text-primary-600 text-sm font-semibold rounded-full mb-4">
            Nuestros servicios
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-neutral-900 mb-4">
            Tres líneas de negocio,{" "}
            <span className="text-primary-500">un solo partner</span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Llevamos 12 años ayudando a empresas tecnológicas, retail y
            financieras a resolver sus desafíos de talento.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
