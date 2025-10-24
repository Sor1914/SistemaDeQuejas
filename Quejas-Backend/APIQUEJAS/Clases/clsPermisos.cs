using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsPermisos
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        bool respuesta;
        public string[] obtenerRol(string usuario)
        {
            try
            {
                string[] rol = new string[2];
                consulta = string.Format(sqlLogin.ObtieneRol, usuario);
                dtResultado = _Ad.realizarConsulta(consulta);
                if (dtResultado.Rows.Count > 0)
                {
                    rol[0] = dtResultado.Rows[0][0].ToString();
                    rol[1] = dtResultado.Rows[0][1].ToString();
                }
                return rol;
            } catch(Exception ex)
            {
                return null;
            }                        
        }
        public Permisos obtenerPermisos(int idRol)
        {
            Permisos permisos = new Permisos();           
            switch (idRol)
            {
                case 1: //Administrador
                    permisos = new Permisos
                    {
                        AsignacionRechazo = true,
                        UsuarioPuntoAtencion = true,
                        AutoConsulta = true,
                        IngresoQuejasUsuario = true,
                        IngresoQuejasCliente = true,
                        CatalogoPuntosAtencion = true,
                        CatalogoQuejas = true,
                        Reporte = true,
                        SeguimientoCentralizador = true,
                        SeguimientoPuntoAtencion = true,
                        Usuarios = true
                    };
                    break;
                case 2: //Centralizador
                    permisos = new Permisos
                    {
                        UsuarioPuntoAtencion = true,
                        AutoConsulta = true,
                        IngresoQuejasCliente = true,
                        AsignacionRechazo = true,
                        SeguimientoCentralizador = true                        
                    };
                    break;
                case 3: //Receptor
                    permisos = new Permisos { IngresoQuejasUsuario = true, IngresoQuejasCliente = true, AutoConsulta = true };
                    break;
                case 4: //CuentaHabiente
                    permisos = new Permisos { IngresoQuejasCliente = true, AutoConsulta = true };
                    break;
                case 5: //CONSULTAS
                    permisos = new Permisos { Reporte = true };
                    break;

            }
            return permisos;
        }
    }
}