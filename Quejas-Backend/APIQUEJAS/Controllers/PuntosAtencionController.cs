using APIQUEJAS.Clases;
using APIQUEJAS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace APIQUEJAS.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR")]
    [RoutePrefix("API/PUNTOSATENCION")]
    public class PuntosAtencionController : ApiController
    {
        string mensaje;
        clsPuntoAtencion _Consultas = new clsPuntoAtencion();
        [HttpPost]
        [Route("AgregarPunto")]
        public IHttpActionResult agregarPuntoAtencion([FromBody] PuntoAtencion Punto)
        {
            if (!ModelState.IsValid)
            {
                var mensaje = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, mensaje));
            }
            try
            {
                string username = User.Identity.Name;
                bool resultado = _Consultas.insertarPunto(Punto, username);
                if (resultado)
                    return Content(HttpStatusCode.Created, Punto.NombrePuntoAtencion);
                else
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [HttpPost]
        [Route("ActualizarPunto")]
        public IHttpActionResult actualizarPuntoAtencion([FromBody] PuntoAtencion Punto)
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
                bool resultado = _Consultas.actualizarPunto(Punto, username);
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
        [Route("EliminarPunto")]
        public IHttpActionResult eliminarPuntoAtencion([FromBody] PuntoAtencion Punto)
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
                bool resultado = _Consultas.eliminarPunto(Punto, username);
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
        [Route("ObtenerPuntos")]
        public IHttpActionResult obtenerPuntosAtencion(PuntoAtencion Punto)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerPuntos(Punto);


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

        [HttpPost]
        [Route("ContarUsuariosPunto")]
        public IHttpActionResult contarUsuariosPunto(PuntoAtencion Punto)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                Punto.cantidadUsuarios = _Consultas.contarUsuariosPunto(Punto);
                return Content(HttpStatusCode.Found, Punto);
            }
            catch (Exception ex)
            {
                mensaje = ex.Message;
                return Content(HttpStatusCode.InternalServerError, mensaje);
            }
        }

        [HttpPost]
        [Route("InactivarUsuariosPunto")]
        public IHttpActionResult inhabilitarUsuariosPunto(PuntoAtencion Punto)
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
                bool respuesta = _Consultas.inactivarUsuariosPunto(Punto, username);
                if (respuesta) return Ok();
                else return Content(HttpStatusCode.InternalServerError, "No se pudo inactivar los usuarios");
            }
            catch (Exception ex)
            {
                mensaje = ex.Message;
                return Content(HttpStatusCode.InternalServerError, mensaje);
            }
        }

        [HttpGet]
        [Route("ObtenerRegiones")]
        public IHttpActionResult obtenerRegiones()
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerRegiones();
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
       
    }
}
