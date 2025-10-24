using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class TipoQueja
    {
        public int Id_Tipo { get; set; }
        public string Siglas_Tipo { get; set; }
        public string Nombre { get; set; }
        public int Correlativo { get; set; }
        public string Estado { get; set; }
    }
}