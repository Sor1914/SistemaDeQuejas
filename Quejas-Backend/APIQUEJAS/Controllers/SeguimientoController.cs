using APIQUEJAS.Clases;
using APIQUEJAS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace APIQUEJAS.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR, CENTRALIZADOR, CUENTAHABIENTE")]
    [RoutePrefix("API/SEGUIMIENTO")]
    public class SeguimientoController : ApiController
    {
        string mensaje;
        clsSeguimiento _Consultas = new clsSeguimiento();
        [HttpGet]
        [Route("ObtenerQuejasAsignacion")]
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
                DataTable dtResultado = _Consultas.obtenerQuejasAsignacion();
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
        [Route("ObtenerQuejasPA")]
        public IHttpActionResult obtenerQuejasPA()
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
                DataTable dtResultado = _Consultas.obtenerQuejasPA(username);
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
        [Route("ObtenerQuejasCent")]
        public IHttpActionResult obtenerQuejasCent()
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
                DataTable dtResultado = _Consultas.obtenerQuejasCent(username);
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
        [Route("ActualizarPuntoEstadoQueja")]
        public IHttpActionResult actualizarPuntoEstadoQueja([FromBody] EncabezadoQueja encabezado)
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
                bool resultado = _Consultas.actualizarPuntoEstadoQueja(encabezado, username);
                if (resultado)
                {
                    DataTable dtEncabezado = _Consultas.obtenerEncabezadoQueja(encabezado);
                    return Content(HttpStatusCode.OK, dtEncabezado);
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
        [Route("ActualizarEstadoQueja")]
        public IHttpActionResult actualizarEstadoQueja([FromBody] EncabezadoQueja encabezado)
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
                bool resultado = _Consultas.actualizarEstadoQueja(encabezado, username);
                if (resultado)
                {
                    DataTable dtEncabezado = _Consultas.obtenerEncabezadoQueja(encabezado);
                    return Content(HttpStatusCode.OK, dtEncabezado);
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
        [Route("ObtenerEncabezadoQueja")]
        public IHttpActionResult obtenerEncabezadoQueja(EncabezadoQueja encabezado)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerEncabezadoQueja(encabezado);
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
        [Route("ObtenerEncabezadoQuejaPorCorrelativo")]
        public IHttpActionResult obtenerEncabezadoQuejaPorCorrelativo(EncabezadoQueja encabezado)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerEncabezadoQuejaPorCorrelativo(encabezado);
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
        [Route("ObtenerEmailsPuntoAtencion")]
        public IHttpActionResult obtenerEmailsPunto(EncabezadoQueja encabezado)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerEmailsPunto(encabezado);
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
        [Route("ObtenerDetalleQueja")]
        public IHttpActionResult obtenerDetalleQueja(DetalleQueja encabezado)
        {
            if (!ModelState.IsValid)
            {
                var message = string.Format("Verifique todos los parámetros de entrada.");
                throw new HttpResponseException(
                   Request.CreateErrorResponse(HttpStatusCode.BadRequest, message));
            }
            try
            {
                DataTable dtResultado = _Consultas.obtenerDetalleQueja(encabezado);
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
        [Route("DescargarArchivo")]
        public HttpResponseMessage DescargarArchivo(string direccionArchivo)
        {
            try
            {
                string rutaArchivo = direccionArchivo; // Ruta completa del archivo en el disco local

                if (File.Exists(rutaArchivo))
                {
                    byte[] archivoBytes = File.ReadAllBytes(rutaArchivo);

                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
                    response.Content = new ByteArrayContent(archivoBytes);
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = Path.GetFileName(rutaArchivo) // Utiliza el nombre original del archivo
                    };
                    response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                    return response;
                }
                else
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "El archivo no existe.");
                }
            }
            catch (Exception ex)
            {
                string mensaje = ex.Message;
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, mensaje);
            }
        }

        [HttpPost]
        [Route("InsertarDetalleQueja")]
        public async Task<IHttpActionResult> InsertarDetalleQueja()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            // Ruta donde se guardarán los archivos adjuntos

            try
            {
                var rutaArchivoDestino = crearRutaDestino();
                var provider = new MultipartFormDataStreamProvider(rutaArchivoDestino);
                await Request.Content.ReadAsMultipartAsync(provider);
                var queja = new DetalleQueja
                {
                    Comentario = provider.FormData["Comentario"],
                    Id_Encabezado = Convert.ToInt32(provider.FormData["Id_Encabezado"])                    
                };
                DataTable dtCorrelativo = _Consultas.obtenerCorrelativoPorId(queja);
                var archivoAdjunto = provider.FileData.FirstOrDefault();
                if (archivoAdjunto != null)
                {
                    // var extension = archivoAdjunto.Headers.ContentDisposition.FileName.Replace("\"", "").Replace("\\", "");
                    string extension = Path.GetExtension(archivoAdjunto.Headers.ContentDisposition.FileName.Replace("\"", "").Replace("\\", ""));
                    var rutaArchivoDestinoFinal = crearRutaDestinoFinal(dtCorrelativo, extension);
                    File.Move(archivoAdjunto.LocalFileName, rutaArchivoDestinoFinal);
                    queja.Direcccion_Archivo = rutaArchivoDestinoFinal;
                }
                string username = User.Identity.Name;
                bool resultado = _Consultas.insertarMovimiento(queja, username);
                if (resultado)
                {                   
                    return Ok(queja);
                }
                else
                {
                    return Content(HttpStatusCode.InternalServerError, "Hubo un error");
                }
            }
            catch (Exception ex)
            {
                return Content(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        private string crearRutaDestino()
        {
            string carpeta = HttpContext.Current.Request.MapPath("~/Archivos/Esperando");
            if (!System.IO.Directory.Exists(carpeta))
            {
                System.IO.Directory.CreateDirectory(carpeta);
            }
            return carpeta;
        }
        private string crearRutaDestinoFinal(DataTable dtSiglas, string extension)
        {
            string siglas = dtSiglas.Rows[0][1].ToString();
            string carpeta = HttpContext.Current.Request.MapPath("~/Archivos/" + siglas + "/" + dtSiglas.Rows[0][0].ToString());
            if (!System.IO.Directory.Exists(carpeta))
            {
                System.IO.Directory.CreateDirectory(carpeta);
            }
            int contador = 1;
            string ruta;
            do
            {
                ruta = Path.Combine(carpeta, contador.ToString() + extension);
                contador++;
            }
            while (File.Exists(ruta));
            return ruta;
        }

    }
}
