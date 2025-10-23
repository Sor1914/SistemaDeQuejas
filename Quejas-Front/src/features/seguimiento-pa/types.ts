export type EncabezadoQueja = {
  Id_Encabezado: number;
  Correlativo: string;
  Estado_Interno: string;      // nombre de etapa
  Id_Estado_Interno?: number;  // para lógica de “Resolver”
  Detalle: string;
  Nombres?: string;
  Apellidos?: string;
  Email?: string;
  Telefono?: string;
  Nombre_Region?: string;
  Nombre_Punto_Atencion?: string;
  Direccion_Archivo?: string;  // adjunto del encabezado
};

export type DetalleQueja = {
  Id_Encabezado: number;
  Id_Usuario?: string;
  Comentario: string;
  Direccion_Archivo?: string;
  Fecha_Detalle?: string;
};

export type EstadoPayload = {
  Id_Encabezado: number;
  Id_Estado_Externo: number;  // 4
  Id_Estado_Interno: number;  // 5=Procedente, 6=Rechazo, 7=Resuelta
  Justificacion?: string;
};
