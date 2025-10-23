/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { RequirePermission } from '../../app/routes/guards';
import { useAuth } from '../auth/AuthContext';
import { actualizarUsuario, eliminarUsuario, obtenerRoles, obtenerUsuarios } from './api';
import type { Rol, Usuario } from './types';

const PAGE_SIZE = 5;

type ModalState =
  | { type: 'none' }
  | { type: 'editar'; row: Usuario }
  | { type: 'eliminar'; row: Usuario };

export default function UsuariosPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  function toast(kind: 'success'|'error'|'warning'|'info', message: string) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { kind, message } }));
  }

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const [u, r] = await Promise.all([obtenerUsuarios(token), obtenerRoles(token)]);
      setRows(u ?? []);
      setRoles(r ?? []);
      setLoading(false);
    })();
  }, [token]);

  const filtered = useMemo(() => {
    const s = q.trim().toUpperCase();
    if (!s) return rows;
    return rows.filter(x => (`${x.Nombres} ${x.Apellidos}`.trim()).toUpperCase().includes(s));
  }, [rows, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    const start = (pageClamped - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, pageClamped]);

  async function refresh() {
    if (!token) return;
    const u = await obtenerUsuarios(token);
    setRows(u ?? []);
  }

  return (
    <RequirePermission permission="Usuarios">
      <section className="py-8 space-y-6 w-full">
        <header>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Usuarios</h1>
          <p className="section-sub">Administración de usuarios y rol asignado.</p>
        </header>

        <div className="card">
          {/* Header + buscador */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="grid md:grid-cols-2 gap-3">
              <div />
              <div className="flex items-center justify-end gap-2">
                <span className="px-2 py-1 rounded text-sm" style={{ background: 'var(--ink)', color: 'var(--surface)' }}>
                  Nombre
                </span>
                <input
                  className="input"
                  placeholder="Nombre"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                />
                <button className="btn" onClick={() => setPage(1)}>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla */}
          <div className="p-4">
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--subtle)' }}>
                  <tr className="text-left">
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2">DPI</th>
                    <th className="px-3 py-2">ROL</th>
                    <th className="px-3 py-2">Departamento</th>
                    <th className="px-3 py-2 text-center">Editar</th>
                    <th className="px-3 py-2 text-center">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="px-3 py-4">Cargando…</td></tr>
                  ) : pageData.length === 0 ? (
                    <tr><td colSpan={6} className="px-3 py-4">No se encontraron registros.</td></tr>
                  ) : (
                    pageData.map(row => (
                      <tr key={row.Id_Usuario} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-3 py-2">{row.Nombres} {row.Apellidos}</td>
                        <td className="px-3 py-2">{row.CUI}</td>
                        <td className="px-3 py-2">{row.Nombre_Rol}</td>
                        <td className="px-3 py-2">{row.Departamento ?? ''}</td>
                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-ghost" onClick={() => setModal({ type: 'editar', row })}>✎</button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-danger" onClick={() => setModal({ type: 'eliminar', row })}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="mt-3 flex items-center gap-2">
              <button className="btn" disabled={pageClamped <= 1} onClick={() => setPage(1)}>⏮</button>
              <button className="btn" disabled={pageClamped <= 1} onClick={() => setPage(p => Math.max(1, p-1))}>◀</button>
              <span className="text-sm">{pageClamped} de {totalPages}</span>
              <button className="btn" disabled={pageClamped >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>▶</button>
              <button className="btn" disabled={pageClamped >= totalPages} onClick={() => setPage(totalPages)}>⏭</button>
            </div>
          </div>
        </div>
      </section>

      {/* Modales */}
      {modal.type === 'editar' && (
        <ModalEditarRol
          row={modal.row}
          roles={roles}
          onClose={() => setModal({ type: 'none' })}
          onSaved={async (idRol) => {
            if (!token) return;
            const ok = await actualizarUsuario(token, { Id_Usuario: modal.row.Id_Usuario, Id_Rol: idRol });
            if (ok) {
              toast('success', 'El rol se modificó correctamente');
              await refresh();
            } else {
              toast('error', 'Hubo un error al guardar la información');
            }
            setModal({ type: 'none' });
          }}
        />
      )}

      {modal.type === 'eliminar' && (
        <Confirm
          title="Notificación del sistema"
          message="¿Está seguro de eliminar este usuario?"
          onCancel={() => setModal({ type: 'none' })}
          onConfirm={async () => {
            if (!token) return;
            const ok = await eliminarUsuario(token, { Id_Usuario: modal.row.Id_Usuario });
            if (ok) {
              toast('success', 'El usuario se eliminó correctamente');
              await refresh();
            } else {
              toast('error', 'Hubo un error al eliminar el registro');
            }
            setModal({ type: 'none' });
          }}
        />
      )}
    </RequirePermission>
  );
}

/* --------------- UI Genérica --------------- */
function Frame({
  title, onClose, children, footer,
}: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; }) {
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div className="w-full max-w-3xl rounded-2xl border shadow-xl"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="btn btn-ghost" onClick={onClose}>✕</button>
          </div>
          <div className="p-4">{children}</div>
          <div className="px-4 py-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

function Confirm({
  title, message, onCancel, onConfirm,
}: { title: string; message: string; onCancel: () => void; onConfirm: () => void | Promise<void>; }) {
  return (
    <Frame
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn" onClick={onCancel}>Cerrar ✖</button>
          <button className="btn btn-warning" onClick={onConfirm}>Continuar 🗑️</button>
        </>
      }
    >
      <p>{message}</p>
    </Frame>
  );
}

/* --------------- Modal Editar Rol --------------- */
function ModalEditarRol({
  row, roles, onClose, onSaved
}: {
  row: Usuario;
  roles: Rol[];
  onClose: () => void;
  onSaved: (idRol: number) => void | Promise<void>;
}) {
  const [idRol, setIdRol] = useState<number | ''>(row.Id_Rol ?? '');

  return (
    <Frame
      title="Editar Rol"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar ✖</button>
          <button
            className="btn btn-primary"
            disabled={!idRol}
            onClick={() => onSaved(idRol as number)}
          >
            Guardar 💾
          </button>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <div className="input" style={{ pointerEvents: 'none' }}>
            {row.Nombres} {row.Apellidos}
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">DPI</label>
          <div className="input" style={{ pointerEvents: 'none' }}>{row.CUI}</div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Rol</label>
          <select
            className="input"
            value={idRol}
            onChange={e => setIdRol(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Seleccionar rol</option>
            {roles.map(r => (
              <option key={r.Id_Rol} value={r.Id_Rol}>{r.Nombre_Rol}</option>
            ))}
          </select>
        </div>
      </div>
    </Frame>
  );
}
