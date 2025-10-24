using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsBitacora
    {
        string consulta = string.Empty;
        DataTable dtResultado = new DataTable();
        clsSqlServer _Ad = new clsSqlServer();
        bool respuesta;
        public DataTable obtenerPuntos()
        {
            consulta = string.Format(sqlBitacora.guardarBitacora);
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public bool guardarBitacora(string tabla, string query, string movimiento, string usuario)
        {
            string escapar = query.Replace("'", "\"");
            consulta = string.Format(sqlBitacora.guardarBitacora, tabla, escapar, movimiento, usuario);
            return _Ad.realizarDml(consulta);
        }
    }
}