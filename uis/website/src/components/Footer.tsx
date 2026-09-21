export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <span className="text-white font-heading font-bold text-sm">
                  N
                </span>
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Nexova
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Consultora de recursos humanos y selección de talento. Desde 2011
              en Valencia y Miami.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Servicios
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Headhunting
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Soporte Externalizado
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white transition-colors">
                  Formación Corporativa
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Empresa
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#resultados" className="hover:text-white transition-colors">
                  Resultados
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li>info@nexovasolutions.com</li>
              <li>+34 960 123 456</li>
              <li>Valencia, España</li>
              <li>Miami, Florida</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Nexova Solutions. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
