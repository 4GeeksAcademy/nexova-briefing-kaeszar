import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexova Solutions — Talento que transforma",
  description:
    "Consultora de recursos humanos y selección de talento. Headhunting, outsourcing de soporte y formación corporativa para empresas que quieren crecer.",
  keywords: [
    "recursos humanos",
    "selección de talento",
    "headhunting",
    "outsourcing",
    "formación corporativa",
    "consultora RRHH",
    "Valencia",
    "Miami",
  ],
  openGraph: {
    title: "Nexova Solutions — Talento que transforma",
    description:
      "12 años ayudando a empresas a encontrar, desarrollar y acompañar el talento que necesitan.",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased text-neutral-800 bg-white">
        {children}
      </body>
    </html>
  );
}
