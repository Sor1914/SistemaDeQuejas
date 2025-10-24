using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class LoginRequest
    {        
        public string Usuario { get; set; }
        public string Pass { get; set; }
        public string Token { get; set; }
        public Permisos permisos { get; set; }
    }

    public class RegistroRequest
    {
        public string Usuario { get; set; }
        public string Password { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }        
        public string CUI { get; set; }
        public string Departamento { get; set; }
        public int IdRol { get; set; }
        public int IdCargo { get; set; }
        public int IdPuntoAtencion { get; set; }
        public string NumeroCuenta { get; set; }
        public string Estado { get; set; }
    }
}