export type TipoQueja = { 
  Id_Tipo: number; 
  Siglas_Tipo: string ;
  Descripcion?: string;
};

export type CrearQuejaPayload = {
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono: string;        // 8 dígitos
  Detalle: string;         // máx 200
  Tipo_Queja: number;
  ArchivoAdjunto?: File | null; // opcional
};

export type QuejaCreada = {
  Correlativo: string;
  Nombres: string;
  Apellidos: string;
  Email: string;
  Telefono: string;
  Detalle: string;
  Tipo_Queja: number;
  Direccion_Archivo?: string;
  Estado_Externo?: number;
  Estado_Interno?: number;
};
