/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "../../lib/axiosClient";

export type Region = { Id_Region: number; Nombre_Region: string };
export type Punto = { Id: number; IdRegion: number; NombrePuntoAtencion: string };

// Normalizamos el catálogo de cargos para que siempre tenga Id_Cargo/Nombre_Cargo
export type Cargo = { Id_Cargo: number; Nombre_Cargo: string };

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

const ok302or200 = (s: number) => s === 200 || s === 302;

export async function obtenerRegiones(token: string | null): Promise<Region[]> {
  const { data, status } = await axiosClient.get(
    "/API/USUARIOPUNTOATENCION/ObtenerRegiones",
    auth(token)
  );
  return ok302or200(status) ? (data as Region[]) : [];
}

export async function obtenerPuntos(token: string | null): Promise<Punto[]> {
  const { data, status } = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ObtenerPuntos",
    "",
    auth(token)
  );
  return ok302or200(status) ? (data as Punto[]) : [];
}

export async function obtenerCargos(token: string | null): Promise<Cargo[]> {
  const { data, status } = await axiosClient.get(
    "/API/USUARIOPUNTOATENCION/ObtenerCargos",
    auth(token)
  );
  if (!ok302or200(status)) return [];
  const arr = Array.isArray(data) ? data : [];
  // Normaliza id_Area / id_Cargo → Id_Cargo
  return arr
    .map((x: any) => ({
      Id_Cargo: x?.Id_Cargo ?? x?.id_Cargo ?? x?.id_Area ?? x?.ID_CARGO,
      Nombre_Cargo:
        x?.Nombre_Cargo ?? x?.nombre_Cargo ?? x?.NOMBRE_CARGO ?? x?.Nombre,
    }))
    .filter((c: Cargo) => Number.isFinite(c.Id_Cargo));
}

export async function obtenerUsuarios(token: string | null): Promise<UsuarioPunto[]> {
  const { data, status } = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ObtenerUsuarios",
    "",
    auth(token)
  );
  return ok302or200(status) ? (data as UsuarioPunto[]) : [];
}

export async function obtenerUsuarioPorCui(
  token: string | null,
  cui: string
): Promise<UsuarioPunto | null> {
  const { data, status } = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ObtieneDatosUsuarioPorCui",
    { Cui: cui },
    auth(token)
  );
  if (ok302or200(status) && Array.isArray(data) && data[0]) return data[0] as UsuarioPunto;
  return null;
}

/** Crea/actualiza/desasigna (mismo endpoint que en MVC) */
export async function actualizarDatosUsuario(
  token: string | null,
  payload: UsuarioPunto
): Promise<boolean> {
  const res = await axiosClient.post(
    "/API/USUARIOPUNTOATENCION/ActualizarDatosUsuario",
    payload,
    auth(token)
  );
  const okStatus = [200, 201, 202, 204, 302];
  const hasSuccessFlag =
    typeof res.data === "object" &&
    res.data !== null &&
    (res.data.success === true || res.data.ok === true);
  return okStatus.includes(res.status) || hasSuccessFlag;
}
