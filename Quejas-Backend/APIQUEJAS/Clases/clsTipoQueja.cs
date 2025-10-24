using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsTipoQueja
    {
        string consulta = string.Empty;
        DataTable dtResultado = new DataTable();
        clsSqlServer _Ad = new clsSqlServer();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;

        public DataTable obtenerTiposQueja()
        {
            consulta = string.Format(sqlTipoQueja.ObtieneTipoQueja);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }
        public bool actualizarTipoQueja(TipoQueja tipo, string usuario)
        {
            consulta = string.Format(sqlTipoQueja.ActualizaTipoQueja, tipo.Nombre, tipo.Id_Tipo);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Tipo_Queja", consulta, "Catalogo Tipo Queja", usuario);
            return respuesta;
        }
        public bool crearTipoQueja(TipoQueja tipo, string usuario)
        {
            consulta = string.Format(sqlTipoQueja.InsertaTipoQueja, tipo.Siglas_Tipo, tipo.Nombre);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Tipo_Queja", consulta, "Catalogo Tipo Queja", usuario);
            return respuesta;
        }
        public bool eliminarTipoQueja(TipoQueja tipo, string usuario)
        {
            consulta = string.Format(sqlTipoQueja.EliminaTipoQueja, tipo.Id_Tipo);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Tipo_Queja", consulta, "Catalogo Tipo Queja", usuario);
            return respuesta;
        }
    }
}