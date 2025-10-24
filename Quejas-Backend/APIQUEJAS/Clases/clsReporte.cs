using APIQUEJAS.Models;
using APIQUEJAS.Sql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Clases
{
    public class clsReporte
    {
        string consulta;
        clsSqlServer _Ad = new clsSqlServer();
        DataTable dtResultado = new DataTable();
        clsBitacora _Bitacora = new clsBitacora();
        bool respuesta;
        public DataTable obtenerQuejas(Reporte reporte)
        {
            consulta = string.Format(sqlReporte.ObtieneQuejasParaReporte, crearFiltro(reporte));
            dtResultado = _Ad.realizarConsulta(consulta);
            return dtResultado;
        }

        public string crearFiltro(Reporte reporte)
        {
            string filtro = "";
            List<string> filtros = new List<string>();
            if (reporte.Fecha_Inicial != new DateTime() || reporte.Fecha_Final != new DateTime() || !string.IsNullOrEmpty(reporte.Numero_Queja) ||
                reporte.id_Region != 0 || reporte.id_Punto_Atencion != 0)
            {

                if (reporte.Fecha_Inicial != new DateTime() || reporte.Fecha_Final != new DateTime())
                {
                    if (reporte.Fecha_Final == new DateTime())
                        reporte.Fecha_Final = DateTime.Now;
                    if (reporte.Fecha_Inicial == new DateTime())
                        reporte.Fecha_Inicial = DateTime.Now.AddYears(-20);
                    filtro = string.Format(sqlReporte.FiltroFechas, reporte.Fecha_Inicial.ToString("yyyy-MM-dd"), reporte.Fecha_Final.ToString("yyyy-MM-dd"));
                    filtros.Add(filtro);
                }

                if (!string.IsNullOrEmpty(reporte.Numero_Queja))
                {
                    filtro = string.Format(sqlReporte.FiltroCorrelativo, reporte.Numero_Queja);
                    filtros.Add(filtro);
                }

                if (reporte.id_Region != 0)
                {
                    filtro = string.Format(sqlReporte.FiltroRegion, reporte.id_Region);
                    filtros.Add(filtro);
                }

                if (reporte.id_Punto_Atencion != 0)
                {
                    filtro = string.Format(sqlReporte.FiltroPuntoAtencion, reporte.id_Punto_Atencion);
                    filtros.Add(filtro);
                }

                bool primeraEjecucion = true;
                foreach (string condicion in filtros)
                {
                    if (primeraEjecucion)
                    {
                        filtro = "Where " + condicion;
                        primeraEjecucion = false;
                    }
                    else
                    {
                        filtro = filtro + " AND " + condicion;
                    }
                }
            }
            return filtro;
        }
    }
}
