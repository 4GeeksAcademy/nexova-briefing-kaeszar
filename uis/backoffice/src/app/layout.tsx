import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexova Solutions — Backoffice",
  description: "Panel de gestión interna de Nexova Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-primary-900 text-white flex flex-col">
            <div className="p-6 border-b border-primary-800">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-accent-400">N</span> Nexova
              </h1>
              <p className="text-xs text-primary-300 mt-1">Backoffice</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <a href="/" className="block px-3 py-2 rounded-lg bg-primary-800 text-white text-sm font-medium">
                Dashboard
              </a>
              <a href="/departments" className="block px-3 py-2 rounded-lg text-primary-200 hover:bg-primary-800 text-sm">
                Departamentos
              </a>
              <a href="/kpis" className="block px-3 py-2 rounded-lg text-primary-200 hover:bg-primary-800 text-sm">
                KPIs
              </a>
            </nav>
            <div className="p-4 border-t border-primary-800">
              <p className="text-xs text-primary-400">v0.1.0</p>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
