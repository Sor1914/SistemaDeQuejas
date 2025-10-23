/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { PuntosApi } from './api';
import type { PuntoAtencion } from './types';

type FormState = {
  Id?: number;
  NombrePuntoAtencion: string;
  IdRegion: number | '';
};

const initialForm: FormState = {
  NombrePuntoAtencion: '',
  IdRegion: '',
};

function EstadoBadge({ value }: { value: string }) {
  const v = (value || '').toUpperCase();
  const label = v === 'A' ? 'Activo' : v === 'E' ? 'En revisión' : v === 'I' ? 'Inactivo' : v || '—';
  const style =
    v === 'A' ? { background: 'rgba(16,185,129,.15)', color: '#065f46' } :
    v === 'I' ? { background: 'rgba(239,68,68,.15)', color: '#7f1d1d' } :
                { background: 'rgba(59,130,246,.15)', color: '#1e3a8a' }; // E u otros
  return <span className="px-2 py-0.5 rounded text-xs font-medium" style={style}>{label}</span>;
}

export default function PuntosAtencionPage() {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<PuntoAtencion[]>([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState<FormState>(initialForm);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState<null | PuntoAtencion>(null);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const data = await PuntosApi.obtenerPuntos({} as any);
      setRows(data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRows(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r => (r.NombrePuntoAtencion ?? '').toLowerCase().includes(term));
  }, [q, rows]);

  const openCreate = () => {
    setForm(initialForm);
    setOpenForm(true);
  };

  const openEdit = (r: PuntoAtencion) => {
    setForm({
      Id: r.Id,
      NombrePuntoAtencion: r.NombrePuntoAtencion,
      IdRegion: r.IdRegion,
    });
    setOpenForm(true);
  };

  const save = async () => {
    if (!form.NombrePuntoAtencion.trim()) return;
    if (form.IdRegion === '' || Number.isNaN(Number(form.IdRegion))) return;

    setLoading(true);
    try {
      const payload = {
        NombrePuntoAtencion: form.NombrePuntoAtencion.trim(),
        IdRegion: Number(form.IdRegion),
      };
      if (form.Id) {
        await PuntosApi.actualizarPunto({ Id: form.Id, ...payload });
      } else {
        await PuntosApi.agregarPunto(payload);
      }
      setOpenForm(false);
      await fetchRows();
    } finally { setLoading(false); }
  };

  const confirmDelete = async () => {
    if (!openDelete?.Id) return;
    setLoading(true);
    try {
      await PuntosApi.eliminarPunto({ Id: openDelete.Id });
      setOpenDelete(null);
      await fetchRows();
    } finally { setLoading(false); }
  };

  const inactivarUsuarios = async (row: PuntoAtencion) => {
    if (!row.Id) return;
    setLoading(true);
    try {
      const cant = await PuntosApi.contarUsuariosPunto({ Id: row.Id });
      if (cant > 0) {
        await PuntosApi.inactivarUsuariosPunto({ Id: row.Id });
        await fetchRows();
      } else {
        // aquí puedes mostrar un toast: no hay usuarios para inactivar
      }
    } finally { setLoading(false); }
  };

return (
  <section className="w-full">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>
          Puntos de Atención
        </h1>
        <p className="section-sub">Administra puntos (Id región y nombre). El estado lo controla el sistema.</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          placeholder="Buscar por nombre..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
        />
        <button className="btn btn-outline hover-black" onClick={() => fetchRows()}>Buscar</button>
        <button className="btn btn-primary hover-black" onClick={openCreate}>Nuevo punto</button>
      </div>
    </div>

    <div className="card overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead style={{ background: 'var(--bg)' }}>
            <tr>
              <th className="text-left px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>ID</th>
              <th className="text-left px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>Nombre</th>
              <th className="text-left px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>Id Región</th>
              <th className="text-left px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>Estado</th>
              <th className="text-right px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.Id} className="hover-black-soft">
                <td className="px-4 py-3">{r.Id}</td>
                <td className="px-4 py-3">{r.NombrePuntoAtencion}</td>
                <td className="px-4 py-3">{r.IdRegion}</td>
                <td className="px-4 py-3"><EstadoBadge value={r.Estado} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button className="btn btn-outline hover-black" onClick={() => openEdit(r)}>Editar</button>
                    <button className="btn btn-outline hover-black" onClick={() => inactivarUsuarios(r)}>Inactivar usuarios</button>
                    <button className="btn btn-outline hover-black" onClick={() => setOpenDelete(r)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center section-sub" colSpan={5}>Sin resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {loading && <div className="px-4 py-3 text-sm section-sub">Cargando…</div>}
    </div>

    {openForm && (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenForm(false)} />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl border p-6 card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--ink)' }}>
              {form.Id ? 'Editar punto' : 'Nuevo punto'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nombre del punto</label>
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
                  value={form.NombrePuntoAtencion}
                  onChange={(e) => setForm((f) => ({ ...f, NombrePuntoAtencion: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Id Región</label>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: 'var(--border)', color: 'var(--ink)', background: 'var(--surface)' }}
                  value={form.IdRegion}
                  onChange={(e) => setForm((f) => ({ ...f, IdRegion: e.target.value === '' ? '' : Number(e.target.value) }))}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="btn btn-outline hover-black" onClick={() => setOpenForm(false)}>Cancelar</button>
              <button className="btn btn-primary hover-black" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {openDelete && (
      <div className="fixed inset-0 z-[60]">
        <div className="absolute inset-0 bg-black/50" onClick={() => setOpenDelete(null)} />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-2xl border p-6 card">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--ink)' }}>Eliminar punto</h3>
            <p className="section-sub">
              ¿Seguro que deseas eliminar <b>{openDelete.NombrePuntoAtencion}</b>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button className="btn btn-outline hover-black" onClick={() => setOpenDelete(null)}>Cancelar</button>
              <button className="btn btn-primary hover-black" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
);

}
