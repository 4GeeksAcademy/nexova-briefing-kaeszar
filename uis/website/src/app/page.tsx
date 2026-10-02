import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import About from "@/components/About";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Services />
        <Stats />
        <About />
        <CTA />
      </main>
      <Footer />
      <a
        href="#top"
        aria-label="Volver arriba"
        className="fixed bottom-6 right-6 z-40 inline-flex h-12 items-center justify-center rounded-full bg-primary-700 px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-accent-300"
      >
        ↑ Volver arriba
      </a>
    </div>
  );
}
