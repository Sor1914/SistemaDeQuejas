using APIQUEJAS.Clases;
using APIQUEJAS.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Http;
using APIQUEJAS.Security;
using System.Web.Http.Cors;

namespace APIQUEJAS.Controllers
{
    [AllowAnonymous]
    [RoutePrefix("API/LOGIN")]
    public class LoginController : ApiController
    {
        clsPermisos _Permisos = new clsPermisos();
        clsLogin _Consultas = new clsLogin();

        /*
         * Code = "200" - Devuelve el JWT 
         * Code = "401" - Noe está autorizado
         */
        [HttpPost]
        [Route("AUTENTICAR")]
        public IHttpActionResult autenticar(LoginRequest login)
        {
            if (login == null)
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            if (!validarParametro(login.Usuario) || !validarParametro(login.Pass))
                throw new HttpResponseException(HttpStatusCode.BadRequest);

            bool existe = _Consultas.validarExistenciaUsuario(login.Usuario.Trim(), login.Pass.Trim());

            if (existe)
            {
                string[] rol = _Permisos.obtenerRol(login.Usuario);
                if (rol != null)
                {
                    login.Token = TokenGenerator.GeneraTokenJwt(login.Usuario, rol[1]);
                    login.permisos = _Permisos.obtenerPermisos(Convert.ToInt32(rol[0]));
                    //_Log.guardarBitacoraCuerpo("Token generado", "Autenticar", login + " usuario: " + login.Usuario.Trim());
                    return Ok(login);
                }
                else
                {
                    return Unauthorized();
                }
            }
            else
            {
                //_Log.guardarBitacoraCuerpo("Solicitud rechazada", "Autenticar", "No autorizado");
                return Unauthorized();
            }

        }

        [HttpPost]
        [Route("REGISTRAR")]
        public IHttpActionResult registrar(RegistroRequest registro)
        {
            try
            {
                if (registro == null)
                    throw new HttpResponseException(HttpStatusCode.BadRequest);
                // if (!validarParametro(registro.Usuario))
                //     throw new HttpResponseException(HttpStatusCode.BadRequest);
                bool usuarioExiste = _Consultas.validarUsuarioRepetido(registro.Usuario.Trim().ToUpper(), 1);
                bool correoExiste = _Consultas.validarUsuarioRepetido(registro.Email.Trim().ToUpper(), 2);
                bool cuiExiste = _Consultas.validarUsuarioRepetido(registro.CUI.Trim().ToUpper(), 3);

                if (!usuarioExiste)
                {
                    if (!correoExiste)
                    {
                        if (!cuiExiste)
                        {
                            bool exitoRegistro = _Consultas.insertarUsuario(registro);
                            if (exitoRegistro)
                            {
                                return Ok(exitoRegistro);
                            }
                            else
                            {
                                return InternalServerError();
                            }
                        }
                        else
                        {
                            return BadRequest("El CUI ya existe");
                        }

                    }
                    else
                    {
                        return BadRequest("El correo ya existe");
                    }
                }
                else
                {
                    return BadRequest("El usuario ya existe");
                }
            }
            catch (Exception ex)
            {
                return InternalServerError();
            }

        }
        public bool validarParametro(string valor)
        {
            if (string.IsNullOrEmpty(valor)) return false;
            bool resultado = Regex.IsMatch(valor, @"^([a-z]|[A-Z]|[0-9]){4,20}$");
            return resultado;
        }
    }
}