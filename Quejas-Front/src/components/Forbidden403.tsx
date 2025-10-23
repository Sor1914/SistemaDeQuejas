export default function Forbidden403({ title = 'Acceso denegado', message = 'No tienes permisos para ver esta página.' }: {title?: string; message?: string}) {
  return (
    <section className="py-16 px-4 text-center">
      <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--ink)' }}>{title}</h1>
      <p className="section-sub mb-6">{message}</p>
      <button
        className="btn btn-primary hover-black"
        onClick={() => window.dispatchEvent(new CustomEvent('app:open-login'))}
      >
        Iniciar sesión
      </button>
    </section>
  );
}
