/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "../../lib/axiosClient";

export type Region = { Id_Region: number; Nombre_Region: string };
export type Punto = { Id: number; IdRegion: number; NombrePuntoAtencion: string };
export type Cargo = { id_Area: number; Nombre_Cargo: string };

export type UsuarioPunto = {
  Cui: string;
  Usuario?: string;
  Nombres: string;
  Apellidos?: string;
  Email: string;
  Id_Region: number;
  Id_Punto_Atencion: number;
  Id_Cargo: number;
  Nombre_Punto_Atencion?: string;
  Nombre_Cargo?: string;
};

function auth(token: string | null) {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    validateStatus: (s: number) => s >= 200 && s < 500,
  };
}

export async function obtenerRegiones(token: string | null): Promise<Region[]> {
  const { data, status } = await axiosClient.get("/API/USUARIOPUNTOATENCION/ObtenerRegiones", auth(token));
  return status === 302 ? (data as Region[]) : [];
}

export async function obtenerPuntos(token: string | null): Promise<Punto[]> {
  const { data, status } = await axiosClient.post("/API/USUARIOPUNTOATENCION/ObtenerPuntos", "", auth(token));
  return status === 302 ? (data as Punto[]) : [];
}

export async function obtenerCargos(token: string | null): Promise<Cargo[]> {
  const { data, status } = await axiosClient.get("/API/USUARIOPUNTOATENCION/ObtenerCargos", auth(token));
  return status === 302 ? (data as Cargo[]) : [];
}

export async function obtenerUsuarios(token: string | null): Promise<UsuarioPunto[]> {
  const { data, status } = await axiosClient.post("/API/USUARIOPUNTOATENCION/ObtenerUsuarios", "", auth(token));
  return status === 302 ? (data as UsuarioPunto[]) : [];
}

export async function obtenerUsuarioPorCui(token: string | null, cui: string): Promise<UsuarioPunto | null> {
  const { data, status } = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ObtieneDatosUsuarioPorCui",
    { Cui: cui },
    auth(token)
  );
  if (status === 302 && Array.isArray(data) && data[0]) return data[0] as UsuarioPunto;
  return null;
}

/** Crea/actualiza/desasigna (mismo endpoint que en MVC) */
export async function actualizarDatosUsuario(token: string | null, payload: UsuarioPunto): Promise<boolean> {
  const { status } = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ActualizarDatosUsuario",
    payload,
    auth(token)
  );
  return status === 200;
}
