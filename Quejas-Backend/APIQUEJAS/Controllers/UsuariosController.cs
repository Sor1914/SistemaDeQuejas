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
    [Authorize(Roles = "ADMINISTRADOR")]
    [RoutePrefix("API/USUARIOS")]
    public class UsuariosController : ApiController
    {
        string mensaje;
        clsUsuarios _Consultas = new clsUsuarios();

        [HttpGet]
        [Route("ObtenerUsuarios")]
        public IHttpActionResult obtenerUsuarios()
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerUsuarios();
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

        [HttpGet]
        [Route("ObtenerRoles")]
        public IHttpActionResult obtenerQuejasAsignacion()
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerRoles();
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
        [Route("ActualizarUsuario")]
        public IHttpActionResult actualizarUsuario([FromBody] Usuarios encabezado)
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
                bool resultado = _Consultas.actualizarUsuario(encabezado, username);
                if (resultado)
                {
                    return Content(HttpStatusCode.OK, "");
                }
                else
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("EliminarUsuario")]
        public IHttpActionResult eliminarUsuario([FromBody] Usuarios encabezado)
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
                bool resultado = _Consultas.eliminarUsuario(encabezado, username);
                if (resultado)
                {
                    return Content(HttpStatusCode.OK, "");
                }
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
