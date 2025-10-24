using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsQueja
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;

        public bool insertarEncabezadoQueja(Queja queja, string usuario)
        {
            consulta = string.Format(sqlQueja.InsertaEncabezadoQueja, queja.Nombres, queja.Apellidos, queja.Email, queja.Telefono, usuario,
                queja.Detalle, 1, 1, queja.Tipo_Queja, 6, queja.Direccion_Archivo, queja.Correlativo);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Ingreso_Queja", consulta, "Ingreso Queja", usuario);

            return respuesta;            
        }
 

        public DataTable obtieneCorrelativoSiguiente(Queja queja)
        {            
            consulta = string.Format(sqlQueja.ObtieneCorrelativoSiguienteQueja, queja.Tipo_Queja);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public bool incrementarCorrelativo(Queja queja, string usuario)
        {
            consulta = string.Format(sqlQueja.IncrementarCorrelativo, queja.Tipo_Queja);
            respuesta = _Ad.realizarDml(consulta);
            if (respuesta) _Bitacora.guardarBitacora("Ingreso_Queja", consulta, "Ingreso Queja", usuario);
            return respuesta;
        }

        public DataTable obtenerCorreoCentralizador()
        {
            consulta = sqlQueja.ObtieneCorreoCentralizador;
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

    }
}