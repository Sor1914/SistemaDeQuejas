using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class PuntoAtencion
    {
        public int Id { get; set; }
        public string NombrePuntoAtencion { get; set; }
        public int IdRegion { get; set; }
        public string Estado { get; set; }                
        public int cantidadUsuarios { get; set; }
    }
}