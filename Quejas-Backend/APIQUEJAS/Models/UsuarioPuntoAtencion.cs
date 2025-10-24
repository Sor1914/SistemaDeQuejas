using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class UsuarioPuntoAtencion
    {
        public int Id_Usuario { get; set; }
        public string Cui { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Nombre_Cargo { get; set; }
        public string Nombre_Punto_Atencion { get; set; }
        public string Nombre_Region { get; set; }
        public int  Id_Punto_Atencion { get; set; }
        public int Id_Region { get; set; }
        public int Id_Cargo { get; set; }
        public string Estado { get; set; }

    }
}