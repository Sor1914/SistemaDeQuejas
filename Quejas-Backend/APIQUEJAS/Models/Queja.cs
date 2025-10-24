using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace APIQUEJAS.Models
{
    public class Queja
    {
        public string Correlativo { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Usuario { get; set; }
        public string Detalle { get; set; }
        public int Estado_Externo { get; set; }
        public int Estado_Interno { get; set; }
        public int Tipo_Queja { get; set; }
        public int Id_Origen { get; set; }
        public string Direccion_Archivo { get; set; }
        public int Id_Punto_Atencion { get; set; }
        public HttpPostedFileBase ArchivoAdjunto { get; set; }
    }
}