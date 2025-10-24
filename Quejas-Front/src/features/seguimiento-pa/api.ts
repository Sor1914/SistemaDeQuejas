/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '../../lib/axiosClient';
import type { DetalleQueja, EncabezadoQueja, EstadoPayload } from './types';

// Normalizadores seguros
const toArray = <T,>(x: any): T[] => (Array.isArray(x) ? x : []);
const toArrayLoose = <T,>(x: any): T[] =>
  Array.isArray(x) ? x : (x && typeof x === 'object' ? [x as T] : []);

export async function obtenerQuejasPA(token: string) {
  const resp = await axiosClient.get<EncabezadoQueja[]>(
    '/API/SEGUIMIENTO/ObtenerQuejasPA',
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return toArray<EncabezadoQueja>(resp?.data);
}

export async function obtenerEncabezadoQueja(token: string, idEncabezado: number) {
  const body = { Id_Encabezado: idEncabezado };
  const { data, status } = await axiosClient.post<EncabezadoQueja[]>(
    '/API/SEGUIMIENTO/ObtenerEncabezadoQueja',
    body,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  // Si viene arreglo, regresa el primero; si no, null
  return status === 302 && Array.isArray(data) && data.length ? data[0] : null;
}

export async function obtenerDetalleQueja(token: string, idEncabezado: number) {
  const body = { Id_Encabezado: idEncabezado };
  const { data } = await axiosClient.post<DetalleQueja[] | DetalleQueja | null>(
    '/API/SEGUIMIENTO/ObtenerDetalleQueja',
    body,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  // Siempre regresa un arreglo (aunque el backend mande objeto único o null)
  return toArrayLoose<DetalleQueja>(data);
}

export async function agregarDetalleQueja(
  token: string,
  payload: { Id_Encabezado: number; Comentario: string; ArchivoAdjunto?: File | null }
) {
  const form = new FormData();
  form.append('Comentario', payload.Comentario);
  form.append('Id_Encabezado', String(payload.Id_Encabezado));
  if (payload.ArchivoAdjunto) {
    form.append('ArchivoAdjunto', payload.ArchivoAdjunto, payload.ArchivoAdjunto.name);
  }

  const { data, status } = await axiosClient.post(
    '/API/SEGUIMIENTO/InsertarDetalleQueja',
    form,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return status === 200 ? (data as DetalleQueja) : null;
}

export async function actualizarEstadoQueja(token: string, payload: EstadoPayload) {
  const { data, status } = await axiosClient.post<EncabezadoQueja[]>(
    '/API/SEGUIMIENTO/ActualizarEstadoQueja',
    payload,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return status === 200 && Array.isArray(data) ? data : null;
}

export async function descargarArchivo(token: string, direccionArchivo: string) {
  // POST para descargar, igual que en MVC
  const { data } = await axiosClient.post(
    `/API/SEGUIMIENTO/DescargarArchivo?direccionArchivo=${encodeURIComponent(direccionArchivo)}`,
    '',
    { headers: { Authorization: `Bearer ${token}` }, responseType: 'blob' }
  );
  return data as Blob;
}
