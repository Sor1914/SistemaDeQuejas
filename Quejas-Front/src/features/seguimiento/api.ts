/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '../../lib/axiosClient';
import type { SeguimientoRequest, SeguimientoRow } from './types';

// POST /API/SEGUIMIENTO/ObtenerEncabezadoQuejaPorCorrelativo  { Correlativo }
export async function obtenerSeguimientoPorCorrelativo(
  correlativo: string
): Promise<SeguimientoRow | null> {
  const body: SeguimientoRequest = { Correlativo: correlativo };

  const resp = await axiosClient.post(
    '/API/SEGUIMIENTO/ObtenerEncabezadoQuejaPorCorrelativo',
    body,
    { validateStatus: s => s >= 200 && s < 400 } // tu API a veces responde 302 Found
  );

  // La API devuelve DataTable -> array. Tomamos la primera fila.
  const raw = (Array.isArray(resp.data) ? resp.data
              : Array.isArray((resp.data as any)?.Table) ? (resp.data as any).Table
              : []) as any[];

  if (!raw.length) return null;

  const r = raw[0];

  const row: SeguimientoRow = {
    Correlativo: String(r.Correlativo ?? ''),
    Id_Estado_Externo: r.Id_Estado_Externo,
    Id_Estado_Interno: r.Id_Estado_Interno,
    Estado_Externo: r.Estado_Externo ?? r.EstadoExterno ?? undefined,
    Estado_Interno: r.Estado_Interno ?? r.EstadoInterno ?? undefined,
    Fecha: r.Fecha ?? r.Fecha_Registro ?? r.Fecha_Ingreso ?? undefined,
    Hora: r.Hora ?? r.Hora_Registro ?? undefined,
    Nombre_Region: r.Nombre_Region ?? r.Region ?? undefined,
    Nombre_Punto_Atencion: r.Nombre_Punto_Atencion ?? r.Punto_Atencion ?? undefined,
    Direccion_Archivo: r.Direccion_Archivo ?? r.Direcccion_Archivo ?? undefined, // typo tolerante
  };

  return row;
}
