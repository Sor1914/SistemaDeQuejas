import {axiosClient} from '../../lib/axiosClient';
import type { PuntoAtencion, Region } from './types';

const BASE = '/API/USUARIOPUNTOATENCION';

export const UsuarioApi = {
  obtenerRegiones: async (): Promise<Region[]> => {
    const { data, status } = await axiosClient.get(`${BASE}/ObtenerRegiones`, { validateStatus: s => s >= 200 && s < 400 });
    return status === 302 ? (data ?? []) : [];
  },

  obtenerPuntos: async (): Promise<PuntoAtencion[]> => {
    const { data, status } = await axiosClient.post(`${BASE}/ObtenerPuntos`, {}, { validateStatus: s => s >= 200 && s < 400 });
    return status === 302 ? (data ?? []) : [];
  },
};
