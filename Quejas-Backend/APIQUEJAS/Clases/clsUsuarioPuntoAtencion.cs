using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsUsuarioPuntoAtencion
    {
        string consulta = string.Empty;
        DataTable dtResultado = new DataTable();
        clsSqlServer _Ad = new clsSqlServer();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;
        public DataTable obtenerPuntos()
        {
            consulta = string.Format(sqlUsuarioPuntoAtencion.ObtienePuntosAtencion);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerUsuarios()
        {
            consulta = string.Format(sqlUsuarioPuntoAtencion.ObtieneUsuarios);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public bool actualizarDatosUsuario(UsuarioPuntoAtencion usuario, string usuarioMov)
        {
            consulta = string.Format(sqlUsuarioPuntoAtencion.ActualizaDatosUsuario, usuario.Id_Punto_Atencion, usuario.Id_Cargo, usuario.Cui);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Usuario", consulta, "Usuario - Punto Atencion", usuarioMov);
            return respuesta;
        }

        public DataTable obtenerCargos()
        {
            consulta = string.Format(sqlUsuarioPuntoAtencion.ObtieneCargos);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerUsuarioPorCui(UsuarioPuntoAtencion Usuario)
        {
            consulta = string.Format(sqlUsuarioPuntoAtencion.ObtieneUsuarioPorCui, Usuario.Cui);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

    }
}