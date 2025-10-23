export type EncabezadoQueja = {
  Id_Encabezado: number;
  Correlativo: string;
  Fecha: string;
  Detalle: string;
  Email?: string;
  Nombres?: string;
  Apellidos?: string;
  Telefono?: string;
  Estado_Interno?: string | number;
  Nombre_Region?: string;
  Nombre_Punto_Atencion?: string;
  Direccion_Archivo?: string;
};

export type DetalleQueja = {
  Id_Encabezado: number;
  Comentario: string;
  Direccion_Archivo?: string;
  Fecha_Detalle?: string;
  Id_Usuario?: string;
};

export type Region = { Id_Region: number; Nombre_Region: string };
export type PuntoAtencion = { Id: number; NombrePuntoAtencion: string; IdRegion: number };
