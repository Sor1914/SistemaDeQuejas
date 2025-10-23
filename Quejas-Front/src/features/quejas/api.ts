/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { axiosClient } from '../../lib/axiosClient';
import type { CrearQuejaPayload, TipoQueja, QuejaCreada } from './types';

// GET catálogo de tipos
export async function obtenerTiposQueja(): Promise<TipoQueja[]> {
  const { data } = await axiosClient.get('/API/TIPOQUEJA/ObtenerTiposQueja');
  const arr = Array.isArray(data) ? data : (Array.isArray(data?.Table) ? data.Table : []);
  return arr.map((r: any) => ({
    Id_Tipo: Number(r.Id_Tipo ?? r.id ?? 0),
    Siglas_Tipo: String(r.Siglas_Tipo ?? r.nombre ?? ''),
    Descripcion: String(r.Nombre ?? r.nombre ?? ''),
  }));
}

// POST multipart para crear
export async function crearQueja(p: CrearQuejaPayload): Promise<QuejaCreada> {
  const fd = new FormData();
  fd.append('Nombres', p.Nombres);
  fd.append('Apellidos', p.Apellidos);
  fd.append('Email', p.Email);
  fd.append('Telefono', p.Telefono);
  fd.append('Detalle', p.Detalle);
  fd.append('Tipo_Queja', String(p.Tipo_Queja));
  if (p.ArchivoAdjunto) {
    fd.append('file', p.ArchivoAdjunto); // el controller toma el primero (ok)
  }

  const resp = await axiosClient.post('/API/QUEJA/InsertarTipoQueja', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return resp.data as QuejaCreada;
}
