import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const heroSrc = `${import.meta.env.BASE_URL}img/hero.svg`;

  // recordatorio: los logos del carrusel están en /public/img/empresas/empresa{1..5}.webp
  const slides = useMemo(
    () => [1, 2, 3, 4, 5].map((n) => `${import.meta.env.BASE_URL}img/empresas/empresa${n}.webp`),
    []
  );

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    // recordatorio: cambiar 3500 si quiero que gire más rápido/lento
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  const goTo = (i: number) => setIdx(i % slides.length);

  return (
    <>
      <section
        className="border-b"
        style={{ background: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div className="w-full px-4 md:px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1
              className="text-3xl md:text-4xl font-semibold tracking-tight"
              style={{ color: "var(--ink)" }}
            >
              Gestión de <span style={{ textDecoration: "underline", textDecorationColor: "var(--secondary)" }}>Quejas</span> clara y eficiente
            </h1>
            <p className="mt-3" style={{ color: "var(--muted)" }}>
              Registra, da seguimiento y resuelve incidentes con transparencia. Reportes y métricas al alcance.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link to="/quejas/nueva" className="btn btn-primary" style={{ outlineColor: "var(--secondary)" }}>
                Registrar queja
              </Link>
              <Link to="/autoconsulta" className="btn btn-outline" style={{ outlineColor: "var(--primary)" }}>
                Ver estado
              </Link>
            </div>
          </div>
          <div>
            <img
              src={heroSrc}
              alt="Personas utilizando plataforma de quejas"
              className="rounded-2xl w-full h-64 md:h-80 object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Carrusel de empresas (logos con padding para que se vean más pequeños) */}
      <section
        id="usuarios"
        className="w-full px-4 md:px-6 py-10"
        aria-label="Empresas que usan el sistema"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Empresas que confían en nosotros</h2>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir al slide ${i + 1}`}
                className={`h-2 w-2 rounded-full transition-opacity ${i === idx ? "opacity-100" : "opacity-40"}`}
                style={{ background: "var(--ink)" }}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)` }}
          >
            {slides.map((src, i) => (
              <div key={i} className="min-w-full">
                {/* recordatorio: ajustar p-? y alturas si quiero logos más pequeños o más grandes */}
                <div className="flex items-center justify-center w-full h-40 md:h-56 p-6 md:p-10 bg-white" style={{ background: "var(--surface)" }}>
                  <img
                    src={src}
                    alt={`Empresa ${i + 1}`}
                    className="max-h-full max-w-full object-contain"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              className="m-2 px-3 py-2 rounded-xl text-sm"
              style={{ background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)" }}
              onClick={() => setIdx((idx - 1 + slides.length) % slides.length)}
            >
              ◀
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              className="m-2 px-3 py-2 rounded-xl text-sm"
              style={{ background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--border)" }}
              onClick={() => setIdx((idx + 1) % slides.length)}
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      <section id="servicios" className="w-full px-4 md:px-6 py-12">
        <h2 className="section-title">Servicios</h2>
        <p className="section-sub mb-6">Procesos, seguimiento y atención al usuario.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: "Registro de quejas", desc: "Captura guiada, adjuntos y validación." },
            { title: "Seguimiento de casos", desc: "Estados, SLA y notificaciones." },
            { title: "Reportes & KPIs", desc: "Dashboard por categoría, tiempo y canal." },
            { title: "Atención al usuario", desc: "Canales de respuesta y satisfacción." },
          ].map((s) => (
            <article key={s.title} className="card overflow-hidden">
              <div className="p-5">
                <h3 className="font-medium" style={{ color: "var(--ink)" }}>
                  {s.title}
                </h3>
                <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  {s.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="mision-vision" className="w-full px-4 md:px-6 pb-14">
        <h2 className="section-title">Misión & Visión</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <article className="card p-6">
            <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
              Misión
            </h3>
            <p className="mt-2" style={{ color: "var(--muted)" }}>
              Ofrecer una plataforma de gestión de quejas que promueva transparencia, eficiencia y mejora continua.
            </p>
          </article>
          <article className="card p-6">
            <h3 className="font-semibold" style={{ color: "var(--ink)" }}>
              Visión
            </h3>
            <p className="mt-2" style={{ color: "var(--muted)" }}>
              Convertirnos en el estándar regional para la atención de quejas, elevando la confianza entre instituciones y ciudadanos.
            </p>
          </article>
        </div>
      </section>

      <footer className="border-t mt-8" style={{ borderColor: "var(--border)" }}>
        <div className="w-full px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            © {new Date().getFullYear()} Gestión de Quejas
          </p>

          <nav className="flex items-center gap-3">
            {/* recordatorio: si uso archivos .svg, dejo el <a> y cambio el contenido por <img src=... className=\"h-5 w-5\"/> */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:opacity-80"
              style={{ outlineColor: "var(--primary)", border: "1px solid var(--border)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0 overflow-visible" style={{ color: "var(--ink)" }}>
                <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.91h-2.34V22c4.78-.75 8.44-4.92 8.44-9.94Z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:opacity-80"
              style={{ outlineColor: "var(--primary)", border: "1px solid var(--border)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0 overflow-visible" style={{ color: "var(--ink)" }}>
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.25-3.25a1.25 1.25 0 1 1-1.25 1.25A1.25 1.25 0 0 1 17.25 6.25Z"/>
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:opacity-80"
              style={{ outlineColor: "var(--primary)", border: "1px solid var(--border)" }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 shrink-0 overflow-visible" style={{ color: "var(--ink)" }}>
                <path d="M22 5.92a7.42 7.42 0 0 1-2.12.58 3.71 3.71 0 0 0 1.63-2.05 7.44 7.44 0 0 1-2.35.9 3.7 3.7 0 0 0-6.3 3.38 10.5 10.5 0 0 1-7.63-3.87 3.7 3.7 0 0 0 1.14 4.94A3.68 3.68 0 0 1 3 9.07v.05a3.7 3.7 0 0 0 2.97 3.63 3.7 3.7 0 0 1-1.67.06 3.7 3.7 0 0 0 3.45 2.57A7.43 7.43 0 0 1 2 17.54a10.49 10.49 0 0 0 5.67 1.66c6.81 0 10.53-5.64 10.53-10.53l-.01-.48A7.53 7.53 0 0 0 22 5.92Z"/>
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
