using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsUsuarios
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;
        public DataTable obtenerUsuarios()
        {
            consulta = sqlUsuarios.ObtieneUsuarios;
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerRoles()
        {
            consulta = sqlUsuarios.ObtieneRoles;
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public bool actualizarUsuario(Usuarios usuario, string user)
        {
            consulta = string.Format(sqlUsuarios.ActualizaRol, usuario.Id_Rol, usuario.Id_Usuario);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Usuario", consulta, "Gestión de usuarios", user);
            return respuesta;
        }

        public bool eliminarUsuario(Usuarios usuario, string user)
        {
            consulta = string.Format(sqlUsuarios.EliminaUsuario, usuario.Id_Usuario);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Usuario", consulta, "Gestión de usuarios", user);
            return respuesta;
        }
    }
}