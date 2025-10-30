/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { RequirePermission } from '../../app/routes/guards';
import { useAuth } from '../auth/AuthContext';
import {
  obtenerQuejasPA,
  obtenerEncabezadoQueja,
  obtenerDetalleQueja,
  agregarDetalleQueja,
  actualizarEstadoQueja,
  descargarArchivo
} from './api';
import type { DetalleQueja, EncabezadoQueja } from './types';

const PAGE_SIZE = 5;
const LIMITE_MB = 10;
const EXT_OK = ['jpg','jpeg','png','xlsx','xls','pdf','doc','docx'];

type ModalState =
  | { type: 'none' }
  | { type: 'ver'; id: number }
  | { type: 'detalle'; id: number }
  | { type: 'procedente'; id: number }
  | { type: 'rechazo'; id: number }
  | { type: 'resolver'; id: number };

export default function SeguimientoPAPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<EncabezadoQueja[]>([]);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const data = await obtenerQuejasPA(token);
      setRows(data);
      setLoading(false);
    })();
  }, [token]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageClamped = Math.min(page, totalPages);
  const pageData = useMemo(() => {
    const start = (pageClamped - 1) * PAGE_SIZE;
    return rows.slice(start, start + PAGE_SIZE);
  }, [rows, pageClamped]);

  function toast(kind: 'success'|'error'|'warning'|'info', message: string) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { kind, message }}));
  }

  async function refresh() {
    if (!token) return;
    const data = await obtenerQuejasPA(token);
    setRows(data);
  }

  return (
    <RequirePermission permission="SeguimientoPuntoAtencion">
      <section className="py-8 space-y-6 w-full">
        <header>
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
            Seguimiento Punto Atención
          </h1>
        </header>

        <div className="card">
          {/* barra superior con pager */}
          <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <button className="btn" disabled={pageClamped <= 1} onClick={() => setPage(1)}>⏮</button>
            <button className="btn" disabled={pageClamped <= 1} onClick={() => setPage(p => Math.max(1, p-1))}>◀</button>
            <span className="text-sm">{pageClamped} de {totalPages}</span>
            <button className="btn" disabled={pageClamped >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>▶</button>
            <button className="btn" disabled={pageClamped >= totalPages} onClick={() => setPage(totalPages)}>⏭</button>
          </div>

          {/* tabla */}
          <div className="p-4">
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-sm">
                <thead style={{ background: 'var(--subtle)' }}>
                  <tr className="text-left">
                    <th className="px-3 py-2">Correlativo</th>
                    <th className="px-3 py-2">Etapa</th>
                    <th className="px-3 py-2">Detalle</th>
                    <th className="px-3 py-2 text-center">Ver</th>
                    <th className="px-3 py-2 text-center">Procedente</th>
                    <th className="px-3 py-2 text-center">Rechazar</th>
                    <th className="px-3 py-2 text-center">Detalle</th>
                    <th className="px-3 py-2 text-center">Resolver</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="px-3 py-4">Cargando…</td></tr>
                  ) : pageData.length === 0 ? (
                    <tr><td colSpan={8} className="px-3 py-4">No se encontraron registros.</td></tr>
                  ) : (
                    pageData.map(row => (
                      <tr key={row.Id_Encabezado} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="px-3 py-2">{row.Correlativo}</td>
                        <td className="px-3 py-2">{row.Estado_Interno}</td>
                        <td className="px-3 py-2">{row.Detalle}</td>

                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-ghost" onClick={() => setModal({ type: 'ver', id: row.Id_Encabezado })}>👁️</button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-success" onClick={() => setModal({ type: 'procedente', id: row.Id_Encabezado })}>✓</button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-danger" onClick={() => setModal({ type: 'rechazo', id: row.Id_Encabezado })}>✕</button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button className="btn btn-info" onClick={() => setModal({ type: 'detalle', id: row.Id_Encabezado })}>ℹ️</button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {row.Id_Estado_Interno === 5 && (
                            <button className="btn" onClick={() => setModal({ type: 'resolver', id: row.Id_Encabezado })}>✔</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* paginación inferior */}
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
      {modal.type === 'ver' && (
        <ModalVer
          id={modal.id}
          onClose={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'detalle' && (
        <ModalDetalle
          id={modal.id}
          onClose={() => setModal({ type: 'none' })}
          onSaved={async () => { await refresh(); toast('success','El detalle se almacenó correctamente'); }}
          onError={() => toast('error','Hubo un error al almacenar el detalle')}
        />
      )}

      {modal.type === 'procedente' && (
        <Confirm
          title="Asignación de Queja"
          message="Queja será actualizada a estado procedente, oprima Aceptar si está de acuerdo o Cerrar si no lo está"
          confirmText="Aceptar"
          onClose={() => setModal({ type: 'none' })}
          onConfirm={async () => {
            if (!token) return;
            const ok = await actualizarEstadoQueja(token, { Id_Encabezado: modal.id, Id_Estado_Externo: 4, Id_Estado_Interno: 5 });
            if (ok) { toast('success','Se Actualizó a procedente correctamente'); await refresh(); }
            else { toast('error','Hubo un error al guardar la información'); }
            setModal({ type: 'none' });
          }}
        />
      )}

      {modal.type === 'resolver' && (
        <Confirm
          title="Asignación de Queja"
          message="Queja será resuelta, verificar que haya ingresado detalles de la gestión, no se podrá ingresar más información"
          confirmText="Resolver"
          onClose={() => setModal({ type: 'none' })}
          onConfirm={async () => {
            if (!token) return;
            const ok = await actualizarEstadoQueja(token, { Id_Encabezado: modal.id, Id_Estado_Externo: 9, Id_Estado_Interno: 7 });
            if (ok) { toast('success','La queja se actualizó correctamente.'); await refresh(); }
            else { toast('error','Hubo un error al guardar la información'); }
            setModal({ type: 'none' });
          }}
        />
      )}

      {modal.type === 'rechazo' && (
        <ModalRechazo
          id={modal.id}
          onClose={() => setModal({ type: 'none' })}
          onConfirm={async (just) => {
            if (!token) return;
            const ok = await actualizarEstadoQueja(token, { Id_Encabezado: modal.id, Id_Estado_Externo: 4, Id_Estado_Interno: 6, Justificacion: just });
            if (ok) { toast('success','La información se almacenó correctamente'); await refresh(); }
            else { toast('error','Hubo un error al guardar la información'); }
            setModal({ type: 'none' });
          }}
        />
      )}
    </RequirePermission>
  );
}

/* ----------------- Modales / Frames ----------------- */
function Frame({
  title, onClose, children, footer,
}: { title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; }) {
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center px-3">
        <div
          className="w-full max-w-4xl rounded-2xl border shadow-xl flex flex-col max-h-[90vh]"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <button className="btn btn-ghost" onClick={onClose}>✕</button>
          </div>
          {/* Contenido scrollable */}
          <div className="p-4 overflow-y-auto flex-1">
            {children}
          </div>
          <div className="px-4 py-3 border-t flex justify-end gap-2" style={{ borderColor: 'var(--border)' }}>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}

function Confirm({
  title, message, onClose, onConfirm, confirmText = 'Confirmar',
}: { title: string; message: string; onClose: () => void; onConfirm: () => void | Promise<void>; confirmText?: string; }) {
  return (
    <Frame
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar ✖</button>
          <button className="btn btn-primary" onClick={onConfirm}>{confirmText} 💾</button>
        </>
      }
    >
      <p>{message}</p>
    </Frame>
  );
}

/* -------- Modal VER -------- */
function ModalVer({ id, onClose }: { id: number; onClose: () => void; }) {
  const { token } = useAuth();
  const [enc, setEnc] = useState<EncabezadoQueja | null>(null);
  const [detalles, setDetalles] = useState<DetalleQueja[]>([]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      const e = await obtenerEncabezadoQueja(token, id);
      const d = await obtenerDetalleQueja(token, id);
      setEnc(e);
      setDetalles(d);
    })();
  }, [token, id]);

  async function handleDownload(url?: string) {
    if (!token || !url) return;
    const blob = await descargarArchivo(token, url);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = url.split('/').pop() ?? 'archivo';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <Frame title="Visualizar Queja" onClose={onClose}
      footer={<button className="btn btn-danger" onClick={onClose}>Cerrar ✖</button>}>
      {!enc ? <p>Cargando…</p> : (
        <div className="space-y-6">
          <h4 className="text-center text-xl font-semibold">{enc.Correlativo}</h4>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{`${enc.Nombres ?? ''} ${enc.Apellidos ?? ''}`.trim()}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Email ?? ''}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Teléfono</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Telefono ?? ''}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Etapa</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Estado_Interno}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">Región</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Nombre_Region ?? ''}</div>
            </div>
            <div>
              <label className="block text-sm mb-1">P.A.</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Nombre_Punto_Atencion ?? ''}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Queja</label>
              <div className="input" style={{ pointerEvents: 'none' }}>{enc.Detalle}</div>
            </div>
          </div>

          {enc.Direccion_Archivo && (
            <div className="flex justify-center">
              <button className="btn btn-success" onClick={() => handleDownload(enc.Direccion_Archivo)}>
                Descargar ⬇
              </button>
            </div>
          )}

          {detalles?.length ? (
            <>
              <hr />
              {/* Contenedor scrolleable para el listado de detalles */}
              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-1">
                {detalles.map((det, i) => (
                  <div key={i} className="space-y-3">
                    <div className="text-center text-sm opacity-80">{det.Fecha_Detalle}</div>
                    <div>
                      <label className="block text-sm mb-1">Usuario</label>
                      <div className="input" style={{ pointerEvents: 'none' }}>{det.Id_Usuario ?? ''}</div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Detalle</label>
                      <div className="input" style={{ pointerEvents: 'none' }}>{det.Comentario}</div>
                    </div>
                    {det.Direccion_Archivo && (
                      <div className="flex justify-center">
                        <button className="btn btn-success" onClick={() => handleDownload(det.Direccion_Archivo)}>
                          Descargar ⬇
                        </button>
                      </div>
                    )}
                    <hr />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}
    </Frame>
  );
}

/* -------- Modal DETALLE (agregar) -------- */
function ModalDetalle({
  id, onClose, onSaved, onError
}: { id: number; onClose: () => void; onSaved: () => void; onError: () => void; }) {
  const { token } = useAuth();
  const [comentario, setComentario] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [errFile, setErrFile] = useState('');

  function validarArchivo(f?: File | null) {
    if (!f) { setErrFile(''); return true; }
    if (f.size > LIMITE_MB * 1024 * 1024) { setErrFile(`El archivo debe tener un tamaño menor a ${LIMITE_MB} MB`); return false; }
    const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
    if (!EXT_OK.includes(ext)) { setErrFile(`El archivo debe tener una de las siguientes extensiones: ${EXT_OK.join(', ')}`); return false; }
    setErrFile(''); return true;
  }

  return (
    <Frame
      title="Detalle de Queja"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar ✖</button>
          <button
            className="btn btn-primary"
            disabled={!comentario || !!errFile}
            onClick={async () => {
              if (!token) return;
              try {
                const ok = await agregarDetalleQueja(token, { Id_Encabezado: id, Comentario: comentario, ArchivoAdjunto: file ?? undefined });
                if (ok) onSaved(); else onError();
              } catch { onError(); }
            }}
          >
            Guardar 💾
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Comentario</label>
          <textarea className="input min-h-[100px]" value={comentario} onChange={e => setComentario(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Seleccionar archivo</label>
          <input
            type="file"
            className="input"
            onChange={e => {
              const f = e.target.files?.[0] ?? null;
              if (validarArchivo(f)) setFile(f); else setFile(null);
            }}
          />
          {errFile && <p className="text-sm mt-1" style={{ color: 'var(--danger)' }}>{errFile}</p>}
        </div>
      </div>
    </Frame>
  );
}

/* -------- Modal RECHAZO -------- */
function ModalRechazo({
  onClose, onConfirm
}: { id: number; onClose: () => void; onConfirm: (justificacion: string) => void | Promise<void>; }) {
  const [just, setJust] = useState('');
  return (
    <Frame
      title="Rechazar Queja"
      onClose={onClose}
      footer={
        <>
          <button className="btn" onClick={onClose}>Cancelar ✖</button>
          <button className="btn btn-primary" disabled={!just.trim()} onClick={() => onConfirm(just)}>Guardar 💾</button>
        </>
      }
    >
      <p className="mb-3"><i className="fa fa-comments-o" /> ¿Está seguro de que quiere rechazar este registro?</p>
      <label className="block text-sm mb-1">Justificación</label>
      <textarea className="input min-h-[100px]" value={just} onChange={e => setJust(e.target.value)} />
    </Frame>
  );
}
