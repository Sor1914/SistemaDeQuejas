import {axiosClient} from '../../lib/axiosClient';
import type { DetalleQueja, EncabezadoQueja } from './types';

const BASE = '/API/SEGUIMIENTO';

export const SeguimientoApi = {
  obtenerQuejasAsignacion: async (): Promise<EncabezadoQueja[]> => {
    const { data, status } = await axiosClient.get(`${BASE}/ObtenerQuejasAsignacion`, { validateStatus: s => s >= 200 && s < 400 });
    return status === 302 ? data : (data ?? []); // la API retorna 302 (Found) con lista
  },

  obtenerEncabezadoQueja: async (Id_Encabezado: number): Promise<EncabezadoQueja | null> => {
    const { data, status } = await axiosClient.post(`${BASE}/ObtenerEncabezadoQueja`, { Id_Encabezado }, { validateStatus: s => s >= 200 && s < 400 });
    if (status === 302 && Array.isArray(data) && data.length) return data[0];
    return null;
  },

  obtenerDetalleQueja: async (Id_Encabezado: number): Promise<DetalleQueja[]> => {
    const { data, status } = await axiosClient.post(`${BASE}/ObtenerDetalleQueja`, { Id_Encabezado }, { validateStatus: s => s >= 200 && s < 400 });
    return status === 302 ? (data ?? []) : [];
  },

  actualizarPuntoEstadoQueja: async (payload: { Id_Encabezado: number; Id_Region: number; Id_Punto_Atencion: number }): Promise<EncabezadoQueja[] | null> => {
    const { data, status } = await axiosClient.post(`${BASE}/ActualizarPuntoEstadoQueja`, payload, { validateStatus: s => s >= 200 && s < 400 });
    return status === 200 ? data : null; // API devuelve lista con encabezado actualizado
  },

  actualizarEstadoQueja: async (payload: { Id_Encabezado: number; Justificacion: string }): Promise<EncabezadoQueja[] | null> => {
    const { data, status } = await axiosClient.post(`${BASE}/ActualizarEstadoQueja`, payload, { validateStatus: s => s >= 200 && s < 400 });
    return status === 200 ? data : null;
  },

  descargarArchivo: async (direccionArchivo: string): Promise<Blob | null> => {
    const { data, status, headers } = await axiosClient.post(
      `${BASE}/DescargarArchivo`,
      '',
      {
        params: { direccionArchivo },
        responseType: 'blob',
        validateStatus: s => s >= 200 && s < 400
      }
    );
    if (status >= 200 && status < 300) {
      // Nombre de archivo (si viene)
      const cd = headers['content-disposition'] || '';
      const match = /filename="?([^"]+)"?/.exec(cd);
      const filename = match?.[1] || 'archivo';
      // crear descarga
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return data;
    }
    return null;
  },
};
