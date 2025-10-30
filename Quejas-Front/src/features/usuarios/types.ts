export type Usuario = {
  Id_Usuario: number;
  NOMBRES: string;
  USUARIO: string;
  APELLIDOS: string;
  CUI: string;
  Id_Rol?: number;
  Nombre_Rol?: string;
  Departamento?: string;
};

export type Rol = {
  Id_Rol: number;
  Nombre_Rol: string;
};
