using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsSeguimiento
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;
        public DataTable obtenerQuejasAsignacion()
        {
            consulta = sqlSeguimiento.ObtieneQuejasAsignacion;
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerQuejasPA(string usuario)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneQuejasPuntoAtencion, usuario);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerQuejasCent(string usuario)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneQuejasCent, usuario);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerEncabezadoQueja(EncabezadoQueja seguimiento)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneEncabezadoQueja, seguimiento.Id_Encabezado);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerEncabezadoQuejaPorCorrelativo(EncabezadoQueja seguimiento)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneEncabezadoQuejaPorCorrelativo, seguimiento.Correlativo);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerDetalleQueja(DetalleQueja seguimiento)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneDetalleQueja, seguimiento.Id_Encabezado);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public bool actualizarPuntoEstadoQueja(EncabezadoQueja seguimiento, string usuario)
        {
            consulta = string.Format(sqlSeguimiento.ActualizarPuntoEstadoQueja, seguimiento.Id_Punto_Atencion, seguimiento.Id_Estado_Externo, seguimiento.Id_Estado_Interno, seguimiento.Id_Encabezado);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Detalle_Queja", consulta, "Asignación o Rechazo", usuario);
            return respuesta;
        }

        public bool actualizarEstadoQueja(EncabezadoQueja seguimiento, string usuario)
        {
            consulta = string.Format(sqlSeguimiento.ActualizarEstadoQueja, seguimiento.Id_Estado_Externo, seguimiento.Id_Estado_Interno, seguimiento.Justificacion, seguimiento.Id_Encabezado);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Detalle_Queja", consulta, "Asignación o Rechazo", usuario);
            return respuesta;
        }

        public bool insertarMovimiento(DetalleQueja seguimiento, string usuario)
        {
            consulta = string.Format(sqlSeguimiento.InsertaDetalleQueja, seguimiento.Id_Encabezado, seguimiento.Comentario, seguimiento.Direcccion_Archivo, usuario);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Detalle_Queja", consulta, "Asignación o Rechazo", usuario);
            return respuesta;
        }
        
        public DataTable obtenerCorrelativoPorId(DetalleQueja detalle)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneCorrelativoPorId, detalle.Id_Encabezado);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public DataTable obtenerEmailsPunto(EncabezadoQueja encabezado)
        {
            consulta = string.Format(sqlSeguimiento.ObtieneEmailPuntoAtención, encabezado.Id_Punto_Atencion);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }
   
    }
}
