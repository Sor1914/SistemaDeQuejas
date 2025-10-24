using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using APIQUEJAS.Models;
using APIQUEJAS.Sql;

namespace APIQUEJAS.Clases
{
    public class clsLogin
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;
        public bool validarExistenciaUsuario(string usuario, string pass)
        {
            consulta = string.Format(sqlLogin.ValidaExistenciaUsuario, usuario, pass);
            dtResultado = _Ad.realizarConsulta(consulta);
            if (Convert.ToInt32(dtResultado.Rows[0]["EXISTE"]) == 1)
                respuesta = true;
            else
                respuesta = false;
            return respuesta;
        }

        public bool validarUsuarioRepetido(string usuario, int tipo)
        {
            if (tipo == 1)
                consulta = string.Format(sqlLogin.ValidaUsuarioRepetido, usuario);
            else if (tipo == 2)
                consulta = string.Format(sqlLogin.ValidaCorreoRepetido, usuario);
            else if (tipo == 3)
                consulta = string.Format(sqlLogin.ValidaCUIRepetido, usuario);
            else if (tipo == 4)
                consulta = string.Format(sqlLogin.ValidaCuenta, usuario);
            dtResultado = _Ad.realizarConsulta(consulta);
            if (Convert.ToInt32(dtResultado.Rows[0]["EXISTE"]) == 1)
                respuesta = true;
            else
                respuesta = false;
            return respuesta;
        }

        public bool insertarUsuario(RegistroRequest registro)
        {
            consulta = string.Format(sqlLogin.InsertaUsuario,
                registro.Usuario, registro.Password, registro.Nombres, registro.Apellidos, registro.Email,
                registro.CUI, registro.Departamento, 4, 1,
                1, 'A');           
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Usuario", consulta, "Registro", "Sistema");
            return respuesta;
        }
    }
}