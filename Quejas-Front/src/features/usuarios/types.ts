export type Usuario = {
  Id_Usuario: number;
  Nombres: string;
  Apellidos: string;
  CUI: string;
  Id_Rol?: number;
  Nombre_Rol?: string;
  Departamento?: string;
};

export type Rol = {
  Id_Rol: number;
  Nombre_Rol: string;
};
