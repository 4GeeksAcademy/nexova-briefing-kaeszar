export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 mb-8 sm:grid-cols-2 md:grid-cols-5">
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
              <li>Valencia: +34 960 123 456</li>
              <li>Miami (ficticio): +1 305 555 0142</li>
              <li>Valencia, España</li>
              <li>Miami, Florida</li>
            </ul>
          </div>

          {/* Social media */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <h4 className="font-heading mb-4 text-sm font-semibold text-white">
              Síguenos en redes
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.linkedin.com/company/nexovacyber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white"
                >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-lg font-bold text-white shadow-sm"
                  aria-hidden="true"
                >
                  in
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">LinkedIn</span>
                  <span className="text-xs text-neutral-400">Visitar perfil</span>
                </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/nexovacyber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white"
                >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 text-white shadow-sm"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="18" cy="6" r="1" fill="currentColor" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">Instagram</span>
                  <span className="text-xs text-neutral-400">Visitar perfil</span>
                </span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/nexovacyber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 transition-colors hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white"
                >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] text-2xl font-bold leading-none text-white shadow-sm"
                  aria-hidden="true"
                >
                  f
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">Facebook</span>
                  <span className="text-xs text-neutral-400">Visitar perfil</span>
                </span>
                </a>
              </li>
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
