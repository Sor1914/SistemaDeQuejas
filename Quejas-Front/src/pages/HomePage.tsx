export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="w-full px-4 md:px-6 py-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: 'var(--ink)' }}>
              Gestión de <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--secondary)' }}>Quejas</span> clara y eficiente
            </h1>
            <p className="mt-3" style={{ color: 'var(--muted)' }}>
              Registra, da seguimiento y resuelve incidentes con transparencia. Reportes y métricas al alcance.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button className="btn btn-primary" style={{ outlineColor: 'var(--secondary)' }}>
                Registrar queja
              </button>
              <button className="btn btn-outline" style={{ outlineColor: 'var(--primary)' }}>
                Ver estado
              </button>
            </div>
          </div>
          <div>
            <img
              src="/img/hero.svg"
              alt="Personas utilizando plataforma de quejas"
              className="rounded-2xl w-full h-64 md:h-80 object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="w-full px-4 md:px-6 py-12">
        <h2 className="section-title">Servicios</h2>
        <p className="section-sub mb-6">Procesos, seguimiento y atención al usuario.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { title: 'Registro de quejas', desc: 'Captura guiada, adjuntos y validación.' },
            { title: 'Seguimiento de casos', desc: 'Estados, SLA y notificaciones.' },
            { title: 'Reportes & KPIs', desc: 'Dashboard por categoría, tiempo y canal.' },
            { title: 'Atención al usuario', desc: 'Canales de respuesta y satisfacción.' },
          ].map((s) => (
            <article key={s.title} className="card overflow-hidden">
              <div className="p-5">
                <h3 className="font-medium" style={{ color: 'var(--ink)' }}>{s.title}</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Misión & Visión */}
      <section id="mision-vision" className="w-full px-4 md:px-6 pb-14">
        <h2 className="section-title">Misión & Visión</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <article className="card p-6">
            <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Misión</h3>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>
              Ofrecer una plataforma de gestión de quejas que promueva transparencia, eficiencia y mejora continua.
            </p>
          </article>
          <article className="card p-6">
            <h3 className="font-semibold" style={{ color: 'var(--ink)' }}>Visión</h3>
            <p className="mt-2" style={{ color: 'var(--muted)' }}>
              Convertirnos en el estándar regional para la atención de quejas, elevando la confianza entre instituciones y ciudadanos.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
