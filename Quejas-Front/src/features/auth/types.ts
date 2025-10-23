export type Permisos = {
  CatalogoPuntosAtencion: boolean;
  UsuarioPuntoAtencion: boolean;
  CatalogoQuejas: boolean;
  IngresoQuejasUsuario: boolean;
  IngresoQuejasCliente: boolean;
  AsignacionRechazo: boolean;
  SeguimientoCentralizador: boolean;
  SeguimientoPuntoAtencion: boolean;
  AutoConsulta: boolean;
  Reporte: boolean;
  Usuarios: boolean;
};

export type AuthState = {
  token: string | null;
  permisos: Permisos | null;
  user?: { nombre?: string; rol?: string } | null;
};
export type LoginRequest = {
    Usuario: string;
    Pass: string;
};

export type LoginResponse = {
  Token: string;
  Usuario: string;
  rol?: string;
  permisos: Permisos; 
};

export type ApiLoginResponse =
  | { Token: string; Usuario: string; rol?: string; permisos: Permisos }
  | { Token: string; Usuario: string; rol?: string; permisos: Permisos[] };

  export type RegistroPayload = {
  Usuario: string;
  Password: string;
  Nombres: string;
  Apellidos: string;
  Email: string;
  CUI: string;
  Departamento?: string;
  IdRol?: number;
  IdCargo?: number;
  IdPuntoAtencion?: number;
  Estado: 'A';
};