/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from '../../lib/axiosClient';
import type { Rol, Usuario } from './types';

export async function obtenerUsuarios(token: string) {
  const { data, status } = await axiosClient.get<Usuario[]>(
    '/API/USUARIOS/ObtenerUsuarios',
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  // El MVC responde 302 (Found) cuando trae datos
  return status === 302 ? (data ?? []) : (data ?? []);
}

export async function obtenerRoles(token: string) {
  const { data, status } = await axiosClient.get<Rol[]>(
    '/API/USUARIOS/ObtenerRoles',
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return status === 302 ? (data ?? []) : (data ?? []);
}

export async function actualizarUsuario(token: string, payload: { Id_Usuario: number; Id_Rol: number }) {
  const { status } = await axiosClient.post(
    '/API/USUARIOS/ActualizarUsuario',
    payload,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return status === 200;
}

export async function eliminarUsuario(token: string, payload: { Id_Usuario: number }) {
  const { status } = await axiosClient.post(
    '/API/USUARIOS/EliminarUsuario',
    payload,
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: s => s < 500 }
  );
  return status === 200;
}
