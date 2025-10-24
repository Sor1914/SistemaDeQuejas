using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class Reporte
    {
        public DateTime Fecha_Inicial { get; set; }
        public DateTime Fecha_Final { get; set; }
        public string Numero_Queja { get; set; }
        public int id_Region { get; set; }
        public int id_Punto_Atencion { get; set; }

    }
}