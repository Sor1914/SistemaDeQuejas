using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using APIQUEJAS.Models;
using APIQUEJAS.Sql;

namespace APIQUEJAS.Clases
{
    public class clsPuntoAtencion    
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;       

        public bool insertarPunto(PuntoAtencion punto, string usuario)
        {
            consulta = string.Format(sqlPuntosAtencion.InsertaPunto, punto.NombrePuntoAtencion, punto.IdRegion);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Punto_Atencion", consulta, "Punto Atencion", usuario);
            return respuesta;
        }

        public bool actualizarPunto(PuntoAtencion punto, string usuario)
        {
            consulta = string.Format(sqlPuntosAtencion.ActualizaPunto, punto.NombrePuntoAtencion, punto.IdRegion, punto.Id);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Punto_Atencion", consulta, "Punto Atencion", usuario);
            return respuesta;
        }

        public bool eliminarPunto(PuntoAtencion punto, string usuario)
        {
            consulta = string.Format(sqlPuntosAtencion.EliminaPunto, 'E', punto.Id);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Punto_Atencion", consulta, "Punto Atencion", usuario);
            return respuesta;
        }

        public DataTable obtenerPuntos(PuntoAtencion punto)
        {                                                     
            consulta = string.Format(sqlPuntosAtencion.ObtienePuntos);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerRegiones()
        {
            consulta = string.Format(sqlPuntosAtencion.ObtieneRegiones);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public int contarUsuariosPunto(PuntoAtencion punto)
        {
            consulta = string.Format(sqlPuntosAtencion.CuentaUsuariosPuntoAtencion, punto.Id);
            dtResultado = _Ad.realizarConsulta(consulta);
            return Convert.ToInt32(dtResultado.Rows[0][0]);
        }

        public bool inactivarUsuariosPunto(PuntoAtencion punto, string usuario)
        {
            consulta = string.Format(sqlPuntosAtencion.InactivaUsuariosPuntoAtencion, punto.Id);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Punto_Atencion", consulta, "Punto Atencion", usuario);
            return respuesta;
        }
    }
}