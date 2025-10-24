using APIQUEJAS.Clases;
using APIQUEJAS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace APIQUEJAS.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR, CONSULTA")]
    [RoutePrefix("API/Reportes")]
    public class ReporteController : ApiController
    {
        string mensaje;
        clsReporte _Consultas = new clsReporte();
        [HttpPost]
        [Route("ObtenerQuejasReporte")]
        public IHttpActionResult obtenerQuejasReporte([FromBody] Reporte reporte)
        {
       
            try
            {
                DataTable dtResultado = _Consultas.obtenerQuejas(reporte);
                if (dtResultado.Rows.Count > 0)
                    return Content(HttpStatusCode.OK, dtResultado);
                else
                    return Content(HttpStatusCode.NotFound, "No existen registros");
            }
            catch (Exception ex)
            {
                mensaje = ex.Message;
                return Content(HttpStatusCode.InternalServerError, mensaje);
            }
        }
    }
}
