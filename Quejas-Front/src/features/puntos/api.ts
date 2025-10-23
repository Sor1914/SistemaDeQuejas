/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '../../lib/axiosClient';
import type { PuntoAtencion } from './types';


function mapToPunto(row: any): PuntoAtencion {
  return {
    Id: Number(row.Id ?? 0),
    NombrePuntoAtencion: String(row.NombrePuntoAtencion ?? ''),
    IdRegion: Number(row.IdRegion ?? 0),
    Estado: String(row.Estado ?? ''),
    cantidadUsuarios: Number(row.cantidadUsuarios ?? 0),
  };
}

export const PuntosApi = {
  async obtenerPuntos(filtro: Partial<PuntoAtencion> = {}): Promise<PuntoAtencion[]> {
    const { data, status } = await axiosClient.post('/API/PUNTOSATENCION/ObtenerPuntos', filtro);
    // tratamos 200 y 302 como "ok"
    if (status === 200 || status === 302) {
      return toArray(data).map(mapToPunto);
    }
    return [];
  },

  async agregarPunto(p: { NombrePuntoAtencion: string; IdRegion: number }): Promise<void> {
    // Estado NO se envía desde el front (lo define backend)
    await axiosClient.post('/API/PUNTOSATENCION/AgregarPunto', p);
  },

  async actualizarPunto(p: { Id: number; NombrePuntoAtencion: string; IdRegion: number }): Promise<void> {
    await axiosClient.post('/API/PUNTOSATENCION/ActualizarPunto', p);
  },

  async eliminarPunto(p: Pick<PuntoAtencion, 'Id'>): Promise<void> {
    await axiosClient.post('/API/PUNTOSATENCION/EliminarPunto', p);
  },

  async contarUsuariosPunto(p: Pick<PuntoAtencion, 'Id'>): Promise<number> {
    const { data } = await axiosClient.post('/API/PUNTOSATENCION/ContarUsuariosPunto', { Id: p.Id });
    if (typeof data?.cantidadUsuarios === 'number') return data.cantidadUsuarios;
    if (typeof data?.Punto?.cantidadUsuarios === 'number') return data.Punto.cantidadUsuarios;
    return 0;
  },

  async inactivarUsuariosPunto(p: Pick<PuntoAtencion, 'Id'>): Promise<void> {
    await axiosClient.post('/API/PUNTOSATENCION/InactivarUsuariosPunto', { Id: p.Id });
  },
};

function toArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.value)) return data.value;
  // si viene un solo objeto, lo meto en arreglo
  return [data];
}
