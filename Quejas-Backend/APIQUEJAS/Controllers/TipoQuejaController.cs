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
    [RoutePrefix("API/TIPOQUEJA")]
    public class TipoQuejaController : ApiController
    {
        string mensaje;
        clsTipoQueja _Consultas = new clsTipoQueja();
        [HttpGet]
        [Authorize(Roles = "ADMINISTRADOR,CENTRALIZADOR,RECEPTOR,CUENTAHABIENTE,CONSULTAS")] 
        [Route("ObtenerTiposQueja")]
        public IHttpActionResult obtenerTiposQueja()
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerTiposQueja();
                if (dtResultado.Rows.Count > 0)
                    return Content(HttpStatusCode.Found, dtResultado);
                else
                    return Content(HttpStatusCode.NotFound, "No existen registros");
            }
            catch (Exception ex)
            {
                mensaje = ex.Message;
                return Content(HttpStatusCode.InternalServerError, mensaje);
            }

        }

        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR")]
        [Route("InsertarTipoQueja")]
        public IHttpActionResult insertarTipoQueja([FromBody] TipoQueja tipo)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                string username = User.Identity.Name;
                bool resultado = _Consultas.crearTipoQueja(tipo, username);
                if (resultado)
                    return Ok();
                else
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR")]
        [Route("ActualizarTipoQueja")]
        public IHttpActionResult actualizarTipoQueja([FromBody] TipoQueja tipo)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                string username = User.Identity.Name;
                bool resultado = _Consultas.actualizarTipoQueja(tipo, username);
                if (resultado)
                    return Ok();
                else
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMINISTRADOR")]
        [Route("EliminarTipoQueja")]
        public IHttpActionResult eliminarTipoQueja([FromBody] TipoQueja tipo)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                string username = User.Identity.Name;
                bool resultado = _Consultas.eliminarTipoQueja(tipo, username);
                if (resultado)
                    return Ok();
                else
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}