using APIQUEJAS.Clases;
using APIQUEJAS.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace APIQUEJAS.Controllers
{
    [Authorize(Roles = "ADMINISTRADOR, CENTRALIZADOR, RECEPTOR, CUENTAHABIENTE, CONSULTAS")]
    [RoutePrefix("API/QUEJA")]
    public class QuejaController : ApiController
    {
        string mensaje;
        clsQueja _Consultas = new clsQueja();
        [HttpPost]
        [Route("InsertarTipoQueja")]
        public async Task<IHttpActionResult> InsertarTipoQueja()
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
                var queja = new Queja
                {
                    Nombres = provider.FormData["Nombres"],
                    Apellidos = provider.FormData["Apellidos"],
                    Email = provider.FormData["Email"],
                    Telefono = provider.FormData["Telefono"],
                    Detalle = provider.FormData["Detalle"],
                    Tipo_Queja = Convert.ToInt32(provider.FormData["Tipo_Queja"])
                };
                DataTable dtCorrelativo = _Consultas.obtieneCorrelativoSiguiente(queja);
                queja = obtenerCorrelativoQueja(queja, dtCorrelativo);
                var archivoAdjunto = provider.FileData.FirstOrDefault();
                if (archivoAdjunto != null)
                {
                   // var extension = archivoAdjunto.Headers.ContentDisposition.FileName.Replace("\"", "").Replace("\\", "");
                    string extension = Path.GetExtension(archivoAdjunto.Headers.ContentDisposition.FileName.Replace("\"", "").Replace("\\", ""));
                    var rutaArchivoDestinoFinal = crearRutaDestinoFinal(queja, dtCorrelativo, extension);
                    File.Move(archivoAdjunto.LocalFileName, rutaArchivoDestinoFinal);                   
                    queja.Direccion_Archivo = rutaArchivoDestinoFinal;
                }
                string username = User.Identity.Name;
                bool resultado = _Consultas.insertarEncabezadoQueja(queja, username);
                if (resultado)
                {
                    _Consultas.incrementarCorrelativo(queja, username);
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

        [HttpGet]
        [Route("ObtenerCorreoCentralizador")]
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
                DataTable dtResultado = _Consultas.obtenerCorreoCentralizador();
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


        public Queja obtenerCorrelativoQueja([FromBody] Queja queja, DataTable dtCorrelativo)
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
                int correlativo = Convert.ToInt32(dtCorrelativo.Rows[0][0]);
                string siglas = dtCorrelativo.Rows[0][1].ToString();
                queja.Correlativo = siglas + "-" + correlativo + "-" + DateTime.Now.Year;
                return queja;
            }
            catch (Exception ex)
            {
                return queja;
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
        private string crearRutaDestinoFinal(Queja queja, DataTable dtSiglas, string extension)
        {            
            string siglas = dtSiglas.Rows[0][1].ToString();
            string carpeta = HttpContext.Current.Request.MapPath("~/Archivos/" + siglas + "/" + queja.Correlativo);
            if (!System.IO.Directory.Exists(carpeta))
            {
                System.IO.Directory.CreateDirectory(carpeta);
            }
            string ruta = Path.Combine(carpeta, "0" + extension);
            return ruta;
        }
    }
}
