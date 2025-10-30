import { Outlet, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../features/auth/AuthContext'
import type { Permisos } from '../features/auth/types'
import LoginModal from '../features/auth/LoginModal'
import ToastHost from '../components/ui/ToastHost'

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0-5-5a5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"
      />
    </svg>
  )
}

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [topNavOpen, setTopNavOpen] = useState(false)
  const [grpQuejas, setGrpQuejas] = useState(true)

  const { isAuthenticated, permisos, user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  const hasAny = (p: Permisos | null, keys: (keyof Permisos)[]) =>
    !!p && keys.some((k) => p[k])

  useEffect(() => {
    const close = () => {
      setDrawerOpen(false)
      setTopNavOpen(false)
      setUserMenuOpen(false)
    }
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  useEffect(() => {
    const open = () => setShowLogin(true)
    window.addEventListener('app:open-login', open)
    return () => window.removeEventListener('app:open-login', open)
  }, [])

  // usa BASE_URL para assets en "public/"
  const logoSrc = `${import.meta.env.BASE_URL}img/logo.svg`

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Abrir menú lateral"
              className="p-2 rounded hover:bg-[var(--hover)]"
              onClick={() => setDrawerOpen((v) => !v)}
              style={{ color: 'var(--ink)' }}
            >
              <span className="sr-only">Abrir menú</span>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
              </svg>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img src={logoSrc} alt="Sistema de Quejas" className="h-7 w-7" />
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>
                Sistema de Quejas
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden md:inline-flex px-3 py-1.5 rounded border hover:bg-[var(--hover)]"
              onClick={() => setTopNavOpen((v) => !v)}
              aria-expanded={topNavOpen}
              aria-controls="top-hnav"
              title="Mostrar/ocultar navegación"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
            >
              Menú
            </button>

            <div className="relative flex items-center gap-3">
              {isAuthenticated && (
                <span className="hidden sm:inline text-sm" style={{ color: 'var(--ink)' }}>
                  {user?.nombre ?? 'Usuario'}
                </span>
              )}

              <button
                className="p-2 rounded hover:bg-[var(--hover)]"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((v) => !v)}
                style={{ color: 'var(--ink)' }}
              >
                <span className="sr-only">Abrir menú de usuario</span>
                <UserIcon />
              </button>

              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl border shadow-md p-1"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
                >
                  {!isAuthenticated ? (
                    <button
                      role="menuitem"
                      className="w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                      onClick={() => {
                        setUserMenuOpen(false)
                        setShowLogin(true)
                      }}
                    >
                      Iniciar sesión
                    </button>
                  ) : (
                    <>
                      <div className="px-3 py-2 text-xs" style={{ color: 'var(--muted)' }}>
                        Sesión de{' '}
                        <span className="font-medium" style={{ color: 'var(--ink)' }}>
                          {user?.nombre ?? 'Usuario'}
                        </span>
                      </div>
                      <button
                        role="menuitem"
                        className="w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                        onClick={() => {
                          setUserMenuOpen(false)
                          logout()
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          id="top-hnav"
          className={`w-full border-t transition-[max-height] duration-300 overflow-hidden ${topNavOpen ? 'max-h-24' : 'max-h-0'}`}
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <nav className="w-full px-4 md:px-6 h-12 flex items-center gap-6 overflow-x-auto whitespace-nowrap" aria-label="Principal">
            <a href="#servicios" className="hover:underline">Servicios</a>
            <a href="#mision-vision" className="hover:underline">Misión & Visión</a>
          </nav>
        </div>
      </header>

      <div className="relative">
        {drawerOpen && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

        <aside
          className={`fixed z-50 inset-y-0 left-0 w-[280px] transform transition-transform duration-300 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', color: 'var(--ink)' }}
          aria-label="Menú lateral"
        >
          <nav className="p-4 space-y-3">
            <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Navegación</p>

            <Link
              to="/quejas/nueva"
              className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
              onClick={() => setDrawerOpen(false)}
            >
              Registrar queja
            </Link>

            {isAuthenticated && (
              <>
                {hasAny(permisos, ['CatalogoPuntosAtencion', 'UsuarioPuntoAtencion', 'CatalogoQuejas']) && (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[var(--hover)]"
                      onClick={() => setGrpQuejas((v) => !v)}
                      aria-expanded={grpQuejas}
                      aria-controls="grp-catalogos"
                    >
                      <span className="font-medium">Catálogos</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" className={`${grpQuejas ? 'rotate-90' : ''} transition-transform`}>
                        <path fill="currentColor" d="m10 17l5-5l-5-5v10z" />
                      </svg>
                    </button>
                    {grpQuejas && (
                      <div id="grp-catalogos" className="ml-2 space-y-1">
                        {permisos?.CatalogoPuntosAtencion && (
                          <Link
                            to="/puntos"
                            className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                            onClick={() => setDrawerOpen(false)}
                          >
                            Puntos de atención
                          </Link>
                        )}

                        {permisos?.UsuarioPuntoAtencion && (
                          <Link
                            to="usuarios-punto"
                            className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                            onClick={() => setDrawerOpen(false)}
                          >
                            Relacionar Usuarios con PA
                          </Link>
                        )}
                      </div>
                    )}
                  </>
                )}

                {hasAny(permisos, ['AsignacionRechazo', 'SeguimientoCentralizador', 'SeguimientoPuntoAtencion', 'AutoConsulta']) && (
                  <>
                    <div className="mt-2 text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                      Seguimiento
                    </div>
                    <div className="ml-2 space-y-1 mt-1">
                      {permisos?.AsignacionRechazo && (
                        <Link
                          to="asignacion"
                          className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Asignación
                        </Link>
                      )}
                      {permisos?.SeguimientoPuntoAtencion && (
                        <Link
                          to="seguimiento/pa"
                          className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Seguimiento PA
                        </Link>
                      )}
                      {permisos?.AutoConsulta && (
                        <Link
                          to="autoconsulta"
                          className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                          onClick={() => setDrawerOpen(false)}
                        >
                          Autoconsulta
                        </Link>
                      )}
                    </div>
                  </>
                )}

                {permisos?.Usuarios && (
                  <>
                    <div className="mt-2 text-xs uppercase tracking-wide" style={{ color: 'var(--muted)' }}>
                      Administración
                    </div>
                    <Link
                      to="usuarios"
                      className="block w-full text-left px-3 py-2 rounded hover:bg-[var(--hover)]"
                      onClick={() => setDrawerOpen(false)}
                    >
                      Usuarios
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </aside>

        <main className="flex-1 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>

          <div className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center p-4">
            <div className="pointer-events-auto">
              <ToastHost />
            </div>
          </div>

          <footer className="mt-12 hr" style={{ background: 'var(--surface)' }}>
            <div className="mx-auto w-full max-w-[1200px] lg:max-w-[1400px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-3"></div>
            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
          </footer>
        </main>
      </div>
    </div>
  )
}
