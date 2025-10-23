/* eslint-disable @typescript-eslint/no-explicit-any */
import {axiosClient} from '../../lib/axiosClient';
import type { Permisos, LoginResponse, ApiLoginResponse, RegistroPayload } from './types';

export async function autenticar(payload: { Usuario: string; Pass: string }): Promise<LoginResponse> {
  const { data } = await axiosClient.post<ApiLoginResponse>('/API/LOGIN/AUTENTICAR', payload);

  const permisos: Permisos = Array.isArray((data as any).permisos)
    ? ((data as any).permisos[0] as Permisos)
    : ((data as any).permisos as Permisos);

  return {
    Token: (data as any).Token,
    Usuario: (data as any).Usuario,
    rol: (data as any).rol,
    permisos,
  };
}

export async function registrarUsuario(input: Omit<RegistroPayload, 'Estado'>) {
  const payload: RegistroPayload = {
    ...input,
    Estado: 'A',
    Departamento: '',      
    IdRol: 0,              
    IdCargo: 0,            
    IdPuntoAtencion: 0,    
  };

  const { data } = await axiosClient.post('/API/LOGIN/REGISTRAR', payload, {
    validateStatus: s => s >= 200 && s < 500, 
  });

  return data;
}

