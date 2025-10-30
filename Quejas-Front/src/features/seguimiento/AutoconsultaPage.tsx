/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { obtenerTiposQueja } from '../../features/quejas/api';
import type { TipoQueja } from '../../features/quejas/types';
import { obtenerSeguimientoPorCorrelativo } from './api';
import AutoconsultaModal from './components/AutoconsultaModal';

const schema = z.object({
  TipoId: z.number().int().min(1, 'Selecciona un tipo'),
  Numero: z.string().regex(/^\d+$/, 'Solo números'),
  Anio: z.string().regex(/^\d{4}$/, 'Año de 4 dígitos'),
});

type FormValues = z.infer<typeof schema>;

export default function AutoconsultaPage() {
  const [tipos, setTipos] = useState<TipoQueja[]>([]);
  const [open, setOpen] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { TipoId: 0, Numero: '', Anio: String(new Date().getFullYear()) }
    });

  useEffect(() => {
    (async () => {
      try {
        const t = await obtenerTiposQueja();
        setTipos(t);
      } catch { setTipos([]); }
    })();
  }, []);

  const onSubmit = async (values: FormValues) => {
    const tipo = tipos.find(t => t.Id_Tipo === values.TipoId);
    const siglas = tipo?.Siglas_Tipo ?? '';
    const correlativo = `${siglas}-${values.Numero}-${values.Anio}`;
    try {
      const row = await obtenerSeguimientoPorCorrelativo(correlativo);
      if (!row) {
        window.dispatchEvent(new CustomEvent('app:toast', {
          detail: { kind: 'warning', message: 'No se encontró la queja.' }
        }));
        return;
      }
      setResultado(row);
      setOpen(true);
    } catch {
      window.dispatchEvent(new CustomEvent('app:toast', {
        detail: { kind: 'error', message: 'Error al consultar la queja.' }
      }));
    }
  };

  return (
    <section className="py-8 space-y-6 w-full">
      <header>
        <h1 className="text-2xl font-semibold" style={{ color: 'var(--ink)' }}>Autoconsulta de Quejas</h1>
        <p className="section-sub">Indica el tipo, número y año de tu queja.</p>
      </header>

      <div className="card p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4" noValidate>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Tipo de queja</label>
            <select
              {...register('TipoId', { valueAsNumber: true })}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <option value={0}>Selecciona...</option>
              {tipos.map(t => (
                <option key={t.Id_Tipo} value={t.Id_Tipo}>
                  {t.Siglas_Tipo}{t.Descripcion ? ` — ${t.Descripcion}` : ''}
                </option>
              ))}
            </select>
            {errors.TipoId && <p className="text-xs text-red-600 mt-1">{errors.TipoId.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Número</label>
            <input
              {...register('Numero')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              inputMode="numeric"
            />
            {errors.Numero && <p className="text-xs text-red-600 mt-1">{errors.Numero.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1">Año</label>
            <input
              {...register('Anio')}
              className="w-full rounded-lg border px-3 py-2"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              inputMode="numeric"
              maxLength={4}
            />
            {errors.Anio && <p className="text-xs text-red-600 mt-1">{errors.Anio.message}</p>}
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary hover-black">
              {isSubmitting ? 'Buscando…' : 'Consultar'}
            </button>
          </div>
        </form>
      </div>

      {resultado && (
        <AutoconsultaModal open={open} onClose={() => setOpen(false)} data={resultado} />
      )}
    </section>
  );
}
