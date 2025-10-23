export type SeguimientoRequest = {
  Correlativo: string;
};

export type SeguimientoRow = {
  Correlativo: string;
  Id_Estado_Externo?: number | string;
  Id_Estado_Interno?: number | string;
  Estado_Externo?: string;
  Estado_Interno?: string;
  
  Fecha?: string;  
  Hora?: string;   

  Nombre_Region?: string;
  Nombre_Punto_Atencion?: string;

  Direccion_Archivo?: string;    
};
